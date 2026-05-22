"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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


const menuItems = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "My Blogs", href: "/dashboard/blogs", icon: FileText },
  { name: "Write New", href: "/dashboard/create-blog", icon: PlusCircle },
  // { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

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
          <Button variant="ghost" className="w-full justify-start gap-3 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-xl">
            <LogOut size={18} />
            Logout
          </Button>
        </div>
      </aside>

 
      <main className="flex-1 flex flex-col">
     
        <header className="h-16 border-b border-foreground/5 flex items-center justify-between px-8 bg-background/50 backdrop-blur-md sticky top-0 z-10">
          <h2 className="font-bold text-sm text-foreground/40 uppercase tracking-widest">
            {menuItems.find(i => i.href === pathname)?.name || "Dashboard"}
          </h2>
          
          <div className="flex items-center gap-4">
            <button className="p-2 text-foreground/40 hover:text-primary transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full border-2 border-background" />
            </button>
            <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs">
              AS
            </div>
          </div>
        </header>


        <div className="py-4 px-2 max-w-7xl w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}