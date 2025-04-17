"use client";

import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";
import {
  Activity,
  AlertCircle,
  BarChart,
  Calendar,
  FileText,
  MessageSquare,
  Settings,
  User,
} from "lucide-react";
import Link from "next/link";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  onClose?: () => void;
}

export function Sidebar({ className, onClose }: SidebarProps) {
  const handleLinkClick = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <div
      className={cn(
        "pb-12 w-64 h-full overflow-y-auto bg-background",
        className
      )}
    >
      <div className="px-4 py-4 border-b">
        <Logo />
      </div>
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
            Health Dashboard
          </h2>
          <div className="space-y-1">
            <Link
              href="/"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent"
              onClick={handleLinkClick}
            >
              <Activity className="h-4 w-4" />
              <span>Overview</span>
            </Link>
            <Link
              href="/health-records"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent"
              onClick={handleLinkClick}
            >
              <FileText className="h-4 w-4" />
              <span>Health Records</span>
            </Link>
            <Link
              href="/ai-insights"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent"
              onClick={handleLinkClick}
            >
              <BarChart className="h-4 w-4" />
              <span>AI Insights</span>
            </Link>
          </div>
        </div>
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
            Medical Services
          </h2>
          <div className="space-y-1">
            <Link
              href="/appointments"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent"
              onClick={handleLinkClick}
            >
              <Calendar className="h-4 w-4" />
              <span>Appointments</span>
            </Link>
            <Link
              href="/messages"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent"
              onClick={handleLinkClick}
            >
              <MessageSquare className="h-4 w-4" />
              <span>Messages</span>
            </Link>
            <Link
              href="/emergency"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent"
              onClick={handleLinkClick}
            >
              <AlertCircle className="h-4 w-4" />
              <span>Emergency</span>
            </Link>
          </div>
        </div>
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
            Account
          </h2>
          <div className="space-y-1">
            <Link
              href="/profile"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent"
              onClick={handleLinkClick}
            >
              <User className="h-4 w-4" />
              <span>Profile</span>
            </Link>
            <Link
              href="/settings/profile"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:bg-accent"
              onClick={handleLinkClick}
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
