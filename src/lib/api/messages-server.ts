import { prisma } from "@/lib/db";
import { auth } from "@/auth";
import { Conversation, Message } from "@/types/message";

export async function getConversationsServer(): Promise<Conversation[]> {
  const session = await auth();
  if (!session?.user?.id) {
    return [];
  }

  const userId = session.user.id;

  const conversations = await prisma.conversation.findMany({
    where: {
      participants: { some: { userId } },
      messages: { some: {} } // Sadece en az 1 mesajı olan konuşmaları getir
    },
    include: {
      listing: {
        select: { id: true, title: true, images: true },
      },
      participants: {
        include: {
          user: { select: { id: true, name: true, image: true } },
        },
      },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
    orderBy: { updatedAt: "desc" },
  });

  const unreadCounts = await prisma.message.groupBy({
    by: ["conversationId"],
    where: {
      read: false,
      senderId: { not: userId },
      conversation: {
        participants: { some: { userId } },
      },
    },
    _count: { id: true },
  });

  const unreadMap: Record<string, number> = {};
  for (const u of unreadCounts) {
    unreadMap[u.conversationId] = u._count.id;
  }

  return conversations.map((conv) => {
    const lastMsg = conv.messages[0]!;
    const participants = conv.participants.map((p) => ({
      id: p.user.id,
      name: p.user.name ?? "Kullanıcı",
      avatar: p.user.image ?? undefined,
    }));

    return {
      id: conv.id,
      listingId: conv.listing?.id,
      listingTitle: conv.listing?.title,
      listingImage: conv.listing?.images?.[0],
      participants,
      lastMessage: {
        id: lastMsg.id,
        conversationId: lastMsg.conversationId,
        senderId: lastMsg.senderId,
        content: lastMsg.content,
        createdAt: lastMsg.createdAt.toISOString(),
        read: lastMsg.read,
      },
      unreadCount: unreadMap[conv.id] ?? 0,
      updatedAt: conv.updatedAt.toISOString(),
    };
  });
}

export async function getConversationServer(id: string): Promise<Conversation | null> {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }

  const userId = session.user.id;

  try {
    const conv = await prisma.conversation.findUnique({
      where: { id },
      include: {
        listing: {
          select: { id: true, title: true, images: true },
        },
        participants: {
          include: {
            user: { select: { id: true, name: true, image: true } },
          },
        },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    if (!conv) {
      return null;
    }

    const isParticipant = conv.participants.some((p) => p.userId === userId);
    if (!isParticipant) {
      return null;
    }

    const lastMsg = conv.messages[0];
    const participants = conv.participants.map((p) => ({
      id: p.user.id,
      name: p.user.name ?? "Kullanıcı",
      avatar: p.user.image ?? undefined,
    }));

    const lastMessageMapped: Message = lastMsg
      ? {
          id: lastMsg.id,
          conversationId: lastMsg.conversationId,
          senderId: lastMsg.senderId,
          content: lastMsg.content,
          createdAt: lastMsg.createdAt.toISOString(),
          read: lastMsg.read,
        }
      : {
          id: "temp",
          conversationId: conv.id,
          senderId: userId,
          content: "",
          createdAt: conv.createdAt.toISOString(),
          read: true,
        };

    return {
      id: conv.id,
      listingId: conv.listing?.id,
      listingTitle: conv.listing?.title,
      listingImage: conv.listing?.images?.[0],
      participants,
      lastMessage: lastMessageMapped,
      unreadCount: 0,
      updatedAt: conv.updatedAt.toISOString(),
    };
  } catch (error) {
    console.error("Error in getConversationServer:", error);
    return null;
  }
}

export async function getMessagesServer(conversationId: string): Promise<Message[]> {
  const session = await auth();
  if (!session?.user?.id) {
    return [];
  }

  const participant = await prisma.conversationParticipant.findUnique({
    where: {
      conversationId_userId: {
        conversationId,
        userId: session.user.id,
      },
    },
  });

  if (!participant) {
    return [];
  }

  const messages = await prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: "asc" },
  });

  await prisma.message.updateMany({
    where: {
      conversationId,
      senderId: { not: session.user.id },
      read: false,
    },
    data: { read: true },
  });

  return messages.map((m) => ({
    id: m.id,
    conversationId: m.conversationId,
    senderId: m.senderId,
    content: m.content,
    createdAt: m.createdAt.toISOString(),
    read: m.read,
  }));
}
