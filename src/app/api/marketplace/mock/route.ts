import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST() {
  try {
    // Bul veya yeni bir dummy satıcı oluştur
    let seller = await prisma.user.findUnique({ where: { email: 'mock_seller@vesti.com' } });
    
    if (!seller) {
      const hashedPassword = await bcrypt.hash('123456', 10);
      seller = await prisma.user.create({
        data: {
          name: 'Vesti Mock Satıcısı',
          email: 'mock_seller@vesti.com',
          image: 'https://ui-avatars.com/api/?name=Vesti+Seller',
          password: hashedPassword,
          bio: 'Ödeme testleri için otomatik oluşturulan ilanlar',
          trustScore: 4.8
        }
      });
    }

    // Rastgele 3 yeni ilan ekle
    const randomSuffix = Math.floor(Math.random() * 1000);
    
    const mockListings = [
      {
        userId: seller.id,
        title: `Test İlanı - Vintage Tişört #${randomSuffix}`,
        description: 'Ödeme altyapısını test etmek için oluşturulmuştur. Satın alabilirsiniz.',
        category: 'ÜST GİYİM',
        condition: 'LIKE_NEW',
        price: 250.0,
        images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500'],
        status: 'active'
      },
      {
        userId: seller.id,
        title: `Test İlanı - Denim Ceket #${randomSuffix}`,
        description: 'Ödeme altyapısını test etmek için oluşturulmuştur. Satın alabilirsiniz.',
        category: 'DIŞ GİYİM',
        condition: 'USED',
        price: 600.0,
        images: ['https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=500'],
        status: 'active'
      },
      {
        userId: seller.id,
        title: `Test İlanı - Spor Ayakkabı #${randomSuffix}`,
        description: 'Ödeme altyapısını test etmek için oluşturulmuştur. Satın alabilirsiniz.',
        category: 'AYAKKABI',
        size: '42',
        brand: 'Nike',
        condition: 'NEW',
        price: 1800.0,
        images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500'],
        status: 'active'
      }
    ];

    await prisma.listing.createMany({
      data: mockListings
    });

    return NextResponse.json({ success: true, message: "3 yeni test ilanı eklendi!" });
  } catch (error) {
    console.error("Mock Listing Error:", error);
    return NextResponse.json({ message: "İlanlar eklenirken hata oluştu" }, { status: 500 });
  }
}
