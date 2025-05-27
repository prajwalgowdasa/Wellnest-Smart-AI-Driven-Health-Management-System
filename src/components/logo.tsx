"use client";

import { Heart } from "lucide-react";

export function Logo() {
  return (
    <div className="flex items-center">
      <Heart className="h-6 w-6 text-primary fill-primary" />
      <div className="flex flex-col ml-2">
        <span className="font-semibold text-xl leading-tight">Wellnest</span>
        <span className="text-[0.65rem] text-muted-foreground leading-none">
          Smart AI-Driven Health Management System
        </span>
      </div>
    </div>
  );
}
