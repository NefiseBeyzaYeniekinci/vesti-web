import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function POST(req: Request) {
  try {
    const { idToken } = await req.json();

    if (!idToken) {
      return NextResponse.json(
        { error: "Google ID Token bulunamadı" },
        { status: 400 }
      );
    }

    // Google token'ı doğrula
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID!,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return NextResponse.json(
        { error: "Geçersiz Google token" },
        { status: 401 }
      );
    }

    const { email, name, sub: googleId } = payload;

    // Kullanıcıyı bul veya oluştur
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name: name ?? email.split("@")[0],
          password: null, // Google kullanıcılarının şifresi olmaz
        },
      });
    }

    // JWT token oluştur (web ile aynı format)
    const token = "jwt_session_token_" + Buffer.from(
      JSON.stringify({ id: user.id, email: user.email })
    ).toString("base64");

    return NextResponse.json(
      {
        message: "Google ile giriş başarılı",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Google Auth hatası:", error);
    return NextResponse.json(
      { error: "Google kimlik doğrulaması başarısız oldu" },
      { status: 500 }
    );
  }
}
