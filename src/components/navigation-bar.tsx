"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

import { usePathname } from "next/navigation";
import { User, BookOpen, GraduationCap, Video, LogIn } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

const navItems = [
  { name: "About", path: "/about", icon: <User className="h-4 w-4" /> },
  { name: "Blogs", path: "/blogs", icon: <BookOpen className="h-4 w-4" /> },
  { name: "Courses", path: "/courses", icon: <GraduationCap className="h-4 w-4" /> },
  { name: "Tutorials", path: "/tutorials", icon: <Video className="h-4 w-4" /> },
];

export default function NavigationBar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full  bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container-box flex h-16 items-center justify-between px-4">
        {/* Left side - Name */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Safia Ahmed
            </span>
          </Link>
        </motion.div>

        {/* Right side - Navigation */}
        <nav className="flex items-center gap-1 sm:gap-4">
          <motion.ul 
            className="flex items-center gap-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            {navItems.map((item) => (
              <motion.li 
                key={item.path}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  asChild
                  variant="ghost"
                  className={`text-sm gap-1 ${pathname === item.path ? 'text-accent' : 'text-foreground/60 hover:text-foreground'}`}
                >
                  <Link href={item.path}>
                    {item.icon}
                    <span className="hidden sm:inline">{item.name}</span>
                  </Link>
                </Button>
              </motion.li>
            ))}
          </motion.ul>

          <div className="ml-2 flex items-center gap-2">
          <ThemeToggle />
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button variant="outline" size="sm" className="gap-1" asChild>
                <Link href="/login">
                  <LogIn className="h-4 w-4" />
                  <span className="hidden sm:inline">Login</span>
                </Link>
              </Button>
            </motion.div>
        
          </div>
        </nav>
      </div>
    </header>
  );
}