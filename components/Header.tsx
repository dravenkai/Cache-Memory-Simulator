import Link from "next/link";
import NavLinks from "./NavLinks";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-surface/80 backdrop-blur">
      <div className="mx-auto grid max-w-6xl grid-cols-[auto_1fr_auto] items-center gap-2 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          {/* <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/15 text-accent">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path
                strokeLinecap="round"
                d="M12 1v3M12 20v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M1 12h3M20 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"
              />
            </svg>
          </span> */}
          <span className="hidden text-base font-semibold tracking-tight sm:inline">
            L1 CacheSimulator
          </span>
        </Link>
        <div className="flex justify-center">
          <NavLinks />
        </div>
        <div className="flex items-center justify-end">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
