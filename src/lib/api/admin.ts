export interface AdminStats {
  totalUsers: number;
  activeListings: number;
  totalSales: number;
  pendingReports: number;
  newUsersThisWeek: number;
  revenueThisMonth: number;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "user" | "admin";
  status: "active" | "banned" | "pending";
  joinedAt: string;
  listingCount: number;
}

export interface AdminListing {
  id: string;
  title: string;
  seller: string;
  price: number;
  category: string;
  status: "active" | "pending" | "rejected" | "sold";
  createdAt: string;
  image?: string;
}

const MOCK_STATS: AdminStats = {
  totalUsers: 1284,
  activeListings: 342,
  totalSales: 891,
  pendingReports: 7,
  newUsersThisWeek: 48,
  revenueThisMonth: 12450,
};

const MOCK_USERS: AdminUser[] = [
  { id: "u1", name: "Ayşe Kaya", email: "ayse@example.com", role: "user", status: "active", joinedAt: "2025-01-15", listingCount: 5 },
  { id: "u2", name: "Elif Tekin", email: "elif@example.com", role: "user", status: "active", joinedAt: "2025-02-03", listingCount: 12 },
  { id: "u3", name: "Zeynep Arslan", email: "zeynep@example.com", role: "user", status: "banned", joinedAt: "2025-01-28", listingCount: 0 },
  { id: "u4", name: "Merve Şahin", email: "merve@example.com", role: "user", status: "active", joinedAt: "2025-03-01", listingCount: 3 },
  { id: "u5", name: "Ceren Yıldız", email: "ceren@example.com", role: "user", status: "pending", joinedAt: "2025-03-20", listingCount: 0 },
  { id: "u6", name: "Burak Demir", email: "burak@example.com", role: "user", status: "active", joinedAt: "2025-02-14", listingCount: 8 },
  { id: "u7", name: "Ali Öztürk", email: "ali@example.com", role: "admin", status: "active", joinedAt: "2024-12-01", listingCount: 0 },
];

const MOCK_LISTINGS: AdminListing[] = [
  { id: "l1", title: "Zara Keten Blazer - Bej", seller: "Ayşe Kaya", price: 350, category: "Ceket", status: "active", createdAt: "2025-03-10", image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=60&h=60&fit=crop" },
  { id: "l2", title: "Mango Midi Etek - Siyah", seller: "Elif Tekin", price: 180, category: "Etek", status: "pending", createdAt: "2025-03-18", image: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=60&h=60&fit=crop" },
  { id: "l3", title: "H&M Denim Ceket", seller: "Merve Şahin", price: 220, category: "Ceket", status: "active", createdAt: "2025-03-05" },
  { id: "l4", title: "Koton Yazlık Elbise", seller: "Ceren Yıldız", price: 150, category: "Elbise", status: "sold", createdAt: "2025-02-28" },
  { id: "l5", title: "Defacto Spor Takım", seller: "Burak Demir", price: 280, category: "Spor", status: "pending", createdAt: "2025-03-22" },
  { id: "l6", title: "Beymen Triko Kazak", seller: "Ayşe Kaya", price: 490, category: "Kazak", status: "rejected", createdAt: "2025-03-01" },
];

export async function getAdminStats(): Promise<AdminStats> {
  return MOCK_STATS;
}

export async function getAdminUsers(): Promise<AdminUser[]> {
  return MOCK_USERS;
}

export async function getAdminListings(): Promise<AdminListing[]> {
  return MOCK_LISTINGS;
}
