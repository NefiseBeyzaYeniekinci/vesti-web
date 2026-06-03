import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { favoriteColors, style, topSize, bottomSize, shoeSize, bodyType, location } = await req.json();

    // StyleProfile oluştur veya güncelle
    await prisma.styleProfile.upsert({
      where: { userId: session.user.id },
      update: {
        colors: favoriteColors ?? [],
        styles: style ? [style] : [],
        topSize: topSize || null,
        bottomSize: bottomSize || null,
        shoeSize: shoeSize || null,
        bodyType: bodyType || "UNKNOWN",
      },
      create: {
        userId: session.user.id,
        colors: favoriteColors ?? [],
        styles: style ? [style] : [],
        topSize: topSize || null,
        bottomSize: bottomSize || null,
        shoeSize: shoeSize || null,
        bodyType: bodyType || "UNKNOWN",
      },
    });

    // Konum güncelle
    if (location) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { location },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Onboarding error:", error);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
