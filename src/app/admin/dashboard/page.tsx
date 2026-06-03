import { getAdminStats } from "@/lib/api/admin";
import { StatCard } from "@/components/admin/StatCard";
import { Users, ShoppingBag, TrendingUp, AlertTriangle, UserPlus, DollarSign } from "lucide-react";

export const metadata = {
  title: "Dashboard | Vesti Admin",
};

export default async function DashboardPage() {
  const stats = await getAdminStats();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Yönetici Paneli</h1>
        <p className="text-gray-500 mt-1">Sistemin genel durumuna bir bakış.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
        <StatCard
          title="Toplam Kullanıcı"
          value={stats.totalUsers.toLocaleString("tr-TR")}
          icon={Users}
          color="purple"
          trend={{ value: 12, label: "geçen aya göre" }}
        />
        <StatCard
          title="Aktif İlan"
          value={stats.activeListings.toLocaleString("tr-TR")}
          icon={ShoppingBag}
          color="blue"
          trend={{ value: 5, label: "geçen haftaya göre" }}
        />
        <StatCard
          title="Toplam Satış"
          value={stats.totalSales.toLocaleString("tr-TR")}
          icon={TrendingUp}
          color="green"
          trend={{ value: 8, label: "bu ay" }}
        />
        <StatCard
          title="Bekleyen Şikayet"
          value={stats.pendingReports}
          subtitle="Acil inceleme gerektiriyor"
          icon={AlertTriangle}
          color="red"
        />
        <StatCard
          title="Bu Haftaki Yeni Üye"
          value={stats.newUsersThisWeek}
          icon={UserPlus}
          color="indigo"
          trend={{ value: 22, label: "geçen haftaya göre" }}
        />
        <StatCard
          title="Bu Ay Gelir"
          value={`₺${stats.revenueThisMonth.toLocaleString("tr-TR")}`}
          icon={DollarSign}
          color="orange"
          trend={{ value: 15, label: "geçen aya göre" }}
        />
      </div>

      {/* Quick Info */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-semibold text-gray-700 mb-4">Hızlı Erişim</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Kullanıcıları Yönet", href: "/admin/users", emoji: "👥" },
            { label: "İlanları Onayla", href: "/admin/listings", emoji: "📋" },
            { label: "Şikayetler", href: "/admin/reports", emoji: "🚨" },
            { label: "Analitik", href: "/admin/analytics", emoji: "📊" },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-100 hover:border-vesti-primary hover:bg-vesti-primary/5 transition-colors text-center"
            >
              <span className="text-2xl">{item.emoji}</span>
              <span className="text-xs font-medium text-gray-600">{item.label}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
