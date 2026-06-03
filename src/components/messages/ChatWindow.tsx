"use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Conversation, Message, MessageUser } from "@/types/message";
import { sendMessage } from "@/lib/api/messages";
import { ChatBubble } from "./ChatBubble";
import { MessageInput } from "./MessageInput";

interface Props {
  conversation: Conversation;
  initialMessages: Message[];
  otherUser?: MessageUser;
}

export function ChatWindow({ conversation, initialMessages, otherUser }: Props) {
  const { data: session } = useSession();
  const currentUserId = session?.user?.id;

  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (content: string) => {
    const msg = await sendMessage(conversation.id, content);
    setMessages((prev) => [...prev, msg]);
  };

  return (
    <>
      {/* Chat Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
        <Link href="/messages" className="md:hidden text-gray-500 hover:text-vesti-primary">
          <ArrowLeft className="w-5 h-5" />
        </Link>

        {otherUser?.avatar ? (
          <Image
            src={otherUser.avatar}
            alt={otherUser.name}
            width={38}
            height={38}
            className="rounded-full object-cover"
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-vesti-primary/20 flex items-center justify-center text-vesti-primary font-bold text-sm flex-shrink-0">
            {otherUser?.name?.[0] ?? "?"}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-vesti-text truncate">{otherUser?.name}</p>
          {conversation.listingTitle && (
            <Link
              href={`/marketplace/${conversation.listingId}`}
              className="flex items-center gap-1 text-[11px] text-vesti-primary hover:underline truncate"
            >
              🏷️ {conversation.listingTitle}
              <ExternalLink className="w-3 h-3" />
            </Link>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1 bg-gray-50 dark:bg-gray-950">
        {messages.length === 0 && (
          <p className="text-center text-sm text-gray-400 mt-10">
            Henüz mesaj yok. İlk mesajı sen gönder!
          </p>
        )}
        {messages.map((msg) => (
          <ChatBubble
            key={msg.id}
            message={msg}
            isMine={currentUserId ? msg.senderId === currentUserId : false}
          />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex-shrink-0">
        <MessageInput onSend={handleSend} />
      </div>
    </>
  );
}
