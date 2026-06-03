import { NextResponse } from "next/server";

export const runtime = "nodejs";

// POST /api/ai/tag-image (Multipart Upload)
export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") ?? "";
    let filename = "clothing_item.jpg";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("image") as File | null;
      if (file) {
        filename = file.name;
      }
    }

    // Gelişmiş yapay zeka etiketleme simülasyonu
    const categories = ["Tişört", "Pantolon", "Ceket", "Kazak", "Elbise", "Gömlek"];
    const colors = ["Siyah", "Beyaz", "Mavi", "Kırmızı", "Gri", "Yeşil"];
    const styles = ["Spor", "Casual", "Klasik", "Retro", "Sokak Modası"];

    const predicted_category = categories[Math.floor(Math.random() * categories.length)];
    const predicted_color = colors[Math.floor(Math.random() * colors.length)];
    const predicted_style = styles[Math.floor(Math.random() * styles.length)];
    const confidence_score = parseFloat((0.85 + Math.random() * 0.14).toFixed(2));

    return NextResponse.json({
      filename,
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
