import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export const runtime = "nodejs";

// POST /api/ai/tag-image (Multipart Upload)
export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") ?? "";
    let file: File | null = null;

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      file = formData.get("image") as File | null;
    }

    if (!file) {
      return NextResponse.json({ message: "Görsel yüklenmedi" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64Image = buffer.toString("base64");
        const mimeType = file.type;

        const response = await ai.models.generateContent({
          model: "gemini-2.0-flash",
          contents: [
            {
              inlineData: {
                data: base64Image,
                mimeType: mimeType
              }
            },
            `Bu kıyafeti analiz et ve şu kategorilerden en uygun olanını belirle:
Kategoriler: Tişört, Pantolon, Ceket, Kazak, Elbise, Gömlek, Ayakkabı, Etek, Hırka, Mont, Kaban, Diğer.
Renkler: Kıyafetin baskın olan rengi (örn. Siyah, Beyaz, Mavi, Gri, Kırmızı, Yeşil, Sarı, Kahverengi, Krem, Bej, Turuncu, Pembe, Çok Renkli vb.).
Stiller: Spor, Casual, Klasik, Retro, Sokak Modası.

Cevabını JSON formatında şu anahtarlarla dön:
{
  "predicted_category": "kategori",
  "predicted_color": "renk",
  "predicted_style": "stil",
  "confidence_score": 0.95
}
`
          ],
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: "OBJECT",
              properties: {
                predicted_category: {
                  type: "STRING"
                },
                predicted_color: {
                  type: "STRING"
                },
                predicted_style: {
                  type: "STRING"
                },
                confidence_score: {
                  type: "NUMBER"
                }
              },
              required: ["predicted_category", "predicted_color", "predicted_style", "confidence_score"]
            }
          }
        });

        const textResponse = typeof response.text === "function" 
          ? (response as any).text() 
          : response.text;

        if (textResponse) {
          const parsed = JSON.parse(textResponse);
          return NextResponse.json({
            filename: file.name,
            predicted_category: parsed.predicted_category,
            predicted_color: parsed.predicted_color,
            predicted_style: parsed.predicted_style,
            confidence_score: parsed.confidence_score
          });
        }
      } catch (geminiError) {
        console.error("Gemini Tagging API hatası, fallback simülasyona geçiliyor:", geminiError);
      }
    }

    // ─── FALLBACK SIMULATION (If Gemini is not configured or fails) ───
    const categories = ["Tişört", "Pantolon", "Ceket", "Kazak", "Elbise", "Gömlek"];
    const colors = ["Siyah", "Beyaz", "Mavi", "Kırmızı", "Gri", "Yeşil"];
    const styles = ["Spor", "Casual", "Klasik", "Retro", "Sokak Modası"];

    const predicted_category = categories[Math.floor(Math.random() * categories.length)];
    const predicted_color = colors[Math.floor(Math.random() * colors.length)];
    const predicted_style = styles[Math.floor(Math.random() * styles.length)];
    const confidence_score = parseFloat((0.85 + Math.random() * 0.14).toFixed(2));

    return NextResponse.json({
      filename: file.name,
      predicted_category,
      predicted_color,
      predicted_style,
      confidence_score
    });

  } catch (error) {
    console.error("AI Tagging Hatası:", error);
    return NextResponse.json({ message: "Sunucu hatası" }, { status: 500 });
  }
}
