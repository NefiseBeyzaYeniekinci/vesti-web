import { NextResponse } from "next/server";
import { getUserIdFromRequest } from "@/lib/api-auth";
import { prisma } from "@/lib/db";
import iyzipay, {
  IYZICO_BASKET_ITEM_TYPE,
  IYZICO_CURRENCY,
  IYZICO_LOCALE,
  IYZICO_PAYMENT_CHANNEL,
  IYZICO_PAYMENT_GROUP,
  iyzicoCreate,
} from "@/lib/iyzipay";

export const runtime = "nodejs";

type IncomingNewCard = {
  number?: string;
  name?: string;
  expiry?: string;
  cvv?: string;
};

function sanitizeCardNumber(cardNumber: string) {
  return cardNumber.replace(/\s+/g, "");
}

function splitExpiry(expiry: string) {
  const [expireMonth, expireYearShort] = expiry.split("/");
  return {
    expireMonth: expireMonth?.padStart(2, "0") ?? "",
    expireYear: expireYearShort ? `20${expireYearShort}` : "",
  };
}

function resolveSandboxCard(maskedCardNumber: string) {
  const last4 = maskedCardNumber.replace(/\s+/g, "").slice(-4);

  if (last4 === "4242") {
    return {
      cardHolderName: "Iyzi Test",
      cardNumber: "5528790000000008",
      expireMonth: "12",
      expireYear: "2030",
      cvc: "123",
    };
  }

  if (last4 === "5555") {
    return {
      cardHolderName: "Iyzi Test",
      cardNumber: "5406697543215353",
      expireMonth: "12",
      expireYear: "2030",
      cvc: "123",
    };
  }

  return null;
}

// POST /api/payments/checkout
export async function POST(req: Request) {
  try {
    const userId = await getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json({ message: "Yetkisiz erişim" }, { status: 401 });
    }

    const body = await req.json();
    const { listingId, shippingAddress, cardId, newCard, appliedCouponId } = body;

    if (!listingId || !shippingAddress) {
      return NextResponse.json({ message: "İlan ID ve teslimat adresi gerekli" }, { status: 400 });
    }

    if (!cardId && !newCard) {
      return NextResponse.json({ message: "Geçerli bir ödeme yöntemi gerekli" }, { status: 400 });
    }

    // İlanı kontrol et
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      select: { id: true, userId: true, title: true, price: true, status: true }
    });

    if (!listing) {
      return NextResponse.json({ message: "İlan bulunamadı" }, { status: 404 });
    }

    if (listing.status !== "active") {
      return NextResponse.json({ message: "Bu ilan artık satışta değil" }, { status: 400 });
    }

    if (listing.userId === userId) {
      return NextResponse.json({ message: "Kendi ilanınızı satın alamazsınız" }, { status: 400 });
    }

    const buyer = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true },
    });

    if (!buyer) {
      return NextResponse.json({ message: "Alıcı bilgisi bulunamadı" }, { status: 404 });
    }

    // --- PROMO KOD & İNDİRİM HESAPLAMA ---
    let finalPaidPrice = listing.price;
    let promoCodeObj = null;

    if (appliedCouponId) {
      // Kuponu veritabanından bul
      promoCodeObj = await prisma.promoCode.findFirst({
        where: { id: appliedCouponId, isActive: true }
      });

      if (!promoCodeObj) {
        return NextResponse.json({ message: "Geçersiz veya süresi dolmuş kupon." }, { status: 400 });
      }

      // Kullanıcının kuponu daha önce kullanıp kullanmadığını kontrol et
      const previousRedemption = await prisma.promoRedemption.findUnique({
        where: {
          userId_promoCodeId: {
            userId,
            promoCodeId: promoCodeObj.id,
          }
        }
      });

      if (previousRedemption) {
        return NextResponse.json({ message: "Bu kuponu daha önce kullandınız." }, { status: 400 });
      }

      // Minimum sepet tutarı kontrolü
      if (promoCodeObj.minOrderAmount && listing.price < promoCodeObj.minOrderAmount) {
        return NextResponse.json({
          message: `Bu kupon sadece en az ${promoCodeObj.minOrderAmount} TL tutarındaki alışverişlerde geçerlidir.`,
        }, { status: 400 });
      }

      // İndirimi hesapla
      let discount = 0;
      if (promoCodeObj.discountType === "percentage") {
        discount = (listing.price * promoCodeObj.discountValue) / 100;
      } else if (promoCodeObj.discountType === "fixed") {
        discount = promoCodeObj.discountValue;
      }

      finalPaidPrice = Math.max(0, listing.price - discount);
    }

    let paymentCard:
      | {
          cardHolderName: string;
          cardNumber: string;
          expireMonth: string;
          expireYear: string;
          cvc: string;
        }
      | null = null;

    if (newCard) {
      const incomingCard = newCard as IncomingNewCard;
      if (
        !incomingCard.number ||
        !incomingCard.name ||
        !incomingCard.expiry ||
        !incomingCard.cvv
      ) {
        return NextResponse.json({ message: "Yeni kart bilgileri eksik" }, { status: 400 });
      }

      const { expireMonth, expireYear } = splitExpiry(incomingCard.expiry);
      if (!expireMonth || !expireYear) {
        return NextResponse.json({ message: "Kart son kullanma tarihi geçersiz" }, { status: 400 });
      }

      paymentCard = {
        cardHolderName: incomingCard.name,
        cardNumber: sanitizeCardNumber(incomingCard.number),
        expireMonth,
        expireYear,
        cvc: incomingCard.cvv,
      };
    } else if (cardId) {
      const savedCard = await prisma.savedCard.findFirst({
        where: { id: cardId, userId: userId },
        select: { cardNumber: true },
      });

      if (!savedCard) {
        return NextResponse.json({ message: "Seçilen kayıtlı kart bulunamadı" }, { status: 404 });
      }

      const sandboxCard = resolveSandboxCard(savedCard.cardNumber);
      if (!sandboxCard) {
        return NextResponse.json(
          { message: "Kayıtlı kart ile ödeme yapılamıyor, lütfen yeni kart girin." },
          { status: 400 }
        );
      }
      paymentCard = sandboxCard;
    }

    if (!paymentCard) {
      return NextResponse.json({ message: "Geçerli bir kart seçilmedi" }, { status: 400 });
    }

    const iyzicoRequest = {
      locale: IYZICO_LOCALE.TR,
      conversationId: `order_${listing.id}_${Date.now()}`,
      price: listing.price.toFixed(2),
      paidPrice: finalPaidPrice.toFixed(2), // İndirimli ödenecek fiyat
      currency: IYZICO_CURRENCY.TRY,
      installment: "1",
      basketId: listing.id,
      paymentChannel: IYZICO_PAYMENT_CHANNEL.WEB,
      paymentGroup: IYZICO_PAYMENT_GROUP.PRODUCT,
      paymentCard,
      buyer: {
        id: buyer.id,
        name: (buyer.name || "Vesti").split(" ")[0] || "Vesti",
        surname: (buyer.name || "Kullanici").split(" ").slice(1).join(" ") || "Kullanici",
        gsmNumber: "+905555555555",
        email: buyer.email || "buyer@vesti.local",
        identityNumber: "11111111111",
        registrationAddress: shippingAddress,
        ip: "85.34.78.112",
        city: "Istanbul",
        country: "Turkey",
        zipCode: "34000",
      },
      shippingAddress: {
        contactName: buyer.name || "Vesti Kullanici",
        city: "Istanbul",
        country: "Turkey",
        address: shippingAddress,
        zipCode: "34000",
      },
      billingAddress: {
        contactName: buyer.name || "Vesti Kullanici",
        city: "Istanbul",
        country: "Turkey",
        address: shippingAddress,
        zipCode: "34000",
      },
      basketItems: [
        {
          id: listing.id,
          name: listing.title,
          category1: "Fashion",
          itemType: IYZICO_BASKET_ITEM_TYPE.PHYSICAL,
          price: listing.price.toFixed(2),
        },
      ],
    };

    const paymentResult = await iyzicoCreate(iyzipay.payment, iyzicoRequest);

    if (paymentResult.status !== "success") {
      return NextResponse.json(
        {
          message: paymentResult.errorMessage || "Ödeme reddedildi. Kart bilgilerinizi kontrol edin.",
          iyzico: {
            status: paymentResult.status,
            errorCode: paymentResult.errorCode,
            errorGroup: paymentResult.errorGroup,
          },
        },
        { status: 400 }
      );
    }

    // İşlem başarılı, DB işlemlerini atomik transaction olarak yap
    const dbTransactions: any[] = [
      prisma.order.create({
        data: {
          buyerId: userId,
          sellerId: listing.userId,
          listingId: listing.id,
          price: finalPaidPrice, // İndirimli ödenen tutar kaydedilir
          currency: "TRY",
          status: "paid",
          shippingAddress,
          notes: `Ödeme başarıyla alındı.${promoCodeObj ? ` Uygulanan kupon: ${promoCodeObj.code}.` : ""} Iyzico PaymentId: ${paymentResult.paymentId ?? "N/A"}`,
        }
      }),
      // İlanı satıldı olarak işaretle
      prisma.listing.update({
        where: { id: listingId },
        data: { status: "sold" }
      })
    ];

    if (promoCodeObj) {
      // Kupon kullanım kaydını ekle
      dbTransactions.push(
        prisma.promoRedemption.create({
          data: {
            userId,
            promoCodeId: promoCodeObj.id,
          }
        })
      );

      // Kuponun kullanım adedini artır
      dbTransactions.push(
        prisma.promoCode.update({
          where: { id: promoCodeObj.id },
          data: { usedCount: { increment: 1 } }
        })
      );
    }

    const [order] = await prisma.$transaction(dbTransactions);

    // İlk tracking event'i oluştur
    await prisma.trackingEvent.create({
      data: {
        orderId: order.id,
        status: "paid",
        description: "Ödeme alındı, satıcının kargolaması bekleniyor."
      }
    });

    return NextResponse.json({ success: true, order }, { status: 201 });

  } catch (error) {
    console.error("Checkout Error:", error);
    return NextResponse.json({ message: "Ödeme işlemi sırasında bir hata oluştu" }, { status: 500 });
  }
}
