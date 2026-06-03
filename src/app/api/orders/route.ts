import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

// GET /api/orders - Kullanıcının alıcı ya da satıcı olduğu siparişleri getir
export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Yetkisiz erişim" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const role = searchParams.get("role") ?? "buyer"; // buyer | seller

  const orders = await prisma.order.findMany({
    where: role === "buyer"
      ? { buyerId: session.user.id }
      : { sellerId: session.user.id },
    include: {
      listing: {
        select: {
          id: true,
          title: true,
          images: true,
          category: true,
        }
      },
      buyer: {
        select: { id: true, name: true, image: true }
      },
      seller: {
        select: { id: true, name: true, image: true }
      },
      events: {
        orderBy: { createdAt: "desc" }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json(orders);
}

// POST /api/orders - Yeni sipariş oluştur
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Yetkisiz erişim" }, { status: 401 });
  }

  const { listingId, shippingAddress, notes } = await req.json();

  if (!listingId) {
    return NextResponse.json({ message: "İlan ID gerekli" }, { status: 400 });
  }

  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    select: { id: true, userId: true, price: true, status: true }
  });

  if (!listing) {
    return NextResponse.json({ message: "İlan bulunamadı" }, { status: 404 });
  }

  if (listing.status !== "active") {
    return NextResponse.json({ message: "Bu ilan artık satışta değil" }, { status: 400 });
  }

  if (listing.userId === session.user.id) {
    return NextResponse.json({ message: "Kendi ilanınızı satın alamazsınız" }, { status: 400 });
  }

  const [order] = await prisma.$transaction([
    prisma.order.create({
      data: {
        buyerId: session.user.id,
        sellerId: listing.userId,
        listingId: listing.id,
        price: listing.price,
        status: "pending",
        shippingAddress,
        notes,
      }
    }),
    // İlanı satıldı olarak işaretle
    prisma.listing.update({
      where: { id: listingId },
      data: { status: "sold" }
    })
  ]);

  // İlk tracking event'i oluştur
  await prisma.trackingEvent.create({
    data: {
      orderId: order.id,
      status: "pending",
      description: "Sipariş alındı, satıcı onayı bekleniyor."
    }
  });

  return NextResponse.json(order, { status: 201 });
}
