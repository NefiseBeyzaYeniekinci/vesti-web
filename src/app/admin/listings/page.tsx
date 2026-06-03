import { getAdminListings } from "@/lib/api/admin";
import { DataTable } from "@/components/admin/DataTable";
import { AdminListing } from "@/lib/api/admin";
import { ShoppingBag } from "lucide-react";
import Image from "next/image";

export const metadata = { title: "İlanlar | Vesti Admin" };

const statusLabels: Record<AdminListing["status"], string> = {
  active: "Aktif",
  pending: "Onay Bekliyor",
  rejected: "Reddedildi",
  sold: "Satıldı",
};

const statusColors: Record<AdminListing["status"], string> = {
  active: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  rejected: "bg-red-100 text-red-700",
  sold: "bg-gray-100 text-gray-600",
};

export default async function AdminListingsPage() {
  const listings = await getAdminListings();

  const columns = [
    {
      key: "title",
      header: "İlan",
      render: (l: AdminListing) => (
        <div className="flex items-center gap-3">
          {l.image ? (
            <Image src={l.image} alt={l.title} width={40} height={40} className="rounded-lg object-cover flex-shrink-0" />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
              <ShoppingBag className="w-4 h-4 text-gray-400" />
            </div>
          )}
          <div>
            <p className="font-medium text-gray-800 text-sm">{l.title}</p>
            <p className="text-xs text-gray-400">{l.category}</p>
          </div>
        </div>
      ),
    },
    {
      key: "seller",
      header: "Satıcı",
      render: (l: AdminListing) => <span className="text-gray-700 text-sm">{l.seller}</span>,
    },
    {
      key: "price",
      header: "Fiyat",
      render: (l: AdminListing) => (
        <span className="font-semibold text-gray-800">₺{l.price}</span>
      ),
    },
    {
      key: "status",
      header: "Durum",
      render: (l: AdminListing) => (
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[l.status]}`}>
          {statusLabels[l.status]}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Tarih",
      render: (l: AdminListing) => (
        <span className="text-xs text-gray-500">{new Date(l.createdAt).toLocaleDateString("tr-TR")}</span>
      ),
    },
    {
      key: "actions",
      header: "İşlem",
      render: (l: AdminListing) => (
        <div className="flex gap-2">
          {l.status === "pending" && (
            <>
              <button className="text-xs text-green-600 hover:underline font-medium">Onayla</button>
              <button className="text-xs text-red-500 hover:underline">Reddet</button>
            </>
          )}
          {l.status === "active" && (
            <button className="text-xs text-red-500 hover:underline">Kaldır</button>
          )}
          {(l.status === "rejected" || l.status === "sold") && (
            <span className="text-xs text-gray-400">—</span>
          )}
        </div>
      ),
    },
  ];

  const pendingCount = listings.filter((l) => l.status === "pending").length;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-blue-50">
          <ShoppingBag className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">İlan Yönetimi</h1>
          <p className="text-sm text-gray-500">
            {listings.length} ilan
            {pendingCount > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                {pendingCount} onay bekliyor
              </span>
            )}
          </p>
        </div>
      </div>
      <DataTable columns={columns} data={listings} emptyMessage="İlan bulunamadı" />
    </div>
  );
}
