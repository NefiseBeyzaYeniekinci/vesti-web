"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useClientLanguage } from "@/lib/i18n/client";
import { Shirt, Palette, Ruler, CheckCircle2, ArrowRight, ArrowLeft, Coffee, Briefcase, Activity, Box, Flame } from "lucide-react";

const COLORS = ["Siyah", "Beyaz", "Gri", "Lacivert", "Kırmızı", "Mavi", "Yeşil", "Sarı", "Pembe", "Bej"];
const COLORS_EN = ["Black", "White", "Gray", "Navy", "Red", "Blue", "Green", "Yellow", "Pink", "Beige"];

const STYLES = [
  { key: "CASUAL", tr: "Casual", en: "Casual", desc_tr: "Rahat ve gündelik", desc_en: "Relaxed & everyday", icon: Coffee },
  { key: "FORMAL", tr: "Formal", en: "Formal", desc_tr: "İş ve resmi toplantılar", desc_en: "Business & formal events", icon: Briefcase },
  { key: "SPORT", tr: "Spor", en: "Sport", desc_tr: "Aktif ve sportif", desc_en: "Active & sporty", icon: Activity },
  { key: "MINIMAL", tr: "Minimal", en: "Minimal", desc_tr: "Sade ve temiz çizgiler", desc_en: "Clean & simple lines", icon: Box },
  { key: "STREETWEAR", tr: "Streetwear", en: "Streetwear", desc_tr: "Şehir trendi", desc_en: "Urban & trendy", icon: Flame },
];

type FormData = {
  favoriteColors: string[];
  style: string;
  topSize: string;
  bottomSize: string;
  shoeSize: string;
  bodyType: string;
  location: string;
};

export default function OnboardingPage() {
  const router = useRouter();
  const language = useClientLanguage();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<FormData>({
    favoriteColors: [],
    style: "CASUAL",
    topSize: "",
    bottomSize: "",
    shoeSize: "",
    bodyType: "UNKNOWN",
    location: "",
  });

  const t = {
    step1Title: language === "en" ? "Welcome to Vesti!" : "Vesti'ye Hoş Geldiniz!",
    step1Desc: language === "en" ? "Let's personalize your experience. First, tell us your style." : "Deneyiminizi kişiselleştirelim. Önce stilinizi bize anlatın.",
    step2Title: language === "en" ? "Your Favorite Colors" : "Favori Renkleriniz",
    step2Desc: language === "en" ? "Select the colors you love to wear." : "Giymekten keyif aldığınız renkleri seçin.",
    step3Title: language === "en" ? "Your Measurements" : "Ölçüleriniz",
    step3Desc: language === "en" ? "So we can find the best-fitting items for you." : "Size en uygun ürünleri bulabilmemiz için.",
    colorError: language === "en" ? "Please select at least 1 color." : "Lütfen en az 1 renk seçin.",
    next: language === "en" ? "Continue" : "Devam Et",
    back: language === "en" ? "Back" : "Geri",
    finish: language === "en" ? "Start Exploring!" : "Keşfetmeye Başla!",
    topSize: language === "en" ? "Top Size (e.g. M, L)" : "Üst Beden (ör. M, L)",
    bottomSize: language === "en" ? "Bottom Size (e.g. 38, 40)" : "Alt Beden (ör. 38, 40)",
    shoeSize: language === "en" ? "Shoe Size (e.g. 42)" : "Ayakkabı No (ör. 42)",
    location: language === "en" ? "Your City" : "Şehriniz",
    locationPlaceholder: language === "en" ? "e.g. Istanbul" : "ör. İstanbul",
    bodyType: language === "en" ? "Body Type (optional)" : "Vücut Tipi (opsiyonel)",
    skip: language === "en" ? "Skip" : "Atla",
  };

  const toggleColor = (color: string) => {
    setForm(prev => ({
      ...prev,
      favoriteColors: prev.favoriteColors.includes(color)
        ? prev.favoriteColors.filter(c => c !== color)
        : [...prev.favoriteColors, color],
    }));
  };

  const handleNext = () => {
    if (step === 2 && form.favoriteColors.length === 0) {
      alert(t.colorError);
      return;
    }
    setStep(s => s + 1);
  };

  const handleFinish = async () => {
    setIsSubmitting(true);
    try {
      await fetch("/api/onboarding/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      router.push("/home");
    } catch {
      router.push("/home");
    }
  };

  const progressPercent = ((step - 1) / 3) * 100;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      {/* Logo */}
      <div className="mb-8 flex items-center gap-2">
        <div className="w-10 h-10 bg-vesti-primary rounded-2xl flex items-center justify-center">
          <Shirt className="w-5 h-5 text-white" />
        </div>
        <span className="text-2xl font-extrabold text-vesti-dark">Vesti</span>
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-lg mb-8">
        <div className="flex justify-between text-xs text-gray-400 mb-2">
          <span>{language === "en" ? "Step" : "Adım"} {step}/3</span>
          <span>{Math.round(progressPercent)}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div
            className="bg-vesti-primary h-2 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Card */}
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-lg border border-gray-100 p-8">

        {/* STEP 1 — Stil Tercihi */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 bg-indigo-50 rounded-2xl">
                <Shirt className="w-6 h-6 text-indigo-500" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-vesti-dark">{t.step1Title}</h1>
                <p className="text-gray-500 text-sm mt-0.5">{t.step1Desc}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 mt-6">
              {STYLES.map(style => (
                <button
                  key={style.key}
                  onClick={() => setForm(p => ({ ...p, style: style.key }))}
                  className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
                    form.style === style.key
                      ? "border-vesti-primary bg-vesti-primary/5"
                      : "border-gray-100 hover:border-gray-200 bg-gray-50"
                  }`}
                >
                  <div className={`p-3 rounded-xl transition-colors ${
                    form.style === style.key
                      ? "bg-vesti-primary text-white"
                      : "bg-white text-gray-500 shadow-sm border border-gray-100"
                  }`}>
                    <style.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{language === "en" ? style.en : style.tr}</p>
                    <p className="text-xs text-gray-500">{language === "en" ? style.desc_en : style.desc_tr}</p>
                  </div>
                  {form.style === style.key && (
                    <CheckCircle2 className="ml-auto w-5 h-5 text-vesti-primary shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2 — Renkler */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 bg-pink-50 rounded-2xl">
                <Palette className="w-6 h-6 text-pink-500" />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-vesti-dark">{t.step2Title}</h2>
                <p className="text-gray-500 text-sm mt-0.5">{t.step2Desc}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2.5 mt-4">
              {COLORS.map((color, i) => (
                <button
                  key={color}
                  onClick={() => toggleColor(color)}
                  className={`px-5 py-2.5 rounded-2xl text-sm font-semibold border-2 transition-all ${
                    form.favoriteColors.includes(color)
                      ? "border-vesti-primary bg-vesti-primary text-white"
                      : "border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {language === "en" ? COLORS_EN[i] : color}
                </button>
              ))}
            </div>

            {form.favoriteColors.length > 0 && (
              <p className="text-xs text-indigo-500 font-medium">
                {form.favoriteColors.length} {language === "en" ? "color(s) selected" : "renk seçildi"}
              </p>
            )}
          </div>
        )}

        {/* STEP 3 — Ölçüler */}
        {step === 3 && (
          <div className="space-y-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 bg-emerald-50 rounded-2xl">
                <Ruler className="w-6 h-6 text-emerald-500" />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-vesti-dark">{t.step3Title}</h2>
                <p className="text-gray-500 text-sm mt-0.5">{t.step3Desc}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { key: "topSize", label: t.topSize, placeholder: "M" },
                { key: "bottomSize", label: t.bottomSize, placeholder: "38" },
                { key: "shoeSize", label: t.shoeSize, placeholder: "42" },
              ].map(field => (
                <div key={field.key}>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">{field.label}</label>
                  <input
                    type="text"
                    placeholder={field.placeholder}
                    value={form[field.key as keyof FormData] as string}
                    onChange={e => setForm(p => ({ ...p, [field.key]: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-gray-50 font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-vesti-primary focus:bg-white transition-all"
                  />
                </div>
              ))}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">{t.location}</label>
              <input
                type="text"
                placeholder={t.locationPlaceholder}
                value={form.location}
                onChange={e => setForm(p => ({ ...p, location: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-vesti-primary focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">{t.bodyType}</label>
              <select
                value={form.bodyType}
                onChange={e => setForm(p => ({ ...p, bodyType: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-gray-50 font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-vesti-primary focus:bg-white transition-all"
              >
                <option value="UNKNOWN">{language === "en" ? "Prefer not to say" : "Belirtmek İstemiyorum"}</option>
                <option value="ECTOMORPH">{language === "en" ? "Slim (Ectomorph)" : "Zayıf (Ektomorf)"}</option>
                <option value="MESOMORPH">{language === "en" ? "Athletic (Mesomorph)" : "Atletik (Mezomorf)"}</option>
                <option value="ENDOMORPH">{language === "en" ? "Broad (Endomorph)" : "Geniş (Endomorf)"}</option>
              </select>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 mt-8">
          {step > 1 && (
            <button
              onClick={() => setStep(s => s - 1)}
              className="flex items-center gap-2 px-5 py-3 border border-gray-200 rounded-2xl text-gray-600 font-semibold hover:bg-gray-50 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              {t.back}
            </button>
          )}

          {step < 3 ? (
            <button
              onClick={handleNext}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-vesti-primary text-white rounded-2xl font-bold hover:bg-vesti-dark transition-all shadow-sm"
            >
              {t.next}
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              disabled={isSubmitting}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-vesti-primary text-white rounded-2xl font-bold hover:bg-vesti-dark transition-all shadow-sm disabled:opacity-50"
            >
              {isSubmitting ? (language === "en" ? "Saving..." : "Kaydediliyor...") : t.finish}
              {!isSubmitting && <CheckCircle2 className="w-4 h-4" />}
            </button>
          )}
        </div>

        {step === 3 && (
          <button
            onClick={() => router.push("/home")}
            className="w-full text-center text-sm text-gray-400 hover:text-gray-600 mt-3 transition-colors"
          >
            {t.skip}
          </button>
        )}
      </div>

      {/* Footer */}
      <p className="text-xs text-gray-400 mt-6">
        {language === "en" ? "You can update these settings anytime in your profile." : "Bu ayarları dilediğiniz zaman profilinizden güncelleyebilirsiniz."}
      </p>
    </div>
  );
}
