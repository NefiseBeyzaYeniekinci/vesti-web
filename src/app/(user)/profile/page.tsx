import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { cookies } from "next/headers";

export const metadata = {
  title: "Profil Ayarları | Vesti",
};

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  // Kullanıcının en güncel verisini veritabanından çekelim
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      bio: true,
      location: true,
      isPublic: true,
      trustScore: true,
      savedCards: {
        select: {
          id: true,
          cardName: true,
          cardNumber: true,
          expiryDate: true,
          isDefault: true,
        }
      }
    },
  });

  if (!user) {
    redirect("/login");
  }

  const cookieStore = cookies();
  const language = cookieStore.get("vesti-lang")?.value === "en" ? "en" : "tr";

  const t = {
    title: language === "en" ? "Profile and Settings" : "Profil ve Ayarlar",
    subtitle: language === "en" ? "Manage your personal information and account settings." : "Kişisel bilgilerinizi ve hesap ayarlarınızı yönetin.",
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-8">
      {/* Header — editoryal stil */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 flex items-center justify-between"
        style={{ border: '0.5px solid #E0E3E8' }}>
        <div>
          <h1
            className="text-3xl tracking-tight"
            style={{
              fontWeight: 600,
              color: '#29294D',
              letterSpacing: '-0.01em',
            }}
          >
            {t.title}
          </h1>
          <p className="text-sm mt-1.5" style={{ color: '#607080', fontWeight: 400 }}>
            {t.subtitle}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl overflow-hidden" style={{ border: '0.5px solid #E0E3E8' }}>
        <div className="p-6 md:p-8">
          <ProfileForm user={user} />
        </div>
      </div>
    </div>
  );
}
