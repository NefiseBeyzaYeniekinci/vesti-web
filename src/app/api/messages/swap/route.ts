import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

// POST /api/messages/swap — Takas teklifini kabul et veya reddet
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Yetkisiz erişim" }, { status: 401 });
  }

  const userId = session.user.id;
  const { messageId, action } = await req.json();

  if (!messageId || !["accept", "reject"].includes(action)) {
    return NextResponse.json({ message: "Geçersiz parametreler" }, { status: 400 });
  }

  try {
    // Mesajı bul
    const message = await prisma.message.findUnique({
      where: { id: messageId },
      include: {
        conversation: {
          include: {
            participants: true,
            listing: true,
          },
        },
      },
    });

    if (!message || !message.swapItemId) {
      return NextResponse.json({ message: "Takas teklifi bulunamadı" }, { status: 404 });
    }

    // Kullanıcının bu konuşmanın katılımcısı olup olmadığını kontrol et
    const isParticipant = message.conversation.participants.some(
      (p) => p.userId === userId
    );
    if (!isParticipant) {
      return NextResponse.json({ message: "Yetkisiz erişim" }, { status: 403 });
    }

    // Sadece teklifi alan kişi (mesajı göndermeyen kişi) onaylayabilir veya reddedebilir
    if (message.senderId === userId) {
      return NextResponse.json(
        { message: "Kendi gönderdiğiniz takas teklifini onaylayamazsınız" },
        { status: 400 }
      );
    }

    if (message.swapStatus !== "pending") {
      return NextResponse.json(
        { message: "Bu takas teklifi zaten sonuçlandırılmış" },
        { status: 400 }
      );
    }

    const listing = message.conversation.listing;
    if (!listing) {
      return NextResponse.json(
        { message: "İlgili ilan bulunamadı" },
        { status: 400 }
      );
    }

    if (action === "reject") {
      // Teklifi reddet
      await prisma.$transaction([
        prisma.message.update({
          where: { id: messageId },
          data: { swapStatus: "rejected" },
        }),
        prisma.message.create({
          data: {
            conversationId: message.conversationId,
            senderId: userId,
            content: "❌ Takas teklifini reddetti.",
          },
        }),
      ]);

      return NextResponse.json({ success: true, status: "rejected" });
    }

    // Teklifi kabul et
    const buyerId = message.senderId; // teklifi gönderen (alıcı)
    const sellerId = userId; // teklifi onaylayan (satıcı)

    // 1. Alıcının takas ettiği kıyafeti satıcıya aktar
    const isMockItem = message.swapItemId.startsWith("mock-");
    const dbTransactions: any[] = [];

    if (isMockItem) {
      // Mock kıyafet ise, satıcının dolabına yeni bir WardrobeItem oluştur
      const mockLabels: Record<string, { category: string; brand: string; color: string; imageUrl: string }> = {
        "mock-1": {
          category: "Tişört",
          brand: "Basic Tişört",
          color: "Beyaz",
          imageUrl: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500",
        },
        "mock-2": {
          category: "Gömlek",
          brand: "Klasik Gömlek",
          color: "Açık Mavi",
          imageUrl: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500",
        },
        "mock-5": {
          category: "Ayakkabı",
          brand: "Sneaker",
          color: "Kahverengi",
          imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500",
        },
        "mock-6": {
          category: "Takımlar",
          brand: "Blazer Takım",
          color: "Bej",
          imageUrl: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=500",
        },
      };

      const mockData = mockLabels[message.swapItemId] || mockLabels["mock-1"]!;

      dbTransactions.push(
        prisma.wardrobeItem.create({
          data: {
            userId: sellerId,
            name: `${mockData.brand} (${mockData.color})`,
            category: mockData.category,
            brand: mockData.brand,
            color: mockData.color,
            imageUrl: mockData.imageUrl,
          },
        })
      );
    } else {
      // Veritabanındaki gerçek kıyafet ise, sahibini satıcı yap
      dbTransactions.push(
        prisma.wardrobeItem.update({
          where: { id: message.swapItemId },
          data: { userId: sellerId },
        })
      );
    }

    // 2. Satıcının ilanındaki kıyafeti alıcının dolabına yeni bir WardrobeItem olarak ekle
    dbTransactions.push(
      prisma.wardrobeItem.create({
        data: {
          userId: buyerId,
          name: `${listing.title} (${listing.brand || "Belirtilmemiş"})`,
          category: listing.category,
          brand: listing.brand,
          size: listing.size,
          imageUrl: listing.images[0] || null,
        },
      })
    );

    // 3. İlan durumunu "sold" yap
    dbTransactions.push(
      prisma.listing.update({
        where: { id: listing.id },
        data: { status: "sold" },
      })
    );

    // 4. Mesaj durumunu güncelle ve sistem mesajı oluştur
    dbTransactions.push(
      prisma.message.update({
        where: { id: messageId },
        data: { swapStatus: "accepted" },
      })
    );

    dbTransactions.push(
      prisma.message.create({
        data: {
          conversationId: message.conversationId,
          senderId: sellerId,
          content: "🎉 Takas teklifini kabul etti! Kıyafetler karşılıklı olarak dolaplara aktarıldı. Dolabınızdan kontrol edebilirsiniz.",
        },
      })
    );

    // İşlemleri gerçekleştir
    await prisma.$transaction(dbTransactions);

    return NextResponse.json({ success: true, status: "accepted" });
  } catch (error) {
    console.error("Takas onay hatası:", error);
    return NextResponse.json({ message: "İşlem sırasında sunucu hatası oluştu" }, { status: 500 });
  }
}
