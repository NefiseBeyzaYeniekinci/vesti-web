import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

// GET /api/payments/cards
// Kullanıcının kayıtlı kartlarını getir
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Yetkisiz erişim" }, { status: 401 });
    }

    const cards = await prisma.savedCard.findMany({
      where: { userId: session.user.id },
      orderBy: [
        { isDefault: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    return NextResponse.json(cards);
  } catch (error) {
    console.error("GET Cards Error:", error);
    return NextResponse.json({ message: "Kartlar alınırken bir hata oluştu" }, { status: 500 });
  }
}

// POST /api/payments/cards
// Yeni kart ekle
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Yetkisiz erişim" }, { status: 401 });
    }

    const body = await req.json();
    const { cardNumber, cardName, expiryDate, isDefault } = body;

    if (!cardNumber || !cardName || !expiryDate) {
      return NextResponse.json({ message: "Eksik kart bilgisi" }, { status: 400 });
    }

    // Mask the card number (e.g. 1234 5678 9012 3456 -> **** **** **** 3456)
    const last4 = cardNumber.slice(-4);
    const maskedNumber = `**** **** **** ${last4}`;

    const newCard = await prisma.savedCard.create({
      data: {
        userId: session.user.id,
        cardNumber: maskedNumber,
        cardName,
        expiryDate,
        isDefault: isDefault || false
      }
    });

    // Eğer yeni kart varsayılan yapıldıysa diğer kartların varsayılanlığını kaldır
    if (isDefault) {
      await prisma.savedCard.updateMany({
        where: {
          userId: session.user.id,
          id: { not: newCard.id }
        },
        data: { isDefault: false }
      });
    }

    return NextResponse.json(newCard, { status: 201 });
  } catch (error) {
    console.error("POST Card Error:", error);
    return NextResponse.json({ message: "Kart eklenirken bir hata oluştu" }, { status: 500 });
  }
}
