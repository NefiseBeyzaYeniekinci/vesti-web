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
    const { title, description, price, imageUrl, images, category, size, condition, brand, isSwapOpen, allowSwap } = body;

    if (!title || !category || price === undefined) {
      return NextResponse.json(
        { message: "Başlık, kategori ve fiyat zorunludur" },
        { status: 400 }
      );
    }

    let finalImages: string[] = [];
    if (Array.isArray(images) && images.length > 0) {
      finalImages = images;
    } else if (imageUrl) {
      finalImages = [imageUrl];
    } else {
      // Fallback default image
      finalImages = ["https://images.unsplash.com/photo-1434389678069-37142cb442ac?w=400"];
    }

    const swapOpen = typeof isSwapOpen === "boolean" ? isSwapOpen : (typeof allowSwap === "boolean" ? allowSwap : true);

    // İlanı oluştur
    const listing = await prisma.listing.create({
      data: {
        userId: userId,
        title,
        description: description ?? "",
        price: parseFloat(price.toString()),
        category,
        brand: brand ?? "",
        size: size ?? "",
        condition: condition ?? "USED",
        images: finalImages,
        allowSwap: swapOpen,
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
