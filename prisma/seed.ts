import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Vesti seed verisi yükleniyor...\n')

  const password = await bcrypt.hash('123456', 10)

  // ─── KULLANICILAR ──────────────────────────────────────────────

  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'test@vesti.com' },
      update: { location: 'Istanbul', trustScore: 4.8 },
      create: {
        name: 'Nefise Beyza',
        email: 'test@vesti.com',
        password,
        bio: 'Minimal ve sürdürülebilir moda tutkunu.',
        location: 'Istanbul',
        trustScore: 4.8,
        isPublic: true,
      },
    }),
    prisma.user.upsert({
      where: { email: 'elif@vesti.com' },
      update: {},
      create: {
        name: "Elif'in Dolabı",
        email: 'elif@vesti.com',
        password,
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
        bio: 'Vintage ve ikinci el kıyafetlere tutkunum. Kaliteli parçaları uygun fiyata satıyorum.',
        location: 'Ankara',
        trustScore: 4.9,
        isPublic: true,
      },
    }),
    prisma.user.upsert({
      where: { email: 'selin@vesti.com' },
      update: {},
      create: {
        name: 'Selin Moda',
        email: 'selin@vesti.com',
        password,
        image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150',
        bio: 'Sürdürülebilir moda savunucusu. Gardırobumu yenilerken eski sevgililerimi sizinle buluşturuyorum.',
        location: 'Izmir',
        trustScore: 4.6,
        isPublic: true,
      },
    }),
    prisma.user.upsert({
      where: { email: 'kaan@vesti.com' },
      update: {},
      create: {
        name: 'Kaan Spor',
        email: 'kaan@vesti.com',
        password,
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        bio: 'Sporcu kimliğimle gardırobumu tazeleyenlerle takas yapmaya hazırım.',
        location: 'Bursa',
        trustScore: 4.3,
        isPublic: true,
      },
    }),
    prisma.user.upsert({
      where: { email: 'luxury@vesti.com' },
      update: {},
      create: {
        name: 'Luxury Closet',
        email: 'luxury@vesti.com',
        password,
        image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150',
        bio: 'Yüksek kaliteli ve lüks marka parçalar. Özgünlük garantili.',
        location: 'Istanbul',
        trustScore: 5.0,
        isPublic: true,
      },
    }),
  ])

  const [mainUser, elif, selin, kaan, luxury] = users
  console.log('✅ 5 kullanıcı oluşturuldu.')

  // ─── GARDROP ──────────────────────────────────────────────────

  const wardrobeItems = [
    { userId: mainUser.id, name: 'Siyah Trençkot', category: 'DIŞ GİYİM', color: 'Siyah', brand: 'Mango', size: 'M', tags: ['klasik', 'sonbahar'], imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500' },
    { userId: mainUser.id, name: 'Beyaz Oversize Tişört', category: 'GÖMLEK', color: 'Beyaz', brand: 'Zara', size: 'L', tags: ['casual', 'yaz'], imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500' },
    { userId: mainUser.id, name: 'Lacivert Slim Fit Jean', category: 'PANTOLON', color: 'Lacivert', brand: "Levi's", size: '38', tags: ['günlük', 'klasik'], imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500' },
    { userId: mainUser.id, name: 'Bej Kaşmir Kazak', category: 'GÖMLEK', color: 'Bej', brand: 'COS', size: 'M', tags: ['kış', 'minimal'], imageUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500' },
    { userId: mainUser.id, name: 'Beyaz Spor Ayakkabı', category: 'AYAKKABI', color: 'Beyaz', brand: 'Nike', size: '38', tags: ['spor', 'günlük'], imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500' },
    { userId: mainUser.id, name: 'Siyah Blazer Ceket', category: 'DIŞ GİYİM', color: 'Siyah', brand: 'Massimo Dutti', size: 'M', tags: ['formal', 'iş'], imageUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4b3af8?w=500' },
    { userId: mainUser.id, name: 'Çizgili Denizci Gömlek', category: 'GÖMLEK', color: 'Lacivert', brand: 'H&M', size: 'M', tags: ['marine', 'casual'], imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500' },
    { userId: mainUser.id, name: 'Bordo Midi Etek', category: 'ELBISE', color: 'Bordo', brand: 'Zara', size: 'S', tags: ['şık', 'kış'], imageUrl: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=500' },
    // Elif için de birkaç gardırop
    { userId: elif.id, name: 'Kahverengi Deri Bot', category: 'AYAKKABI', color: 'Kahverengi', brand: 'Aldo', size: '37', tags: ['sonbahar', 'vintage'], imageUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500' },
    { userId: elif.id, name: 'Açık Mavi Denim Ceket', category: 'DIŞ GİYİM', color: 'Mavi', brand: "Levi's", size: 'M', tags: ['casual', 'vintage'], imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500' },
  ]

  for (const item of wardrobeItems) {
    const exists = await prisma.wardrobeItem.findFirst({ where: { userId: item.userId, name: item.name } })
    if (!exists) {
      await prisma.wardrobeItem.create({ data: item })
    }
  }
  console.log(`✅ ${wardrobeItems.length} gardırop kıyafeti eklendi.`)


  await Promise.all([
    prisma.styleProfile.upsert({
      where: { userId: mainUser.id },
      update: {},
      create: {
        userId: mainUser.id,
        colors: ['Siyah', 'Beyaz', 'Bej'],
        styles: ['MINIMAL', 'CASUAL'],
        bodyType: 'MESOMORPH',
        topSize: 'M',
        bottomSize: '38',
        shoeSize: '38',
      },
    }),
    prisma.styleProfile.upsert({
      where: { userId: elif.id },
      update: {},
      create: {
        userId: elif.id,
        colors: ['Lacivert', 'Siyah', 'Beyaz'],
        styles: ['CASUAL', 'FORMAL'],
        bodyType: 'ECTOMORPH',
        topSize: 'S',
        bottomSize: '36',
        shoeSize: '37',
      },
    }),
    prisma.styleProfile.upsert({
      where: { userId: selin.id },
      update: {},
      create: {
        userId: selin.id,
        colors: ['Kırmızı', 'Sarı', 'Beyaz'],
        styles: ['CASUAL', 'STREETWEAR'],
        bodyType: 'MESOMORPH',
        topSize: 'M',
        bottomSize: '38',
        shoeSize: '39',
      },
    }),
    prisma.styleProfile.upsert({
      where: { userId: kaan.id },
      update: {},
      create: {
        userId: kaan.id,
        colors: ['Gri', 'Siyah', 'Mavi'],
        styles: ['SPORT', 'CASUAL'],
        bodyType: 'MESOMORPH',
        topSize: 'L',
        bottomSize: '44',
        shoeSize: '43',
      },
    }),
    prisma.styleProfile.upsert({
      where: { userId: luxury.id },
      update: {},
      create: {
        userId: luxury.id,
        colors: ['Siyah', 'Beyaz', 'Gri'],
        styles: ['FORMAL', 'MINIMAL'],
        bodyType: 'ECTOMORPH',
        topSize: 'S',
        bottomSize: '36',
        shoeSize: '37',
      },
    }),
  ])
  console.log('✅ Style profiller oluşturuldu.')

  // ─── MARKETPLACE İLANLARI ─────────────────────────────────────

  const listings = [
    // Elif'in İlanları
    {
      userId: elif.id,
      title: 'Zara Siyah Kaşe Kaban',
      description: 'Sadece bir kış giyildi, tertemiz, kuru temizlemesi yapıldı. Çift düğmeli, kemer detaylı şık bir kaban. Ciddi alıcılarla fiyatta anlaşabiliriz.',
      category: 'DIŞ GİYİM',
      brand: 'Zara',
      size: 'M',
      condition: 'LIKE_NEW',
      price: 850.0,
      allowSwap: false,
      images: [
        'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600',
        'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600',
      ],
    },
    {
      userId: elif.id,
      title: "Levi's 501 Orijinal Jean",
      description: "Beden uymadığı için satıyorum. Çok az kullanıldı. Klasik kesim, mavi renk. Takasa açığım.",
      category: 'PANTOLON',
      brand: "Levi's",
      size: 'M',
      condition: 'LIKE_NEW',
      price: 1200.0,
      allowSwap: true,
      images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?w=600'],
    },
    {
      userId: elif.id,
      title: 'Vintage Deri Ceket',
      description: "Hakiki deri, 90'lardan kalma retro parça. Çok tarz ve hatasız. Koleksiyon niteliğinde.",
      category: 'DIŞ GİYİM',
      size: 'L',
      condition: 'USED',
      price: 1500.0,
      allowSwap: false,
      images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600'],
    },
    {
      userId: elif.id,
      title: 'H&M Beyaz Oversize Gömlek',
      description: 'Keten kumaş, oversize kesim. Yaz aylarında çok şık. Sadece 2 kez giyildi.',
      category: 'GÖMLEK',
      brand: 'H&M',
      size: 'L',
      condition: 'LIKE_NEW',
      price: 350.0,
      allowSwap: true,
      images: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600'],
    },
    // Selin'in İlanları
    {
      userId: selin.id,
      title: 'Çiçek Desenli Midi Elbise',
      description: 'Bahar ve yaz için mükemmel. Viskon kumaş, dökümlü kesim. Beden uyumadı.',
      category: 'ELBISE',
      size: 'S',
      condition: 'NEW',
      price: 650.0,
      allowSwap: false,
      images: ['https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600'],
    },
    {
      userId: selin.id,
      title: 'Knit Crop Kazak',
      description: "90'lar estetiği, triko dokulu crop kazak. Kırık beyaz renk, her kombine uyar.",
      category: 'GÖMLEK',
      size: 'M',
      condition: 'LIKE_NEW',
      price: 480.0,
      allowSwap: true,
      images: ['https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600'],
    },
    {
      userId: selin.id,
      title: 'Yüksek Bel Kargo Pantolon',
      description: 'Street style kargo pantolon. Haki renk, çok cepli. Takasa da açığım.',
      category: 'PANTOLON',
      size: 'S',
      condition: 'USED',
      price: 420.0,
      allowSwap: true,
      images: ['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600'],
    },
    {
      userId: selin.id,
      title: 'Pembe Blazer Ceket',
      description: 'Pastel pembe, ofis ve gündelik kullanım için ideal. Dar kesim, omuzlar tam oturdu.',
      category: 'DIŞ GİYİM',
      size: 'M',
      condition: 'NEW',
      price: 890.0,
      allowSwap: false,
      images: ['https://images.unsplash.com/photo-1594938298603-c8148c4b3af8?w=600'],
    },
    // Kaan'ın İlanları
    {
      userId: kaan.id,
      title: 'Nike Air Force 1 Beyaz',
      description: "Temiz beyaz, 43 numara. Sadece birkaç kez giyildi. Orijinal kutusunda duruyor.",
      category: 'AYAKKABI',
      brand: 'Nike',
      size: '43',
      condition: 'LIKE_NEW',
      price: 2200.0,
      allowSwap: false,
      images: ['https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=600'],
    },
    {
      userId: kaan.id,
      title: 'Under Armour Spor Eşofman Altı',
      description: 'Koşu ve antrenman için ideal. Siyah, elastik bel. L beden.',
      category: 'PANTOLON',
      brand: 'Under Armour',
      size: 'L',
      condition: 'USED',
      price: 380.0,
      allowSwap: true,
      images: ['https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600'],
    },
    {
      userId: kaan.id,
      title: 'New Balance 574 Gri',
      description: "Klasik NB 574, gri-beyaz. 43 numara. Çok az kullanıldı, sole'lar tertemiz.",
      category: 'AYAKKABI',
      brand: 'New Balance',
      size: '43',
      condition: 'LIKE_NEW',
      price: 1800.0,
      allowSwap: false,
      images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600'],
    },
    // Luxury Closet'in İlanları
    {
      userId: luxury.id,
      title: 'Gucci GG Logolu Kemer',
      description: "Orijinal Gucci kemer, 85cm. Kutusunu ve sertifikasını korudım. Çok az kullanıldı.",
      category: 'AKSESUAR',
      brand: 'Gucci',
      condition: 'LIKE_NEW',
      price: 4500.0,
      allowSwap: false,
      images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600'],
    },
    {
      userId: luxury.id,
      title: 'Burberry Ekoseli Atkı',
      description: "Klasik Burberry ekose desen, %100 kaşmir. Çok sıcak tutuyor. Sezon sonu satıyorum.",
      category: 'AKSESUAR',
      brand: 'Burberry',
      condition: 'LIKE_NEW',
      price: 3200.0,
      allowSwap: false,
      images: ['https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=600'],
    },
    {
      userId: luxury.id,
      title: 'Mango Saten Midi Etek',
      description: 'Krem rengi saten etek. Etkinlik ve ofis için ideal. Sadece 1 kez giyildi.',
      category: 'ELBISE',
      brand: 'Mango',
      size: 'S',
      condition: 'NEW',
      price: 1100.0,
      allowSwap: false,
      images: ['https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600'],
    },
    {
      userId: luxury.id,
      title: 'Boss Slim Fit Takım Elbise',
      description: '48 beden, lacivert. İş görüşmesi, nikah, toplantı için. Çok az kullanıldı.',
      category: 'DIŞ GİYİM',
      brand: 'Hugo Boss',
      size: '48',
      condition: 'LIKE_NEW',
      price: 5000.0,
      allowSwap: false,
      images: ['https://images.unsplash.com/photo-1594938374182-a57369de48f8?w=600'],
    },
  ]

  // İlanları sadece yoksa ekle
  for (const listing of listings) {
    const exists = await prisma.listing.findFirst({ where: { title: listing.title } })
    if (!exists) {
      await prisma.listing.create({ data: listing })
    }
  }
  console.log(`✅ ${listings.length} marketplace ilanı oluşturuldu.`)

  // ─── MESAJLAŞMALAR ────────────────────────────────────────────

  const kaban = await prisma.listing.findFirst({ where: { title: 'Zara Siyah Kaşe Kaban' } })
  const elbise = await prisma.listing.findFirst({ where: { title: 'Çiçek Desenli Midi Elbise' } })

  if (kaban) {
    const conv1Exists = await prisma.conversation.findFirst({ where: { listingId: kaban.id } })
    if (!conv1Exists) {
      await prisma.conversation.create({
        data: {
          listingId: kaban.id,
          participants: { create: [{ userId: mainUser.id }, { userId: elif.id }] },
          messages: {
            create: [
              { senderId: mainUser.id, content: 'Merhaba! Kaban hala satılık mı?', createdAt: new Date(Date.now() - 3600000 * 5) },
              { senderId: elif.id, content: 'Evet! Bugün kargoya verebilirim. Beden olarak M sizi tam giyer.', createdAt: new Date(Date.now() - 3600000 * 4) },
              { senderId: mainUser.id, content: 'Harika! Fiyatta biraz esnek olabilir misiniz?', createdAt: new Date(Date.now() - 3600000 * 2) },
              { senderId: elif.id, content: '800 yapabilirim, makul fiyat bence. 🙂', createdAt: new Date(Date.now() - 3600000) },
            ],
          },
        },
      })
    }
  }

  if (elbise) {
    const conv2Exists = await prisma.conversation.findFirst({ where: { listingId: elbise.id } })
    if (!conv2Exists) {
      await prisma.conversation.create({
        data: {
          listingId: elbise.id,
          participants: { create: [{ userId: mainUser.id }, { userId: selin.id }] },
          messages: {
            create: [
              { senderId: mainUser.id, content: 'Çiçekli elbise çok güzel, kargo ücreti dahil mi?', createdAt: new Date(Date.now() - 86400000) },
              { senderId: selin.id, content: 'Teşekkürler! Kargo alıcıya aittir, PTT kargo ile gönderirim.', createdAt: new Date(Date.now() - 86400000 + 3600000) },
            ],
          },
        },
      })
    }
  }
  console.log('✅ Örnek mesajlaşmalar oluşturuldu.')

  // ─── PROMO KODLARI ────────────────────────────────────────────

  await Promise.all([
    prisma.promoCode.upsert({
      where: { code: 'VESTI20' },
      update: {},
      create: {
        code: 'VESTI20',
        discountType: 'percentage',
        discountValue: 20,
        description: 'Tüm siparişlerde %20 indirim',
        isActive: true,
        maxUses: 100,
      },
    }),
    prisma.promoCode.upsert({
      where: { code: 'HOSGELDIN' },
      update: {},
      create: {
        code: 'HOSGELDIN',
        discountType: 'fixed',
        discountValue: 50,
        description: 'Yeni üyelere 50₺ indirim',
        minOrderAmount: 200,
        isActive: true,
        maxUses: 500,
      },
    }),
    prisma.promoCode.upsert({
      where: { code: 'YENISEZON' },
      update: {},
      create: {
        code: 'YENISEZON',
        discountType: 'percentage',
        discountValue: 15,
        description: 'Yeni sezon indirimi: %15',
        isActive: true,
      },
    }),
  ])
  console.log('✅ Promo kodlar oluşturuldu.')

  console.log('\n🎉 Seed başarıyla tamamlandı!')
  console.log('─'.repeat(50))
  console.log('📧 Giriş için hazır hesaplar:')
  console.log('   test@vesti.com      → Şifre: 123456')
  console.log('   elif@vesti.com      → Şifre: 123456')
  console.log('   selin@vesti.com     → Şifre: 123456')
  console.log('   kaan@vesti.com      → Şifre: 123456')
  console.log('   luxury@vesti.com    → Şifre: 123456')
  console.log('─'.repeat(50))
}

main()
  .catch((e) => {
    console.error('❌ Seed hatası:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
