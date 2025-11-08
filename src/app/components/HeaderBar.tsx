"use client";

import dynamic from "next/dynamic";

const Logo3D = dynamic(() => import("./Logo3D").then(m => m.default), {
  ssr: false,
});

export function Header({
  search,
  onSearch,
}: {
  search?: string;
  onSearch?: (value: string) => void;
}) {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-4 sm:gap-8">
        {/* Logo */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="relative w-10 h-10 rounded-lg overflow-hidden">
            <Logo3D ambientIntensity={0.8} dirIntensity={1.0} stageIntensity={0.7} />
          </div>
          <span className="text-white font-bold text-lg tracking-wide">Mon@las</span>
        </div>

        {/* Search Bar */}
        <div className="w-full sm:flex-1 sm:max-w-2xl">
          <div className="relative">
            <svg
              viewBox="0 0 24 24"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground fill-current"
              aria-hidden
            >
              <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
            <input
              type="text"
              placeholder="Search the ecosystem..."
              className="w-full pl-10 pr-10 py-2 bg-muted/50 text-foreground placeholder-muted-foreground rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
              value={search ?? undefined}
              onChange={(e) => onSearch?.(e.target.value)}
            />
            {(search ?? "").length > 0 && (
              <button
                type="button"
                aria-label="Clear search"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted/70 text-muted-foreground hover:text-foreground transition"
                onClick={() => onSearch?.("")}
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden>
                  <path fill="currentColor" d="M18.3 5.71a1 1 0 0 0-1.41 0L12 10.59 7.11 5.7A1 1 0 0 0 5.7 7.11L10.59 12l-4.9 4.89a1 1 0 1 0 1.41 1.42L12 13.41l4.89 4.9a1 1 0 0 0 1.42-1.41L13.41 12l4.9-4.89a1 1 0 0 0-.01-1.4z"/>
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex items-center gap-4 overflow-x-auto sm:gap-6 flex-shrink-0">
          <a
            href="#grid"
            className="text-foreground hover:text-primary transition-colors text-sm"
            onClick={(e) => {
              e.preventDefault();
              const el = document.getElementById("grid");
              if (el) {
                el.scrollIntoView({ behavior: "smooth", block: "start" });
                history.replaceState(null, "", "#grid");
              } else {
                location.hash = "grid";
              }
            }}
          >
            Explore
          </a>
          <a
            href="https://docs.monad.xyz/"
            target="_blank"
            rel="noreferrer noopener"
            className="text-foreground hover:text-primary transition-colors text-sm"
          >
            Docs
          </a>
          <a
            href="https://github.com/lawalal079/Monad-Atlas"
            target="_blank"
            rel="noreferrer noopener"
            className="text-foreground hover:text-primary transition-colors text-sm"
          >
            Github
          </a>
          <span
            className="px-6 py-2 rounded-full font-medium text-sm bg-primary/20 text-primary-foreground/70 border border-border/60 cursor-not-allowed select-none pointer-events-none"
            aria-disabled="true"
            role="button"
            tabIndex={-1}
          >
            Coming Soon
          </span>
        </nav>
      </div>
    </header>
  )
}
