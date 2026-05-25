"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/components/AuthProvider";

type SiteHeaderProps = {
  active?: "home" | "practice" | "progress";
};

export function SiteHeader({ active }: SiteHeaderProps) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const userInitial = user?.username.charAt(0).toUpperCase() ?? "?";

  useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  async function handleLogout() {
    setIsLoggingOut(true);
    setIsMenuOpen(false);

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
          {isAuthenticated ? (
            <Link
              className={active === "progress" ? "text-stone-950" : undefined}
              href="/progress"
            >
              Progress
            </Link>
          ) : null}
          <Link href="/#domains">Domains</Link>
        </nav>
        <div className="flex items-center gap-3">
          {isLoading ? (
            <div className="hidden rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs text-stone-500 shadow-sm sm:block">
              Session
            </div>
          ) : isAuthenticated && user ? (
            <div ref={menuRef} className="relative">
              <button
                type="button"
                onClick={() => setIsMenuOpen((open) => !open)}
                aria-haspopup="menu"
                aria-expanded={isMenuOpen}
                className="grid size-9 place-items-center rounded-lg border border-stone-200 bg-white text-sm font-semibold text-[#008080] shadow-sm transition hover:border-stone-300 hover:bg-stone-100 focus:outline-none focus:ring-4 focus:ring-[#008080]/10"
              >
                {userInitial}
              </button>

              {isMenuOpen ? (
                <div
                  role="menu"
                  className="absolute right-0 z-20 mt-2 w-56 overflow-hidden rounded-xl border border-stone-200 bg-white py-1 text-sm shadow-[0_18px_50px_rgba(41,37,36,0.16)]"
                >
                  <div className="border-b border-stone-100 px-3 py-2">
                    <p className="truncate font-medium text-stone-950">
                      {user.username}
                    </p>
                    {user.email ? (
                      <p className="truncate text-xs text-stone-500">
                        {user.email}
                      </p>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    role="menuitem"
                    className="flex w-full cursor-not-allowed items-center justify-between px-3 py-2 text-left text-stone-400"
                    disabled
                  >
                    Account
                    <span className="text-[10px] uppercase tracking-wide">
                      Soon
                    </span>
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    className="flex w-full cursor-not-allowed items-center justify-between px-3 py-2 text-left text-stone-400"
                    disabled
                  >
                    Settings
                    <span className="text-[10px] uppercase tracking-wide">
                      Soon
                    </span>
                  </button>
                  <div className="my-1 border-t border-stone-100" />
                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="flex w-full items-center px-3 py-2 text-left font-medium text-stone-800 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:text-stone-400"
                  >
                    {isLoggingOut ? "Signing out..." : "Sign out"}
                  </button>
                </div>
              ) : null}
            </div>
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
