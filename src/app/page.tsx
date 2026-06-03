import Link from "next/link";
import { ArrowRight, Shirt } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-vesti-background flex flex-col items-center justify-center text-center px-4">
      <div className="max-w-3xl space-y-8">
        <div className="flex justify-center mb-6">
          <Shirt className="w-20 h-20 text-vesti-primary" />
        </div>
        <h1 className="text-5xl md:text-7xl font-extrabold text-vesti-dark tracking-tight">
          Dolabındaki Giysiler,<br />
          <span className="text-vesti-primary">Şimdi Daha Anlamlı.</span>
        </h1>
        <p className="text-xl text-vesti-text/80 max-w-2xl mx-auto">
          Vesti ile kıyafetlerini dijitalleştir, yapay zeka ile yepyeni kombinler keşfet ve artık kullanmadıklarını kolayca sat!
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <Link
            href="/register"
            className="px-8 py-4 bg-vesti-primary text-white font-semibold rounded-full hover:bg-vesti-dark transition-colors flex items-center justify-center gap-2"
          >
            Hemen Başla <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            href="/login"
            className="px-8 py-4 bg-white text-vesti-primary border-2 border-vesti-primary font-semibold rounded-full hover:bg-vesti-primary/10 transition-colors"
          >
            Giriş Yap
          </Link>
        </div>
      </div>
    </div>
  );
}
