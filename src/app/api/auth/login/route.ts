import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "E-posta ve şifre zorunludur" },
        { status: 400 }
      );
    }

    // Kullanıcıyı veritabanında ara
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      if (password === "google_oauth_pass") {
        // Google kullanıcısı ilk defa giriş yapıyorsa otomatik kaydet
        user = await prisma.user.create({
          data: {
            name: email.split("@")[0], // E-postadan varsayılan ad türet
            email,
            password: await bcrypt.hash(password, 10),
          },
        });
      } else {
        return NextResponse.json(
          { message: "Hatalı e-posta veya şifre" },
          { status: 401 }
        );
      }
    }

    // Şifreyi doğrula (Google girişlerinde şifre kontrolünü atlayıp doğrudan oturum açtırıyoruz)
    if (password !== "google_oauth_pass") {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return NextResponse.json(
          { message: "Hatalı e-posta veya şifre" },
          { status: 401 }
        );
      }
    }

    // Mobil için benzersiz bir JWT token oluştur / simüle et
    const mockToken = "jwt_session_token_" + Buffer.from(JSON.stringify({ id: user.id, email: user.email })).toString("base64");

    return NextResponse.json(
      {
        message: "Giriş başarılı",
        token: mockToken,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Giriş hatası:", error);
    return NextResponse.json(
      { message: "Sunucu hatası oluştu" },
      { status: 500 }
    );
  }
}
