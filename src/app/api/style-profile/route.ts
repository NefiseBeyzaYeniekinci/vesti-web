import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { styleProfileSchema } from "@/lib/validations/style-profile";

export async function GET() {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ message: "Yetkisiz erişim" }, { status: 401 });
    }

    try {
        const profile = await prisma.styleProfile.findUnique({
            where: { userId: session.user.id },
        });

        if (!profile) {
            return NextResponse.json(null);
        }

        // Return mapped fields from styles array
        return NextResponse.json({
            favoriteColors: profile.colors || [],
            unwantedColors: [],
            stylePreference: profile.styles[0] || "CASUAL",
            fitPreference: profile.styles[1] || "",
            fabricPreference: profile.styles[2] || "",
            bodyType: profile.bodyType || "UNKNOWN",
            sizeTops: profile.topSize || "",
            sizeBottoms: profile.bottomSize || "",
            sizeShoes: profile.shoeSize || "",
        });
    } catch (error) {
        console.error("Tarz profili getirme hatası:", error);
        return NextResponse.json({ message: "Sunucu hatası" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ message: "Yetkisiz erişim" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const validatedData = styleProfileSchema.parse(body);

        // Store fitPreference and fabricPreference inside the styles string array
        const stylesArray = [
            validatedData.stylePreference,
            validatedData.fitPreference || "",
            validatedData.fabricPreference || ""
        ].filter(Boolean) as string[];

        const profile = await prisma.styleProfile.upsert({
            where: { userId: session.user.id },
            update: {
                colors: validatedData.favoriteColors,
                styles: stylesArray,
                bodyType: validatedData.bodyType === "UNKNOWN" ? null : validatedData.bodyType,
                topSize: validatedData.sizeTops,
                bottomSize: validatedData.sizeBottoms,
                shoeSize: validatedData.sizeShoes,
            },
            create: {
                userId: session.user.id,
                colors: validatedData.favoriteColors,
                styles: stylesArray,
                bodyType: validatedData.bodyType === "UNKNOWN" ? null : validatedData.bodyType,
                topSize: validatedData.sizeTops,
                bottomSize: validatedData.sizeBottoms,
                shoeSize: validatedData.sizeShoes,
            },
        });

        return NextResponse.json({ success: true, profile });
    } catch (error) {
        console.error("Tarz profili güncelleme hatası:", error);
        return NextResponse.json({ message: "Girdi doğrulama hatası veya sunucu hatası" }, { status: 400 });
    }
}
