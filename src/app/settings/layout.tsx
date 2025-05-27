"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  Bell,
  ChevronLeft,
  Contact,
  HelpCircle,
  Home,
  Key,
  Menu,
  Phone,
  Shield,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

interface SettingsLayoutProps {
  children: React.ReactNode;
}

const sidebarNavItems = [
  {
    title: "Profile",
    href: "/settings/profile",
    icon: User,
  },
  {
    title: "Emergency Contacts",
    href: "/settings/emergency-contacts",
    icon: Phone,
  },
  {
    title: "Notifications",
    href: "/settings/notifications",
    icon: Bell,
  },
  {
    title: "Privacy & Security",
    href: "/settings/privacy",
    icon: Shield,
  },
  {
    title: "Password",
    href: "/settings/password",
    icon: Key,
  },
  {
    title: "Help & Support",
    href: "/settings/help",
    icon: HelpCircle,
  },
];

const SideNav = ({ className }: { className?: string }) => {
  const pathname = usePathname();

  return (
    <nav className={cn("flex flex-col gap-2", className)}>
      <Link
        href="/settings/profile"
        className={cn(
          "flex w-full items-center gap-2 rounded-md border p-3 text-sm font-medium transition-colors hover:bg-accent",
          pathname === "/settings/profile"
            ? "bg-primary text-primary-foreground hover:bg-primary/90"
            : "bg-background hover:text-accent-foreground"
        )}
      >
        <User className="h-4 w-4" />
        <span>Profile</span>
      </Link>
      <Link
        href="/settings/emergency-contacts"
        className={cn(
          "flex w-full items-center gap-2 rounded-md border p-3 text-sm font-medium transition-colors hover:bg-accent",
          pathname === "/settings/emergency-contacts"
            ? "bg-primary text-primary-foreground hover:bg-primary/90"
            : "bg-background hover:text-accent-foreground"
        )}
      >
        <Contact className="h-4 w-4" />
        <span>Emergency Contacts</span>
      </Link>
      <Link
        href="/settings/notifications"
        className={cn(
          "flex w-full items-center gap-2 rounded-md border p-3 text-sm font-medium transition-colors hover:bg-accent",
          pathname === "/settings/notifications"
            ? "bg-primary text-primary-foreground hover:bg-primary/90"
            : "bg-background hover:text-accent-foreground"
        )}
      >
        <Bell className="h-4 w-4" />
        <span>Notifications</span>
      </Link>
    </nav>
  );
};

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-6 p-4 md:p-10 pb-16 block">
      {/* Navigation buttons */}
      <div className="flex items-center gap-2 mb-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.back()}
          title="Go back"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" asChild title="Go to dashboard">
          <Link href="../">
            <Home className="h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <Separator className="my-6" />

      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="hidden md:block w-64">
          <SideNav className="flex flex-col gap-2" />
        </aside>

        {/* Mobile Navigation */}
        <div className="flex items-center md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="h-10 w-10 mb-3">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[250px] sm:w-[300px]">
              <SideNav className="flex flex-col gap-2 mt-6" />
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
