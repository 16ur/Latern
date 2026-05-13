import Link from "next/link";

type SiteHeaderProps = {
  active?: "home" | "practice";
};

export function SiteHeader({ active = "home" }: SiteHeaderProps) {
  return (
    <header className="border-b border-stone-200/80 bg-stone-50/90">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="grid size-7 place-items-center rounded-md bg-emerald-700 text-sm text-white">
            L
          </span>
          <span>Latern</span>
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
          <div className="hidden rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs text-stone-600 shadow-sm sm:block">
            <span className="mr-2 inline-block size-1.5 rounded-full bg-emerald-600" />
            Local session
          </div>
          <div className="grid size-8 place-items-center rounded-full border border-stone-200 bg-white text-xs font-medium text-stone-700">
            EN
          </div>
        </div>
      </div>
    </header>
  );
}
