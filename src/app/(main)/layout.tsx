"use client";

import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="grid min-h-screen grid-cols-[auto_1fr] grid-rows-[auto_1fr]">
      {/* Sidebar in the first column, spanning both rows */}
      <div className="row-span-2 border-r">
        <Sidebar />
      </div>

      {/* Navbar in the second column, first row */}
      <div>
        <Navbar />
      </div>

      {/* Main content in the second column, second row */}
      <main className="p-6">{children}</main>
    </div>
  );
}
