export default function Hero() {
  return (
    <section className="w-full border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-black">
      <div className="container-app py-10 sm:py-14">
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">Monad Ecosystem Navigator</h1>
          <p className="max-w-2xl text-zinc-600 dark:text-zinc-400">Discover dApps building on Monad. Filter by category, network, and tags to quickly find what you need.</p>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <a href="#grid" className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-white transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary/50">Explore dApps</a>
            <a href="#submit" className="inline-flex h-10 items-center justify-center rounded-md border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-900 hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-zinc-800 dark:bg-black dark:text-zinc-100 dark:hover:bg-zinc-900">Submit a dApp</a>
          </div>
        </div>
      </div>
    </section>
  );
}
