import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = { title: "Kullanıcı Sözleşmesi | Vesti" };

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <Link href="/register" className="inline-flex items-center text-vesti-primary hover:underline mb-8">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Kayıt sayfasına dön
      </Link>
      
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Kullanıcı Sözleşmesi</h1>
      <p className="text-gray-500 mb-8">Son güncelleme tarihi: 26 Mart 2026</p>

      <div className="space-y-6 text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Taraflar ve Kapsam</h2>
          <p>
            İşbu sözleşme, Vesti platformunu (&quot;Platform&quot;) kullanan bireyler (&quot;Kullanıcı&quot;) ile Vesti arasında akdedilmiştir. Uygulamamıza kayıt olarak veya uygulamayı kullanarak bu koşulları peşinen kabul etmiş sayılırsınız.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Hesap Oluşturma ve Sorumluluklar</h2>
          <p>
            Vesti hesabı açarken gerçek kimlik bilgilerinizi kullanmalı, şifre güvenliğinizi sağlamalısınız. Hesabınız üzerinden yapılan tüm işlemler kendi sorumluluğunuzdadır. Yanıltıcı hesap profilleri veya spam ilanlar açılması durumunda Vesti, hesabınızı önceden bildirmeksizin kapatma veya askıya alma hakkını saklı tutar.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Pazar Yeri İşlemleri ve İlan Kuralları</h2>
          <p>
            Pazar yeri (Marketplace) üzerinden satılan veya takaslanan kıyafetlerin durumu, fiyatı ve diğer tüm bilgileri ilan verenin (Satıcı) sorumluluğundadır. Vesti, sadece bir aracı platform rolü üstlenir. Taraflar arasındaki alışverişten doğan anlaşmazlıklarda yasal bağlayıcılığı yoktur. Sahte, taklit veya yasadışı ürün satışı kesinlikle yasaktır.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Fikri Mülkiyet ve İçerik Kullanımı</h2>
          <p>
            Kullanıcılar, platforma yükledikleri tüm fotoğrafların, açıklamaların telif haklarına sahip olduklarını veya bunları paylaşmaya haklarının olduğunu beyan eder. Vesti, uygulamadaki kullanıcı onaylı içerikleri ve yapay zeka ile oluşturulan kombin planlarını analiz etme hakkına sahiptir.
          </p>
        </section>
        
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Sözleşme Değişiklikleri</h2>
          <p>
            Vesti, bu sözleşmeyi istediği zaman önceden haber vererek veya vermeyerek güncelleyebilir. Sözleşmenin güncel haline her zaman Vesti platformu üzerinden erişebileceksiniz.
          </p>
        </section>
      </div>
    </div>
  );
}
