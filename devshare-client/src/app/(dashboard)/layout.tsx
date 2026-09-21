"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { 
  LayoutDashboard, 
  FileText, 
  PlusCircle, 
  Settings, 
  LogOut,
  Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/Logo";
import { useAuth } from "@/providers/auth-provider";

const menuItems = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "My Blogs", href: "/dashboard/blogs", icon: FileText },
  { name: "Write New", href: "/dashboard/create-blog", icon: PlusCircle },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      router.push("/auth");
    } catch (error: any) {
      toast.error(error.message || "Failed to log out");
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return "DS";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <div className="flex min-h-screen bg-background">

      <aside className="w-64 border-r border-foreground/5 hidden md:flex flex-col sticky top-0 h-screen bg-foreground/[0.02]">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2 mb-10">
            <Logo className="w-8 h-8 text-primary" />
            <span className="font-black tracking-tighter text-lg uppercase">Dev Share</span>
          </Link>

          <nav className="space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.name} href={item.href}>
                  <div className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    isActive 
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                    : "text-foreground/60 hover:bg-foreground/5 hover:text-foreground"
                  }`}>
                    <item.icon size={18} />
                    {item.name}
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-foreground/5">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start gap-3 text-red-500 hover:bg-red-500/10 hover:text-red-500 rounded-xl cursor-pointer"
          >
            <LogOut size={18} />
            Logout
          </Button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col">
        <header className="h-16 border-b border-foreground/5 flex items-center justify-between px-8 bg-background/50 backdrop-blur-md sticky top-0 z-10">
          <h2 className="font-bold text-sm text-foreground/40 uppercase tracking-widest">
            {menuItems.find((i) => i.href === pathname)?.name || "Dashboard"}
          </h2>

          <div className="flex items-center gap-4">
            <button className="p-2 text-foreground/40 hover:text-primary transition-colors relative cursor-pointer">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full border-2 border-background" />
            </button>
            <Link href="/dashboard/settings">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name || "User avatar"}
                  className="w-8 h-8 rounded-full object-cover border border-primary/20"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                  {getInitials(user?.name)}
                </div>
              )}
            </Link>
          </div>
        </header>


        <div className="py-4 px-2 max-w-7xl w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}