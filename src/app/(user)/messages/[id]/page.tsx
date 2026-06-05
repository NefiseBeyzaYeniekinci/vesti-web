import { getConversationServer, getMessagesServer, getConversationsServer } from "@/lib/api/messages-server";
import { ConversationList } from "@/components/messages/ConversationList";
import { ChatWindow } from "@/components/messages/ChatWindow";
import { notFound } from "next/navigation";
import { auth } from "@/auth";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const conv = await getConversationServer(id);
  const session = await auth();
  const other = conv?.participants.find((p) => p.id !== session?.user?.id);
  return {
    title: other ? `${other.name} ile Mesajlar | Vesti` : "Mesaj | Vesti",
  };
}

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  const [conversation, messages, allConversations] = await Promise.all([
    getConversationServer(id),
    getMessagesServer(id),
    getConversationsServer(),
  ]);

  if (!conversation) notFound();

  const other = conversation.participants.find((p) => p.id !== session?.user?.id);

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-10rem)] flex rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden bg-white dark:bg-gray-900">
      {/* Left: Conversation List */}
      <div className="w-80 border-r border-gray-100 dark:border-gray-800 flex flex-col hidden md:flex flex-shrink-0 overflow-y-auto">
        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
          <h2 className="font-semibold text-vesti-text text-sm">Tüm Konuşmalar</h2>
        </div>
        <ConversationList
          conversations={allConversations}
          activeId={id}
          currentUserId={session?.user?.id}
        />
      </div>

      {/* Right: Chat Window */}
      <div className="flex-1 flex flex-col min-w-0">
        <ChatWindow
          conversation={conversation}
          initialMessages={messages}
          otherUser={other}
          currentUserId={session?.user?.id}
        />
      </div>
    </div>
  );
}
