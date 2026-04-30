"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";


import { DarkModeIcon } from "./ui/icons/DarkModeIcon";
import { LightModeIcon } from "./ui/icons/LightModeIcon";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch (Industry standard trick)
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="w-9 h-9" />;

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-full hover:bg-foreground/10 transition-colors"
      aria-label="Toggle Theme"
    >
      {theme === "dark" ? (
         <LightModeIcon className="text-accent " />
      ) : (
        <DarkModeIcon className=" text-primary " />
      )}
    </button>
  );
}