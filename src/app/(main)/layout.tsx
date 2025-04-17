"use client";

import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Function to check if screen size is mobile
  const checkIfMobile = () => {
    setIsMobile(window.innerWidth < 1024);
    if (window.innerWidth >= 1024) {
      setSidebarOpen(true);
    } else {
      setSidebarOpen(false);
    }
  };

  // Handle window resize events
  useEffect(() => {
    // Set initial state
    checkIfMobile();

    // Add event listener for window resize
    window.addEventListener("resize", checkIfMobile);

    // Clean up event listener
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  return (
    <div className="min-h-screen">
      {/* Mobile sidebar toggle button */}
      {isMobile && (
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="fixed top-3 left-3 z-50 rounded-md bg-primary p-2 text-white shadow-md lg:hidden"
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      )}

      {/* Main layout with conditional responsive classes */}
      <div
        className="grid min-h-screen grid-rows-[auto_1fr]
                     lg:grid-cols-[auto_1fr] lg:grid-rows-[auto_1fr]"
      >
        {/* Sidebar - hidden on mobile when closed */}
        <div
          className={`
          fixed inset-0 z-40 transform bg-white transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:static lg:row-span-2 lg:z-0 lg:flex lg:translate-x-0 lg:border-r lg:bg-transparent
          dark:bg-sidebar
        `}
        >
          <Sidebar onClose={() => isMobile && setSidebarOpen(false)} />
        </div>

        {/* Backdrop for mobile sidebar */}
        {sidebarOpen && isMobile && (
          <div
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Navbar - full width on mobile */}
        <div className="row-start-1 col-start-1 col-span-2 lg:col-start-2 lg:col-span-1">
          <Navbar
            showMobileMenu={isMobile}
            onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          />
        </div>

        {/* Main content - full width on mobile */}
        <main className="col-span-2 lg:col-start-2 lg:col-span-1 p-6 pt-16 lg:pt-6">
          {children}
        </main>
      </div>
    </div>
  );
}
