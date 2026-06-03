"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Camera, User, Lock, MapPin, AlignLeft, Globe, Shield, CreditCard, Trash2, Star, CheckCircle2, Package, ShoppingBag, Tag } from "lucide-react";
import { OrdersTab } from "./OrdersTab";
import { SalesTab } from "./SalesTab";
import { PromotionsTab } from "./PromotionsTab";
import { ThemeLanguageControls } from "@/components/layout/ThemeLanguageControls";
import { useClientLanguage } from "@/lib/i18n/client";

interface SavedCard {
  id: string;
  cardName: string;
  cardNumber: string;
  expiryDate: string;
  isDefault: boolean;
}

interface Props {
  user: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
    bio?: string | null;
    location?: string | null;
    isPublic?: boolean;
    trustScore?: number;
    savedCards?: SavedCard[];
  };
}

export function ProfileForm({ user }: Props) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"general" | "orders" | "sales" | "promotions" | "payments" | "privacy" | "security">("general");
  
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const language = useClientLanguage();
  const t = {
    general: language === "en" ? "General Profile" : "Genel Profil",
    orders: language === "en" ? "My Orders" : "Siparişlerim",
    sales: language === "en" ? "Sales & Earnings" : "Satışlarım & Kazançlarım",
    payments: language === "en" ? "Payment Methods" : "Ödeme Yöntemleri",
    promotions: language === "en" ? "Promotions & Codes" : "Kampanyalar & Kodlar",
    privacy: language === "en" ? "Privacy & Appearance" : "Gizlilik ve Görünüm",
    security: language === "en" ? "Security" : "Güvenlik",
    saveSuccess: language === "en" ? "Settings saved successfully!" : "Ayarlarınız başarıyla kaydedildi!",
    saving: language === "en" ? "Saving..." : "Kaydediliyor...",
    saveAll: language === "en" ? "Save All Changes" : "Tüm Değişiklikleri Kaydet",
    ordersDesc: language === "en" ? "Track your purchased items and shipping status." : "Satın aldığınız ürünleri ve kargo durumlarını takip edin.",
    salesDesc: language === "en" ? "Manage your sold items and view your earnings." : "Sattığınız ürünleri yönetin ve kazançlarınızı görün.",
    nameLabel: language === "en" ? "Full Name" : "Ad Soyad",
    bioLabel: language === "en" ? "About Me (Bio)" : "Hakkımda (Biyografi)",
    locationLabel: language === "en" ? "Location / City" : "Konum / Şehir",
    trustScore: language === "en" ? "Trust Score" : "Güvenilirlik Puanı",
    paymentsDesc: language === "en" ? "Manage your cards for marketplace purchases." : "Pazar yeri alışverişleriniz için kartlarınızı yönetin.",
    addCardBtn: language === "en" ? "+ Add New Card" : "+ Yeni Kart Ekle",
    cancelBtn: language === "en" ? "Cancel" : "İptal",
    cardName: language === "en" ? "Name on Card" : "Kart Üzerindeki İsim",
    cardNumber: language === "en" ? "Card Number" : "Kart Numarası",
    expiry: language === "en" ? "Expiry (MM/YY)" : "Son Kullanma (AA/YY)",
    saveCard: language === "en" ? "Save Card Securely" : "Kartı Güvenli Kaydet",
    adding: language === "en" ? "Adding..." : "Ekleniyor...",
    noCards: language === "en" ? "You don't have any saved cards yet." : "Henüz kayıtlı bir kartınız yok.",
    cardHolder: language === "en" ? "Card Holder" : "Kart Sahibi",
    visibilityTitle: language === "en" ? "Profile Visibility" : "Profil Görünürlüğü",
    publicProfile: language === "en" ? "Make My Profile Public" : "Profilim Herkese Açık Olsun",
    publicDesc: language === "en" ? "While this is disabled, other users cannot see your uploaded clothes (except Marketplace) or style bio. Your Marketplace listings are always visible." : "Bu seçenek kapalıyken diğer kullanıcılar yüklediğiniz kıyafetleri (Pazar Yeri hariç) veya tarz biyografinizi göremez. Pazar Yeri ilanlarınız her zaman görünürdür.",
    securityTitle: language === "en" ? "Change Password" : "Şifre Değiştir",
    securityDesc: language === "en" ? "We recommend changing your password regularly for security. If you registered with Google, you may not have a password." : "Hesabınızın güvenliği için şifrenizi düzenli aralıklarla değiştirmeniz önerilir. Google ile kayıt olduysanız şifreniz olmayabilir.",
    currentPassword: language === "en" ? "Current Password" : "Mevcut Şifre",
    newPassword: language === "en" ? "New Password" : "Yeni Şifre",
  };

  // Genel Form State
  const [formData, setFormData] = useState({
    name: user.name || "",
    bio: user.bio || "",
    location: user.location || "",
    isPublic: user.isPublic ?? true,
    currentPassword: "",
    newPassword: "",
  });

  // Yeni Kart Ekleme State
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCard, setNewCard] = useState({
    cardName: "",
    cardNumber: "",
    expiryDate: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData((prev) => ({ ...prev, [e.target.name]: value }));
  };

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewCard((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (formData.newPassword && formData.newPassword.length < 6) {
        throw new Error("Yeni şifre en az 6 karakter olmalıdır.");
      }

      await axios.put("/api/user/profile", formData);
      setSuccess(true);
      setFormData((prev) => ({ ...prev, currentPassword: "", newPassword: "" }));
      router.refresh();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const error = err as any;
      setError(error.response?.data?.message || error.message || "Bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await axios.post("/api/user/cards", newCard);
      setIsAddingCard(false);
      setNewCard({ cardName: "", cardNumber: "", expiryDate: "" });
      router.refresh();
    } catch (err: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const error = err as any;
      setError(error.response?.data?.message || "Kart eklenirken bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCard = async (cardId: string) => {
    if (!confirm("Bu kartı silmek istediğinize emin misiniz?")) return;
    try {
      await axios.delete(`/api/user/cards?id=${cardId}`);
      router.refresh();
    } catch {
      alert("Kart silinemedi");
    }
  };

  const isTrusted = (user.trustScore || 0) >= 4.0;

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Sidebar Tabs */}
      <div className="md:w-64 flex-shrink-0 space-y-2">
        <button
          onClick={() => setActiveTab("general")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left ${
            activeTab === "general" ? "bg-vesti-primary text-white font-medium shadow-md shadow-vesti-primary/20" : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          <User className="w-5 h-5" />
          {t.general}
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left ${
            activeTab === "orders" ? "bg-vesti-primary text-white font-medium shadow-md shadow-vesti-primary/20" : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          <Package className="w-5 h-5" />
          {t.orders}
        </button>
        <button
          onClick={() => setActiveTab("sales")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left ${
            activeTab === "sales" ? "bg-vesti-primary text-white font-medium shadow-md shadow-vesti-primary/20" : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          <ShoppingBag className="w-5 h-5" />
          {t.sales}
        </button>
        <button
          onClick={() => setActiveTab("payments")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left ${
            activeTab === "payments" ? "bg-vesti-primary text-white font-medium shadow-md shadow-vesti-primary/20" : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          <CreditCard className="w-5 h-5" />
          {t.payments}
        </button>
        <button
          onClick={() => setActiveTab("promotions")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left ${
            activeTab === "promotions" ? "bg-vesti-primary text-white font-medium shadow-md shadow-vesti-primary/20" : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          <Tag className="w-5 h-5" />
          {t.promotions}
        </button>
        <button
          onClick={() => setActiveTab("privacy")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left ${
            activeTab === "privacy" ? "bg-vesti-primary text-white font-medium shadow-md shadow-vesti-primary/20" : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          <Shield className="w-5 h-5" />
          {t.privacy}
        </button>
        <button
          onClick={() => setActiveTab("security")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-left ${
            activeTab === "security" ? "bg-vesti-primary text-white font-medium shadow-md shadow-vesti-primary/20" : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          <Lock className="w-5 h-5" />
          {t.security}
        </button>
      </div>

      {/* Form Content */}
      <div className="flex-1 min-w-0">
        {error && <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm">{error}</div>}
        {success && <div className="mb-6 p-4 bg-green-50 border border-green-100 text-green-600 rounded-xl text-sm">{t.saveSuccess}</div>}

        {/* ------------- SİPARİŞLERİM ------------- */}
        {activeTab === "orders" && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="border-b border-gray-100 pb-4 mb-6">
              <h3 className="text-lg font-semibold text-gray-900">{t.orders}</h3>
              <p className="text-sm text-gray-500">{t.ordersDesc}</p>
            </div>
            <OrdersTab />
          </div>
        )}

        {/* ------------- SATIŞLARIM & KAZANÇLARIM ------------- */}
        {activeTab === "sales" && (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="border-b border-gray-100 pb-4 mb-6">
              <h3 className="text-lg font-semibold text-gray-900">{t.sales}</h3>
              <p className="text-sm text-gray-500">{t.salesDesc}</p>
            </div>
            <SalesTab />
          </div>
        )}

        {/* ------------- KAMPANYALAR & KODLAR ------------- */}
        {activeTab === "promotions" && <PromotionsTab />}

        {/* ------------- GENEL PROFIL ------------- */}
        {activeTab === "general" && (
          <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6 border-b border-gray-100 dark:border-gray-800">
              <div className="relative group cursor-pointer shrink-0">
                <div className="w-24 h-24 rounded-full bg-vesti-primary/10 flex items-center justify-center text-3xl text-vesti-primary font-bold overflow-hidden border-2 border-white shadow-sm transition-transform group-hover:scale-105">
                  {user.image ? (
                    <img src={user.image} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    user.name?.[0].toUpperCase() || "?"
                  )}
                </div>
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="text-center sm:text-left flex-1 border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{user.name}</h3>
                <p className="text-sm text-gray-500 mb-3">{user.email}</p>
                
                {/* GÜVENİLİRLİK PUANI BADGE */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-orange-600 border border-orange-100/50">
                  <Star className="w-4 h-4 fill-orange-500 text-orange-500" />
                  <span className="text-sm font-semibold">{user.trustScore ? user.trustScore.toFixed(1) : "0.0"}</span>
                  <span className="text-xs text-orange-600/70 ml-1">{t.trustScore}</span>
                  {isTrusted && <CheckCircle2 className="w-4 h-4 text-green-500 ml-1" />}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" /> {t.nameLabel}
                </label>
                <Input name="name" value={formData.name} onChange={handleChange} placeholder={t.nameLabel} className="bg-gray-50/50" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                  <AlignLeft className="w-4 h-4 text-gray-400" /> {t.bioLabel}
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder={language === "en" ? "Talk about your fashion style and favorite brands..." : "Kendi moda tarzınızdan ve sevdiğiniz markalardan bahsedin..."}
                  className="w-full rounded-md border border-input bg-gray-50/50 px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" /> {t.locationLabel}
                </label>
                <Input name="location" value={formData.location} onChange={handleChange} placeholder={language === "en" ? "Ex: Istanbul, Besiktas" : "Örn: İstanbul, Beşiktaş"} className="bg-gray-50/50" />
              </div>
            </div>
            
            <div className="pt-6 border-t border-gray-100 flex justify-end">
              <Button type="submit" disabled={isLoading} className="bg-vesti-dark hover:bg-black text-white px-8 h-11 rounded-full font-medium shadow-md shadow-gray-200">
                {isLoading ? t.saving : t.saveAll}
              </Button>
            </div>
          </form>
        )}

        {/* ------------- ÖDEME YÖNTEMLERİ (KAYITLI KARTLAR) ------------- */}
        {activeTab === "payments" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{t.payments}</h3>
                <p className="text-sm text-gray-500">{t.paymentsDesc}</p>
              </div>
              <Button onClick={() => setIsAddingCard(!isAddingCard)} variant={isAddingCard ? "outline" : "default"} className={!isAddingCard ? "bg-vesti-primary hover:bg-vesti-dark" : ""}>
                {isAddingCard ? t.cancelBtn : t.addCardBtn}
              </Button>
            </div>

            {isAddingCard && (
              <form onSubmit={handleAddCard} className="bg-gray-50/50 p-5 rounded-xl border border-gray-100 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.cardName}</label>
                    <Input name="cardName" value={newCard.cardName} onChange={handleCardChange} placeholder={t.cardName} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.cardNumber}</label>
                    <Input name="cardNumber" value={newCard.cardNumber} onChange={handleCardChange} placeholder="1111 2222 3333 4444" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.expiry}</label>
                    <Input name="expiryDate" value={newCard.expiryDate} onChange={handleCardChange} placeholder="12/28" required />
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <Button type="submit" disabled={isLoading} className="bg-black hover:bg-gray-800 text-white">
                    {isLoading ? t.adding : t.saveCard}
                  </Button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {user.savedCards && user.savedCards.length > 0 ? (
                user.savedCards.map((card) => (
                  <div key={card.id} className="relative p-5 rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 text-white shadow-lg overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                      <CreditCard className="w-24 h-24" />
                    </div>
                    <div className="relative z-10 flex flex-col h-full justify-between gap-6">
                      <div className="flex justify-between items-start">
                        <div className="font-semibold tracking-widest text-lg">{card.cardNumber}</div>
                        <button 
                          onClick={() => handleDeleteCard(card.id)}
                          className="p-1.5 rounded-md bg-white/10 hover:bg-red-500/80 transition-colors text-white"
                          title="Kartı Sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex justify-between items-end">
                        <div>
                          <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">{t.cardHolder}</div>
                          <div className="font-medium">{card.cardName}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">SKT</div>
                          <div className="font-medium">{card.expiryDate}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-8 text-center text-gray-500 border border-dashed border-gray-200 rounded-xl">
                  <CreditCard className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                  <p>{t.noCards}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ------------- GİZLİLİK VE GÖRÜNÜM ------------- */}
        {activeTab === "privacy" && (
          <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-100 pb-3">{t.visibilityTitle}</h3>
            
            <div className="flex items-start gap-4 p-4 border border-gray-100 rounded-xl bg-gray-50/50">
              <div className="flex items-center h-6">
                <input
                  id="isPublic"
                  name="isPublic"
                  type="checkbox"
                  checked={formData.isPublic}
                  onChange={handleChange}
                  className="h-5 w-5 rounded border-gray-300 text-vesti-primary focus:ring-vesti-primary"
                />
              </div>
              <div className="flex-1">
                <label htmlFor="isPublic" className="font-medium text-gray-900 flex items-center gap-2 cursor-pointer">
                  <Globe className="w-4 h-4 text-gray-500" /> {t.publicProfile}
                </label>
                <p className="text-sm text-gray-500 mt-1">
                  {t.publicDesc}
                </p>
              </div>
            </div>

            <div className="pt-2">
              <h4 className="text-base font-semibold text-gray-900 mb-2">{language === "en" ? "Language Options" : "Dil Seçenekleri"}</h4>
              <p className="text-sm text-gray-500 mb-3">{language === "en" ? "You can change your language preference here." : "Dil ayarlarınızı buradan yönetebilirsiniz."}</p>
              <ThemeLanguageControls />
            </div>

            <div className="pt-6 border-t border-gray-100 flex justify-end">
              <Button type="submit" disabled={isLoading} className="bg-vesti-dark hover:bg-black text-white px-8 h-11 rounded-full font-medium shadow-md shadow-gray-200">
                {isLoading ? t.saving : t.saveAll}
              </Button>
            </div>
          </form>
        )}

        {/* ------------- GÜVENLİK ------------- */}
        {activeTab === "security" && (
          <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-100 pb-3">{t.securityTitle}</h3>
            <p className="text-sm text-gray-500 mb-4">{t.securityDesc}</p>
            
            <div className="space-y-4 max-w-md">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.currentPassword}</label>
                <Input type="password" name="currentPassword" value={formData.currentPassword} onChange={handleChange} placeholder={t.currentPassword} className="bg-gray-50/50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{t.newPassword}</label>
                <Input type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} placeholder={language === "en" ? "At least 6 characters" : "En az 6 karakter olmalı"} className="bg-gray-50/50" />
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 flex justify-end">
              <Button type="submit" disabled={isLoading} className="bg-vesti-dark hover:bg-black text-white px-8 h-11 rounded-full font-medium shadow-md shadow-gray-200">
                {isLoading ? t.saving : t.saveAll}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
