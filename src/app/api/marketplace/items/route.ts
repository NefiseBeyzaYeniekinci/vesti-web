import { NextResponse } from "next/server";
import { getUserIdFromRequest } from "@/lib/api-auth";
import { prisma } from "@/lib/db";
import { GET as delegateGET } from "../route";

// GET /api/marketplace/items — Listelemeleri getir (Delegasyon)
export { delegateGET as GET };

// POST /api/marketplace/items — Yeni ilan ekle
export async function POST(req: Request) {
  const userId = await getUserIdFromRequest(req);
  if (!userId) {
    return NextResponse.json({ message: "Yetkisiz erişim" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, description, price, imageUrl, category, size, condition } = body;

    if (!title || !category || price === undefined) {
      return NextResponse.json(
        { message: "Başlık, kategori ve fiyat zorunludur" },
        { status: 400 }
      );
    }

    // İlanı oluştur
    const listing = await prisma.listing.create({
      data: {
        userId: userId,
        title,
        description: description ?? "",
        price: parseFloat(price.toString()),
        category,
        size: size ?? "",
        condition: condition ?? "new",
        images: imageUrl ? [imageUrl] : [],
        allowSwap: true, // Mobil için varsayılan olarak takas açık
        status: "active",
      },
    });

    // Mobil uygulamanın MarketplaceItemDto formatına uygun dönüş yap
    return NextResponse.json(
      {
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
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Marketplace ilan ekleme hatası:", error);
    return NextResponse.json(
      { message: "Sunucu hatası oluştu" },
      { status: 500 }
    );
  }
}
