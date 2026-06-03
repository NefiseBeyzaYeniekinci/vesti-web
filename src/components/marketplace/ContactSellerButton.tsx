"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle, Loader2 } from "lucide-react";
import { useClientLanguage } from "@/lib/i18n/client";

interface Props {
  sellerId: string;
  listingId: string;
  sellerName: string;
}

export function ContactSellerButton({ sellerId, listingId }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const language = useClientLanguage();

  const label = language === "en" ? "Message Seller" : "Satıcıya Mesaj At";
  const loadingLabel = language === "en" ? "Connecting..." : "Bağlanıyor...";

  const handleContact = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientId: sellerId,
          listingId,
          content: language === "en"
            ? `Hello! I'm interested in your listing.`
            : `Merhaba! İlanınızla ilgileniyorum.`,
        }),
      });

      if (!res.ok) {
        // Unauthorized → login
        if (res.status === 401) {
          router.push("/login");
          return;
        }
        throw new Error("Failed");
      }

      const data = await res.json();
      router.push(`/messages/${data.conversationId}`);
    } catch {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleContact}
      disabled={loading}
      className="flex items-center justify-center gap-2 bg-white text-gray-800 border border-gray-200 font-medium py-3.5 px-6 rounded-xl hover:bg-gray-50 transition-colors active:scale-[0.98] disabled:opacity-60"
    >
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <MessageCircle className="w-5 h-5" />
      )}
      {loading ? loadingLabel : label}
    </button>
  );
}
