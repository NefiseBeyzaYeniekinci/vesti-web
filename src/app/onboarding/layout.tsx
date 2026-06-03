export const metadata = {
  title: "Hoş Geldiniz | Vesti",
};

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {children}
    </div>
  );
}
