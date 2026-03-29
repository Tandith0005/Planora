"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Bell, CheckCheck, Clock, Loader2, BellOff, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import {
  getMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  INotification,
  deleteAllNotificationsAsRead,
} from "@/src/services/notification.service";
import { useAuth } from "@/src/hooks/useAuth";
import { useRouter } from "next/navigation";
import { formatDate } from "@/src/utils/formatDate";

export default function NotificationsPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["notifications", page],
    queryFn: () => getMyNotifications(page, 10),
    enabled: isAuthenticated,
  });

  const markReadMutation = useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications-count"] });
    },
  });

  const markAllMutation = useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      toast.success("All notifications marked as read");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications-count"] });
    },
  });

  const deleteAllMutation = useMutation({
    mutationFn: deleteAllNotificationsAsRead,
    onSuccess: () => {
      toast.success("All notifications cleared");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications-count"] });
    },
    onError: () => toast.error("Failed to delete notifications"),
  });

  if (!isAuthenticated) {
    router.push("/login");
    return null;
  }

  const notifications = data?.data ?? [];
  const meta = data?.meta;
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0f] to-[#050508] pt-28 pb-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-white flex items-center gap-3">
              <Bell className="w-7 h-7 text-violet-400" />
              Notifications
            </h1>
            {unreadCount > 0 && (
              <p className="text-zinc-500 text-sm mt-1">
                You have{" "}
                <span className="text-violet-400 font-semibold">
                  {unreadCount} unread
                </span>{" "}
                notification{unreadCount > 1 ? "s" : ""}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={() => markAllMutation.mutate()}
                disabled={markAllMutation.isPending}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-violet-600/20 hover:bg-violet-600/30 text-violet-400 border border-violet-500/30 rounded-xl transition-all"
              >
                {markAllMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCheck className="w-4 h-4" />
                )}
                Mark all read
              </button>
            )}

            {notifications.length > 0 && (
              <button
                onClick={() => {
                  if (
                    confirm("Delete all notifications? This can't be undone.")
                  ) {
                    deleteAllMutation.mutate();
                  }
                }}
                disabled={deleteAllMutation.isPending}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl transition-all"
              >
                {deleteAllMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                Clear all
              </button>
            )}
          </div>
        </div>

        {/* Notification List */}
        <div className="space-y-3">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="bg-[#111118] border border-white/5 rounded-2xl p-5 animate-pulse"
              >
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-white/5 rounded w-1/3" />
                    <div className="h-3 bg-white/5 rounded w-full" />
                    <div className="h-3 bg-white/5 rounded w-2/3" />
                  </div>
                </div>
              </div>
            ))
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                <BellOff className="w-9 h-9 text-zinc-600" />
              </div>
              <p className="text-white font-semibold text-lg">All caught up!</p>
              <p className="text-zinc-600 text-sm mt-1">
                No notifications yet.
              </p>
            </div>
          ) : (
            notifications.map((notif: INotification) => (
              <div
                key={notif.id}
                onClick={() => {
                  if (!notif.isRead) markReadMutation.mutate(notif.id);
                }}
                className={`group relative bg-[#111118] border rounded-2xl p-5 transition-all cursor-pointer hover:bg-[#16161f] ${
                  notif.isRead
                    ? "border-white/5"
                    : "border-violet-500/30 shadow-sm shadow-violet-500/10"
                }`}
              >
                {/* Unread dot */}
                {!notif.isRead && (
                  <span className="absolute top-5 right-5 w-2 h-2 bg-violet-500 rounded-full" />
                )}

                <div className="flex gap-4">
                  {/* Icon */}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      notif.isRead
                        ? "bg-white/5"
                        : "bg-gradient-to-br from-violet-500/20 to-indigo-500/20 border border-violet-500/20"
                    }`}
                  >
                    <Bell
                      className={`w-4 h-4 ${notif.isRead ? "text-zinc-600" : "text-violet-400"}`}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-semibold mb-0.5 ${notif.isRead ? "text-zinc-400" : "text-white"}`}
                    >
                      {notif.title}
                    </p>
                    <p className="text-sm text-zinc-500 leading-relaxed">
                      {notif.message}
                    </p>
                    <div className="flex items-center gap-1.5 mt-2 text-xs text-zinc-600">
                      <Clock className="w-3 h-3" />
                      {formatDate(notif.createdAt)}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {meta && meta.totalPage > 1 && (
          <div className="flex items-center justify-center gap-3 mt-8">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 text-sm font-medium bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white rounded-xl border border-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              Previous
            </button>
            <span className="text-sm text-zinc-600">
              {page} / {meta.totalPage}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(meta.totalPage, p + 1))}
              disabled={page === meta.totalPage}
              className="px-4 py-2 text-sm font-medium bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white rounded-xl border border-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
