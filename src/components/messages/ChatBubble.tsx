"use client";

import { Message } from "@/types/message";

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
