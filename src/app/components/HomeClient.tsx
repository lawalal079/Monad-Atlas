"use client";

import Header from "@/app/components/Header";
import Hero from "@/app/components/Hero";
import Sidebar from "@/app/components/Sidebar";
import DappGrid from "@/app/components/DappGrid";
import { useFilters } from "@/app/hooks/useFilters";
import { Category, Project } from "@/app/types";

export default function HomeClient({ projects }: { projects: Project[] }) {
  const { filters, setFilters, predicate } = useFilters();
  const filtered = projects.filter(predicate);

  const categories = Array.from(
    new Set(projects.map((p) => p.category))
  ) as Category[];
  const labelsApp = new Set<string>();
  const labelsInfra = new Set<string>();
  for (const p of projects) {
    const ls = p.labels ?? [];
    if (p.category === "App") {
      ls.forEach((l) => labelsApp.add(l));
    } else if (p.category === "Infrastructure") {
      ls.forEach((l) => labelsInfra.add(l));
    }
  }
  let labels: string[];
  if (filters.categories.size === 1 && filters.categories.has("App" as Category)) {
    labels = Array.from(labelsApp);
  } else if (
    filters.categories.size === 1 &&
    filters.categories.has("Infrastructure" as Category)
  ) {
    labels = Array.from(labelsInfra);
  } else {
    labels = Array.from(new Set([...labelsApp, ...labelsInfra]));
  }

  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900 dark:bg-black dark:text-zinc-100">
      <Header />
      <Hero />
      <main className="container-app" id="grid">
        <div className="flex gap-6 py-8">
          <Sidebar filters={filters} onChange={setFilters} categories={categories} labels={labels} />
          <div className="min-w-0 flex-1">
            <div className="mb-4 text-sm text-zinc-600 dark:text-zinc-400">
              Showing {filtered.length} of {projects.length}
            </div>
            <DappGrid projects={filtered} />
          </div>
        </div>
      </main>
    </div>
  );
}
