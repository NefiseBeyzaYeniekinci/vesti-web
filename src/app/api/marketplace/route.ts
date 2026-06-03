import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/marketplace?q=&category=&swap=true
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim() ?? "";
  const category = searchParams.get("category")?.trim() ?? "";
  const swapOnly = searchParams.get("swap") === "true";

  const listings = await prisma.listing.findMany({
    where: {
      status: "active",
      ...(q && {
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { brand: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
        ],
      }),
      ...(category && { category: { equals: category, mode: "insensitive" } }),
      ...(swapOnly && { allowSwap: true }),
    },
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
    orderBy: { createdAt: "desc" },
  });

  const formatted = listings.map((l) => ({
    id: l.id,
    title: l.title,
    description: l.description,
    price: l.price,
    currency: "₺",
    images: l.images,
    category: l.category,
    size: l.size ?? "",
    condition: l.condition,
    brand: l.brand ?? "",
    seller: {
      id: l.user.id,
      name: l.user.name ?? "Bilinmeyen",
      avatar:
        l.user.image ??
        `https://ui-avatars.com/api/?name=${encodeURIComponent(l.user.name ?? "?")}`,
      rating: l.user.trustScore ?? 0,
    },
    createdAt: l.createdAt.toISOString(),
    isSwapOpen: l.allowSwap,
  }));

  return NextResponse.json(formatted);
}
