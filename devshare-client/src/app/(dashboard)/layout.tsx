"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  Settings,
  LogOut,
  Bell,
  Menu,
  ExternalLink,
  ChevronRight,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/shared/Logo";
import { useAuth } from "@/providers/auth-provider";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/layouts/ThemeToggle";

const menuItems = [
  {
    name: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "My Blogs",
    href: "/dashboard/blogs",
    icon: FileText,
  },
  {
    name: "Write New",
    href: "/dashboard/create-blog",
    icon: PlusCircle,
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

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

  const currentSection =
    menuItems.find((i) => i.href === pathname)?.name || "Dashboard";

  // Reusable Sidebar content for desktop and mobile sheet
  const SidebarNav = ({ onNavigate }: { onNavigate?: () => void }) => (
    <div className="flex flex-col h-full justify-between">
      {/* Brand & Main Menu */}
      <div className="p-5">
        {/* Brand */}
        <Link
          href="/"
          onClick={onNavigate}
          className="flex items-center gap-2.5 px-2 mb-8 group"
        >
          <Logo className="w-8 h-8 text-primary transition-transform group-hover:scale-105" />
          <div className="flex items-center gap-2">
            <span className="font-black tracking-tight text-lg uppercase text-foreground">
              DevShare
            </span>
            <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20">
              Studio
            </span>
          </div>
        </Link>

        {/* Primary Navigation - Clean, un-cluttered */}
        <div className="space-y-1">
          <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-foreground/40 font-mono">
            Menu
          </p>
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onNavigate}
                className="block"
              >
                <div
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-primary text-primary-foreground font-bold shadow-sm shadow-primary/20"
                      : "text-foreground/70 hover:bg-foreground/[0.04] hover:text-foreground"
                  }`}
                >
                  <Icon
                    size={18}
                    className={
                      isActive
                        ? "text-primary-foreground"
                        : "text-foreground/50"
                    }
                  />
                  <span className="flex-1">{item.name}</span>
                  {isActive && (
                    <ChevronRight size={14} className="opacity-80" />
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        {/* Secondary Links */}
        <div className="mt-8 pt-6 border-t border-foreground/5 space-y-1">
          <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-foreground/40 font-mono">
            Community
          </p>
          <Link href="/blogs" onClick={onNavigate} className="block">
            <div className="flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium text-foreground/60 hover:bg-foreground/[0.04] hover:text-foreground transition-all">
              <Globe size={16} className="text-foreground/40" />
              <span className="flex-1">Explore Articles</span>
              <ExternalLink size={12} className="opacity-40" />
            </div>
          </Link>
        </div>
      </div>

      {/* User Footer Card with Clean Popover / Logout */}
      <div className="p-4 border-t border-foreground/5">
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-foreground/[0.03] border border-foreground/5">
          <div className="flex items-center gap-2.5 min-w-0">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name || "User"}
                className="w-8 h-8 rounded-full object-cover border border-primary/20 shrink-0"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary/15 border border-primary/20 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                {getInitials(user?.name)}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-foreground truncate">
                {user?.name || "Developer"}
              </p>
              <p className="text-[10px] text-foreground/40 truncate">
                {user?.email || "contributor"}
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            title="Sign out"
            className="h-8 w-8 text-foreground/40 hover:text-red-500 hover:bg-red-500/10 rounded-lg shrink-0 cursor-pointer transition-colors"
          >
            <LogOut size={15} />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-background">
      {/* DESKTOP SIDEBAR */}
      <aside className="w-64 border-r border-foreground/5 hidden md:flex flex-col sticky top-0 h-screen bg-background/50 z-20 shrink-0">
        <SidebarNav />
      </aside>

      {/* MAIN VIEW */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* SLEEK, PROFESSIONAL HEADER */}
        <header className="h-16 border-b border-foreground/5 flex items-center justify-between px-4 sm:px-8 bg-background/95 backdrop-blur-md sticky top-0 z-30">
          {/* Left: Mobile Toggle & Breadcrumbs */}
          <div className="flex items-center gap-3">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden h-9 w-9 rounded-xl border border-foreground/10 text-foreground/70 cursor-pointer"
                  aria-label="Open mobile menu"
                >
                  <Menu size={18} />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-68 p-0 border-r border-foreground/10 bg-background"
              >
                <SheetHeader className="sr-only">
                  <SheetTitle>Navigation Menu</SheetTitle>
                </SheetHeader>
                <SidebarNav onNavigate={() => setMobileOpen(false)} />
              </SheetContent>
            </Sheet>

            <div className="flex items-center gap-2 text-xs">
              <span className="font-medium text-foreground/40 hidden sm:inline">
                DevShare
              </span>
              <span className="text-foreground/30 hidden sm:inline">/</span>
              <span className="font-bold text-foreground tracking-tight text-sm">
                {currentSection}
              </span>
            </div>
          </div>

          {/* Right: Site Link, Notifications & User Dropdown */}
          <div className="flex items-center gap-3">
            <ThemeToggle />

            <button
              aria-label="View notifications"
              className="p-2 text-foreground/50 hover:text-foreground hover:bg-foreground/5 rounded-lg transition-colors relative cursor-pointer"
              onClick={() => toast.info("No unread notifications")}
            >
              <Bell size={17} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-primary rounded-full" />
            </button>

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  aria-label="User menu"
                  className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-full border border-foreground/10 hover:border-foreground/20 hover:bg-foreground/[0.02] transition-all cursor-pointer outline-none"
                >
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name || "User"}
                      className="w-7 h-7 rounded-full object-cover border border-primary/20"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-primary/15 text-primary font-bold text-xs flex items-center justify-center">
                      {getInitials(user?.name)}
                    </div>
                  )}
                  <span className="text-xs font-bold text-foreground max-w-[110px] truncate hidden md:inline">
                    {user?.name || "Account"}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-52 p-1.5 rounded-2xl border border-foreground/10 bg-background shadow-xl"
              >
                <DropdownMenuLabel className="p-2">
                  <p className="text-xs font-bold text-foreground truncate">
                    {user?.name || "Author"}
                  </p>
                  <p className="text-[11px] text-foreground/50 truncate font-normal">
                    {user?.email || "contributor"}
                  </p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-foreground/5" />
                <DropdownMenuItem asChild>
                  <Link
                    href="/dashboard/blogs"
                    className="flex items-center gap-2.5 px-2.5 py-2 text-xs font-medium rounded-xl cursor-pointer"
                  >
                    <FileText size={14} className="text-foreground/50" />
                    <span>My Publications</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href="/dashboard/settings"
                    className="flex items-center gap-2.5 px-2.5 py-2 text-xs font-medium rounded-xl cursor-pointer"
                  >
                    <Settings size={14} className="text-foreground/50" />
                    <span>Account Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-foreground/5" />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="flex items-center gap-2.5 px-2.5 py-2 text-xs font-semibold text-red-500 hover:text-red-600 hover:bg-red-500/10 rounded-xl cursor-pointer"
                >
                  <LogOut size={14} />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* MAIN BODY */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}