import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const listing = await prisma.listing.findUnique({
      where: { id },
    });

    if (!listing || listing.status === "deleted") {
      return NextResponse.json({ message: "İlan bulunamadı" }, { status: 404 });
    }

    // Mobil uygulamanın MarketplaceItemDto formatına uygun dönüş yap
    return NextResponse.json({
      id: listing.id,
      sellerId: listing.userId,
      title: listing.title,
      description: listing.description,
      price: listing.price,
      currency: "₺",
      imageUrl: listing.images[0] ?? "",
      category: listing.category,
      size: listing.size ?? "",
      condition: listing.condition,
      createdAt: listing.createdAt.toISOString(),
    });
  } catch (error) {
    console.error("Marketplace detay çekme hatası:", error);
    return NextResponse.json(
      { message: "Sunucu hatası oluştu" },
      { status: 500 }
    );
  }
}
