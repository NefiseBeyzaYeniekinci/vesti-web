import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = { 
    title: "Gizlilik Politikası | Vesti",
    description: "Vesti veri gizliliği politikası ve KVKK aydınlatma metni."
};

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <Link href="/register" className="inline-flex items-center text-vesti-primary hover:underline mb-8">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Kayıt sayfasına dön
      </Link>
      
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Gizlilik Politikası ve KVKK</h1>
      <p className="text-gray-500 mb-8">Son güncelleme tarihi: 1 Haziran 2026</p>

      <div className="space-y-6 text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Şifreleme ve Veritabanı Güvenliği</h2>
          <p>
            Vesti verileriniz, dünya standartlarındaki bulut veritabanımızda SSL şifrelemeli tünellerle korunarak saklanır. Şifreleriniz sisteme kaydedilirken en güvenli hashing algoritmalarından biri olan bcrypt ile şifrelenir ve sistemsel olarak asla düz metin olarak okunamaz veya geri döndürülemez.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Eşzamanlı Mobil ve Web Veri Paylaşımı</h2>
          <p>
            Web ve mobil sürümlerimiz ortak güvenli bir API katmanı üzerinden çalışır. Android uygulamasında veya web arayüzünde eklediğiniz her bir kıyafet, verileriniz ve konum detaylarınız, güvenlik yetkilendirmesi kontrollerinden geçirilerek veritabanına işlenir. Yetkisiz hiçbir sorgunun veritabanına erişmesine izin verilmez.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Pazaryeri ve İkinci El Takas Bilgileri</h2>
          <p>
            Pazaryerinde paylaştığınız ilanlar tüm ziyaretçiler tarafından incelenebilir ancak doğrudan iletişim kurma, mesaj gönderme veya takas teklifi yapma yetkisi yalnızca doğrulanmış giriş yapmış üyelere aittir. Kendi rızanız dışında e-posta adresiniz veya kişisel iletişim detaylarınız asla ilanlarda sergilenmez.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Kalıcı Olarak Silinme Hakkı (KVKK Uyum)</h2>
          <p>
            KVKK kapsamında, dilediğiniz an profilinizi silme hakkına sahipsiniz. Vesti uygulamasındaki hesabınızı sildiğinizde; dolabınızdaki tüm kıyafetler, profil detaylarınız, mesajlaşmalarınız ve ilanlarınız veritabanından kalıcı olarak (hard-delete) temizlenir ve geri getirilemeyecek şekilde yok edilir.
          </p>
        </section>
      </div>
    </div>
  );
}
