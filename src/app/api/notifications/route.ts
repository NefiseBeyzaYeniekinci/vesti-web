import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { AppNotification } from "@/store/notificationStore";

// GET /api/notifications — Gerçek zamanlı bildirimler: okunmamış mesajlar + sipariş eventleri
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Yetkisiz erişim" }, { status: 401 });
  }

  const userId = session.user.id;
  const notifications: AppNotification[] = [];

  try {
    // 1. Okunmamış mesajlar (kullanıcıya ait konuşmalardaki okunmamış mesajlar)
    const unreadMessages = await prisma.message.findMany({
      where: {
        read: false,
        senderId: { not: userId },
        conversation: {
          participants: {
            some: { userId },
          },
        },
      },
      include: {
        sender: { select: { name: true } },
        conversation: {
          select: {
            id: true,
            listing: { select: { title: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    for (const msg of unreadMessages) {
      const senderName = msg.sender.name ?? "Birisi";
      const listingTitle = msg.conversation.listing?.title;
      notifications.push({
        id: `msg-${msg.id}`,
        title: "Yeni Mesajınız Var",
        description: listingTitle
          ? `${senderName} "${listingTitle}" ilanı için mesaj gönderdi.`
          : `${senderName} size mesaj gönderdi.`,
        type: "message",
        href: `/messages/${msg.conversationId}`,
        read: false,
        createdAt: msg.createdAt.toISOString(),
      });
    }

    // 2. Son sipariş eventleri (alıcı olarak)
    const recentOrderEvents = await prisma.trackingEvent.findMany({
      where: {
        order: { buyerId: userId },
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // son 7 gün
        },
      },
      include: {
        order: {
          select: {
            id: true,
            listing: { select: { title: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 3,
    });

    const statusLabels: Record<string, string> = {
      pending: "Sipariş alındı, onay bekleniyor.",
      paid: "Ödemeniz alındı!",
      shipped: "Kargonuz yola çıktı!",
      delivered: "Siparişiniz teslim edildi.",
      cancelled: "Siparişiniz iptal edildi.",
    };

    for (const event of recentOrderEvents) {
      const listingTitle = event.order.listing?.title ?? "Ürün";
      notifications.push({
        id: `order-${event.id}`,
        title: statusLabels[event.status] ?? "Sipariş Güncellendi",
        description: `"${listingTitle}" — ${event.description}`,
        type: event.status === "paid" ? "payment" : "order",
        href: `/profile`,
        read: true, // sipariş eventleri baştan okunmuş sayılır
        createdAt: event.createdAt.toISOString(),
      });
    }

    // Tarihe göre sırala
    notifications.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json(notifications);
  } catch (error) {
    console.error("Bildirim hatası:", error);
    return NextResponse.json([], { status: 200 }); // hata varsa boş dön
  }
}

// PATCH /api/notifications — Tüm mesajları okundu olarak işaretle
export async function PATCH() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Yetkisiz erişim" }, { status: 401 });
  }

  try {
    // Kullanıcının konuşmalarındaki okunmamış mesajları okundu yap
    await prisma.message.updateMany({
      where: {
        read: false,
        senderId: { not: session.user.id },
        conversation: {
          participants: {
            some: { userId: session.user.id },
          },
        },
      },
      data: { read: true },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Bildirim okundu işareti hatası:", error);
    return NextResponse.json({ message: "Sunucu hatası" }, { status: 500 });
  }
}
