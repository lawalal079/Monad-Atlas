"use client";

import { useEffect, useMemo, useState } from "react";
import { Header } from "./HeaderBar";
import { FilterBar } from "./filter-bar";
import FeaturedSection from "./FeaturedSection";
import AppCard from "./AppCard";
import SplashScreen from "./SplashScreen";
import type { Project } from "@/app/types";

export default function HomeSearchClient({ projects }: { projects: Project[] }) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"All" | "App" | "Infrastructure">("All");
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);

  const allLabels = useMemo(() => {
    const set = new Set<string>();
    for (const p of projects) {
      for (const l of p.labels ?? []) {
        const key = String(l).trim();
        if (key) set.add(key);
      }
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [projects]);

  const labelsByCategory = useMemo(() => {
    const app = new Set<string>();
    const infra = new Set<string>();
    for (const p of projects) {
      const dest = p.category === "Infrastructure" ? infra : p.category === "App" ? app : null;
      if (!dest) continue;
      for (const l of p.labels ?? []) {
        const key = String(l).trim();
        if (key) dest.add(key);
      }
    }
    const sort = (arr: string[]) => arr.sort((a, b) => a.localeCompare(b));
    return {
      All: allLabels,
      App: sort(Array.from(app)),
      Infrastructure: sort(Array.from(infra)),
    } as Record<"All" | "App" | "Infrastructure", string[]>;
  }, [projects, allLabels]);

  const visibleLabels = useMemo(() => labelsByCategory[selectedCategory], [labelsByCategory, selectedCategory]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return projects.filter((p) => {
      // name search
      if (q && !p.name.toLowerCase().includes(q)) return false;
      // category
      if (selectedCategory !== "All" && p.category !== selectedCategory) return false;
      // labels: match ANY selected label
      if (selectedLabels.length) {
        const pl = (p.labels ?? []).map((x) => x.toLowerCase());
        const hasAny = selectedLabels.some((l) => pl.includes(l.toLowerCase()));
        if (!hasAny) return false;
      }
      return true;
    });
  }, [projects, search, selectedCategory, selectedLabels]);

  const toggleLabel = (label: string) => {
    setSelectedLabels((prev) => {
      const i = prev.findIndex((l) => l.toLowerCase() === label.toLowerCase());
      if (i >= 0) {
        const next = [...prev];
        next.splice(i, 1);
        return next;
      }
      return [...prev, label];
    });
  };

  const [idx, setIdx] = useState(0);
  useEffect(() => {
    setIdx(0);
  }, [search, selectedCategory, selectedLabels]);
  useEffect(() => {
    if (!filtered.length) return;
    const t = setInterval(() => {
      setIdx((i) => (i + 1) % filtered.length);
    }, 6000);
    return () => clearInterval(t);
  }, [filtered.length]);

  const featured = filtered.length ? filtered[idx % filtered.length] : undefined;
  const alts = useMemo(() => {
    if (filtered.length <= 1) return [] as typeof filtered;
    const a: typeof filtered = [];
    const n1 = (idx + 1) % filtered.length;
    a.push(filtered[n1]);
    if (filtered.length > 2) {
      const n2 = (idx + 2) % filtered.length;
      a.push(filtered[n2]);
    }
    return a;
  }, [filtered, idx]);

  return (
    <div className="min-h-screen bg-background dark pb-16 sm:pb-0">
      <SplashScreen />
      <Header search={search} onSearch={setSearch} />
      <FilterBar
        labels={visibleLabels}
        selectedLabels={selectedLabels}
        onToggleLabel={toggleLabel}
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          // prune selected labels to ones available in the chosen category
          const allowed = new Set(labelsByCategory[cat].map((l) => l.toLowerCase()));
          setSelectedLabels((prev) => prev.filter((l) => allowed.has(l.toLowerCase())));
        }}
      />
      {featured && <FeaturedSection key={featured.id} featured={featured} alts={alts} />}
      <div id="grid" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((project) => (
            <AppCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </div>
  );
}
