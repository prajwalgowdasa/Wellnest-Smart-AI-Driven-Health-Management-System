"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";

interface NavbarProps {
  className?: string;
  showMobileMenu?: boolean;
  onMenuClick?: () => void;
}

export function Navbar({
  className,
  showMobileMenu,
  onMenuClick,
}: NavbarProps) {
  return (
    <header
      className={cn(
        "w-full border-b bg-background sticky top-0 z-10",
        className
      )}
    >
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Show menu button on mobile, but make it invisible since we have a floating button */}
          {showMobileMenu && (
            <button
              onClick={onMenuClick}
              className="invisible lg:hidden"
              aria-label="Toggle sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
