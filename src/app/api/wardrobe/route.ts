import { NextResponse } from "next/server";
import { getUserIdFromRequest } from "@/lib/api-auth";
import { prisma } from "@/lib/db";

// GET /api/wardrobe — Kullanıcının tüm dolap öğelerini veya id ile tekil öğeyi getir
export async function GET(req: Request) {
  const userId = await getUserIdFromRequest(req);
  if (!userId) {
    return NextResponse.json({ message: "Yetkisiz erişim" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (id) {
    const item = await prisma.wardrobeItem.findUnique({
      where: { id },
    });

    if (!item || item.userId !== userId) {
      return NextResponse.json({ message: "Bulunamadı veya yetkisiz" }, { status: 404 });
    }

    return NextResponse.json({
      id: item.id,
      userId: item.userId,
      imageUrl: item.imageUrl ?? "",
      category: item.category,
      color: item.color ?? "",
      brand: item.brand ?? undefined,
      size: item.size ?? undefined,
      season: item.tags,
      createdAt: item.createdAt.toISOString(),
    });
  }

  const items = await prisma.wardrobeItem.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  // wardrobe.api.ts'deki ClothingItem tipine uygun formata çevir
  const formatted = items.map((item) => ({
    id: item.id,
    userId: item.userId,
    imageUrl: item.imageUrl ?? "",
    category: item.category,
    color: item.color ?? "",
    brand: item.brand ?? undefined,
    size: item.size ?? undefined,
    season: item.tags, // tags → season olarak kullanıldı
    createdAt: item.createdAt.toISOString(),
  }));

  return NextResponse.json(formatted);
}

// POST /api/wardrobe — Yeni kıyafet ekle
export async function POST(req: Request) {
  const userId = await getUserIdFromRequest(req);
  if (!userId) {
    return NextResponse.json({ message: "Yetkisiz erişim" }, { status: 401 });
  }

  try {
    const contentType = req.headers.get("content-type") ?? "";
    let category = "";
    let color = "";
    let brand: string | undefined;
    let season: string[] = [];
    let imageUrl = "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      category = (formData.get("category") as string) ?? "";
      color = (formData.get("color") as string) ?? "";
      brand = (formData.get("brand") as string) ?? undefined;
      const seasonRaw = formData.getAll("season") as string[];
      season = seasonRaw.flatMap((s) => s.split(",").map((x) => x.trim())).filter(Boolean);

      // Resim: base64 olarak sakla (Production'da S3/Cloudinary kullanılmalı)
      const file = formData.get("image") as File | null;
      if (file) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const base64 = buffer.toString("base64");
        imageUrl = `data:${file.type};base64,${base64}`;
      }
    } else {
      const body = await req.json();
      category = body.category ?? "";
      color = body.color ?? "";
      brand = body.brand;
      season = Array.isArray(body.season) ? body.season : [body.season].filter(Boolean);
      imageUrl = body.imageUrl ?? "";
    }

    if (!category) {
      return NextResponse.json({ message: "Kategori zorunludur" }, { status: 400 });
    }

    const item = await prisma.wardrobeItem.create({
      data: {
        userId: userId,
        name: brand ? `${brand} ${category}` : category,
        category,
        color,
        brand,
        imageUrl,
        tags: season,
      },
    });

    return NextResponse.json(
      {
        id: item.id,
        userId: item.userId,
        imageUrl: item.imageUrl ?? "",
        category: item.category,
        color: item.color ?? "",
        brand: item.brand ?? undefined,
        season: item.tags,
        createdAt: item.createdAt.toISOString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Gardırop ekleme hatası:", error);
    return NextResponse.json({ message: "Sunucu hatası" }, { status: 500 });
  }
}

// DELETE /api/wardrobe?id= — Kıyafet sil
export async function DELETE(req: Request) {
  const userId = await getUserIdFromRequest(req);
  if (!userId) {
    return NextResponse.json({ message: "Yetkisiz erişim" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ message: "ID gerekli" }, { status: 400 });
  }

  const item = await prisma.wardrobeItem.findUnique({ where: { id } });
  if (!item || item.userId !== userId) {
    return NextResponse.json({ message: "Bulunamadı veya yetkisiz" }, { status: 404 });
  }

  await prisma.wardrobeItem.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
