"use client";

import { Heart } from "lucide-react";

export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <Heart className="h-6 w-6 text-primary fill-primary" />
      <span className="font-semibold text-xl">HealthTrack</span>
    </div>
  );
}
