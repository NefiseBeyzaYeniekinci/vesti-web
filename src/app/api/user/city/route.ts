import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

// GET /api/user/city — Kullanıcının kayıtlı şehir kodunu getir
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ cityCode: "Istanbul" });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { cityCode: true },
  });

  return NextResponse.json({ cityCode: user?.cityCode ?? "Istanbul" });
}

// PUT /api/user/city — Kullanıcının şehir kodunu güncelle
export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Yetkisiz erişim" }, { status: 401 });
  }

  const { cityCode } = await req.json();
  if (!cityCode || typeof cityCode !== "string") {
    return NextResponse.json({ message: "Geçerli bir şehir kodu gerekli" }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { cityCode: cityCode.trim() },
  });

  return NextResponse.json({ success: true, cityCode: cityCode.trim() });
}
