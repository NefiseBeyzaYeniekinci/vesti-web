import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/marketplace/[id]
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const listing = await prisma.listing.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
          trustScore: true,
        },
      },
    },
  });

  if (!listing || listing.status === "deleted") {
    return NextResponse.json({ message: "İlan bulunamadı" }, { status: 404 });
  }

  return NextResponse.json({
    id: listing.id,
    title: listing.title,
    description: listing.description,
    price: listing.price,
    currency: "₺",
    images: listing.images,
    category: listing.category,
    size: listing.size ?? "",
    condition: listing.condition,
    brand: listing.brand ?? "",
    seller: {
      id: listing.user.id,
      name: listing.user.name ?? "Bilinmeyen",
      avatar:
        listing.user.image ??
        `https://ui-avatars.com/api/?name=${encodeURIComponent(listing.user.name ?? "?")}`,
      rating: listing.user.trustScore ?? 0,
    },
    createdAt: listing.createdAt.toISOString(),
    isSwapOpen: listing.allowSwap,
    status: listing.status,
  });
}
