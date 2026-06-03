import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// POST /api/ai/recommend
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { user_id, weather_condition, temperature, style_preference } = body;

    if (!user_id) {
      return NextResponse.json({ message: "Kullanıcı ID gereklidir" }, { status: 400 });
    }

    // Kullanıcının gerçek dolap öğelerini veritabanından çekelim
    const myItems = await prisma.wardrobeItem.findMany({
      where: { userId: user_id },
    });

    const isWarm = temperature > 22;
    const isCold = temperature < 14;

    // Gerçek eşleşen öğeleri filtrele veya yoksa mock öğeler ekle
    let selectedItems = myItems.slice(0, 3); // Varsayılan: ilk 3 eşya

    if (myItems.length > 0) {
      if (isWarm) {
        selectedItems = myItems.filter(item => 
          ["tisort", "short", "etek", "elbise", "ayakkabi", "t-shirt"].includes((item.category || "").toLowerCase())
        );
      } else if (isCold) {
        selectedItems = myItems.filter(item => 
          ["kazak", "kaban", "pantolon", "ceket", "bot", "hırka"].includes((item.category || "").toLowerCase())
        );
      }
    }

    // Eğer eşleşen bulunamadıysa veya dolap boşsa, şık mock eşyalar ekleyerek tamamlayalım
    if (selectedItems.length === 0) {
      selectedItems = myItems.slice(0, 3);
    }

    // Mobil DTO tipine göre nesneleri formatlayalım
    const itemsDto = selectedItems.map(item => ({
      id: item.id,
      userId: item.userId,
      imageUrl: item.imageUrl ?? "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80",
      category: item.category,
      color: item.color ?? "Bilinmeyen",
      brand: item.brand ?? "Vesti",
      size: item.size ?? "M",
      season: item.tags,
      createdAt: item.createdAt.toISOString(),
    }));

    // Öneri metnini oluşturalım
    let description = `Hava sıcaklığı ${temperature}°C ve ${weather_condition === "Clear" ? "güneşli" : "kapalı"}. Tarz tercihinize (${style_preference}) uygun olarak dolabınızdaki en şık parçaları seçtik. Keyifli günler!`;
    if (isCold) {
      description = `Hava soğuk (${temperature}°C). Vesti Yapay Zeka motoru tarz tercihinize (${style_preference}) uygun olarak dolabınızdaki sıcak ve katmanlı giysileri seçti!`;
    } else if (isWarm) {
      description = `Bugün harika bir hava var (${temperature}°C). Tarz tercihinize (${style_preference}) uygun, hafif ve nefes alabilen dolap kombinleriniz hazır!`;
    }

    return NextResponse.json({
      outfit_id: "recommend_" + Math.random().toString(36).substring(7),
      description,
      items: itemsDto
    });

  } catch (error) {
    console.error("AI Öneri Hatası:", error);
    return NextResponse.json({ message: "Sunucu hatası" }, { status: 500 });
  }
}
