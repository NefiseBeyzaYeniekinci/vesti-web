import { NextResponse } from "next/server";
import { getUserIdFromRequest } from "@/lib/api-auth";
import { prisma } from "@/lib/db";

// GET /api/user/promotions - Kullanıcının kullandığı promosyon kodlarını getir
export async function GET(req: Request) {
  const userId = await getUserIdFromRequest(req);
  if (!userId) {
    return NextResponse.json({ message: "Yetkisiz erişim" }, { status: 401 });
  }

  try {
    const redemptions = await prisma.promoRedemption.findMany({
      where: { userId },
      include: {
        promoCode: {
          select: {
            code: true,
            discountType: true,
            discountValue: true,
            description: true,
            expiresAt: true,
          }
        }
      },
      orderBy: { redeemedAt: "desc" }
    });

    return NextResponse.json(redemptions);
  } catch (error) {
    console.error("Promosyon kodları getirme hatası:", error);
    return NextResponse.json({ message: "Sistem hatası oluştu" }, { status: 500 });
  }
}

// POST /api/user/promotions - Yeni promosyon kodu kullan
export async function POST(req: Request) {
  const userId = await getUserIdFromRequest(req);
  if (!userId) {
    return NextResponse.json({ message: "Yetkisiz erişim" }, { status: 401 });
  }

  try {
    const { code } = await req.json();

    if (!code || typeof code !== "string") {
      return NextResponse.json({ message: "Promosyon kodu gerekli" }, { status: 400 });
    }

    const uppercaseCode = code.trim().toUpperCase();

    // Promosyon kodunu veritabanından bul
    const promo = await prisma.promoCode.findUnique({
      where: { code: uppercaseCode }
    });

    if (!promo) {
      return NextResponse.json({ message: "Geçersiz veya bulunmayan promosyon kodu." }, { status: 400 });
    }

    if (!promo.isActive) {
      return NextResponse.json({ message: "Bu promosyon kodu aktif değil." }, { status: 400 });
    }

    if (promo.expiresAt && new Date(promo.expiresAt) < new Date()) {
      return NextResponse.json({ message: "Bu promosyon kodunun süresi dolmuş." }, { status: 400 });
    }

    if (promo.maxUses !== null && promo.usedCount >= promo.maxUses) {
      return NextResponse.json({ message: "Bu promosyon kodunun kullanım limiti dolmuş." }, { status: 400 });
    }

    // Kullanıcının bu kodu daha önce kullanıp kullanmadığını kontrol et
    const existingRedemption = await prisma.promoRedemption.findUnique({
      where: {
        userId_promoCodeId: {
          userId,
          promoCodeId: promo.id
        }
      }
    });

    if (existingRedemption) {
      return NextResponse.json({ message: "Bu promosyon kodunu zaten kullandınız." }, { status: 400 });
    }

    // Redemption oluştur ve usedCount'u artır
    const [redemption] = await prisma.$transaction([
      prisma.promoRedemption.create({
        data: {
          userId,
          promoCodeId: promo.id
        },
        include: {
          promoCode: {
            select: {
              code: true,
              discountType: true,
              discountValue: true,
              description: true,
              expiresAt: true,
            }
          }
        }
      }),
      prisma.promoCode.update({
        where: { id: promo.id },
        data: { usedCount: { increment: 1 } }
      })
    ]);

    return NextResponse.json({
      message: "Promosyon kodu başarıyla uygulandı!",
      redemption
    }, { status: 201 });

  } catch (error) {
    console.error("Promosyon kodu kullanma hatası:", error);
    return NextResponse.json({ message: "Sistem hatası oluştu" }, { status: 500 });
  }
}
