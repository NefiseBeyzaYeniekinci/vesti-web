import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Yetkisiz erişim" }, { status: 401 });
    }

    const { cardName, cardNumber, expiryDate } = await req.json();

    if (!cardName || !cardNumber || !expiryDate) {
      return NextResponse.json({ message: "Kart bilgileri eksik" }, { status: 400 });
    }

    // Gerçekte cardNumber şifrelenir veya payment gateway token'i tutulur.
    // Biz burada demo amaçlı son 4 hanesini gösterip gerisini yıldızlayacağız.
    const maskedNumber = cardNumber.length >= 4 
      ? `**** **** **** ${cardNumber.slice(-4)}`
      : `**** ${cardNumber}`;

    const newCard = await prisma.savedCard.create({
      data: {
        userId: session.user.id,
        cardName,
        cardNumber: maskedNumber,
        expiryDate,
      }
    });

    return NextResponse.json({ success: true, card: newCard }, { status: 201 });
  } catch (error) {
    console.error("Kart ekleme hatası:", error);
    return NextResponse.json({ message: "Sunucu hatası oluştu" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Yetkisiz erişim" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const cardId = searchParams.get("id");

    if (!cardId) {
      return NextResponse.json({ message: "Kart ID belirtilmedi" }, { status: 400 });
    }

    // Güvenlik doğrulaması: Bu kart gerçekten bu kullanıcıya mı ait?
    const card = await prisma.savedCard.findUnique({ where: { id: cardId } });
    if (!card || card.userId !== session.user.id) {
      return NextResponse.json({ message: "Kart bulunamadı veya yetkiniz yok" }, { status: 404 });
    }

    await prisma.savedCard.delete({
      where: { id: cardId }
    });

    return NextResponse.json({ success: true, message: "Kart silindi" });
  } catch (error) {
    console.error("Kart silme hatası:", error);
    return NextResponse.json({ message: "Sunucu hatası oluştu" }, { status: 500 });
  }
}
