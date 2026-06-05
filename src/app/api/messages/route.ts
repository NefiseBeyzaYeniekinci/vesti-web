import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

// GET /api/messages — Kullanıcının tüm konuşmalarını getir
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Yetkisiz erişim" }, { status: 401 });
  }

  const userId = session.user.id;

  const conversations = await prisma.conversation.findMany({
    where: {
      participants: { some: { userId } },
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

  // Okunmamış mesaj sayısını ayrıca çek
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

  const formatted = conversations.map((conv) => {
    const lastMsg = conv.messages[0];
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
      lastMessage: lastMsg
        ? {
            id: lastMsg.id,
            conversationId: lastMsg.conversationId,
            senderId: lastMsg.senderId,
            content: lastMsg.content,
            createdAt: lastMsg.createdAt.toISOString(),
            read: lastMsg.read,
            swapItemId: lastMsg.swapItemId ?? undefined,
            swapStatus: lastMsg.swapStatus ?? undefined,
          }
        : null,
      unreadCount: unreadMap[conv.id] ?? 0,
      updatedAt: conv.updatedAt.toISOString(),
    };
  });

  return NextResponse.json(formatted);
}

// POST /api/messages — Yeni konuşma başlat
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Yetkisiz erişim" }, { status: 401 });
  }

  const { recipientId, listingId, content, swapItemId } = await req.json();

  if (!recipientId || !content) {
    return NextResponse.json({ message: "Alıcı ve mesaj içeriği gerekli" }, { status: 400 });
  }

  // Aynı ilan için mevcut konuşma var mı kontrol et
  let conversation = await prisma.conversation.findFirst({
    where: {
      listingId: listingId ?? null,
      participants: {
        every: {
          userId: { in: [session.user.id, recipientId] },
        },
      },
    },
  });

  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: {
        listingId: listingId ?? null,
        participants: {
          create: [{ userId: session.user.id }, { userId: recipientId }],
        },
      },
    });
  }

  const message = await prisma.message.create({
    data: {
      conversationId: conversation.id,
      senderId: session.user.id,
      content,
      swapItemId: swapItemId || null,
      swapStatus: swapItemId ? "pending" : null,
    },
  });

  // updatedAt güncelle
  await prisma.conversation.update({
    where: { id: conversation.id },
    data: { updatedAt: new Date() },
  });

  return NextResponse.json(
    {
      conversationId: conversation.id,
      message: {
        id: message.id,
        conversationId: message.conversationId,
        senderId: message.senderId,
        content: message.content,
        createdAt: message.createdAt.toISOString(),
        read: message.read,
        swapItemId: message.swapItemId ?? undefined,
        swapStatus: message.swapStatus ?? undefined,
      },
    },
    { status: 201 }
  );
}
