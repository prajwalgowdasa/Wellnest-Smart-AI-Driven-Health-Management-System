"use client";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-700 dark:from-slate-950 dark:to-slate-900">
      {children}
    </div>
  );
}
