"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Package, Truck, CheckCircle2, Clock, XCircle, ChevronDown, ChevronUp } from "lucide-react";
import Image from "next/image";

type TrackingEvent = {
  id: string;
  status: string;
  description: string;
  location?: string;
  createdAt: string;
};

type Order = {
  id: string;
  status: string;
  price: number;
  currency: string;
  trackingNumber?: string;
  trackingCarrier?: string;
  createdAt: string;
  listing: { id: string; title: string; images: string[]; category: string };
  seller: { name: string | null; image?: string | null };
  buyer: { name: string | null; image?: string | null };
  events: TrackingEvent[];
};

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  pending:   { label: "Onay Bekleniyor", color: "text-yellow-700 bg-yellow-50 border-yellow-200",  icon: <Clock className="w-4 h-4" /> },
  paid:      { label: "Ödendi",          color: "text-blue-700 bg-blue-50 border-blue-200",        icon: <CheckCircle2 className="w-4 h-4" /> },
  shipped:   { label: "Kargoda",         color: "text-indigo-700 bg-indigo-50 border-indigo-200",  icon: <Truck className="w-4 h-4" /> },
  delivered: { label: "Teslim Edildi",   color: "text-green-700 bg-green-50 border-green-200",     icon: <CheckCircle2 className="w-4 h-4" /> },
  cancelled: { label: "İptal Edildi",    color: "text-red-700 bg-red-50 border-red-200",           icon: <XCircle className="w-4 h-4" /> },
};

export function OrdersTab() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    axios.get("/api/orders?role=buyer")
      .then(res => setOrders(res.data))
      .catch(() => setOrders([]))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1,2].map(i => (
          <div key={i} className="h-24 bg-gray-100 animate-pulse rounded-xl" />
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="py-16 text-center border border-dashed border-gray-200 rounded-2xl">
        <Package className="w-10 h-10 mx-auto text-gray-300 mb-3" />
        <p className="font-semibold text-gray-500">Henüz hiç siparişiniz yok.</p>
        <p className="text-sm text-gray-400 mt-1">Marketplace üzerinden alışveriş yapabilirsiniz.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => {
        const statusCfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending;
        const isOpen = expanded === order.id;

        return (
          <div key={order.id} className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
            {/* Order Header */}
            <div
              className="flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => setExpanded(isOpen ? null : order.id)}
            >
              {/* Ürün Görseli */}
              <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0 border">
                {order.listing.images[0] ? (
                  <Image src={order.listing.images[0]} alt={order.listing.title} fill className="object-cover" />
                ) : (
                  <Package className="w-8 h-8 text-gray-300 m-auto mt-4" />
                )}
              </div>

              {/* Ürün Bilgisi */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">{order.listing.title}</p>
                <p className="text-sm text-gray-500">{order.listing.category} · {new Date(order.createdAt).toLocaleDateString("tr-TR")}</p>
                <p className="text-sm font-bold text-vesti-primary mt-0.5">{order.price.toLocaleString("tr-TR")} {order.currency}</p>
              </div>

              {/* Durum */}
              <div className="flex flex-col items-end gap-2 shrink-0">
                <span className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border ${statusCfg.color}`}>
                  {statusCfg.icon}
                  {statusCfg.label}
                </span>
                {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
              </div>
            </div>

            {/* Expanded: Kargo Detayı */}
            {isOpen && (
              <div className="border-t border-gray-100 bg-gray-50 p-4 space-y-4">
                {order.trackingNumber && (
                  <div className="flex items-center gap-3 bg-indigo-50 border border-indigo-100 p-3 rounded-xl">
                    <Truck className="w-5 h-5 text-indigo-600 shrink-0" />
                    <div>
                      <p className="text-xs text-indigo-500 font-medium">{order.trackingCarrier}</p>
                      <p className="font-bold text-indigo-800 tracking-widest">{order.trackingNumber}</p>
                    </div>
                  </div>
                )}

                {/* Timeline */}
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Sipariş Geçmişi</p>
                  <div className="space-y-3">
                    {order.events.map((event, idx) => (
                      <div key={event.id} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className={`w-2.5 h-2.5 rounded-full mt-1 ${idx === 0 ? "bg-indigo-500" : "bg-gray-300"}`} />
                          {idx < order.events.length - 1 && <div className="w-px flex-1 bg-gray-200 my-1" />}
                        </div>
                        <div className="pb-3">
                          <p className="text-sm font-medium text-gray-800">{event.description}</p>
                          {event.location && <p className="text-xs text-gray-400">{event.location}</p>}
                          <p className="text-xs text-gray-400 mt-0.5">{new Date(event.createdAt).toLocaleString("tr-TR")}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
