import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

// POST /api/payments/cards/mock
// Kullanıcı için test kartları oluşturur
export async function POST() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Yetkisiz erişim" }, { status: 401 });
    }

    const userId = session.user.id;

    // Önce kullanıcının mevcut kartlarını kontrol et
    const existingCards = await prisma.savedCard.count({
      where: { userId }
    });

    if (existingCards > 0) {
      return NextResponse.json({ message: "Kullanıcının zaten kayıtlı kartları var" }, { status: 400 });
    }

    // Mock kartları oluştur
    const mockCards = [
      {
        userId,
        cardNumber: "**** **** **** 4242",
        cardName: session.user.name || "Test Kullanıcısı",
        expiryDate: "12/28",
        isDefault: true
      },
      {
        userId,
        cardNumber: "**** **** **** 5555",
        cardName: session.user.name || "Test Kullanıcısı",
        expiryDate: "08/26",
        isDefault: false
      }
    ];

    await prisma.savedCard.createMany({
      data: mockCards
    });

    return NextResponse.json({ success: true, message: "Mock kartlar eklendi" }, { status: 201 });
  } catch (error) {
    console.error("POST Mock Cards Error:", error);
    return NextResponse.json({ message: "Mock kartlar eklenirken bir hata oluştu" }, { status: 500 });
  }
}
