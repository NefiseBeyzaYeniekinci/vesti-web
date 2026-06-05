import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

// POST /api/ai/recommend
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { user_id, weather_condition, temperature, style_preference } = body;

    if (!user_id) {
      return NextResponse.json({ message: "Kullanıcı ID gereklidir" }, { status: 400 });
    }

    // 1. Pazar yerindeki yayındaki ilanları çekelim (Kendi ilanları hariç)
    const listings = await prisma.listing.findMany({
      where: {
        status: "active",
        userId: { not: user_id }
      },
      orderBy: { createdAt: "desc" }
    });

    const isWarm = temperature > 22;
    const isCold = temperature < 14;

    // 2. Mevsimsel sıcaklığa göre pazar yeri ilanlarını filtrele
    let filteredListings = listings;
    if (isWarm) {
      filteredListings = listings.filter(item => 
        ["tisort", "t-shirt", "short", "şort", "etek", "elbise", "ayakkabi", "ayakkabı", "gömlek", "gomlek"].includes((item.category || "").toLowerCase())
      );
    } else if (isCold) {
      filteredListings = listings.filter(item => 
        ["kazak", "kaban", "ceket", "mont", "hirka", "hırka", "pantolon", "bot"].includes((item.category || "").toLowerCase())
      );
    }

    // 3. Kullanıcının tarz tercihine göre eşleşen ilanları filtrele
    if (style_preference && filteredListings.length > 0) {
      const pref = style_preference.toLowerCase();
      const styleMatches = filteredListings.filter(item => 
        (item.title || "").toLowerCase().includes(pref) || 
        (item.description || "").toLowerCase().includes(pref) ||
        (item.category || "").toLowerCase().includes(pref)
      );
      if (styleMatches.length > 0) {
        filteredListings = styleMatches;
      }
    }

    // 4. Eğer mevsimsel/tarz filtresine uyan bulunamadıysa ama genel ilanlar varsa onlardan seç
    if (filteredListings.length === 0 && listings.length > 0) {
      filteredListings = listings;
    }

    // 5. Eğer pazar yerinde hiç aktif ilan yoksa veya sığmıyorsa
    if (filteredListings.length === 0) {
      return NextResponse.json({
        outfit_id: "recommend_empty",
        description: "Yakında tarzınıza uygun seçimler sizinle! 🛍️",
        items: []
      });
    }

    // En uygun ilk 3 ilanı seçip DTO tipine göre formatlayalım
    const itemsDto = filteredListings.slice(0, 3).map(item => ({
      id: item.id,
      userId: item.userId,
      imageUrl: item.images[0] ?? "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80",
      category: item.category,
      color: "Standart",
      brand: item.brand ?? "Vesti",
      size: item.size ?? "Standart",
      season: isWarm ? ["Yazlık"] : isCold ? ["Kışlık"] : ["Bahar"],
      createdAt: item.createdAt.toISOString(),
      price: item.price,
      title: item.title,
    }));

    // Öneri metnini oluşturalım
    let description = `Bugün hava ${temperature}°C ve ${weather_condition === "Clear" ? "güneşli" : "kapalı"}. Pazar yerinde tam tarzınıza (${style_preference || "Vesti tarzı"}) uygun ve dolabınızı tamamlayacak bu harika parçaları sizin için seçtik! 🛍️`;
    if (isCold) {
      description = `Hava soğuk (${temperature}°C). Vesti Yapay Zeka motoru tarz tercihinize (${style_preference || "Kış Modası"}) uygun olarak pazar yerinden sizi sıcacık tutacak bu harika kombinleri öneriyor! ❄️`;
    } else if (isWarm) {
      description = `Bugün harika ve sıcak bir hava var (${temperature}°C). Tarz tercihinize (${style_preference || "Yaz Modası"}) uygun, hafif ve pazar yerinde satışta olan bu nefes alabilen kombinleri keşfedin! ☀️`;
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
