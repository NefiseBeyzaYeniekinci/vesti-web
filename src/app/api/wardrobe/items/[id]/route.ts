import { NextResponse } from "next/server";
import { getUserIdFromRequest } from "@/lib/api-auth";
import { prisma } from "@/lib/db";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const userId = await getUserIdFromRequest(req);
  if (!userId) {
    return NextResponse.json({ message: "Yetkisiz erişim" }, { status: 401 });
  }

  const id = params.id;
  const item = await prisma.wardrobeItem.findUnique({ where: { id } });
  if (!item || item.userId !== userId) {
    return NextResponse.json({ message: "Bulunamadı veya yetkisiz" }, { status: 404 });
  }

  await prisma.wardrobeItem.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const userId = await getUserIdFromRequest(req);
  if (!userId) {
    return NextResponse.json({ message: "Yetkisiz erişim" }, { status: 401 });
  }

  const id = params.id;
  const item = await prisma.wardrobeItem.findUnique({ where: { id } });
  if (!item || item.userId !== userId) {
    return NextResponse.json({ message: "Bulunamadı veya yetkisiz" }, { status: 404 });
  }

  try {
    const body = await req.json();
    const { category, color, brand, size, season } = body;

    const updated = await prisma.wardrobeItem.update({
      where: { id },
      data: {
        category: category !== undefined ? category : item.category,
        color: color !== undefined ? color : item.color,
        brand: brand !== undefined ? brand : item.brand,
        size: size !== undefined ? size : item.size,
        tags: season !== undefined ? season : item.tags,
        name: (brand !== undefined ? brand : item.brand) 
          ? `${brand !== undefined ? brand : item.brand} ${category !== undefined ? category : item.category}`
          : (category !== undefined ? category : item.category),
      }
    });

    return NextResponse.json({
      id: updated.id,
      userId: updated.userId,
      imageUrl: updated.imageUrl ?? "",
      category: updated.category,
      color: updated.color ?? "",
      brand: updated.brand ?? undefined,
      size: updated.size ?? undefined,
      season: updated.tags,
      createdAt: updated.createdAt.toISOString(),
    });
  } catch (error) {
    console.error("Wardrobe item update error:", error);
    return NextResponse.json({ message: "Güncelleme sırasında hata oluştu" }, { status: 500 });
  }
}
