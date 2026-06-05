import { prisma } from "@/lib/db";

export interface User {
    id: string;
    name: string;
    avatar: string;
    rating: number;
}

export interface MarketplaceItem {
    id: string;
    title: string;
    description: string;
    price: number;
    currency: string;
    images: string[];
    category: string;
    size: string;
    condition: 'NEW' | 'LIKE_NEW' | 'USED' | 'DEFECTIVE';
    brand: string;
    seller: User;
    createdAt: string;
    isSwapOpen: boolean;
    status: string;
}

export async function getMarketplaceItemByIdServer(id: string): Promise<MarketplaceItem | null> {
  try {
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
      return null;
    }

    return {
      id: listing.id,
      title: listing.title,
      description: listing.description ?? "",
      price: listing.price,
      currency: "₺",
      images: listing.images,
      category: listing.category,
      size: listing.size ?? "",
      condition: listing.condition as 'NEW' | 'LIKE_NEW' | 'USED' | 'DEFECTIVE',
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
    };
  } catch (error) {
    console.error("Error in getMarketplaceItemByIdServer:", error);
    return null;
  }
}
