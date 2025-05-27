"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    router.push("/dashboard");
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Loading...</h1>
        <p className="text-slate-300">Redirecting to dashboard...</p>
      </div>
    </div>
  );
}
