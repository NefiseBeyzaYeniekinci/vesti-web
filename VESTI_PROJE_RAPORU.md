# Vesti Mobil ve Web Uygulaması Teknik Proje Raporu
**Sürüm:** 1.0  
**Tarih:** 8 Haziran 2026  
**Yazar:** Proje Geliştirme Grubu  

---

## İÇİNDEKİLER
1. [YÖNETİCİ ÖZETİ (EXECUTIVE SUMMARY)](#1-yönetici-özeti-executive-summary)
2. [SİSTEM MİMARİSİ VE GENEL YAPI](#2-sistem-mimarisi-ve-genel-yapi)
3. [KULLANILAN TEKNOLOJİLER (TECH STACK)](#3-kullanilan-teknolojiler-tech-stack)
   - [Web Uygulaması](#web-uygulaması)
   - [Mobil Uygulama](#mobil-uygulama)
   - [Yapay Zeka Servisi (AI Service)](#yapay-zeka-servisi-ai-service)
   - [Veritabanı ve Altyapı](#veritabanı-ve-altyapı)
4. [VERİTABANI TASARIMI VE İLİŞKİLERİ (DATABASE SCHEMA)](#4-veritabani-tasarimi-ve-ilişkileri-database-schema)
5. [YAPAY ZEKA VE ÖNERİ ALGORİTMALARI](#5-yapay-zeka-ve-öneri-algoritmalari)
   - [Kıyafet Sınıflandırma ve Stil Analizi (Fashion-CLIP)](#kıyafet-sınıflandırma-ve-stil-analizi-fashion-clip)
   - [Hava Durumu ve Arama Terimi Duyarlı Öneri Motoru](#hava-durumu-ve-arama-terimi-duyarli-öneri-motoru)
6. [TEMEL FONKSİYONEL MODÜLLER VE İŞLEYİŞLERİ](#6-temel-fonksiyonel-modüller-ve-işleyişleri)
   - [Dijital Gardırop Modülü](#dijital-gardırop-modülü)
   - [Pazaryeri ve Takas (Swap) Sistemi](#pazaryeri-ve-takas-swap-sistemi)
   - [Ödeme ve Sipariş Takip Mekanizması](#ödeme-ve-sipariş-takip-mekanizmasi)
   - [Gerçek Zamanlı Sohbet (Real-Time Messaging)](#gerçek-zamanli-sohbet-real-time-messaging)
7. [SENKRONİZASYON MİMARİSİ VE EN İYİ PRATİKLER](#7-senkronizasyon-mimarisi-ve-en-iyi-pratikler)
8. [SONUÇ VE GELECEK YOL HARİTASI](#8-sonuç-ve-gelecek-yol-haritasi)

---

## 1. YÖNETİCİ ÖZETİ (EXECUTIVE SUMMARY)

Günümüz moda dünyasında hızlı tüketim (fast fashion) çevre kirliliğine, aşırı kaynak tüketimine ve ciddi karbon salınımına yol açmaktadır. Bu soruna teknolojik bir çözüm sunmak amacıyla geliştirilen **Vesti**, kullanıcıların sahip oldukları kıyafetleri dijitalleştirerek daha verimli kullanmalarını sağlayan, hava durumuna göre yapay zeka (AI) destekli kombinler öneren ve kullanıcıların kendi aralarında kıyafet satışı ya da takası (swap) gerçekleştirebildikleri eşler arası (peer-to-peer - P2P) hibrit bir mobil ve web platformudur.

Bu teknik raporda, Vesti ekosisteminin mobil (Native Android Kotlin/Compose) ve web (Next.js/React/Prisma) ayaklarının sahip olduğu mimari altyapı, kullanılan son teknoloji kütüphaneler, ilişkisel veritabanı şemaları, yapay zeka modelleri (Fashion-CLIP) ve bu iki platformun gerçek zamanlı (real-time) senkronizasyonunu sağlayan mekanizmalar detaylandırılmıştır.

---

## 2. SİSTEM MİMARİSİ VE GENEL YAPI

Vesti, istemci-sunucu (Client-Server) mimarisine dayanır. Mobil ve web uygulamaları, merkezi bir veritabanı ve uygulama sunucusu üzerinden haberleşerek verilerin **Tek Güvenilir Kaynaktan (Single Source of Truth)** yönetilmesini garantiler.

Sistem, ölçeklenebilirliği artırmak ve modüler yapıyı korumak adına üç temel katmandan oluşur:
1. **İstemciler (Clients):** Android Native Jetpack Compose uygulaması ve Next.js Web Dashboard.
2. **API & Servis Katmanı (Backend Services):** REST API'ler ve WebSockets (Socket.io) üzerinden anlık veri iletimini sağlayan Next.js Serverless rotaları ile bağımsız Python Flask AI sunucusu.
3. **Veri Katmanı (Data Layer):** PostgreSQL (İlişkisel Veri), Redis (Oturum, Önbellek ve Soket durum yönetimi) ve S3 Uyumlu Görsel Depolama (Bulut ortamındaki gardırop ve ilan resimleri için).

Aşağıdaki şema, istemciler ile sunucu bileşenleri arasındaki genel veri akışını göstermektedir:

```mermaid
graph TD
    subgraph İstemciler (Clients)
        MobileApp["Android (Kotlin & Jetpack Compose)"]
        WebApp["Web Application (React & Next.js)"]
    end

    subgraph API & Backend Servis Katmanı
        NextAPI["Next.js Serverless API Rotaları"]
        FlaskAI["Flask AI Servisi (Port 5000)"]
    end

    subgraph Veritabanı ve Depolama (Data Layer)
        PG[("PostgreSQL Database")]
        Redis[("Upstash Redis Cache")]
        S3["Supabase/S3 Storage (Medya Depolama)"]
    end

    MobileApp <-->|HTTPS / REST & WebSockets| NextAPI
    WebApp <-->|HTTPS / REST & WebSockets| NextAPI
    
    NextAPI <-->|Prisma ORM| PG
    NextAPI <-->|Token & Cache| Redis
    NextAPI -->|Görsel Analiz/Proxy| FlaskAI
    
    FlaskAI -->|HuggingFace API/Local PyTorch| FlaskAI
    NextAPI <-->|Resim Yükleme/Okuma| S3
```

---

## 3. KULLANILAN TEKNOLOJİLER (TECH STACK)

### Web Uygulaması
Web tarafında, modern arayüz tasarımı, SEO uyumluluğu, yüksek performans ve sunucu tarafı işleme (Server-Side Rendering) avantajlarından ötürü React tabanlı **Next.js** framework'ü seçilmiştir.

* **Framework:** Next.js 14 (App Router) ve React 18.
* **Dil:** TypeScript (Tip güvenliği ve geliştirici üretkenliği için).
* **Tasarım Sistemi:** Vanilla CSS + Tailwind CSS (Esnek ızgara -grid- yerleşimleri) ve Radix UI tabanlı **Shadcn UI** bileşen kütüphanesi.
* **Animasyonlar:** **Framer Motion** (Yumuşak sayfa geçişleri, hover efektleri ve modal açılış animasyonları).
* **Durum Yönetimi (State Management):** **Zustand** (Local storage entegrasyonu ile JWT token yönetimi ve sepet durumları).
* **API İletişimi:** **Axios** (İstek kesiciler -interceptors- kullanılarak her isteğin başlığına `"Authorization: Bearer <JWT>"` token'ının otomatik eklenmesi sağlanmıştır).
* **Veri Çekme & Önbellek:** **@tanstack/react-query** (Verilerin arka planda güncel tutulması ve önbellek yönetimi).
* **Kimlik Doğrulama:** **NextAuth.js (v5 Beta)** ve Google Auth Library.
* **Ödeme Entegrasyonu:** **Iyzipay SDK** (Türkiye pazarına uygun ödeme altyapısı).

> [!NOTE]
> Web arayüzü, büyük ekranlarda sol sabit yan menülü (sidebar) düzen sunarken, mobil ekran genişliklerine düşüldüğünde otomatik olarak mobil uygulamadaki gibi bir **Alt Navigasyon Barı (Bottom Navigation Bar)** formuna dönüşür.

---

### Mobil Uygulama
Mobil uygulama, modern Android standartlarına uygun olarak %100 yerel (Native) teknolojilerle inşa edilmiştir.

* **Dil:** **Kotlin** (Modern, güvenli ve fonksiyonel programlama dili).
* **Kullanıcı Arayüzü (UI):** **Jetpack Compose** (Deklaratif UI mimarisi, animasyonlar ve özel tema destekleri).
* **Asenkron Programlama:** **Kotlin Coroutines** ve **Flow** (Arka planda ağ istekleri ve yerel veritabanı işlemlerini bloke etmeden çalıştırma).
* **Ağ İstemcisi:** **Retrofit 2** ve **OkHttp 4** (Ağ isteklerinin yönetimi, zaman aşımları ve hata loglarının yönetimi). OkHttp interceptor'ları vasıtasıyla token'lar dinamik olarak her isteğe enjekte edilir.
* **Yerel Depolama (Caching):** **Jetpack DataStore Preferences** (Kullanıcı JWT token, kimlik bilgileri ve ayarlarının anahtar-değer eşleşmesiyle güvenli depolanması).
* **Görsel Yükleme:** **Coil** (Jetpack Compose uyumlu, optimize edilmiş asenkron resim yükleme ve önbellekleme kütüphanesi).

---

### Yapay Zeka Servisi (AI Service)
Kıyafet görsel analizleri, stil danışmanlığı ve otomatik etiketleme süreçlerinde **Hibrit (Bulut + Lokal) Yapay Zeka** altyapısı kullanılmaktadır.

* **Birincil Model (Bulut):** **Google Gemini 2.0 Flash** (Multimodal Conversational AI). Doğrudan Next.js API katmanı üzerinden `@google/genai` SDK'sı ile çağrılır. Kullanıcıyla doğal dilde sohbet eder, yüklenen resimleri yüksek doğrulukla analiz eder ve kişiselleştirilmiş kombin tavsiyeleri sunar.
* **İkincil/Yedek Model (Lokal Flask Sunucu):** Çevrimdışı durumlarda veya API anahtarı tanımlanmadığında çalışan, Python tabanlı **Flask** mikroservisi.
* **Derin Öğrenme Framework (Lokal):** **PyTorch** ve **HuggingFace Transformers**.
* **Lokal Model:** HuggingFace üzerinde eğitilmiş özel **`Yeniekinci/Vesti-Fashion-AI`** (Fine-tuned Fashion-CLIP model). Fallback olarak **`patrickjohncyh/fashion-clip`** kullanılmaktadır.
* **Görsel İşleme:** **Pillow (PIL)**.

---

### Veritabanı ve Altyapı
* **Veritabanı:** **PostgreSQL** (ACID standartlarına uygun, karmaşık ilişkileri ve pazar yeri siparişlerini güvenle saklayabilen ilişkisel veritabanı).
* **ORM:** **Prisma** (Tip güvenliği, kolay şema göçleri -migrations- ve veri tohumlama -seeding- işlemleri için).
* **Önbellek & Soket Durumları:** **Upstash Redis** (Sunucusuz mimariye uygun Redis çözümü).
* **Obje Depolama:** **Supabase Storage (AWS S3 API uyumlu)** (Kullanıcı gardırop resimleri ve pazar yeri ilan görsellerinin saklandığı alan).

---

## 4. VERİTABANI TASARIMI VE İLİŞKİLERİ (DATABASE SCHEMA)

Vesti projesinin tüm ilişkisel veri yapısı PostgreSQL üzerinde Prisma ORM kullanılarak tasarlanmıştır. Şema yapısı, kullanıcı profillerinden gardırop nesnelerine, mesajlaşma kanallarından pazar yeri siparişlerine ve kargo takibine kadar geniş bir yelpazeyi kapsar.

Aşağıdaki tabloda PostgreSQL üzerinde tanımlı olan modeller ve görevleri listelenmiştir:

| Model Adı | Açıklama | İlişkili Olduğu Modeller |
| :--- | :--- | :--- |
| **User** | Platformdaki kullanıcıların temel bilgileri, şifreleri, konumları, güven puanları ve rolleri. | Account, Session, WardrobeItem, Listing, StyleProfile, Message, ConversationParticipant, SavedCard, Order, PromoRedemption, Favorite |
| **Account / Session** | NextAuth gereksinimleri (OAuth, Google Login ve oturum yönetimi verileri). | User |
| **SavedCard** | Kullanıcının ödemelerde hızlı kullanması için sakladığı kartların maskeli verisi (örn. `**** **** **** 1234`). | User |
| **WardrobeItem** | Kullanıcının gardırobuna eklediği kıyafet nesneleri (Kategori, renk, marka, beden, görsel URL). | User |
| **StyleProfile** | Kullanıcının onboarding aşamasında belirlediği beden ölçüleri, stil tercihleri ve sevdiği renkler. | User (Birebir ilişki) |
| **Listing** | Pazar yerinde satışa sunulan kıyafet ilanları (Başlık, fiyat, durum, takas izni, görseller). | User, Conversation, Order, Favorite |
| **Conversation** | İlan bazlı veya kullanıcılar arası başlatılan mesajlaşma odaları. | Listing, ConversationParticipant, Message |
| **Message** | Sohbet odalarındaki bireysel mesaj içerikleri ve takas teklifi durumları (pending/accepted/rejected). | Conversation, User (Sender) |
| **Order** | Pazar yerinde yapılan satış işlemlerinin detayları (Alıcı, satıcı, ilan, fiyat, durum, kargo bilgisi). | User (Buyer & Seller), Listing, TrackingEvent |
| **TrackingEvent** | Siparişe ait kargo hareketleri (Kargoya verildi, yolda, dağıtımda, teslim edildi vb.). | Order |
| **PromoCode** | Kampanyalarda tanımlanan indirim kodları (Yüzdelik veya sabit indirim değerleri). | PromoRedemption |
| **PromoRedemption** | Kullanıcıların hangi promosyon kodunu kullandığının kaydı (Bir kullanıcı aynı kodu en fazla 1 kez kullanabilir). | User, PromoCode (Çoklu tekil anahtar) |
| **Favorite** | Kullanıcıların pazar yerinde beğendikleri ilanların listesi. | User, Listing |

### Kritik Prisma Şema İlişkileri ve Kısıtlar (Constraints)
* **OnDelete: Cascade:** Kullanıcı hesabı silindiğinde, o kullanıcıya ait gardırop öğeleri (`WardrobeItem`), ilanlar (`Listing`), seanslar, kayıtlı kartlar ve stil profili veritabanından bütünlüğü korumak adına otomatik olarak temizlenir.
* **Unique Constraints:** Bir kullanıcının aynı ilanı birden fazla kez favorilere eklemesini engellemek için `@@unique([userId, listingId])` kısıtı kullanılmıştır. Benzer şekilde, promosyon kodlarının suistimal edilmesini önlemek adına `@@unique([userId, promoCodeId])` kuralı geçerlidir.

---

## 5. YAPAY ZEKA VE ÖNERİ ALGORİTMALARI

Vesti'nin stil danışmanlığı altyapısı, kullanıcının hem resimlerini analiz edebilen hem de onlarla tamamen doğal ve arkadaşça sohbet edebilen **Google Gemini 2.0 Flash** multimodal yapay zeka modeline dayanmaktadır. İnternet erişimi kısıtlı olduğunda veya API anahtarı girilmediğinde ise lokal **Fashion-CLIP** sınıflandırma modeli yedek (fallback) olarak devreye girer.

### Multimodal Görsel Analiz ve Doğal Dil Sohbeti (Google Gemini 2.0 Flash)
Kullanıcı Vesves chatbotu üzerinden bir kıyafet resmi yüklediğinde veya metinsel olarak bir soru sorduğunda (Örn: *"Bugün spora gideceğim, yağmurlu havaya uygun ne giyebilirim?"*), Next.js API rotası kullanıcının konumundaki güncel hava durumunu (sıcaklık, yağmur vb.) sorgular ve bu bilgileri **Gemini 2.0 Flash** modeline birleştirilmiş bir prompt olarak iletir.

Gemini modeli, hem kullanıcının yüklediği görseli hem de güncel hava durumunu inceleyerek arkadaşça ve samimi bir Türkçe stil tavsiyesi üretir. Aynı zamanda, kıyafetin kategorisini (`winter clothing`, `summer clothing`, `casual wear`, `formal elegant wear`, `streetwear`, `vintage clothing`) otomatik tespit ederek veritabanı ile uyumlu bir JSON formatında döner.

#### Gemini API Entegrasyonu (Next.js - TypeScript):
```typescript
const response = await ai.models.generateContent({
  model: "gemini-2.0-flash",
  contents: contents, // Resim base64 verisi ve metin promptu
  config: {
    systemInstruction: "Sen Vesti'nin samimi moda danışmanı Vesves'sin...",
    responseMimeType: "application/json",
    responseSchema: {
      type: "OBJECT",
      properties: {
        category: { type: "STRING" },
        message: { type: "STRING" }
      },
      required: ["category", "message"]
    }
  }
});
```

### Lokal Kıyafet Sınıflandırma ve Stil Analizi (Fashion-CLIP Fallback)
Erişim kısıtlamalarında devreye giren lokal Flask AI servisi, **Fashion-CLIP** modelini kullanarak kıyafet görsellerini 6 ana stil kategorisine (kışlık, yazlık, casual vb.) ayırır.

#### Sınıflandırma Mantığı (Flask Sunucu Kodu - Python):
```python
# Modelin tanıyabileceği metinsel etiketler (Prompts)
labels = [
    "a photo of winter clothing", 
    "a photo of summer clothing", 
    "a photo of casual wear", 
    "a photo of formal elegant wear",
    "a photo of streetwear",
    "a photo of vintage clothing"
]

# Resim ve etiketlerin Fashion-CLIP işlemcisinden geçirilmesi
inputs = processor(text=labels, images=image, return_tensors="pt", padding=True).to(device)

with torch.no_grad():
    outputs = model(**inputs)
    logits_per_image = outputs.logits_per_image
    probs = logits_per_image.softmax(dim=1)  # Olasılık dağılımı hesaplama

best_idx = probs.argmax().item()
best_label = labels[best_idx].replace("a photo of ", "")
```
Bu analiz sonucunda elde edilen kategori ve stil etiketleri veritabanına kaydedilerek arama, filtreleme ve kombin önerme modüllerinde girdi olarak kullanılır.

---

### Hava Durumu ve Arama Terimi Duyarlı Öneri Motoru
Kullanıcılar platforma giriş yaptığında veya "Kombin Üret" sayfasını açtığında, sistem şu adımları sırayla izler:
1. **Konum Tespiti:** Kullanıcının profilinde kayıtlı olan konum bilgisi (örn. `Istanbul`) üzerinden **OpenWeather API** entegrasyonu ile anlık sıcaklık (°C) ve hava durumu koşulu (Clear, Rain, Snow, Clouds vb.) çekilir.
2. **Kural Tabanlı Eşleştirme Filtresi:** Çekilen sıcaklık derecesine göre gardıroptaki kıyafetler filtrelenir:
   * **Sıcaklık > 22°C (Yaz Koşulları):** Hafif, nefes alabilen tişörtler, askılılar, şortlar ve açık ayakkabılar önceliklendirilir.
   * **14°C - 22°C (Ilık/Bahar Koşulları):** Tişört üstüne ince ceketler, hırkalar, ince jean pantolonlar ve sneaker'lar önerilir.
   * **Sıcaklık < 14°C (Soğuk/Kış Koşulları):** Kalın yün kazaklar, kabanlar, montlar, kalın kumaş pantolonlar ve kışlık botlar listelenir.
3. **Semantik Arama Filtresi:** Kullanıcı stil danışmanına yazılı olarak ne yapacağını söylerse (örn. *"Bugün spora gideceğim"* veya *"Akşam resmi bir iş yemeği var"*), sistem metin içerisindeki anahtar kelimeleri analiz eder:
   * *Spor/Koşu/Gym/Antrenman:* Sıcaklığa bağlı olarak spor şortları, taytlar ve koşu ayakkabıları seçilir.
   * *Toplantı/İş/Mülakat/Resmi:* Keten gömlekler, blazer ceketler, kumaş pantolonlar ve klasik ayakkabılar ön plana çıkarılır.
   * *Parti/Düğün/Davet/Eğlence:* Şık elbiseler, takımlar ve özel gün aksesuarları eşleştirilir.
   * *Yağmur/Yağmurlu:* Su geçirmez yağmurluklar, botlar ve şemsiye uyarısı içeren kombinler sunulur.

---

## 6. TEMEL FONKSİYONEL MODÜLLER VE İŞLEYİŞLERİ

### Dijital Gardırop Modülü
Kullanıcıların fiziksel gardıroplarını dijital dünyaya aktardıkları alandır.
* **Görsel Yükleme:** İstemci (mobil veya web), resmi `multipart/form-data` formatında sunucuya gönderir.
* **Otomatik Etiketleme:** Görsel sunucuya ulaştığında AI mikroservisi tetiklenir, kıyafetin kategorisi, rengi ve stili otomatik algılanarak form alanlarına yerleştirilir (Kullanıcı dilerse elle düzeltme yapabilir).
* **Filtreleme Arayüzü:** Kullanıcı gardırobunu kategoriye (Üst Giyim, Alt Giyim, Dış Giyim, Ayakkabı vb.) ve renklere göre dinamik olarak listeleyebilir.

---

### Pazaryeri ve Takas (Swap) Sistemi
Kullanıcıların artık giymedikleri kıyafetleri satabildikleri veya takas edebildikleri alandır.
* **İlan Verme:** Gardıroptan seçilen bir kıyafet doğrudan pazar yerinde ilana dönüştürülebilir. İlana dönüştürülürken kıyafetin yıpranma durumu (Yeni-Etiketli, Çok İyi, İyi, Kullanılmış) ve satış fiyatı girilir.
* **Takas (Swap) Teklifi:** Alıcı, satıcıya para ödemek yerine kendi gardırobundan bir kıyafeti takas olarak önerebilir. Bu teklif sohbet ekranı üzerinden (`swapItemId` ve `swapStatus` alanları kullanılarak) kart halinde satıcıya iletilir. Satıcı teklifi kabul ederse, sistem takas işlemini başlatır.

---

### Ödeme ve Sipariş Takip Mekanizması
Güvenli ve sorunsuz bir alışveriş deneyimi için tasarlanan bu modül, bankacılık standartlarında çalışır.
* **Iyzipay Entegrasyonu:** Ödeme aşamasında kart bilgileri doğrudan Iyzipay API'sine gönderilir. 3D Secure doğrulaması Next.js sunucusunda işlenir.
* **Maskeli Kart Kaydı:** Kullanıcı ödeme esnasında kartını kaydetmek isterse, kartın gerçek numaraları asla veritabanına yazılmaz. Iyzipay'in sunduğu tokenization altyapısı kullanılır ve veritabanında (`SavedCard`) sadece maskelenmiş numara (örn: `4355 **** **** 1907`) saklanır.
* **Kargo ve Sipariş Durumları:** Bir sipariş oluşturulduğunda sırasıyla şu aşamalardan geçer:  
  `pending` (Beklemede) $\rightarrow$ `paid` (Ödendi) $\rightarrow$ `shipped` (Kargolandı) $\rightarrow$ `delivered` (Teslim Edildi).  
  Sipariş kargoya verildiğinde satıcı takip numarasını ve kargo firmasını (MNG, Yurtiçi, Aras, PTT) sisteme girer. `TrackingEvent` modeli sayesinde alıcı, kargo adımlarını (yolda, dağıtımda) anlık olarak görebilir.

---

### Gerçek Zamanlı Sohbet (Real-Time Messaging)
Alıcılar ve satıcılar arasında hızlı pazarlık veya takas görüşmesi yapılabilmesi için WebSocket teknolojisi kullanılmıştır.
* **Socket.io Altyapısı:** Sunucu tarafında Socket.io sunucusu, istemciler tarafında ise sırasıyla `socket.io-client` (Web) ve `socket.io-client-java` (Android) kütüphaneleri aktif bağlantı kurar.
* **Veritabanı Senkronizasyonu:** Gönderilen her mesaj anlık olarak alıcıya ulaştırılırken arka planda PostgreSQL veritabanındaki `Message` ve `Conversation` tablolarına kaydedilir. Böylece kullanıcılar çevrimdışı (offline) olsalar bile uygulamayı açtıklarında mesaj geçmişini eksiksiz görürler.

---

## 7. SENKRONİZASYON MİMARİSİ VE EN İYİ PRATİKLER

Mobil ve web uygulamalarının gerçek zamanlı ve sorunsuz çalışması (örneğin mobilden silinen bir kıyafetin web dashboard'unda anında yok olması) için şu mimari standartlar uygulanmıştır:

1. **Optimistic UI:** Kullanıcı arayüzünde bir işlem yaptığında (örneğin bir ilanı favorilere eklediğinde veya sildiğinde), sunucudan HTTP yanıtı gelmesi beklenmeden arayüz güncellenir. Sunucudan hata dönerse işlem geri alınır (rollback). Bu sayede internet gecikmeleri kullanıcıya yansıtılmaz.
2. **WebSocket Bildirimleri:** Gardıropta veya sohbet kutusunda kritik bir güncelleme olduğunda, backend ilgili kullanıcı ID'sine WebSocket kanalı üzerinden özel bir event fırlatır (Örn: `WARDROBE_CHANGED`). Bu eventi dinleyen diğer aktif istemci, veriyi arka planda yeniden sorgulayarak (Refetch) ekranı sessizce günceller.
3. **HTTP Caching ve Cache-Control:** API Gateway ve Next.js rotalarında sık değişmeyen statik veriler (örn. şehir kodları, kategori listeleri) Redis üzerinde önbelleğe alınarak veritabanı yükü minimuma indirilmiştir.

---

## 8. SONUÇ VE GELECEK YOL HARİTASI

Vesti projesi; native mobil teknolojilerin hızı ve Next.js web teknolojilerinin esnekliğini tek bir potada eriterek başarılı bir hibrit mimari sunmaktadır. Gelişmiş yapay zeka entegrasyonu (Fashion-CLIP) ve pazar yeri ile entegre çalışan dijital gardırop yapısı, projenin ticari ve ekolojik potansiyelini üst düzeye taşımaktadır.

### Gelecek Fazlar ve Planlanan Geliştirmeler:
* **LLM Destekli Chatbot:** Mevcut kural ve CLIP tabanlı stil danışmanlığının, doğrudan GPT-4 veya Gemini API entegrasyonuyla zenginleştirilerek kullanıcılara daha doğal ve uzun diyaloglar kurabilen kişisel bir stilist sunulması.
* **Kamera ile Canlı Deneme (AR Try-On):** Mobil uygulamada artırılmış gerçeklik (AR) kullanılarak, seçilen kıyafetlerin kullanıcının kendi fotoğrafı üzerinde canlı olarak nasıl duracağını gösteren AR kabinlerinin kurulması.
* **Gelişmiş Kargo Entegrasyonu:** Yurtiçi ve MNG Kargo API'leri ile doğrudan entegre olunarak, kargo takip numaralarının sistem tarafından otomatik üretilmesi ve takip durumlarının kargo firması sunucularından web-hook'lar ile otomatik çekilmesi.
