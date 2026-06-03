import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/db";

// GET /api/messages/[id] — Tek bir konuşmanın mesajlarını getir
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Yetkisiz erişim" }, { status: 401 });
  }

  const { id } = await params;

  // Kullanıcının bu konuşmada olup olmadığını doğrula
  const participant = await prisma.conversationParticipant.findUnique({
    where: {
      conversationId_userId: {
        conversationId: id,
        userId: session.user.id,
      },
    },
  });

  if (!participant) {
    return NextResponse.json({ message: "Yetkisiz erişim" }, { status: 403 });
  }

  const messages = await prisma.message.findMany({
    where: { conversationId: id },
    orderBy: { createdAt: "asc" },
  });

  // Okunmamış mesajları okundu yap
  await prisma.message.updateMany({
    where: {
      conversationId: id,
      senderId: { not: session.user.id },
      read: false,
    },
    data: { read: true },
  });

  return NextResponse.json(
    messages.map((m) => ({
      id: m.id,
      conversationId: m.conversationId,
      senderId: m.senderId,
      content: m.content,
      createdAt: m.createdAt.toISOString(),
      read: m.read,
    }))
  );
}

// POST /api/messages/[id] — Konuşmaya yeni mesaj gönder
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Yetkisiz erişim" }, { status: 401 });
  }

  const { id } = await params;
  const { content } = await req.json();

  if (!content?.trim()) {
    return NextResponse.json({ message: "Mesaj içeriği boş olamaz" }, { status: 400 });
  }

  // Katılımcı doğrulama
  const participant = await prisma.conversationParticipant.findUnique({
    where: {
      conversationId_userId: {
        conversationId: id,
        userId: session.user.id,
      },
    },
  });

  if (!participant) {
    return NextResponse.json({ message: "Yetkisiz erişim" }, { status: 403 });
  }

  const message = await prisma.message.create({
    data: {
      conversationId: id,
      senderId: session.user.id,
      content: content.trim(),
    },
  });

  // Konuşmanın updatedAt'ini güncelle
  await prisma.conversation.update({
    where: { id },
    data: { updatedAt: new Date() },
  });

  return NextResponse.json({
    id: message.id,
    conversationId: message.conversationId,
    senderId: message.senderId,
    content: message.content,
    createdAt: message.createdAt.toISOString(),
    read: message.read,
  });
}
