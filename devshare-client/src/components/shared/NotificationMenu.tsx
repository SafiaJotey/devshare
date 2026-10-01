"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  Heart,
  MessageSquare,
  UserPlus,
  Bookmark,
  Sparkles,
  CheckCheck,
  Check,
  ExternalLink,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/providers/auth-provider";
import {
  getMyNotificationsApi,
  markNotificationReadApi,
  markAllNotificationsReadApi,
  INotification,
  NotificationType,
} from "@/lib/api";

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case "like":
      return <Heart size={14} className="text-rose-500 fill-rose-500/20" />;
    case "comment":
      return <MessageSquare size={14} className="text-sky-500 fill-sky-500/20" />;
    case "follow":
      return <UserPlus size={14} className="text-emerald-500 fill-emerald-500/20" />;
    case "save":
      return <Bookmark size={14} className="text-amber-500 fill-amber-500/20" />;
    case "system":
    default:
      return <Sparkles size={14} className="text-purple-500 fill-purple-500/20" />;
  }
};

const formatRelativeTime = (dateStr: string) => {
  try {
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffMin < 1) return "Just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHour < 24) return `${diffHour}h ago`;
    if (diffDay < 7) return `${diffDay}d ago`;
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch {
    return "";
  }
};

export const NotificationMenu = () => {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");

  const fetchNotifications = useCallback(async () => {
    if (!isLoggedIn) return;
    try {
      setIsLoading(true);
      const res = await getMyNotificationsApi();
      if (res.success && res.data) {
        setNotifications(res.data.notifications || []);
        setUnreadCount(res.data.unreadCount || 0);
      }
    } catch (err) {
      // Quiet fail on network issues
    } finally {
      setIsLoading(false);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Refresh when opened
  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (nextOpen) {
      fetchNotifications();
    }
  };

  const handleMarkAllRead = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
      await markAllNotificationsReadApi();
      toast.success("All notifications marked as read");
    } catch {
      toast.error("Failed to mark notifications as read");
    }
  };

  const handleItemClick = async (notif: INotification) => {
    // If unread, mark as read
    if (!notif.read) {
      setNotifications((prev) =>
        prev.map((n) => (n._id === notif._id ? { ...n, read: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
      try {
        await markNotificationReadApi(notif._id);
      } catch {}
    }

    setOpen(false);

    if (notif.link) {
      router.push(notif.link);
    }
  };

  if (!isLoggedIn) return null;

  const displayedNotifications =
    activeTab === "unread" ? notifications.filter((n) => !n.read) : notifications;

  return (
    <DropdownMenu open={open} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <button
          aria-label="View notifications"
          className="p-2 text-foreground/60 hover:text-foreground hover:bg-foreground/5 rounded-xl transition-all relative cursor-pointer outline-none active:scale-95"
          title="Notifications"
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold font-mono ring-2 ring-background animate-in zoom-in-75 duration-200">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-[340px] sm:w-[380px] p-0 rounded-2xl border border-foreground/10 bg-background/95 backdrop-blur-xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="p-3.5 border-b border-foreground/5 flex items-center justify-between bg-foreground/[0.02]">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-sm text-foreground">Notifications</h4>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-primary/15 text-primary font-mono">
                {unreadCount} new
              </span>
            )}
          </div>

          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="text-xs text-primary hover:underline flex items-center gap-1 cursor-pointer font-medium"
            >
              <CheckCheck size={13} />
              <span>Mark all read</span>
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 px-3 pt-2 pb-1 border-b border-foreground/5 text-xs">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === "all"
                ? "bg-foreground/10 text-foreground font-semibold"
                : "text-foreground/50 hover:text-foreground hover:bg-foreground/5"
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setActiveTab("unread")}
            className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === "unread"
                ? "bg-foreground/10 text-foreground font-semibold"
                : "text-foreground/50 hover:text-foreground hover:bg-foreground/5"
            }`}
          >
            Unread ({unreadCount})
          </button>
        </div>

        {/* Notification List */}
        <div className="max-h-[360px] overflow-y-auto divide-y divide-foreground/5">
          {displayedNotifications.length === 0 ? (
            <div className="py-12 px-6 text-center text-foreground/40 space-y-2">
              <div className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center mx-auto text-foreground/30">
                <Bell size={20} />
              </div>
              <p className="text-xs font-medium text-foreground/70">
                {activeTab === "unread"
                  ? "No unread notifications"
                  : "No notifications yet"}
              </p>
              <p className="text-[11px] text-foreground/40 max-w-xs mx-auto">
                {activeTab === "unread"
                  ? "You are all caught up! Check the 'All' tab for previous updates."
                  : "When someone likes, comments, or follows your publications, you will find updates here."}
              </p>
            </div>
          ) : (
            displayedNotifications.map((item) => (
              <div
                key={item._id}
                onClick={() => handleItemClick(item)}
                className={`p-3.5 flex items-start gap-3 hover:bg-foreground/[0.03] transition-colors cursor-pointer relative group ${
                  !item.read ? "bg-primary/[0.03]" : ""
                }`}
              >
                {/* Type Icon Badge */}
                <div className="w-8 h-8 rounded-xl bg-foreground/5 border border-foreground/10 flex items-center justify-center shrink-0 mt-0.5">
                  {getNotificationIcon(item.type)}
                </div>

                <div className="flex-1 min-w-0 pr-2">
                  <div className="flex items-baseline justify-between gap-2">
                    <p
                      className={`text-xs truncate ${
                        !item.read
                          ? "font-bold text-foreground"
                          : "font-semibold text-foreground/80"
                      }`}
                    >
                      {item.title}
                    </p>
                    <span className="text-[10px] text-foreground/40 font-mono shrink-0">
                      {formatRelativeTime(item.createdAt)}
                    </span>
                  </div>

                  <p className="text-xs text-foreground/60 line-clamp-2 mt-0.5 leading-relaxed">
                    {item.message}
                  </p>
                </div>

                {/* Unread Indicator */}
                {!item.read && (
                  <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2 ring-2 ring-primary/20" />
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-2 border-t border-foreground/5 text-center bg-foreground/[0.01]">
          <span className="text-[10px] text-foreground/30 font-mono">
            DevShare Notification Center
          </span>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationMenu;
