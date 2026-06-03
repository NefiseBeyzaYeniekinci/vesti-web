import { create } from "zustand";

export interface AppNotification {
  id: string;
  title: string;
  description: string;
  type: "message" | "order" | "payment" | "info";
  href: string;
  read: boolean;
  createdAt: string;
}

interface NotificationState {
  notifications: AppNotification[];
  unreadCount: number;
  isLoading: boolean;
  fetchNotifications: () => Promise<void>;
  markAllRead: () => Promise<void>;
  markRead: (id: string) => void;
  setNotifications: (notifications: AppNotification[]) => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,

  setNotifications: (notifications) => {
    set({
      notifications,
      unreadCount: notifications.filter((n) => !n.read).length,
    });
  },

  fetchNotifications: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch("/api/notifications");
      if (!res.ok) return;
      const data: AppNotification[] = await res.json();
      set({
        notifications: data,
        unreadCount: data.filter((n) => !n.read).length,
        isLoading: false,
      });
    } catch {
      set({ isLoading: false });
    }
  },

  markAllRead: async () => {
    const { notifications } = get();
    // Optimistic update
    set({
      notifications: notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    });
    try {
      await fetch("/api/notifications", { method: "PATCH" });
    } catch {
      // ignore
    }
  },

  markRead: (id: string) => {
    const { notifications } = get();
    const updated = notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
    set({
      notifications: updated,
      unreadCount: updated.filter((n) => !n.read).length,
    });
  },
}));
