import { getConversations } from "@/lib/api/messages";
import { ConversationList } from "@/components/messages/ConversationList";
import { auth } from "@/auth";
import { cookies } from "next/headers";

export const metadata = {
  title: "Mesajlar | Vesti",
  description: "Gelen mesajlarınız ve satıcılarla konuşmalarınız.",
};

export default async function MessagesPage() {
  const session = await auth();
  const conversations = await getConversations();
  
  const cookieStore = cookies();
  const language = cookieStore.get("vesti-lang")?.value === "en" ? "en" : "tr";
  
  const t = {
    title: language === "en" ? "Messages" : "Mesajlar",
    subtitle: language === "en" ? "Your incoming messages and conversations with sellers." : "Gelen mesajlarınız ve satıcılarla konuşmalarınız.",
    noMessages: language === "en" ? "You have no messages" : "Hiç mesajınız yok",
    unread: language === "en" ? "unread conversations" : "okunmamış konuşma"
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-8">
      {/* Header — editoryal stil */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 flex items-center justify-between"
        style={{ border: '0.5px solid #E0E3E8' }}>
        <div>
          <h1
            className="text-3xl tracking-tight"
            style={{
              fontWeight: 600,
              color: '#29294D',
              letterSpacing: '-0.01em',
            }}
          >
            {t.title}
          </h1>
          <p className="text-sm mt-1.5" style={{ color: '#607080', fontWeight: 400 }}>
            {conversations.length > 0
              ? `${conversations.filter((c) => c.unreadCount > 0).length} ${t.unread}`
              : t.noMessages}
          </p>
        </div>
      </div>

      {/* Conversation List */}
      <div className="bg-white rounded-2xl overflow-hidden" style={{ border: '0.5px solid #E0E3E8' }}>
        <ConversationList conversations={conversations} currentUserId={session?.user?.id} language={language} />
      </div>
    </div>
  );
}
