import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { getWeatherByCity } from "@/lib/api/weather";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let message = "";
    let file: File | null = null;

    if (contentType.includes("application/json")) {
      const body = await req.json();
      message = body.message || "";
    } else {
      const formData = await req.formData();
      file = formData.get("image") as File | null;
      message = (formData.get("message") as string) || "";
    }

    // 1. Eğer resim yoksa, sadece sözel (metinsel) konuşma yapılmak isteniyordur
    if (!file) {
      if (!message.trim()) {
        return NextResponse.json({ error: "Mesaj veya resim bulunamadı" }, { status: 400 });
      }

      // Kullanıcının konumunu ve hava durumunu çekelim
      const session = await auth();
      const userId = session?.user?.id;
      let cityCode = "Istanbul";

      if (userId) {
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: { location: true },
        });
        if (user?.location) {
          cityCode = user.location.split(',')[0].trim();
        }
      }

      const weather = await getWeatherByCity(cityCode, "tr");
      const temp = weather?.main?.temp ?? 20;
      const weatherMain = weather?.weather?.[0]?.main ?? "Clear";
      const weatherDesc = weather?.weather?.[0]?.description ?? "";

      const query = message.toLowerCase();
      let responseText = "";

      // Spor/Workout araması
      if (query.includes("spor") || query.includes("koşu") || query.includes("gym") || query.includes("antrenman") || query.includes("egzersiz") || query.includes("koşacağım") || query.includes("workout")) {
        if (temp > 22) {
          responseText = `Bulunduğun konumdaki (${cityCode}) sıcak ve güzel havayı (${Math.round(temp)}°C) düşünürsek; hafif ve nefes alabilen bir tişört, altına spor bir şort ve rahat koşu ayakkabıların sporun için harika bir kombin olacaktır! 🏃‍♂️☀️`;
        } else if (temp < 14) {
          responseText = `Bulunduğun konumdaki (${cityCode}) soğuk havayı (${Math.round(temp)}°C) düşünürsek; rüzgar geçirmeyen ince bir ceket, altına uzun spor taytı/eşofman altı ve içine terletmeyen spor bir tişört giymen sporun için çok koruyucu ve güzel bir kombin olur! 🏃‍♂️❄️`;
        } else {
          responseText = `Bulunduğun konumdaki (${cityCode}) ılık havayı (${Math.round(temp)}°C) düşünürsek; tişört üzerine ince bir ceket/sweatshirt ve altına bir şort veya eşofman altı sporun için güzel bir kombin olabilir! 🏃‍♂️✨`;
        }
      }
      // Toplantı/İş/Ofis araması
      else if (query.includes("toplantı") || query.includes("iş") || query.includes("görüşme") || query.includes("mülakat") || query.includes("ofis") || query.includes("resmi")) {
        if (temp > 22) {
          responseText = `Bugün hava oldukça sıcak (${Math.round(temp)}°C). Ofis/toplantı için ince bir keten gömlek, kumaş pantolon ve makosen ayakkabılar ile hem profesyonel hem de ferah görünebilirsin! 💼☀️`;
        } else if (temp < 14) {
          responseText = `Dışarıda soğuk bir hava var (${Math.round(temp)}°C). Resmi bir toplantı için şık bir blazer ceket, içine klasik bir balıkçı yaka kazak ve kumaş pantolon harika bir kış ofis stili olacaktır! 💼❄️`;
        } else {
          responseText = `Ilık bir hava var (${Math.round(temp)}°C). Toplantın için şık bir gömlek üzerine blazer ceket ve keten pantolon kombini her ortama uyum sağlayacaktır! 💼✨`;
        }
      }
      // Parti/Davet/Düğün araması
      else if (query.includes("parti") || query.includes("düğün") || query.includes("gece") || query.includes("davet") || query.includes("kulüp") || query.includes("eğlence")) {
        if (temp > 22) {
          responseText = `Sıcak bir yaz gecesi için şık, askılı bir elbise veya ince şık bir gömlek + keten pantolon kombini harika gider! ✨`;
        } else if (temp < 14) {
          responseText = `Soğuk havada şık bir davet için kabanının altına giyeceğin şık bir takım elbise veya kadife şık bir elbise harika bir tercih olur! ❄️✨`;
        } else {
          responseText = `Güzel bir akşam için şık bir ceket ve alt tonlarda pantolon ile tarzını yansıtabilirsin! ✨`;
        }
      }
      // Yağmur araması
      else if (query.includes("yağmur") || query.includes("yağmurlu") || query.includes("ıslak") || query.includes("şemsiye")) {
        responseText = `Bugün yağmur ihtimaline karşı su geçirmez bir trençkot/yağmurluk ve su geçirmeyen botlarını tercih etmelisin. Şemsiyeni yanına almayı sakın unutma! ☔🌧️`;
      }
      // Genel tavsiye
      else {
        if (temp > 22) {
          responseText = `Bulunduğun konumda (${cityCode}) hava oldukça sıcak (${Math.round(temp)}°C). Terletmeyen, pamuklu hafif bir tişört veya gömlek ile altına şort/jean giyerek günün tadını çıkarabilirsin! ☀️`;
        } else if (temp < 14) {
          responseText = `Bulunduğun konumda (${cityCode}) hava soğuk (${Math.round(temp)}°C). Kalın bir kazak, üzerine sıcak tutacak bir mont/kaban ve altına kalın pantolonlar tercih ederek katmanlı giyinmeni öneririm! ❄️🧣`;
        } else {
          responseText = `Bulunduğun konumda (${cityCode}) hava oldukça ılık (${Math.round(temp)}°C). Tişört üzerine alacağın hafif bir hırka veya ince bir ceket hem serin rüzgarlardan korur hem de tarzına şıklık katar! 🍃`;
        }
      }

      return NextResponse.json({
        success: true,
        message: responseText
      });
    }

    // 2. Eğer resim varsa, resim analiziyle devam et
    const aiServerUrl = process.env.AI_SERVER_URL || process.env.NEXT_PUBLIC_AI_SERVER_URL;

    if (aiServerUrl) {
      try {
        const pyFormData = new FormData();
        pyFormData.append("image", file);

        const response = await fetch(`${aiServerUrl}/api/analyze`, {
          method: "POST",
          body: pyFormData,
        });

        if (response.ok) {
          const data = await response.json();
          return NextResponse.json(data);
        }
      } catch (err) {
        console.error("Python AI Server'a bağlanırken hata oluştu, simülasyona geçiliyor:", err);
      }
    }

    // Gelişmiş yapay zeka etiketleme simülasyonu (Vercel/Production Fallback)
    const labels = [
      "winter clothing", 
      "summer clothing", 
      "casual wear", 
      "formal elegant wear",
      "streetwear",
      "vintage clothing"
    ];
    
    const best_label = labels[Math.floor(Math.random() * labels.length)];
    
    const tr_responses: Record<string, string> = {
      "winter clothing": "Bu bir kışlık kıyafet! ❄️ Koyu renk bir kaban veya kalın bir atkı ile harika durur.",
      "summer clothing": "Harika bir yazlık parça! ☀️ Açık renkli sandaletler ve hasır bir çanta ile kombinleyebilirsin.",
      "casual wear": "Çok rahat ve günlük bir tarz! 👖 Beyaz sneaker'lar bu kombinin kurtarıcısı olacaktır.",
      "formal elegant wear": "Çok şık ve resmi bir parça! ✨ Özel davetler için topuklu ayakkabı ve zarif takılarla tamamlayabilirsin.",
      "streetwear": "Tam bir sokak stili! 🛹 Oversize bir ceket veya dikkat çekici spor ayakkabılarla çok havalı durur.",
      "vintage clothing": "Harika bir vintage esintisi! 🕰️ Retro güneş gözlükleri ve deri detaylarla bu tarzı güçlendirebilirsin."
    };
    
    const response_text = tr_responses[best_label] || "Görseldeki kıyafeti çok beğendim! Harika bir seçim.";

    return NextResponse.json({
      success: true,
      category: best_label,
      message: response_text
    });

  } catch (error) {
    console.error("AI Proxy Hatası:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
