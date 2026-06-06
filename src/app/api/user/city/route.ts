import { NextResponse } from "next/server";
import { getUserIdFromRequest } from "@/lib/api-auth";
import { prisma } from "@/lib/db";

// GET /api/user/city — Kullanıcının kayıtlı şehir kodunu getir
export async function GET(req: Request) {
  const userId = await getUserIdFromRequest(req);
  if (!userId) {
    return NextResponse.json({ cityCode: "Istanbul" });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { cityCode: true },
  });

  return NextResponse.json({ cityCode: user?.cityCode ?? "Istanbul" });
}

// PUT /api/user/city — Kullanıcının şehir kodunu güncelle
export async function PUT(req: Request) {
  const userId = await getUserIdFromRequest(req);
  if (!userId) {
    return NextResponse.json({ message: "Yetkisiz erişim" }, { status: 401 });
  }

  const { cityCode } = await req.json();
  if (!cityCode || typeof cityCode !== "string") {
    return NextResponse.json({ message: "Geçerli bir şehir kodu gerekli" }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: userId },
    data: { cityCode: cityCode.trim() },
  });

  return NextResponse.json({ success: true, cityCode: cityCode.trim() });
}
