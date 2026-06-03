"use client";

import { useState } from "react";
import { Send } from "lucide-react";

interface Props {
  onSend: (content: string) => Promise<void>;
  disabled?: boolean;
}

export function MessageInput({ onSend, disabled }: Props) {
  const [value, setValue] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || sending) return;

    setSending(true);
    try {
      await onSend(trimmed);
      setValue("");
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-end gap-3 p-4 border-t bg-white dark:bg-gray-900"
    >
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={1}
        placeholder="Mesaj yaz... (Enter ile gönder)"
        disabled={disabled || sending}
        className="flex-1 resize-none px-4 py-2.5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-vesti-text placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-vesti-primary/40 focus:border-vesti-primary transition min-h-[44px] max-h-28 overflow-y-auto"
        style={{ height: "44px" }}
        onInput={(e) => {
          const el = e.currentTarget;
          el.style.height = "44px";
          el.style.height = Math.min(el.scrollHeight, 112) + "px";
        }}
      />
      <button
        type="submit"
        disabled={!value.trim() || sending || disabled}
        className="w-11 h-11 rounded-full bg-vesti-primary text-white flex items-center justify-center hover:bg-vesti-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition flex-shrink-0"
      >
        <Send className="w-4 h-4" />
      </button>
    </form>
  );
}
