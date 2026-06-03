import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

// PATCH /api/orders/[id]/tracking - Satıcı kargo takip numarası girer
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Yetkisiz erişim" }, { status: 401 });
  }

  const { trackingNumber, trackingCarrier } = await req.json();

  if (!trackingNumber || !trackingCarrier) {
    return NextResponse.json(
      { message: "Takip numarası ve kargo firması zorunludur" },
      { status: 400 }
    );
  }

  const order = await prisma.order.findUnique({
    where: { id: params.id },
    select: { sellerId: true, status: true }
  });

  if (!order) {
    return NextResponse.json({ message: "Sipariş bulunamadı" }, { status: 404 });
  }

  if (order.sellerId !== session.user.id) {
    return NextResponse.json({ message: "Bu siparişe erişim yetkiniz yok" }, { status: 403 });
  }

  const updated = await prisma.order.update({
    where: { id: params.id },
    data: {
      trackingNumber,
      trackingCarrier,
      status: "shipped",
    }
  });

  // Kargo takip eventi oluştur
  await prisma.trackingEvent.create({
    data: {
      orderId: params.id,
      status: "shipped",
      description: `Kargo teslim edildi. Takip No: ${trackingNumber} (${trackingCarrier})`,
    }
  });

  return NextResponse.json(updated);
}

// GET /api/orders/[id]/tracking - Alıcı kargo durumunu görüntüler
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Yetkisiz erişim" }, { status: 401 });
  }

  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      events: { orderBy: { createdAt: "desc" } },
      listing: { select: { title: true, images: true } },
      seller: { select: { name: true } },
      buyer: { select: { name: true } }
    }
  });

  if (!order) {
    return NextResponse.json({ message: "Sipariş bulunamadı" }, { status: 404 });
  }

  // Sadece alıcı veya satıcı görebilir
  if (order.buyerId !== session.user.id && order.sellerId !== session.user.id) {
    return NextResponse.json({ message: "Bu siparişe erişim yetkiniz yok" }, { status: 403 });
  }

  return NextResponse.json(order);
}
