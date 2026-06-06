import { NextResponse } from "next/server";
import { getUserIdFromRequest } from "@/lib/api-auth";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function GET(req: Request) {
  try {
    const userId = await getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json({ message: "Yetkisiz erişim" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        bio: true,
        location: true,
        isPublic: true,
        trustScore: true,
        savedCards: {
          select: {
            id: true,
            cardName: true,
            cardNumber: true,
            expiryDate: true,
            isDefault: true,
          }
        }
      },
    });

    if (!user) {
      return NextResponse.json({ message: "Kullanıcı bulunamadı" }, { status: 404 });
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Profil getirme hatası:", error);
    return NextResponse.json({ message: "Sunucu hatası oluştu" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const userId = await getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json({ message: "Yetkisiz erişim" }, { status: 401 });
    }

    const { name, bio, location, isPublic, currentPassword, newPassword } = await req.json();

    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!currentUser) {
      return NextResponse.json({ message: "Kullanıcı bulunamadı" }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};

    if (name && name.trim().length > 0) {
      updateData.name = name.trim();
    }
    
    // Yeni alanlar eklendi
    if (bio !== undefined) updateData.bio = bio;
    if (location !== undefined) updateData.location = location;
    if (isPublic !== undefined) updateData.isPublic = isPublic;

    // Eğer şifre de değişecekse
    if (newPassword && newPassword.length >= 6) {
      if (!currentPassword) {
        return NextResponse.json({ message: "Mevcut şifrenizi girmelisiniz" }, { status: 400 });
      }

      // Şifresi varsa karşılaştıralım (Google ile girenlerde şifre olmayabilir)
      if (currentUser.password) {
        const isValid = await bcrypt.compare(currentPassword, currentUser.password);
        if (!isValid) {
          return NextResponse.json({ message: "Mevcut şifreniz yanlış" }, { status: 400 });
        }
      }

      updateData.password = await bcrypt.hash(newPassword, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: { id: true, name: true, email: true },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Profil güncelleme hatası:", error);
    return NextResponse.json({ message: "Sunucu hatası oluştu" }, { status: 500 });
  }
}
