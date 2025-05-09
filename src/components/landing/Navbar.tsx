"use client";

import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { FiMoon, FiSun } from "react-icons/fi";

export function Navbar() {
  const { theme, setTheme } = useTheme();

  return (
    <nav className="sticky top-0 bg-gray-50 dark:bg-black z-[999] flex min-h-16 w-full items-center border-b border-border-primary bg-background-primary px-[5%] md:min-h-18">
      <div className="mx-auto flex size-full max-w-full items-center justify-between">
        {/* Logo */}
        <a href="#" className="text-xl font-bold">
          Move37
        </a>

        {/* Navigation Items */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            title="Toggle theme"
          >
            {theme === "dark" ? (
              <FiSun className="h-5 w-5" />
            ) : (
              <FiMoon className="h-5 w-5" />
            )}
          </Button>

          {/* Auth Buttons */}
          <Button variant="ghost" size="sm">
            Login
          </Button>
          <Button size="sm">Sign up</Button>
        </div>
      </div>
    </nav>
  );
}
