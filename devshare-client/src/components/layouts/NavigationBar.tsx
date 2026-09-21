"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

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
import { useAuth } from "@/providers/auth-provider";

export default function NavigationBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn, isLoading } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getLinkClassName = (path: string) => {
    const isActive = pathname === path;
    return cn(
      "transition-colors gap-2",
      isActive
        ? "text-primary"
        : isScrolled
        ? "text-foreground/60 hover:text-foreground"
        : "text-foreground"
    );
  };

  const AuthControl = () => {
    if (isLoading) {
      return (
        <div className="w-8 h-8 rounded-full bg-foreground/10 animate-pulse" />
      );
    }
    if (isLoggedIn) {
      return <UserAccountMenu />;
    }
    return (
      <Link href="/auth">
        <LoginIcon className="text-foreground cursor-pointer" />
      </Link>
    );
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all backdrop-blur supports-[backdrop-filter]:bg-background/60",
        isScrolled ? "bg-background/90 " : "bg-background/95"
      )}
    >
      <div className="container-box flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Logo className="text-primary dark:text-accent" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-4">
          <ul className="flex items-center gap-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <Button asChild variant="link" className={getLinkClassName(item.path)}>
                  <Link href={item.path}>
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                </Button>
              </li>
            ))}
          </ul>

          <div className="ml-2 flex items-center gap-2">
            <ThemeToggle />
            <AuthControl />
          </div>
        </nav>

        {/* Mobile Header Actions */}
        <div className="flex items-center md:hidden gap-1">
          <div className="flex items-center gap-1 mr-2">
            <AuthControl />
            <ThemeToggle />
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-foreground/60">
                <MenuIcon className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="top"
              className="h-screen w-full pt-12 flex flex-col bg-background/95 backdrop-blur-md"
            >
              <SheetHeader>
                <SheetTitle className="text-left p-0 gap-0">
                  <Logo className="text-primary dark:text-accent" />
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <Button
                    key={item.path}
                    asChild
                    variant="ghost"
                    className={cn("w-full justify-start text-lg", getLinkClassName(item.path))}
                  >
                    <Link href={item.path}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  </Button>
                ))}

                {!isLoading && !isLoggedIn && (
                  <Button asChild className="mt-4 rounded-xl h-12 font-bold">
                    <Link href="/auth">Sign In</Link>
                  </Button>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}