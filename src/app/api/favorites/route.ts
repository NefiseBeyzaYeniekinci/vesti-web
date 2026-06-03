import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

// Favorileri getir
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId: session.user.id },
      include: {
        listing: {
          include: {
            user: {
              select: {
                name: true,
                image: true
              }
            }
          }
        }
      }
    });

    return NextResponse.json({ success: true, data: favorites });
  } catch {
    return NextResponse.json({ error: "Favoriler yüklenemedi" }, { status: 500 });
  }
}

// Favoriye ekle / çıkar (toggle)
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { listingId } = await request.json();

    if (!listingId) {
      return NextResponse.json({ error: "Listing ID is required" }, { status: 400 });
    }

    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_listingId: {
          userId: session.user.id,
          listingId: listingId
        }
      }
    });

    if (existingFavorite) {
      // Çıkar
      await prisma.favorite.delete({
        where: { id: existingFavorite.id }
      });
      return NextResponse.json({ success: true, action: "removed" });
    } else {
      // Ekle
      await prisma.favorite.create({
        data: {
          userId: session.user.id,
          listingId: listingId
        }
      });
      return NextResponse.json({ success: true, action: "added" });
    }
  } catch {
    return NextResponse.json({ error: "İşlem başarısız" }, { status: 500 });
  }
}
