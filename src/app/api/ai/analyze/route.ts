import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { getWeatherByCity } from "@/lib/api/weather";
import { GoogleGenAI } from "@google/genai";

export const runtime = "nodejs";

const systemInstruction = `
Sen Vesti uygulamasının akıllı stil ve moda danışmanı "Vesves"sin.
Kullanıcılarla son derece samimi, sıcak, cana yakın ve sanki yakın bir arkadaşıymış gibi Türkçe dilinde konuşmalısın.
Kullanıcının yüklediği kıyafet resimlerini veya sorduğu stil sorularını inceleyip onlara trendlere uygun, yaratıcı stil tavsiyeleri vermelisin.
Cümlelerin motive edici, yapıcı ve samimi olmalıdır (Örn: 'Bu harika bir seçim!', 'Dolabındaki siyah botlarla nefis durur!').
Kullanıcı sana belirli aktiviteler veya hava durumlarıyla ilgili sorular sorduğunda, hava durumunu da hesaba katarak en uygun önerileri yap.
`;

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

    // Hava durumunu çek
    const weather = await getWeatherByCity(cityCode, "tr");
    const temp = weather?.main?.temp ?? 20;
    const weatherDesc = weather?.weather?.[0]?.description ?? "";

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        
        let contents: any[] = [];
        
        if (file) {
          const arrayBuffer = await file.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          const base64Image = buffer.toString("base64");
          const mimeType = file.type;

          contents.push({
            inlineData: {
              data: base64Image,
              mimeType: mimeType
            }
          });

          const promptText = message.trim() 
            ? `Bu görseldeki kıyafeti incele. Kullanıcının sorusu: "${message}". Lütfen samimi bir stil önerisinde bulun.`
            : `Bu görseldeki kıyafeti incele ve samimi bir stil/kombin önerisinde bulun.`;
          contents.push(promptText);
        } else {
          contents.push(`Kullanıcının sorusu: "${message}"\nKonum: ${cityCode}\nGüncel Hava Durumu: ${temp}°C, ${weatherDesc}. Lütfen bu hava durumu ve soruyu dikkate alarak samimi bir stil önerisinde bulun.`);
        }

        const response = await ai.models.generateContent({
          model: "gemini-2.0-flash",
          contents: contents,
          config: {
            systemInstruction: systemInstruction,
            responseMimeType: "application/json",
            responseSchema: {
              type: "OBJECT",
              properties: {
                category: {
                  type: "STRING",
                  description: "Kıyafetin en uygun olduğu stil kategorisi: winter clothing, summer clothing, casual wear, formal elegant wear, streetwear, vintage clothing"
                },
                message: {
                  type: "STRING",
                  description: "Kullanıcıya samimi, arkadaşça ve Türkçe stil önerisi cevabı."
                }
              },
              required: ["category", "message"]
            }
          }
        });

        const textResponse = typeof response.text === "function" 
          ? (response as any).text() 
          : response.text;

        if (textResponse) {
          const parsed = JSON.parse(textResponse);
          return NextResponse.json({
            success: true,
            category: parsed.category,
            message: parsed.message
          });
        }
      } catch (geminiError) {
        console.error("Gemini API hatası, fallback simülasyona geçiliyor:", geminiError);
      }
    }

    // ─── FALLBACK SIMULATION (If Gemini is not configured or fails) ───
    if (!file) {
      if (!message.trim()) {
        return NextResponse.json({ error: "Mesaj veya resim bulunamadı" }, { status: 400 });
      }

      const query = message.toLowerCase();
      let responseText = "";

      // Spor/Workout araması
      if (query.includes("spor") || query.includes("koşu") || query.includes("gym") || query.includes("antrenman")) {
        if (temp > 22) {
          responseText = `Harika bir spor günü! 🏃‍♂️ Konumundaki (${cityCode}) sıcak havayı (${Math.round(temp)}°C) düşünürsek; hafif ve nefes alabilen bir tişört, spor şort ve rahat sneaker'larınla spora hazırsın!`;
        } else if (temp < 14) {
          responseText = `Hava biraz serin (${Math.round(temp)}°C). Rüzgar geçirmeyen ince bir ceket, altına spor taytı ve terletmeyen tişörtünle harika bir spor kombini yapabilirsin!`;
        } else {
          responseText = `Hava ılık (${Math.round(temp)}°C). Üzerine ince bir sweatshirt ve altına rahat bir eşofman altı alıp spora başlayabilirsin! 🏃‍♂️`;
        }
      }
      // Toplantı/İş araması
      else if (query.includes("toplantı") || query.includes("iş") || query.includes("görüşme") || query.includes("ofis")) {
        if (temp > 22) {
          responseText = `Bugün hava oldukça sıcak (${Math.round(temp)}°C). Ofis için ince keten gömlek, kumaş pantolon ve makosenler hem profesyonel hem de çok ferah! 💼`;
        } else if (temp < 14) {
          responseText = `Ofiste şık olmak için harika bir gün! Sıcak bir kış kombini olarak şık bir blazer ceket, ince balıkçı yaka kazak ve kumaş pantolon tercih edebilirsin.`;
        } else {
          responseText = `Ilık bir havada ofis için blazer ceket, şık bir gömlek ve keten pantolon kombini kurtarıcın olacaktır!`;
        }
      }
      // Genel tavsiye
      else {
        if (temp > 22) {
          responseText = `Bulunduğun yerde (${cityCode}) hava oldukça sıcak (${Math.round(temp)}°C). Pamuklu hafif bir tişört ve şık bir şortla günün tadını çıkarabilirsin! ☀️`;
        } else if (temp < 14) {
          responseText = `Hava soğuk (${Math.round(temp)}°C). Kalın bir kazak, üzerine sıcak tutacak kabanını giyerek katmanlı bir tarz oluşturabilirsin. ❄️`;
        } else {
          responseText = `Hava oldukça ılık (${Math.round(temp)}°C). Tişört üzerine alacağın ince bir hırka hem rüzgardan korur hem de stiline harika bir hava katar! 🍃`;
        }
      }

      return NextResponse.json({
        success: true,
        category: "casual wear",
        message: responseText
      });
    }

    // Görsel analiz simülasyonu
    const labels = ["winter clothing", "summer clothing", "casual wear", "formal elegant wear", "streetwear", "vintage clothing"];
    const best_label = labels[Math.floor(Math.random() * labels.length)];
    const tr_responses: Record<string, string> = {
      "winter clothing": "Bu bir kışlık kıyafet! ❄️ Koyu renk bir kaban veya kalın bir atkı ile harika durur. Sohbet tadında öneriler için lütfen .env.local dosyana GEMINI_API_KEY ekle!",
      "summer clothing": "Harika bir yazlık parça! ☀️ Açık renkli sandaletler ve hasır bir çanta ile kombinleyebilirsin. Daha akıllı öneriler için GEMINI_API_KEY tanımlayabilirsin.",
      "casual wear": "Çok rahat ve günlük bir tarz! 👖 Beyaz sneaker'lar bu kombinin kurtarıcısı olacaktır. Sohbet robotunu canlandırmak için GEMINI_API_KEY ekleyebilirsin.",
      "formal elegant wear": "Çok şık ve resmi bir parça! ✨ Özel davetler için topuklu ayakkabı ve zarif takılarla tamamlayabilirsin. Gemini entegrasyonu için API anahtarını eklemeyi unutma!",
      "streetwear": "Tam bir sokak stili! 🛹 Oversize bir ceket veya dikkat çekici spor ayakkabılarla çok havalı durur.",
      "vintage clothing": "Harika bir vintage esintisi! 🕰️ Retro güneş gözlükleri ve deri detaylarla bu tarzı güçlendirebilirsin."
    };

    return NextResponse.json({
      success: true,
      category: best_label,
      message: tr_responses[best_label]
    });

  } catch (error) {
    console.error("AI Proxy Hatası:", error);
    return NextResponse.json({ error: "Sunucu hatası" }, { status: 500 });
  }
}
