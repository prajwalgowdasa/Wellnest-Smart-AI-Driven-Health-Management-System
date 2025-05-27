"use client";

import { Button } from "@/components/button";
import { cn } from "@/lib/utils";
import * as React from "react";

interface ActionBarProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export function ActionBar({ children, className, ...props }: ActionBarProps) {
  return (
    <div
      className={cn(
        "sticky bottom-0 z-10 flex w-full items-center justify-between border-t bg-background p-4",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-2">{children}</div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm">
          Cancel
        </Button>
        <Button size="sm">Save</Button>
      </div>
    </div>
  );
}
