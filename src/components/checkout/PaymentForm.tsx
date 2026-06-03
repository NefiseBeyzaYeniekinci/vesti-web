"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, MapPin, CheckCircle2, Loader2, Plus, ShieldCheck, Gift, Tag, ChevronRight, Palette } from "lucide-react";
import { toast } from "sonner";

interface SavedCard {
  id: string;
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  isDefault: boolean;
}

interface PromoCode {
  id: string;
  code: string;
  discountType: string;
  discountValue: number;
  description: string | null;
  minOrderAmount: number | null;
}

interface PaymentFormProps {
  listingId: string;
  price: number;
  currency: string;
  sellerId: string;
  availableCoupons: PromoCode[];
}

export default function PaymentForm({ listingId, price, currency, availableCoupons = [] }: PaymentFormProps) {
  const router = useRouter();
  const [cards, setCards] = useState<SavedCard[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<string>("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoadingCards, setIsLoadingCards] = useState(true);
  const [appliedCoupon, setAppliedCoupon] = useState<PromoCode | null>(null);
  const [manualCode, setManualCode] = useState("");

  const handleApplyManualCode = () => {
    if (!manualCode.trim()) return;
    
    // Kullanılmayan kuponlar arasından eşleşeni bul
    const matchingCoupon = availableCoupons.find(
      (c) => c.code.toUpperCase() === manualCode.trim().toUpperCase()
    );

    if (!matchingCoupon) {
      toast.error("Geçersiz, kullanılmış veya süresi dolmuş promosyon kodu.");
      return;
    }

    const hasMinAmount = matchingCoupon.minOrderAmount ? price >= matchingCoupon.minOrderAmount : true;
    if (!hasMinAmount) {
      toast.error(`Bu kupon sadece en az ${matchingCoupon.minOrderAmount} TL tutarındaki alışverişlerde geçerlidir.`);
      return;
    }

    setAppliedCoupon(matchingCoupon);
    setManualCode("");
    toast.success(`${matchingCoupon.code} kuponu başarıyla uygulandı!`);
  };
  
  // New card states
  const [showNewCardForm, setShowNewCardForm] = useState(false);
  const [newCard, setNewCard] = useState({ number: "", name: "", expiry: "", cvv: "" });

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 16) value = value.slice(0, 16);
    const formatted = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    setNewCard({ ...newCard, number: formatted });
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length > 2) {
      value = `${value.slice(0, 2)}/${value.slice(2)}`;
    }
    setNewCard({ ...newCard, expiry: value });
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 3) value = value.slice(0, 3);
    setNewCard({ ...newCard, cvv: value });
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      const res = await fetch("/api/payments/cards");
      if (res.ok) {
        const data = await res.json();
        setCards(data);
        const defaultCard = data.find((c: SavedCard) => c.isDefault);
        if (defaultCard) setSelectedCardId(defaultCard.id);
        else if (data.length > 0) setSelectedCardId(data[0].id);
        else setShowNewCardForm(true);
      }
    } catch (error) {
      console.error("Error fetching cards:", error);
    } finally {
      setIsLoadingCards(false);
    }
  };

  const generateMockCards = async () => {
    setIsLoadingCards(true);
    try {
      const res = await fetch("/api/payments/cards/mock", { method: "POST" });
      if (res.ok) {
        toast.success("Test kartları eklendi!");
        fetchCards();
      }
    } catch (error) {
      console.error("Mock card error:", error);
      setIsLoadingCards(false);
    }
  };

  const handleCheckout = async () => {
    if (!shippingAddress.trim()) {
      toast.error("Lütfen teslimat adresi giriniz.");
      return;
    }
    
    if (!showNewCardForm && !selectedCardId) {
      toast.error("Lütfen bir ödeme yöntemi seçin.");
      return;
    }

    if (showNewCardForm) {
      if (!newCard.number || !newCard.name || !newCard.expiry) {
        toast.error("Lütfen kart bilgilerini eksiksiz girin.");
        return;
      }
    }

    setIsProcessing(true);

    try {
      const res = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId,
          shippingAddress,
          cardId: showNewCardForm ? null : selectedCardId,
          newCard: showNewCardForm ? newCard : null,
          appliedCouponId: appliedCoupon ? appliedCoupon.id : null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Ödeme işlemi başarısız oldu.");
      }

      toast.success("Ödeme Iyzico ile başarıyla alındı! Siparişiniz oluşturuldu.");
      router.push("/profile?tab=orders");

    } catch (error) {
      const message = error instanceof Error ? error.message : "Ödeme işlemi başarısız oldu.";
      toast.error(message);
      setIsProcessing(false);
    }
  };

  // İndirim hesaplama
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      discountAmount = (price * appliedCoupon.discountValue) / 100;
    } else if (appliedCoupon.discountType === 'fixed') {
      discountAmount = appliedCoupon.discountValue;
    }
  }
  const finalPrice = Math.max(0, price - discountAmount);

  return (
    <div className="space-y-8">
      {/* Teslimat Adresi */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-indigo-600" />
          Teslimat Adresi
        </h2>
        <textarea
          value={shippingAddress}
          onChange={(e) => setShippingAddress(e.target.value)}
          placeholder="Açık adresinizi giriniz..."
          className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none h-32 text-sm"
        />
      </div>

      {/* Ödeme Yöntemi */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="mb-4 rounded-xl border border-indigo-100 bg-indigo-50 px-3 py-2 text-xs text-indigo-700">
          Guvenli odeme altyapisi: <span className="font-semibold">Iyzico</span>
        </div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-indigo-600" />
            Odeme Yontemi (Iyzico)
          </h2>
          {cards.length === 0 && !isLoadingCards && (
            <button 
              onClick={generateMockCards}
              className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg font-medium hover:bg-indigo-100 transition-colors"
            >
              Test Kartları Ekle
            </button>
          )}
        </div>

        {isLoadingCards ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
          </div>
        ) : (
          <div className="space-y-4">
            {!showNewCardForm && cards.length > 0 && (
              <div className="space-y-3">
                {cards.map((card) => (
                  <div
                    key={card.id}
                    onClick={() => setSelectedCardId(card.id)}
                    className={`p-4 border rounded-xl cursor-pointer transition-all flex items-center justify-between ${
                      selectedCardId === card.id 
                        ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-600' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center ${selectedCardId === card.id ? 'bg-indigo-600' : 'bg-gray-200'}`}>
                        {selectedCardId === card.id && <CheckCircle2 className="w-4 h-4 text-white" />}
                      </div>
                      <div>
                        <p className="font-medium text-sm text-gray-900">{card.cardNumber}</p>
                        <p className="text-xs text-gray-500">{card.cardName} • SKT: {card.expiryDate}</p>
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => setShowNewCardForm(true)}
                  className="w-full flex items-center justify-center gap-2 p-3 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors"
                >
                  <Plus className="w-4 h-4" /> Başka Bir Kart Kullan
                </button>
              </div>
            )}

            {showNewCardForm && (
              <div className="space-y-4 border border-gray-200 p-5 rounded-xl bg-gray-50/50">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Kart Üzerindeki İsim</label>
                  <input
                    type="text"
                    value={newCard.name}
                    onChange={(e) => setNewCard({ ...newCard, name: e.target.value })}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                    placeholder="Ad Soyad"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Kart Numarası</label>
                  <input
                    type="text"
                    value={newCard.number}
                    onChange={handleCardNumberChange}
                    className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm tracking-widest"
                    placeholder="**** **** **** ****"
                    maxLength={19}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Son Kullanma (AA/YY)</label>
                    <input
                      type="text"
                      value={newCard.expiry}
                      onChange={handleExpiryChange}
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                      placeholder="AA/YY"
                      maxLength={5}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">CVV</label>
                    <input
                      type="text"
                      value={newCard.cvv}
                      onChange={handleCvvChange}
                      className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-sm"
                      placeholder="***"
                      maxLength={3}
                    />
                  </div>
                </div>

                {cards.length > 0 && (
                  <button
                    onClick={() => setShowNewCardForm(false)}
                    className="text-sm text-gray-500 hover:text-gray-700 mt-2 underline"
                  >
                    Kayıtlı kartlarıma dön
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Promosyon Kodu & Kullanmadığın Kuponlar Kartı */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
        {/* Promosyon Kodu Giriş Alanı */}
        <div className="bg-gradient-to-br from-indigo-50/40 to-purple-50/20 border border-indigo-100/70 rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-indigo-50 rounded-xl flex items-center justify-center">
              <Gift className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">Promosyon Kodu Girin</p>
              <p className="text-xs text-gray-500 mt-0.5">Kod büyük/küçük harf duyarlı değildir.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                placeholder="ÖRN: VESTI20"
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-250 rounded-xl font-mono tracking-wider uppercase text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <button
              type="button"
              onClick={handleApplyManualCode}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 shrink-0"
            >
              Kodu Uygula
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Kullanılmayan Kuponlar Listesi (Altta) */}
        <div>
          <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-1.5">
            <Palette className="w-4 h-4 text-indigo-600" />
            Kullanabileceğin Kuponlar
          </h3>

          {availableCoupons.length === 0 ? (
            <p className="text-xs text-gray-550">Kullanılabilir kuponunuz bulunmamaktadır.</p>
          ) : (
            <div className="space-y-3">
              {availableCoupons.map((coupon) => {
                const isApplied = appliedCoupon?.id === coupon.id;
                const hasMinAmount = coupon.minOrderAmount ? price >= coupon.minOrderAmount : true;
                
                // Herhangi bir kupon uygulanmışsa ve bu kupon o uygulanmış kupon değilse "silik/transparan" yapıyoruz
                const isDimmed = appliedCoupon !== null && !isApplied;
                
                return (
                  <div 
                    key={coupon.id} 
                    style={{
                      opacity: isDimmed ? 0.45 : 1,
                      filter: isDimmed ? 'grayscale(40%) font-smoothing' : 'none',
                      transform: isApplied ? 'scale(1.01)' : 'scale(1)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                    className={`p-4 border rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      isApplied 
                        ? 'border-indigo-600 bg-indigo-50/40 shadow-sm ring-1 ring-indigo-500/20' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 text-xs font-bold rounded-md uppercase tracking-wider ${
                          isApplied 
                            ? 'bg-indigo-600 text-white' 
                            : 'bg-indigo-100 text-indigo-700'
                        }`}>
                          {coupon.code}
                        </span>
                        {coupon.minOrderAmount && (
                          <span className="text-xs text-gray-505 bg-gray-100 px-2 py-0.5 rounded">
                            Min Tutar: {coupon.minOrderAmount} TL
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-semibold text-gray-900 mt-2">
                        {coupon.description || (coupon.discountType === 'percentage' ? `%${coupon.discountValue} İndirim` : `${coupon.discountValue} TL İndirim`)}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (isApplied) {
                          setAppliedCoupon(null);
                          toast.success("Kupon kaldırıldı.");
                        } else {
                          if (appliedCoupon !== null) {
                            toast.error("Önce aktif kuponu kaldırmalısınız.");
                            return;
                          }
                          if (!hasMinAmount) {
                            toast.error(`Bu kupon sadece en az ${coupon.minOrderAmount} TL tutarındaki alışverişlerde geçerlidir.`);
                            return;
                          }
                          setAppliedCoupon(coupon);
                          toast.success("Kupon uygulandı!");
                        }
                      }}
                      className={`px-4 py-2 text-xs font-bold rounded-lg transition-all uppercase tracking-wider shrink-0 ${
                        isApplied 
                          ? 'bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200' 
                          : isDimmed
                          ? 'bg-gray-50 text-gray-400 border border-gray-150 cursor-not-allowed'
                          : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-200'
                      }`}
                    >
                      {isApplied ? 'Kaldır' : 'Uygula'}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Toplam ve Ödeme Butonu */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
        {appliedCoupon && (
          <div className="flex items-center justify-between w-full mb-3 text-sm text-emerald-600 font-semibold">
            <span>Uygulanan Kupon ({appliedCoupon.code})</span>
            <span>-{discountAmount.toLocaleString('tr-TR')} {currency}</span>
          </div>
        )}
        <div className="flex items-center justify-between w-full mb-6 pb-4 border-b border-gray-100">
          <span className="text-gray-600 font-medium">Ödenecek Tutar</span>
          <span className="text-2xl font-bold text-gray-900">{finalPrice.toLocaleString('tr-TR')} {currency}</span>
        </div>

        <button
          onClick={handleCheckout}
          disabled={isProcessing}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-4 px-6 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg active:scale-[0.98]"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              İşleniyor...
            </>
          ) : (
            <>
              <ShieldCheck className="w-5 h-5" />
              Iyzico ile Odemeyi Tamamla
            </>
          )}
        </button>
        <p className="text-xs text-gray-400 mt-4 text-center">
          Bu islem Iyzico guvencesiyle alinip Vesti havuzunda tutulur. Urun size ulasip onaylandiginda saticiya aktarilir.
        </p>
      </div>
    </div>
  );
}
