import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getOutfitSuggestions } from "@/lib/api/ai";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ message: "Yetkisiz erişim" }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const condition = searchParams.get("condition") || "Clear";
        const temp = parseFloat(searchParams.get("temp") || "20");

        // Gardıropta kıyafet var mı kontrol et
        const count = await prisma.wardrobeItem.count({
            where: { userId: session.user.id }
        });

        if (count === 0) {
            return NextResponse.json({ success: true, data: [], isEmpty: true });
        }

        // Şimdilik gelişmiş mock fonksiyonunu çağırıyoruz
        const suggestions = await getOutfitSuggestions(condition, temp);

        return NextResponse.json({ success: true, data: suggestions });
    } catch (error) {
        console.error("Öneri getirme hatası:", error);
        return NextResponse.json({ message: "Sunucu hatası" }, { status: 500 });
    }
}
