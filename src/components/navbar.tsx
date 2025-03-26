"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

export function Navbar({ className }: { className?: string }) {
  return (
    <header className={cn("w-full border-b bg-background", className)}>
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-4">{/* Left side empty */}</div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
