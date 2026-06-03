"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Tag, CheckCircle2, XCircle, Gift, Clock, Percent, Wallet, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

type RedeemedPromo = {
  id: string;
  redeemedAt: string;
  promoCode: {
    code: string;
    discountType: "percentage" | "fixed" | "wallet";
    discountValue: number;
    description: string | null;
    expiresAt: string | null;
  };
};

const DISCOUNT_ICONS: Record<string, React.ReactNode> = {
  percentage: <Percent className="w-4 h-4" />,
  fixed: <Tag className="w-4 h-4" />,
  wallet: <Wallet className="w-4 h-4" />,
};

const DISCOUNT_LABELS: Record<string, string> = {
  percentage: "İndirim",
  fixed: "Sabit İndirim",
  wallet: "Cüzdan Bakiyesi",
};

const DISCOUNT_COLORS: Record<string, string> = {
  percentage: "from-rose-50 to-pink-50 border-rose-100 text-rose-700",
  fixed: "from-orange-50 to-amber-50 border-orange-100 text-orange-700",
  wallet: "from-green-50 to-emerald-50 border-green-100 text-green-700",
};

function formatDiscount(type: string, value: number): string {
  if (type === "percentage") return `%${value} İndirim`;
  if (type === "fixed") return `${value.toLocaleString("tr-TR")} ₺ İndirim`;
  if (type === "wallet") return `${value.toLocaleString("tr-TR")} ₺ Cüzdan`;
  return `${value}`;
}

export function PromotionsTab() {
  const [codeInput, setCodeInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [redeemed, setRedeemed] = useState<RedeemedPromo[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [lastResult, setLastResult] = useState<{
    type: "success" | "error";
    message: string;
    promo?: RedeemedPromo["promoCode"];
  } | null>(null);

  useEffect(() => {
    axios
      .get("/api/user/promotions")
      .then((res) => setRedeemed(res.data))
      .catch(() => setRedeemed([]))
      .finally(() => setIsFetching(false));
  }, []);

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!codeInput.trim()) return;

    setIsLoading(true);
    setLastResult(null);

    try {
      const res = await axios.post("/api/user/promotions", { code: codeInput.trim() });
      const { redemption } = res.data;

      setLastResult({
        type: "success",
        message: res.data.message,
        promo: redemption.promoCode,
      });
      setCodeInput("");
      toast.success(res.data.message);

      // Listeyi güncelle
      setRedeemed((prev) => [redemption, ...prev]);
    } catch (err: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const error = err as any;
      const message = error.response?.data?.message || "Bir hata oluştu. Lütfen tekrar deneyin.";
      setLastResult({ type: "error", message });
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Başlık */}
      <div className="border-b border-gray-100 pb-4">
        <h3 className="text-lg font-semibold text-gray-900">Kampanyalar & Promosyon Kodları</h3>
        <p className="text-sm text-gray-500 mt-1">
          Vesti promosyon kodlarını girerek indirim veya cüzdan bakiyesi kazanabilirsiniz.
        </p>
      </div>

      {/* Kod Giriş Alanı */}
      <div className="bg-gradient-to-br from-vesti-primary/5 to-purple-50 border border-vesti-primary/20 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 bg-vesti-primary/10 rounded-xl">
            <Gift className="w-5 h-5 text-vesti-primary" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">Promosyon Kodu Girin</p>
            <p className="text-xs text-gray-500">Kod büyük/küçük harf duyarlı değildir.</p>
          </div>
        </div>

        <form onSubmit={handleRedeem} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              id="promo-code-input"
              value={codeInput}
              onChange={(e) => {
                setCodeInput(e.target.value.toUpperCase());
                setLastResult(null);
              }}
              placeholder="Örn: VESTI20"
              className="pl-9 font-mono tracking-wider uppercase bg-white border-gray-200 focus:border-vesti-primary"
              disabled={isLoading}
            />
          </div>
          <Button
            type="submit"
            disabled={isLoading || !codeInput.trim()}
            className="bg-vesti-primary hover:bg-vesti-dark text-white px-6 h-10 font-medium shrink-0"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Uygulanıyor...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Kodu Uygula
                <ChevronRight className="w-4 h-4" />
              </span>
            )}
          </Button>
        </form>

        {/* Sonuç Mesajı */}
        {lastResult && (
          <div
            className={`mt-4 flex items-start gap-3 p-3 rounded-xl border text-sm font-medium ${
              lastResult.type === "success"
                ? "bg-green-50 border-green-200 text-green-700"
                : "bg-red-50 border-red-200 text-red-700"
            }`}
          >
            {lastResult.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-5 h-5 shrink-0 mt-0.5" />
            )}
            <div>
              <p>{lastResult.message}</p>
              {lastResult.promo && (
                <p className="text-xs opacity-75 mt-0.5">
                  {formatDiscount(lastResult.promo.discountType, lastResult.promo.discountValue)} kazandınız!
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Kullanılan Kodlar */}
      <div>
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
          Kullandığım Kodlar ({redeemed.length})
        </p>

        {isFetching ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-20 bg-gray-100 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : redeemed.length === 0 ? (
          <div className="py-12 text-center border border-dashed border-gray-200 rounded-2xl">
            <Gift className="w-8 h-8 mx-auto text-gray-300 mb-2" />
            <p className="font-medium text-gray-500">Henüz kod kullanmadınız.</p>
            <p className="text-sm text-gray-400 mt-1">Yukarıdaki alana bir promosyon kodu girerek başlayın.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {redeemed.map((item) => {
              const colorClass =
                DISCOUNT_COLORS[item.promoCode.discountType] || "from-gray-50 to-gray-50 border-gray-100 text-gray-700";
              const isExpired =
                item.promoCode.expiresAt && new Date() > new Date(item.promoCode.expiresAt);

              return (
                <div
                  key={item.id}
                  className={`bg-gradient-to-br ${colorClass} border rounded-2xl p-4 relative overflow-hidden`}
                >
                  {/* Decorative dashes pattern (ticket style) */}
                  <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 border-t-2 border-dashed border-current opacity-10" />

                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-white/60 rounded-lg">
                        {DISCOUNT_ICONS[item.promoCode.discountType]}
                      </div>
                      <div>
                        <p className="font-bold tracking-widest text-sm font-mono">{item.promoCode.code}</p>
                        <p className="text-xs opacity-75">
                          {DISCOUNT_LABELS[item.promoCode.discountType]}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="text-lg font-extrabold">
                        {formatDiscount(item.promoCode.discountType, item.promoCode.discountValue)}
                      </p>
                      {item.promoCode.expiresAt && (
                        <p className={`flex items-center justify-end gap-1 text-xs mt-0.5 ${isExpired ? "opacity-50 line-through" : "opacity-75"}`}>
                          <Clock className="w-3 h-3" />
                          {new Date(item.promoCode.expiresAt).toLocaleDateString("tr-TR")}
                        </p>
                      )}
                    </div>
                  </div>

                  {item.promoCode.description && (
                    <p className="text-xs opacity-75 mt-2 ml-0.5">{item.promoCode.description}</p>
                  )}

                  <p className="text-[10px] opacity-50 mt-2">
                    Kullanıldı: {new Date(item.redeemedAt).toLocaleDateString("tr-TR")}
                  </p>

                  {isExpired && (
                    <span className="absolute top-3 right-3 text-[10px] font-bold bg-white/50 px-2 py-0.5 rounded-full opacity-75">
                      Süresi Doldu
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
