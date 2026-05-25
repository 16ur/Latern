"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";

type SiteHeaderProps = {
  active?: "home" | "practice";
};

export function SiteHeader({ active }: SiteHeaderProps) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    setIsLoggingOut(true);

    try {
      await logout();
      router.push("/");
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <header className="border-b border-stone-200/80 bg-stone-50/90">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Image
            src="/LATERN_TYPO_BY_MH.svg"
            alt="Latern logo"
            width={80}
            height={80}
          />
        </Link>
        <nav className="hidden items-center gap-7 text-sm text-stone-600 md:flex">
          <Link
            className={active === "home" ? "text-stone-950" : undefined}
            href="/"
          >
            Home
          </Link>
          <Link
            className={active === "practice" ? "text-stone-950" : undefined}
            href="/practice"
          >
            Practice
          </Link>
          <Link href="/#domains">Domains</Link>
        </nav>
        <div className="flex items-center gap-3">
          {isLoading ? (
            <div className="hidden rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs text-stone-500 shadow-sm sm:block">
              Session
            </div>
          ) : isAuthenticated && user ? (
            <>
              <div className="hidden max-w-40 truncate rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs text-stone-600 shadow-sm sm:block">
                {user.username}
              </div>
              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="inline-flex h-9 items-center justify-center rounded-lg border border-stone-200 bg-white px-3 text-sm font-medium text-stone-800 shadow-sm transition hover:border-stone-300 hover:bg-stone-100 disabled:cursor-not-allowed disabled:text-stone-400"
              >
                {isLoggingOut ? "Logging out..." : "Logout"}
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="inline-flex h-9 items-center justify-center rounded-lg border border-stone-200 bg-white px-3 text-sm font-medium text-stone-800 shadow-sm transition hover:border-stone-300 hover:bg-stone-100"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="inline-flex h-9 items-center justify-center rounded-lg bg-[#008080] px-3 text-sm font-medium text-white transition hover:bg-[#006666]"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
