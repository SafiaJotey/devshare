"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronRight, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "./ThemeToggle";
import { MenuIcon } from "../icons/MenuIcon";
import { navItems } from "@/constants/menu";
import { cn } from "@/lib/utils";
import { Logo } from "../shared/Logo";
import UserAccountMenu from "./UserAccountMenu";
import { LoginIcon } from "../icons/LoginIcon";
import { LogoutIcon } from "../icons/LogoutIcon";
import { DashboardIcon } from "../icons/DashboardIcon";
import { SettingsIcon } from "../icons/SettingsIcon";
import { useAuth } from "@/providers/auth-provider";

export default function NavigationBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoggedIn, isLoading, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMobileLogout = async () => {
    try {
      setIsOpen(false);
      await logout();
      toast.success("Logged out successfully");
      router.push("/auth");
    } catch (error: any) {
      toast.error(error.message || "Failed to log out");
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-200 backdrop-blur-md",
        isScrolled
          ? "bg-background/90 border-border/60 shadow-xs"
          : "bg-background/70 border-border/30"
      )}
    >
      <div className="container-box flex h-16 items-center justify-between">
        {/* Brand Logo & Name */}
        <Link
          href="/"
          className="flex items-center gap-2.5 group transition-transform active:scale-95 no-underline hover:no-underline"
        >
          <Logo className="w-9 h-9 text-primary dark:text-accent transition-transform group-hover:scale-105" />
          <span className="font-bold text-lg tracking-tight text-foreground flex items-center gap-1">
            Dev<span className="text-primary">Share</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          <ul className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className={cn(
                      "group relative flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 no-underline hover:no-underline",
                      isActive
                        ? "text-primary font-semibold bg-primary/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
                    )}
                  >
                    <item.icon
                      className={cn(
                        "h-4 w-4 transition-transform duration-200 group-hover:scale-110",
                        isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                      )}
                    />
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="ml-3 pl-3  flex items-center gap-2">
            <ThemeToggle />

            {isLoading ? (
              <div className="w-8 h-8 rounded-full bg-foreground/10 animate-pulse" />
            ) : isLoggedIn ? (
              <UserAccountMenu />
            ) : (
              <Button
                asChild
                size="sm"
                className="rounded-lg px-4 h-9 font-medium shadow-xs hover:shadow-sm"
              >
                <Link
                  href="/auth"
                  className="flex items-center gap-1.5 no-underline hover:no-underline"
                >
                  <LoginIcon className="h-4 w-4" />
                  <span>Sign In</span>
                </Link>
              </Button>
            )}
          </div>
        </nav>

        {/* Mobile Header Actions */}
        <div className="flex items-center md:hidden gap-1.5">
          <ThemeToggle />

          {isLoading ? (
            <div className="w-8 h-8 rounded-full bg-foreground/10 animate-pulse" />
          ) : isLoggedIn ? (
            <UserAccountMenu />
          ) : null}

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-lg border border-border/40 hover:bg-foreground/5 cursor-pointer"
                aria-label="Open navigation menu"
              >
                <MenuIcon className="h-5 w-5 text-foreground" />
              </Button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-[85vw] max-w-[340px] p-0 flex flex-col justify-between bg-background/95 backdrop-blur-xl border-l border-border/50 shadow-2xl"
            >
              <div>
                {/* Mobile Drawer Header */}
                <SheetHeader className="p-4 border-b border-border/40 text-left">
                  <SheetTitle className="flex items-center gap-2 text-base font-semibold">
                    <Logo className="w-7 h-7 text-primary dark:text-accent" />
                    <span className="tracking-tight text-foreground">
                      Dev<span className="text-primary">Share</span>
                    </span>
                  </SheetTitle>
                </SheetHeader>

                {/* Mobile Navigation Links */}
                <div className="p-4 space-y-6">
                  <div>
                    <p className="px-2 mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
                      Navigation
                    </p>
                    <nav className="space-y-1">
                      {navItems.map((item) => {
                        const isActive = pathname === item.path;
                        return (
                          <Link
                            key={item.path}
                            href={item.path}
                            onClick={() => setIsOpen(false)}
                            className={cn(
                              "group flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all no-underline hover:no-underline",
                              isActive
                                ? "bg-primary/10 text-primary font-semibold border border-primary/20"
                                : "text-foreground/80 hover:text-foreground hover:bg-foreground/5 border border-transparent"
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={cn(
                                  "p-2 rounded-lg transition-colors",
                                  isActive
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted/70 text-foreground/70 group-hover:text-foreground group-hover:bg-muted"
                                )}
                              >
                                <item.icon className="h-4 w-4" />
                              </div>
                              <span className="text-sm font-medium">{item.name}</span>
                            </div>
                            <ChevronRight
                              className={cn(
                                "h-4 w-4 transition-transform group-hover:translate-x-0.5",
                                isActive ? "text-primary" : "text-muted-foreground/40"
                              )}
                            />
                          </Link>
                        );
                      })}
                    </nav>
                  </div>

                  {/* Account / Auth Navigation Section */}
                  {isLoggedIn && user ? (
                    <div>
                      <p className="px-2 mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
                        My Account
                      </p>
                      <div className="p-3 mb-2 rounded-xl bg-muted/40 border border-border/40 flex items-center gap-3">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name || "User"}
                            className="h-10 w-10 rounded-full object-cover border border-primary/20"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                            {getInitials(user.name)}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-foreground truncate">
                            {user.name || "Developer"}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>

                      <nav className="space-y-1">
                        <Link
                          href="/dashboard"
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-foreground/5 transition-all no-underline hover:no-underline"
                        >
                          <div className="p-2 rounded-lg bg-muted/70 text-foreground/70">
                            <DashboardIcon className="h-4 w-4" />
                          </div>
                          <span>Dashboard</span>
                        </Link>
                        <Link
                          href="/dashboard/settings"
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-foreground/5 transition-all no-underline hover:no-underline"
                        >
                          <div className="p-2 rounded-lg bg-muted/70 text-foreground/70">
                            <SettingsIcon className="h-4 w-4" />
                          </div>
                          <span>Settings</span>
                        </Link>
                        <button
                          onClick={handleMobileLogout}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-500/10 transition-all cursor-pointer"
                        >
                          <div className="p-2 rounded-lg bg-red-500/10 text-red-500">
                            <LogoutIcon className="h-4 w-4" />
                          </div>
                          <span>Log out</span>
                        </button>
                      </nav>
                    </div>
                  ) : !isLoading ? (
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20">
                      <div className="flex items-center gap-2 text-primary font-semibold text-xs mb-1">
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>Developer Platform</span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                        Share code, explore developer blogs, and showcase your dev journey.
                      </p>
                      <Button
                        asChild
                        className="w-full rounded-xl h-10 font-semibold shadow-xs"
                      >
                        <Link
                          href="/auth"
                          onClick={() => setIsOpen(false)}
                          className="flex items-center justify-center gap-2 no-underline hover:no-underline"
                        >
                          <LoginIcon className="h-4 w-4" />
                          <span>Sign In / Register</span>
                        </Link>
                      </Button>
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Mobile Drawer Footer */}
              <div className="p-4 border-t border-border/40 bg-muted/10 flex items-center justify-between text-xs text-muted-foreground">
                <span>DevShare Community</span>
                <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-muted">v0.1.0</span>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}