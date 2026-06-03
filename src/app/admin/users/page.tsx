import { getAdminUsers } from "@/lib/api/admin";
import { DataTable } from "@/components/admin/DataTable";
import { AdminUser } from "@/lib/api/admin";
import { Users } from "lucide-react";

export const metadata = { title: "Kullanıcılar | Vesti Admin" };

const statusLabels: Record<AdminUser["status"], string> = {
  active: "Aktif",
  banned: "Yasaklı",
  pending: "Beklemede",
};

const statusColors: Record<AdminUser["status"], string> = {
  active: "bg-green-100 text-green-700",
  banned: "bg-red-100 text-red-700",
  pending: "bg-yellow-100 text-yellow-700",
};

export default async function AdminUsersPage() {
  const users = await getAdminUsers();

  const columns = [
    {
      key: "name",
      header: "Kullanıcı",
      render: (u: AdminUser) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-vesti-primary/20 flex items-center justify-center text-vesti-primary font-bold text-xs flex-shrink-0">
            {u.name[0]}
          </div>
          <div>
            <p className="font-medium text-gray-800 text-sm">{u.name}</p>
            <p className="text-xs text-gray-400">{u.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      header: "Rol",
      render: (u: AdminUser) => (
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${u.role === "admin" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-600"}`}>
          {u.role === "admin" ? "Admin" : "Kullanıcı"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Durum",
      render: (u: AdminUser) => (
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[u.status]}`}>
          {statusLabels[u.status]}
        </span>
      ),
    },
    {
      key: "listingCount",
      header: "İlan",
      render: (u: AdminUser) => <span className="text-gray-600">{u.listingCount}</span>,
    },
    {
      key: "joinedAt",
      header: "Kayıt Tarihi",
      render: (u: AdminUser) => (
        <span className="text-gray-500 text-xs">{new Date(u.joinedAt).toLocaleDateString("tr-TR")}</span>
      ),
    },
    {
      key: "actions",
      header: "İşlem",
      render: (u: AdminUser) => (
        <div className="flex gap-2">
          <button className="text-xs text-vesti-primary hover:underline">Düzenle</button>
          {u.status !== "banned" && (
            <button className="text-xs text-red-500 hover:underline">Yasakla</button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-xl bg-purple-50">
          <Users className="w-5 h-5 text-purple-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Kullanıcılar</h1>
          <p className="text-sm text-gray-500">{users.length} kayıtlı kullanıcı</p>
        </div>
      </div>
      <DataTable columns={columns} data={users} emptyMessage="Kullanıcı bulunamadı" />
    </div>
  );
}
