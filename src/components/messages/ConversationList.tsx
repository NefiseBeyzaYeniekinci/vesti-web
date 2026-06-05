"use client";

import Image from "next/image";
import Link from "next/link";
import { Conversation } from "@/types/message";
import { MessageCircle } from "lucide-react";

function timeAgo(isoDate: string, lang: string): string {
  const diff = (Date.now() - new Date(isoDate).getTime()) / 1000;
  if (diff < 60) return lang === "en" ? "Just now" : "Az önce";
  if (diff < 3600) return lang === "en" ? `${Math.floor(diff / 60)}m ago` : `${Math.floor(diff / 60)} dk önce`;
  if (diff < 86400) return lang === "en" ? `${Math.floor(diff / 3600)}h ago` : `${Math.floor(diff / 3600)} sa önce`;
  return lang === "en" ? `${Math.floor(diff / 86400)}d ago` : `${Math.floor(diff / 86400)} gün önce`;
}

interface Props {
  conversations: Conversation[];
  activeId?: string;
  currentUserId?: string;
  language?: string;
}

export function ConversationList({ conversations, activeId, currentUserId, language = "tr" }: Props) {
  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400 gap-3">
        <MessageCircle className="w-12 h-12 opacity-30" />
        <p className="text-sm">{language === "en" ? "No messages yet" : "Henüz mesajınız yok"}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col divide-y divide-gray-100">
      {conversations.map((conv) => {
        const other = conv.participants.find((p) => p.id !== currentUserId);
        const isActive = conv.id === activeId;

        return (
          <Link
            key={conv.id}
            href={`/messages/${conv.id}`}
            className={`flex items-start gap-3 px-4 py-4 hover:bg-vesti-primary/5 transition-colors ${
              isActive ? "bg-vesti-primary/10 border-l-4 border-vesti-primary" : ""
            }`}
          >
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              {other?.avatar ? (
                <img
                  src={other.avatar}
                  alt={other.name ?? ""}
                  width={44}
                  height={44}
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="w-11 h-11 rounded-full bg-vesti-primary/20 flex items-center justify-center text-vesti-primary font-bold text-sm">
                  {other?.name?.[0] ?? "?"}
                </div>
              )}
              {conv.unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-vesti-primary rounded-full text-white text-[10px] flex items-center justify-center font-bold">
                  {conv.unreadCount}
                </span>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className={`text-sm font-semibold truncate ${conv.unreadCount > 0 ? "text-vesti-text" : "text-gray-500"}`}>
                  {other?.name ?? (language === "en" ? "Unknown" : "Bilinmeyen")}
                </span>
                <span className="text-[11px] text-gray-400 flex-shrink-0 ml-2">
                  {timeAgo(conv.updatedAt, language)}
                </span>
              </div>
              {conv.listingTitle && (
                <p className="text-[11px] text-vesti-primary font-medium truncate mb-0.5">
                  🏷️ {conv.listingTitle}
                </p>
              )}
              <p className={`text-xs truncate ${conv.unreadCount > 0 ? "font-medium text-vesti-text" : "text-gray-400"}`}>
                {conv.lastMessage.senderId === currentUserId ? (language === "en" ? "You: " : "Sen: ") : ""}
                {conv.lastMessage.content}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
