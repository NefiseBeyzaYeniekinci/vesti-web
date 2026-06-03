import { Conversation, Message } from "@/types/message";

function getBaseUrl() {
  if (typeof window !== "undefined") return "";
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}

export async function getConversations(): Promise<Conversation[]> {
  try {
    const res = await fetch(`${getBaseUrl()}/api/messages`, {
      cache: "no-store",
      credentials: "include",
    });
    if (!res.ok) return [];
    const data = await res.json();
    // API null lastMessage döndürebilir, filtrele
    return data.filter((c: Conversation) => c.lastMessage !== null);
  } catch {
    return [];
  }
}

export async function getConversation(id: string): Promise<Conversation | null> {
  try {
    const conversations = await getConversations();
    return conversations.find((c) => c.id === id) ?? null;
  } catch {
    return null;
  }
}

export async function getMessages(conversationId: string): Promise<Message[]> {
  try {
    const res = await fetch(`${getBaseUrl()}/api/messages/${conversationId}`, {
      cache: "no-store",
      credentials: "include",
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function sendMessage(
  conversationId: string,
  content: string
): Promise<Message> {
  const res = await fetch(`${getBaseUrl()}/api/messages/${conversationId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
    credentials: "include",
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Mesaj gönderilemedi");
  }

  return res.json();
}
