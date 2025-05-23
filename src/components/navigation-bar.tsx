"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { User, BookOpen, GraduationCap, Video, LogIn, Menu, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { useState, useEffect } from "react";

const navItems = [
  { name: "About", path: "/about", icon: <User className="h-4 w-4" /> },
  { name: "Blogs", path: "/blogs", icon: <BookOpen className="h-4 w-4" /> },
  { name: "Courses", path: "/courses", icon: <GraduationCap className="h-4 w-4" /> },
  { name: "Tutorials", path: "/tutorials", icon: <Video className="h-4 w-4" /> },
];

export default function NavigationBar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 w-full transition-all ${isScrolled ? 'bg-background/90 ' : 'bg-background/95'} backdrop-blur supports-[backdrop-filter]:bg-background/60`}>
  
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

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-4">
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
                  variant="link"
                  className={`text-sm gap-1 ${pathname === item.path ? 'text-accent' : `${isScrolled ? 'text-foreground/60 hover:text-foreground' : 'text-foreground'}`}`}
                >

                    
                  <Link href={item.path}>
                    {item.icon}
                    <span>{item.name}</span>
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
                  <span className="hidden lg:inline">Login</span>
                </Link>
              </Button>
            </motion.div>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
            className="text-foreground/60 hover:text-foreground"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden md:hidden"
          >
            <div className="container px-4 pb-4">
              <motion.ul 
                className="flex flex-col gap-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ staggerChildren: 0.05 }}
              >
                {navItems.map((item) => (
                  <motion.li 
                    key={item.path}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                  >
                    <Button
                      asChild
                      variant="ghost"
                      className={`w-full justify-start gap-2 ${pathname === item.path ? 'text-accent' : 'text-foreground/60 hover:text-foreground'}`}
                    >
                      <Link href={item.path}>
                        {item.icon}
                        <span>{item.name}</span>
                      </Link>
                    </Button>
                  </motion.li>
                ))}
                <motion.li
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  className="mt-2"
                >
                  <Button
                    asChild
                    variant="outline"
                    className="w-full justify-start gap-2"
                  >
                    <Link href="/login">
                      <LogIn className="h-4 w-4" />
                      <span>Login</span>
                    </Link>
                  </Button>
                </motion.li>
              </motion.ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}