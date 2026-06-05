"use client";

import { useState } from "react";
import { Message } from "@/types/message";
import { toast } from "sonner";
import { Check, X, ArrowRightLeft, Loader2 } from "lucide-react";

interface Props {
  message: Message;
  isMine: boolean;
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ChatBubble({ message, isMine }: Props) {
  const [swapStatus, setSwapStatus] = useState<string | undefined>(message.swapStatus);
  const [processing, setProcessing] = useState(false);

  const handleSwapAction = async (action: "accept" | "reject") => {
    setProcessing(true);
    try {
      const res = await fetch("/api/messages/swap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageId: message.id, action }),
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setSwapStatus(data.status);
        toast.success(
          action === "accept" 
            ? "Takas teklifi kabul edildi ve dolaplar güncellendi!" 
            : "Takas teklifi reddedildi."
        );
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        toast.error(data.message || "İşlem başarısız oldu.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Takas işlemi sırasında bir hata oluştu.");
    } finally {
      setProcessing(false);
    }
  };

  const isSwapOffer = !!message.swapItemId;

  if (isSwapOffer) {
    return (
      <div className={`flex ${isMine ? "justify-end" : "justify-start"} mb-4`}>
        <div className="max-w-[85%] sm:max-w-[65%] bg-white dark:bg-gray-800 border border-purple-100 dark:border-gray-700 rounded-2xl shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-purple-50 dark:bg-purple-900/30 px-4 py-3 border-b border-purple-100 dark:border-purple-900/20 flex items-center justify-between">
            <span className="text-xs font-bold text-purple-700 dark:text-purple-300 flex items-center gap-1.5">
              <ArrowRightLeft className="w-3.5 h-3.5" />
              Takas Teklifi
            </span>
            {swapStatus === "accepted" && (
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                Kabul Edildi
              </span>
            )}
            {swapStatus === "rejected" && (
              <span className="text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300 px-2 py-0.5 rounded-full">
                Reddedildi
              </span>
            )}
            {swapStatus === "pending" && (
              <span className="text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 px-2 py-0.5 rounded-full animate-pulse">
                Yanıt Bekleniyor
              </span>
            )}
          </div>

          {/* Content */}
          <div className="p-4 space-y-3">
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
              {message.content}
            </p>

            {/* Actions */}
            {swapStatus === "pending" && (
              <div className="pt-2">
                {isMine ? (
                  <p className="text-xs text-gray-400 italic">
                    Karşı tarafın teklifinizi incelemesi bekleniyor.
                  </p>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSwapAction("accept")}
                      disabled={processing}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold py-2.5 px-3 rounded-lg flex items-center justify-center gap-1 transition-colors active:scale-[0.98]"
                    >
                      {processing ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Check className="w-3.5 h-3.5" />
                      )}
                      Kabul Et
                    </button>
                    <button
                      onClick={() => handleSwapAction("reject")}
                      disabled={processing}
                      className="flex-1 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 dark:hover:bg-rose-950/40 text-rose-600 disabled:opacity-50 text-xs font-bold py-2.5 px-3 rounded-lg flex items-center justify-center gap-1 border border-rose-200 dark:border-rose-900/30 transition-colors active:scale-[0.98]"
                    >
                      {processing ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <X className="w-3.5 h-3.5" />
                      )}
                      Reddet
                    </button>
                  </div>
                )}
              </div>
            )}
            
            <p className="text-[10px] text-gray-400 text-right">
              {formatTime(message.createdAt)}
              {isMine && (
                <span className="ml-1">{message.read ? "✓✓" : "✓"}</span>
              )}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Normal Chat Bubble
  return (
    <div className={`flex ${isMine ? "justify-end" : "justify-start"} mb-2`}>
      <div
        className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
          isMine
            ? "bg-vesti-primary text-white rounded-br-sm"
            : "bg-white dark:bg-gray-800 text-vesti-text border border-gray-100 dark:border-gray-700 rounded-bl-sm"
        }`}
      >
        <p>{message.content}</p>
        <p
          className={`text-[10px] mt-1 text-right ${
            isMine ? "text-white/70" : "text-gray-400"
          }`}
        >
          {formatTime(message.createdAt)}
          {isMine && (
            <span className="ml-1">{message.read ? "✓✓" : "✓"}</span>
          )}
        </p>
      </div>
    </div>
  );
}
