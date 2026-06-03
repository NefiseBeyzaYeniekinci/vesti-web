"use client";

import { useEffect } from "react";
import { Bell, MessageCircle, Package, CreditCard, Info } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useNotificationStore, AppNotification } from "@/store/notificationStore";

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Az önce";
  if (mins < 60) return `${mins} dakika önce`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} saat önce`;
  const days = Math.floor(hrs / 24);
  return `${days} gün önce`;
}

function NotificationIcon({ type }: { type: AppNotification["type"] }) {
  if (type === "message")
    return <MessageCircle className="w-4 h-4 text-vesti-primary" />;
  if (type === "order")
    return <Package className="w-4 h-4 text-orange-500" />;
  if (type === "payment")
    return <CreditCard className="w-4 h-4 text-green-500" />;
  return <Info className="w-4 h-4 text-blue-500" />;
}

export function NotificationsDropdown() {
  const { notifications, unreadCount, isLoading, fetchNotifications, markAllRead } =
    useNotificationStore();

  useEffect(() => {
    fetchNotifications();
    // Her 2 dakikada bir yenile
    const interval = setInterval(fetchNotifications, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const handleOpen = (open: boolean) => {
    if (open && unreadCount > 0) {
      markAllRead();
    }
  };

  return (
    <DropdownMenu onOpenChange={handleOpen}>
      <DropdownMenuTrigger asChild>
        <button className="text-vesti-text hover:text-vesti-primary transition-colors relative outline-none">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Bildirimler</span>
          {unreadCount > 0 && (
            <span className="text-xs text-red-500 font-normal">
              {unreadCount} okunmamış
            </span>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {isLoading && (
          <div className="px-4 py-6 text-center text-sm text-gray-400">
            Bildirimler yükleniyor...
          </div>
        )}

        {!isLoading && notifications.length === 0 && (
          <div className="px-4 py-6 text-center text-sm text-gray-400">
            <Bell className="w-6 h-6 mx-auto mb-2 text-gray-300" />
            Yeni bildiriminiz yok.
          </div>
        )}

        {!isLoading &&
          notifications.map((notif) => (
            <DropdownMenuItem
              key={notif.id}
              className="cursor-pointer focus:bg-gray-50"
              asChild
            >
              <Link href={notif.href} className="flex gap-3 items-start p-2">
                <div
                  className={`mt-0.5 p-1.5 rounded-full flex-shrink-0 ${
                    !notif.read ? "bg-red-50" : "bg-gray-50"
                  }`}
                >
                  <NotificationIcon type={notif.type} />
                </div>
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span
                    className={`text-sm leading-snug truncate ${
                      !notif.read
                        ? "font-semibold text-vesti-dark"
                        : "font-medium text-gray-700"
                    }`}
                  >
                    {notif.title}
                  </span>
                  <span className="text-xs text-gray-500 line-clamp-2">
                    {notif.description}
                  </span>
                  <span className="text-[10px] text-gray-400 mt-0.5">
                    {relativeTime(notif.createdAt)}
                  </span>
                </div>
                {!notif.read && (
                  <div className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0 mt-1.5" />
                )}
              </Link>
            </DropdownMenuItem>
          ))}

        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <div className="px-3 py-2 text-center">
              <Link
                href="/messages"
                className="text-xs text-vesti-primary hover:underline font-medium"
              >
                Tüm mesajları gör →
              </Link>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
