"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  ShoppingBag, Truck, CheckCircle2, Clock, XCircle,
  AlertTriangle, PackageCheck, TrendingUp, BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useClientLanguage } from "@/lib/i18n/client";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type Order = {
  id: string;
  status: string;
  price: number;
  currency: string;
  trackingNumber?: string;
  trackingCarrier?: string;
  createdAt: string;
  listing: { id: string; title: string; images: string[] };
  buyer: { name: string | null; image?: string | null };
};

const CARRIERS = ["MNG Kargo", "Yurtiçi Kargo", "PTT Kargo", "Aras Kargo", "Sürat Kargo", "UPS", "DHL"];

export function SalesTab() {
  const language = useClientLanguage();

  const t = {
    totalEarned: language === "en" ? "Total Earnings" : "Toplam Kazanç",
    pendingPayment: language === "en" ? "Pending Payment" : "Bekleyen Ödeme",
    totalSales: language === "en" ? "Total Sales" : "Toplam Satış",
    items: language === "en" ? "items" : "ürün",
    noSales: language === "en" ? "You have no sales yet." : "Henüz satışınız yok.",
    noSalesDesc: language === "en" ? "You can start selling by creating a listing in the Marketplace." : "Marketplace'te ilan oluşturarak satış yapmaya başlayabilirsiniz.",
    buyer: language === "en" ? "Buyer:" : "Alıcı:",
    enterTracking: language === "en" ? "Enter tracking number" : "Kargo takip numarası girin",
    carrier: language === "en" ? "Shipping Carrier" : "Kargo Firması",
    trackingNum: language === "en" ? "Tracking number" : "Takip numarası",
    save: language === "en" ? "Save" : "Kaydet",
    saving: language === "en" ? "Saving..." : "Kaydediliyor...",
    selectCarrier: language === "en" ? "You must select a tracking number and carrier." : "Takip numarası ve kargo firması seçmelisiniz.",
    savedSuccess: language === "en" ? "Tracking info saved successfully!" : "Kargo bilgisi başarıyla kaydedildi!",
    saveError: language === "en" ? "Failed to save tracking info." : "Kargo bilgisi kaydedilemedi.",
  };

  const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
    pending:   { label: language === "en" ? "Pending Approval" : "Onay Bekleniyor", color: "text-amber-700 bg-amber-50 border-amber-200",  icon: <Clock className="w-4 h-4" /> },
    paid:      { label: language === "en" ? "Paid - Ship It!" : "Ödendi - Kargola!", color: "text-sky-700 bg-sky-50 border-sky-200",      icon: <AlertTriangle className="w-4 h-4" /> },
    shipped:   { label: language === "en" ? "Shipped" : "Kargoda",          color: "text-indigo-700 bg-indigo-50 border-indigo-200", icon: <Truck className="w-4 h-4" /> },
    delivered: { label: language === "en" ? "Delivered" : "Teslim Edildi",    color: "text-emerald-700 bg-emerald-50 border-emerald-200",    icon: <PackageCheck className="w-4 h-4" /> },
    cancelled: { label: language === "en" ? "Cancelled" : "İptal Edildi",     color: "text-rose-700 bg-rose-50 border-rose-200",          icon: <XCircle className="w-4 h-4" /> },
  };

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [trackingInputs, setTrackingInputs] = useState<Record<string, { number: string; carrier: string }>>({});
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [showStats, setShowStats] = useState(false);
  const totalEarned = orders
    .filter(o => ["shipped", "delivered"].includes(o.status))
    .reduce((sum, o) => sum + o.price, 0);

  const pendingEarnings = orders
    .filter(o => o.status === "paid")
    .reduce((sum, o) => sum + o.price, 0);

  useEffect(() => {
    axios.get("/api/orders?role=seller")
      .then(res => setOrders(res.data))
      .catch(() => setOrders([]))
      .finally(() => setIsLoading(false));
  }, []);

  const handleShip = async (orderId: string) => {
    const input = trackingInputs[orderId];
    const cleanNumber = input.number.trim();
    const carrier = input.carrier;

    // Carrier specific validations
    if (carrier === "Yurtiçi Kargo") {
      if (cleanNumber.length !== 12 || !/^\d+$/.test(cleanNumber)) {
        toast.error(language === "en" ? "Yurtiçi Kargo tracking number must be exactly 12 digits." : "Yurtiçi Kargo takip numarası sadece rakamlardan oluşmalı ve tam 12 haneli olmalıdır.");
        return;
      }
    } else if (carrier === "Aras Kargo") {
      if (cleanNumber.length !== 13 || !/^\d+$/.test(cleanNumber)) {
        toast.error(language === "en" ? "Aras Kargo tracking number must be exactly 13 digits and fully numeric." : "Aras Kargo takip numarası tamamen rakamlardan oluşmalı ve tam 13 haneli olmalıdır.");
        return;
      }
    } else if (carrier === "MNG Kargo") {
      if (cleanNumber.length !== 12 || !/^\d+$/.test(cleanNumber)) {
        toast.error(language === "en" ? "MNG Kargo tracking number must be exactly 12 digits." : "MNG Kargo takip numarası sadece rakamlardan oluşmalı ve tam 12 haneli olmalıdır.");
        return;
      }
    } else if (carrier === "PTT Kargo") {
      if (cleanNumber.length !== 13) {
        toast.error(language === "en" ? "PTT Kargo tracking number must be exactly 13 characters." : "PTT Kargo takip numarası tam 13 haneli olmalıdır.");
        return;
      }
    } else if (carrier === "Sürat Kargo") {
      if (cleanNumber.length !== 14 || !/^\d+$/.test(cleanNumber)) {
        toast.error(language === "en" ? "Sürat Kargo tracking number must be exactly 14 digits." : "Sürat Kargo takip numarası sadece rakamlardan oluşmalı ve tam 14 haneli olmalıdır.");
        return;
      }
    }

    setSubmitting(orderId);
    try {
      await axios.patch(`/api/orders/${orderId}/tracking`, {
        trackingNumber: input.number,
        trackingCarrier: input.carrier,
      });
      toast.success(t.savedSuccess);
      // Refresh
      const res = await axios.get("/api/orders?role=seller");
      setOrders(res.data);
      setTrackingInputs(prev => {
        const updated = { ...prev };
        delete updated[orderId];
        return updated;
      });
    } catch {
      toast.error(t.saveError);
    } finally {
      setSubmitting(null);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1,2].map(i => <div key={i} className="h-32 bg-gray-100 animate-pulse rounded-3xl" />)}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button
          onClick={() => setShowStats(true)}
          variant="outline"
          className="flex items-center gap-2 border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl px-4 py-2 text-xs font-semibold shadow-sm transition-all"
        >
          <BarChart3 className="w-4 h-4 text-vesti-primary" />
          {language === "en" ? "Show Stats" : "İstatistikleri Gör"}
        </Button>
      </div>

      {/* Stats Modal */}
      <Dialog open={showStats} onOpenChange={setShowStats}>
        <DialogContent className="sm:max-w-md rounded-3xl p-6 bg-white dark:bg-gray-900">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-gray-100">
              <BarChart3 className="w-5 h-5 text-vesti-primary" />
              {language === "en" ? "Sales & Earnings Stats" : "Satış ve Kazanç İstatistikleri"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {/* Card 1 */}
            <div className="bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 rounded-2xl p-4 flex items-center gap-4">
              <div className="p-3 bg-emerald-100/80 dark:bg-emerald-900/50 rounded-xl shrink-0">
                <TrendingUp className="w-6 h-6 text-emerald-700 dark:text-emerald-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-emerald-800 dark:text-emerald-400 font-bold uppercase tracking-wider">{t.totalEarned}</p>
                <p className="text-2xl font-extrabold text-emerald-950 dark:text-emerald-100 mt-0.5 whitespace-nowrap">{totalEarned.toLocaleString("tr-TR")} ₺</p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-sky-50/50 dark:bg-sky-950/20 border border-sky-100 dark:border-sky-900/30 rounded-2xl p-4 flex items-center gap-4">
              <div className="p-3 bg-sky-100/80 dark:bg-sky-900/50 rounded-xl shrink-0">
                <Clock className="w-6 h-6 text-sky-700 dark:text-sky-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-sky-800 dark:text-sky-400 font-bold uppercase tracking-wider">{t.pendingPayment}</p>
                <p className="text-2xl font-extrabold text-sky-950 dark:text-sky-100 mt-0.5 whitespace-nowrap">{pendingEarnings.toLocaleString("tr-TR")} ₺</p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/30 rounded-2xl p-4 flex items-center gap-4">
              <div className="p-3 bg-purple-100/80 dark:bg-purple-900/50 rounded-xl shrink-0">
                <CheckCircle2 className="w-6 h-6 text-purple-700 dark:text-purple-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-purple-800 dark:text-purple-400 font-bold uppercase tracking-wider">{t.totalSales}</p>
                <p className="text-2xl font-extrabold text-purple-950 dark:text-purple-100 mt-0.5 whitespace-nowrap">
                  {orders.length} <span className="text-sm text-purple-700 dark:text-purple-400 font-bold">{t.items}</span>
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Satış Listesi */}
      {orders.length === 0 ? (
        <div className="py-20 text-center border border-gray-100 bg-gray-50 rounded-3xl shadow-sm">
          <ShoppingBag className="w-12 h-12 mx-auto text-gray-300 mb-4" />
          <p className="font-bold text-gray-900 text-lg mb-1">{t.noSales}</p>
          <p className="text-gray-500">{t.noSalesDesc}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => {
            const statusCfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending;
            const needsShipping = order.status === "paid" && !order.trackingNumber;
            const input = trackingInputs[order.id] ?? { number: "", carrier: "" };

            let maxLength = 30; // default
            if (input.carrier === "Yurtiçi Kargo" || input.carrier === "MNG Kargo") maxLength = 12;
            else if (input.carrier === "Aras Kargo" || input.carrier === "PTT Kargo") maxLength = 13;
            else if (input.carrier === "Sürat Kargo") maxLength = 14;

            return (
              <div key={order.id} className="border border-gray-100 rounded-3xl shadow-sm overflow-hidden bg-white hover:shadow-md transition-shadow">
                {/* Header */}
                <div className="flex items-center gap-5 p-5">
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-gray-50 shrink-0 border border-gray-100">
                    {order.listing.images[0] ? (
                      <Image src={order.listing.images[0]} alt={order.listing.title} fill className="object-cover" />
                    ) : (
                      <ShoppingBag className="w-6 h-6 text-gray-300 m-auto mt-5" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 truncate">{order.listing.title}</p>
                    <p className="text-sm text-gray-500 font-medium mt-0.5">{t.buyer} {order.buyer.name}</p>
                    <p className="text-sm font-extrabold text-vesti-primary mt-1">{order.price.toLocaleString("tr-TR")} ₺</p>
                  </div>

                  <span className={`flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl border shrink-0 ${statusCfg.color}`}>
                    {statusCfg.icon}
                    {statusCfg.label}
                  </span>
                </div>

                {/* Kargo Takip Numarası Girme Alanı */}
                {needsShipping && (
                  <div className="border-t border-sky-100 bg-sky-50/50 p-5">
                    <p className="text-sm font-bold text-sky-800 mb-3 flex items-center gap-2">
                      <Truck className="w-4 h-4" /> {t.enterTracking}
                    </p>
                    <div className="flex flex-col gap-3.5 w-full">
                      {/* Üstte Kargo Firması Seçimi */}
                      <select
                        className="border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-vesti-primary w-full font-medium text-gray-700 cursor-pointer"
                        value={input.carrier}
                        onChange={e => setTrackingInputs(p => ({ ...p, [order.id]: { number: "", carrier: e.target.value } }))}
                      >
                        <option value="">{t.carrier}</option>
                        {CARRIERS.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>

                      {/* Altta Takip Numarası Girişi */}
                      <input
                        type="text"
                        disabled={!input.carrier}
                        maxLength={maxLength}
                        placeholder={input.carrier ? `${input.carrier} takip numarasını girin (${maxLength} haneli)` : "Önce kargo firması seçin"}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white disabled:bg-gray-50/80 disabled:text-gray-400 focus:outline-none focus:ring-2 focus:ring-vesti-primary font-medium text-gray-700"
                        value={input.number}
                        onChange={e => {
                          const val = e.target.value;
                          const isNumericOnly = ["Yurtiçi Kargo", "Aras Kargo", "MNG Kargo", "Sürat Kargo"].includes(input.carrier);
                          const cleanVal = isNumericOnly ? val.replace(/\D/g, "") : val;
                          setTrackingInputs(p => ({ ...p, [order.id]: { ...input, number: cleanVal } }));
                        }}
                      />

                      {/* En Altta Kaydet Butonu */}
                      <Button
                        size="sm"
                        className="w-full bg-vesti-primary hover:bg-vesti-dark text-white rounded-xl px-6 py-3 h-auto font-semibold shrink-0 shadow-sm transition-colors"
                        disabled={!!submitting || !input.number || !input.carrier}
                        onClick={() => handleShip(order.id)}
                      >
                        {submitting === order.id ? t.saving : t.save}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Mevcut Kargo Bilgisi */}
                {order.trackingNumber && (
                  <div className="border-t border-gray-100 bg-gray-50/80 px-5 py-4 flex items-center gap-3">
                    <Truck className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600 font-medium">
                      {order.trackingCarrier} • <span className="font-bold tracking-wider text-gray-900">{order.trackingNumber}</span>
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
