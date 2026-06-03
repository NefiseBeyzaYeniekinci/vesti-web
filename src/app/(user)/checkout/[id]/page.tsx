import { getMarketplaceItemById } from "@/lib/api/marketplace";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import PaymentForm from "@/components/checkout/PaymentForm";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const item = await getMarketplaceItemById(params.id);
  if (!item) return { title: "İlan Bulunamadı | Vesti Checkout" };
  return { title: `Ödeme: ${item.title} | Vesti` };
}

export default async function CheckoutPage({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const item = await getMarketplaceItemById(params.id);

  if (!item) {
    notFound();
  }

  if (item.status !== "active") {
    return (
      <div className="max-w-3xl mx-auto py-16 px-4 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Bu ilan artık satışta değil</h2>
        <Link href="/marketplace" className="text-indigo-600 hover:underline">
          {"Marketplace'e Dön"}
        </Link>
      </div>
    );
  }

  if (item.seller.id === session.user.id) {
    return (
      <div className="max-w-3xl mx-auto py-16 px-4 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Kendi ilanınızı satın alamazsınız</h2>
        <Link href="/marketplace" className="text-indigo-600 hover:underline">
          {"Marketplace'e Dön"}
        </Link>
      </div>
    );
  }

  // Aktif ve kullanıcının henüz kullanmadığı kuponları bul
  const availableCoupons = await prisma.promoCode.findMany({
    where: {
      isActive: true,
      redemptions: {
        none: {
          userId: session.user.id
        }
      }
    }
  });

  return (
    <div className="bg-gray-50/50 min-h-screen py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href={`/marketplace/${item.id}`} className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 mb-6 transition-colors font-medium">
          <ArrowLeft className="w-4 h-4" /> İlana Dön
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Güvenli Ödeme</h1>
          <p className="text-gray-500 mt-1">Siparişinizi Iyzico ile güvenle tamamlayın.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Sol Kısım: Formlar */}
          <div className="lg:col-span-7 xl:col-span-8">
            <PaymentForm 
              listingId={item.id} 
              price={item.price} 
              currency={item.currency} 
              sellerId={item.seller.id}
              availableCoupons={availableCoupons.map(c => ({
                id: c.id,
                code: c.code,
                discountType: c.discountType,
                discountValue: c.discountValue,
                description: c.description,
                minOrderAmount: c.minOrderAmount
              }))}
            />
          </div>

          {/* Sağ Kısım: Sipariş Özeti */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Sipariş Özeti</h3>
              
              <div className="flex gap-4 mb-6 pb-6 border-b border-gray-100">
                <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                  <Image src={item.images[0]} alt={item.title} fill className="object-cover" />
                </div>
                <div className="flex flex-col justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900 line-clamp-2 leading-tight">{item.title}</h4>
                    <p className="text-xs text-gray-500 mt-1">{item.brand} • {item.size}</p>
                  </div>
                  <p className="font-bold text-indigo-600">{item.price.toLocaleString('tr-TR')} {item.currency}</p>
                </div>
              </div>

              <div className="space-y-4 mb-6 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Ürün Tutarı</span>
                  <span>{item.price.toLocaleString('tr-TR')} {item.currency}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Kargo Ücreti</span>
                  <span className="text-emerald-600 font-medium">Bedava</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Alıcı Koruma Ücreti</span>
                  <span>0,00 {item.currency}</span>
                </div>
              </div>

              <div className="flex justify-between items-center py-4 border-t border-gray-100 mb-6">
                <span className="font-bold text-gray-900">Toplam</span>
                <span className="text-2xl font-extrabold text-indigo-600">{item.price.toLocaleString('tr-TR')} {item.currency}</span>
              </div>

              <div className="bg-emerald-50 text-emerald-800 p-4 rounded-xl text-xs flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 flex-shrink-0 text-emerald-600" />
                <p>
                  <strong>Iyzico + Vesti Güvencesi:</strong> Ödeme Iyzico altyapısı ile alınır, ürün size ulaştığında ve siz onay verdiğinizde satıcıya aktarılır.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
