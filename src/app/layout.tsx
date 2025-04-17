// src/app/layout.tsx
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";
import { Metadata } from "next";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "HealthTrack",
  description: "Healthcare management system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          {children}
          <Toaster />
          <ToastContainer position="top-right" autoClose={5000} />
        </Providers>
      </body>
    </html>
  );
}
