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

    // ─── FALLBACK (Gemini yapılandırılmamış veya başarısız olduğunda) ───
    if (!file) {
      if (!message.trim()) {
        return NextResponse.json({ error: "Mesaj veya resim bulunamadı" }, { status: 400 });
      }

      const q = message.toLowerCase();
      const t = Math.round(temp);
      let responseText = "";
      let category = "casual wear";

      // ── Hava & mevsim yardımcıları ──
      const sicak = temp > 22;
      const soguk = temp < 14;
      const ilik  = !sicak && !soguk;
      const hava  = sicak ? `sıcak (${t}°C)` : soguk ? `soğuk (${t}°C)` : `ılık (${t}°C)`;

      // 1. Spor / Egzersiz
      if (q.match(/spor|koşu|gym|antrenman|egzersiz|workout|fitness|yürüyüş|pilates|yoga/)) {
        category = "casual wear";
        if (sicak) responseText = `Bugün ${hava}! Spor için hafif, nefes alabilen bir tişört + spor şort + koşu ayakkabısı ideal kombin. 🏃‍♀️☀️`;
        else if (soguk) responseText = `Hava ${hava}. Isıyı içinde tutan termal tayt, ince rüzgarlık ve spor tişört ile spora hazırsın! 🏃‍♀️❄️`;
        else responseText = `${hava} bir hava var. İnce bir eşofman altı + sweatshirt kombinasyonu spor için mükemmel! 🏃‍♀️`;
      }

      // 2. Arkadaş buluşması / Kafede / Günlük
      else if (q.match(/arkadaş|buluşma|kafe|cafe|kahve|gezme|gezinti|çıkmak|çıkıyorum|casual|günlük|rahat/)) {
        category = "casual wear";
        if (sicak) responseText = `Arkadaş buluşması için hava ${hava} — hafif bir elbise veya crop top + jean kombinasyonu tam da bu hava için biçilmiş kaftan! 👗☀️`;
        else if (soguk) responseText = `Hava ${hava}, üşümemek için şık bir kaban altına turtleneck + skinny jean çok havalı durur arkadaş buluşmasında! 🧥`;
        else responseText = `Kafe buluşması için ${hava} bir gün — oversized bir gömlek veya örme kazak + mom jean + beyaz sneaker kombinini tavsiye ederim! 🤍`;
      }

      // 3. Elbise / Etek seçimi
      else if (q.match(/elbise|etek|dress|maxi|mini|midi|rop|fıstık|şık görün|zarif/)) {
        category = "formal elegant wear";
        if (sicak) responseText = `Elbise harika bir seçim olur bu ${hava} için! Hafif kumaşlı askılı veya kısa kollu bir elbise — yanına sandalet ve küçük bir el çantası ekle, mükemmel görünürsün. 👗✨`;
        else if (soguk) responseText = `Elbise giymek istiyorsan bu ${hava} içini örten kalın bir külotlu çorap + uzun elbise + üzerine trençkot kombinini dene! Hem şık hem sıcak. 🧥👗`;
        else responseText = `${hava} bir günde etek ya da elbise için harika! Midi boy bir elbise veya pileli etek + bluz kombinasyonu çok şık durur. ✨`;
      }

      // 4. Toplantı / İş / Ofis / Mülakat
      else if (q.match(/toplantı|iş|ofis|görüşme|mülakat|sunum|resmi|profesyonel/)) {
        category = "formal elegant wear";
        if (sicak) responseText = `Ofis için hava ${hava}. İnce keten gömlek veya bluz + kumaş pantolon + makosen ayakkabı hem profesyonel hem ferah! 💼`;
        else if (soguk) responseText = `Toplantı için ${hava} bir gün — klasik bir blazer ceket, içine balıkçı yaka kazak + kumaş pantolon her zaman güvenli ve şık! 💼`;
        else responseText = `İş görüşmesi için ${hava} hava — blazer + şık bluz/gömlek + düz renk pantolon kombinini öneririm. 💼`;
      }

      // 5. Akşam yemeği / Romantik / Date
      else if (q.match(/akşam yemeği|restoran|romantik|sevgili|date|randevu|özel gece|sevgilimle/)) {
        category = "formal elegant wear";
        if (sicak) responseText = `Romantik bir akşam için ${hava} var — ince askılı bir midi elbise veya şık bir bluz + dar pantolon + topuklu sandalet çok şık olur! 🌹✨`;
        else if (soguk) responseText = `${hava} bir akşam yemeği için kadife veya saten detaylı bir elbise + üzerine şık bir kaban + bot kombinasyonu hem sıcak hem zarif! 🌹`;
        else responseText = `Akşam yemeği için ${hava} — şık bir midi elbise veya blazer + saten bluz kombinasyonunu dene, harika görünürsün! 🌹`;
      }

      // 6. Parti / Gece kulübü / Düğün / Davet
      else if (q.match(/parti|gece kulüb|kulüp|düğün|davet|nişan|eğlence|kutlama|kına|balo/)) {
        category = "formal elegant wear";
        if (sicak) responseText = `Parti için ${hava} var! Mini elbise veya şık iki parça set + topuklu sandalet + büyük küpeler ile gecenin yıldızı olursun! 🎉✨`;
        else responseText = `Düğün/davet için zarif bir midi/maxi elbise veya şık bir tulum — üzerine ince bir şal veya ceket ekleyebilirsin. 🥂✨`;
      }

      // 7. Plaj / Tatil / Yüzme
      else if (q.match(/plaj|deniz|tatil|yüzme|bikini|mayo|sahil|yaz tatili|resort/)) {
        category = "summer clothing";
        responseText = `Plaj için en iyi seçimler: bikini veya mayo üzerine ince bir pareo ya da kısa elbise, sandalet ve güneş şapkası! Güneş kremini de unutma! 🌊☀️`;
      }

      // 8. Okul / Üniversite / Kampüs
      else if (q.match(/okul|üniversite|kampüs|derse|sınıfa|öğrenci/)) {
        category = "casual wear";
        if (sicak) responseText = `Okul için ${hava} — rahat bir tişört + straight leg jean + beyaz sneaker kombinasyonu hem şık hem rahat! 🎒`;
        else if (soguk) responseText = `Kampüse giderken ${hava} var — kalın bir hoodie veya kazak + mom jean + bot kombinasyonuna parka ceket ekle! 🎒❄️`;
        else responseText = `Okul için ${hava} bir gün — oversized bir gömlek veya kazak + jean + sneaker her zaman kurtarıcıdır! 🎒`;
      }

      // 9. Kışlık / Sıcak tutma
      else if (q.match(/soğukta|üşüyorum|sıcak tut|kışlık|mont|kaban|kalın/)) {
        category = "winter clothing";
        responseText = `${hava} bir hava için katmanlı giyinmek şart! İçe ince termal, üzerine kalın bir kazak, en dışa da dolgu mont + atkı + bere + kar botu kombinasyonu seni sıcacık tutar! ❄️🧣`;
      }

      // 10. Yağmur / Islak hava
      else if (q.match(/yağmur|yağmurlu|ıslak|şemsiye|yağacak|bulutlu/)) {
        category = "casual wear";
        responseText = `Yağmurlu bir hava! ☔ Su geçirmez trençkot veya yağmurluk + su geçirmez bot + koyu renk pantolon kombinini önerir, şemsiyeni yanına almayı unutmazsın!`;
      }

      // 11. Vintage / Retro tarz
      else if (q.match(/vintage|retro|klasik|90lar|80ler|thrift/)) {
        category = "vintage clothing";
        responseText = `Vintage tarz için harika öneriler: yüksek bel wide-leg pantolon + blazer veya crop tişört, deri ceket + bootcut jean + platform ayakkabı. Retro güneş gözlüğü de şart! 🕰️✨`;
      }

      // 12. Streetwear / Sokak modası
      else if (q.match(/sokak|streetwear|oversize|hoodie|sweatshirt|sneaker|hype/)) {
        category = "streetwear";
        responseText = `Sokak stili için oversize hoodie veya grafik tişört + cargo pantolon + chunky sneaker kombinasyonu çok havalı! Bere veya kep de ekleyebilirsin. 🛹🔥`;
      }

      // 13. Ne giyeyim / Genel kombin önerisi
      else if (q.match(/ne giyeyim|ne giysem|kombin|öneri|tavsiye|yardım|ne giymeli/)) {
        category = "casual wear";
        if (sicak) responseText = `${hava} bir günde en iyi seçimler: hafif bir elbise veya şort + tişört kombinasyonu + sandalet ya da beyaz sneaker. Hafif kumaşları tercih et! ☀️👗`;
        else if (soguk) responseText = `${hava} bu havada katmanlı giyinmek altın kural! Kalın kazak + jean + bot + üzerine sıcak tutan bir kaban. Atkı ve bere de ekleyebilirsin! ❄️🧣`;
        else responseText = `${hava} bir gün için en şık seçim: tişört veya bluz + jean + ince bir dış ceket veya hırka + sneaker. Sade ama şık! ✨`;
      }

      // Genel fallback
      else {
        category = "casual wear";
        if (sicak) responseText = `${cityCode} bölgesinde hava ${hava}. Hafif, nefes alabilen pamuklu bir tişört ve şort veya ince elbiseyle günün tadını çıkarabilirsin! ☀️`;
        else if (soguk) responseText = `Hava ${hava}. Kalın bir kazak + kaban + jean + bot kombinasyonuyla hem sıcak hem de şık olabilirsin! ❄️`;
        else responseText = `Hava ${hava}. Tişört + hırka veya ince ceket + jean kombinasyonu her ortama uyar. Günün harika geçsin! ✨`;
      }

      return NextResponse.json({
        success: true,
        category,
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
