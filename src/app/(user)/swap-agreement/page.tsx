import Link from "next/link";
import { ArrowLeft, ShieldAlert, Truck, FileText } from "lucide-react";

export const metadata = { title: "Takas ve Güvenlik Sözleşmesi | Vesti" };

export default function SwapAgreementPage() {
  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <Link href="/messages" className="inline-flex items-center text-vesti-primary hover:underline mb-8">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Mesajlara geri dön
      </Link>
      
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Vesti Takas ve Güvenlik Sözleşmesi</h1>
      <p className="text-gray-500 mb-8">Son güncelleme tarihi: 5 Haziran 2026</p>

      <div className="space-y-6 text-gray-700 leading-relaxed">
        <section className="bg-purple-50/50 p-4 rounded-xl border border-purple-100 flex items-start gap-3 mb-6">
          <ShieldAlert className="w-5 h-5 text-purple-700 shrink-0 mt-0.5" />
          <p className="text-xs text-purple-800 font-semibold">
            Önemli Uyarı: Bu sözleşme, Vesti platformu üzerinden yapılan takas (barter) işlemlerinde tarafların güvenliğini korumak amacıyla taraflar arasında akdedilmiştir. Onaylamanız halinde yasal olarak bağlayıcıdır.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <FileText className="w-5 h-5 text-gray-600" />
            1. Amaç ve Kapsam
          </h2>
          <p>
            İşbu sözleşme, Vesti platformu üzerinden yapılan takas (barter) işlemlerinde, tarafların birbirlerini mağdur etmemesi, takas edilen kıyafetlerin zamanında ve eksiksiz teslim edilmesini sağlamak amacıyla düzenlenmiştir. Takas teklifini gönderen ve onaylayan taraflar bu sözleşmenin tüm maddelerini peşinen kabul etmiş sayılır.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Truck className="w-5 h-5 text-gray-600" />
            2. Teslimat ve Gönderim Yükümlülüğü
          </h2>
          <p>
            Takas işlemi karşılıklı olarak onaylandığı andan itibaren, her iki taraf da takasa konu olan kıyafetleri en geç 3 (üç) iş günü içerisinde kargoya vermekle veya önceden mesajlaşarak anlaşılan elden teslim şartlarına uymakla yükümlüdür. Kargo ile gönderim durumunda kargo takip numarası vakit kaybetmeksizin sohbet ekranı üzerinden karşı tarafa iletilmelidir.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2 text-rose-700">
            ⚠️ 3. Cayma Cezası ve Cezai Şart
          </h2>
          <p>
            Takas işlemi onaylandıktan sonra haklı bir gerekçe (kıyafetin kargo öncesi hasar görmesi veya ilan açıklamasına uymayan ağır kusur durumları hariç) olmaksızın takastan tek taraflı olarak vazgeçen veya ürünü göndermeyen taraf, karşı tarafın uğradığı zararı tazmin etmek amacıyla <strong>takas konusu olan ürünün piyasa/sipariş tutarının 2 (iki) katı oranında</strong> cezai şart ödemeyi kabul ve taahhüt eder.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-2 text-amber-700">
            ⏳ 4. İletişimsizlik ve Geri Dönüş Yapmama Durumu
          </h2>
          <p>
            Takas işlemi onaylandıktan sonra taraflardan birinin kargo durumu, elden teslim veya ürün detayları hakkında gönderilen mesajlara veya platform ulaştırma çağrılarına <strong>1 (bir) hafta (7 gün) içerisinde</strong> yanıt vermemesi, geri dönüt yapmaması durumunda:
          </p>
          <ul className="list-disc pl-5 mt-2 space-y-1.5">
            <li>Geri dönüş yapmayan taraf, olası bir adli süreçte veya açılacak davada doğrudan kusurlu ve haksız sayılacaktır.</li>
            <li>Bu durum, Vesti veritabanındaki log kayıtları ile birlikte mahkemelerde kesin delil olarak kullanılacaktır.</li>
            <li>Haksız sayılan taraf, karşı tarafın doğacak tüm mahkeme, harç ve avukatlık giderlerini de ödemekle yükümlü olacaktır.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Delil Sözleşmesi Niteliği</h2>
          <p>
            Vesti, alıcı ve satıcı arasındaki takas ve kargo süreçlerinde doğrudan bir taraf olmayıp, sadece aracı platformdur. Ancak bu sözleşme, tarafların rızalarıyla elektronik ortamda imzalanmış olup, olası ihtilaflarda 6100 sayılı Hukuk Muhakemeleri Kanunu uyarınca yazılı delil niteliğindedir.
          </p>
        </section>
      </div>
    </div>
  );
}
