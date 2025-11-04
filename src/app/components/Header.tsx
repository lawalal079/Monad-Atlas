export default function Header() {
  return (
    <header className="sticky top-0 z-10 w-full border-b border-zinc-200 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-zinc-800 dark:bg-black/80">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="h-6 w-6 rounded bg-primary" aria-hidden />
          <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Monad Ecosystem</span>
        </div>
        <nav className="hidden items-center gap-6 sm:flex">
          <a href="#grid" className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">Explore</a>
          <a href="https://docs.monad.org" target="_blank" className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">Docs</a>
          <a href="https://github.com" target="_blank" className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100">GitHub</a>
          <a href="#submit" className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary/50">Submit dApp</a>
        </nav>
      </div>
    </header>
  );
}
