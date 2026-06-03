import { auth } from "@/auth";

/**
 * Web (NextAuth session) ve Mobil (Bearer Token) isteklerini ortak bir şekilde doğrular
 * ve giriş yapmış kullanıcının ID'sini döner.
 */
export async function getUserIdFromRequest(req: Request): Promise<string | null> {
  // 1. Web için: NextAuth oturum kontrolü
  const session = await auth();
  if (session?.user?.id) {
    return session.user.id;
  }

  // 2. Mobil için: Retrofit'ten gelen Bearer Token kontrolü
  const authHeader = req.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer jwt_session_token_")) {
    try {
      const token = authHeader.replace("Bearer jwt_session_token_", "");
      const decodedJson = Buffer.from(token, "base64").toString("utf-8");
      const payload = JSON.parse(decodedJson);
      return payload.id || null;
    } catch (error) {
      console.error("Mobil token doğrulama hatası:", error);
      return null;
    }
  }

  return null;
}
