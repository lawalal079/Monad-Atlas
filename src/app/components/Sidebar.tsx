"use client";

import { Category, Filters, Tag } from "@/app/types";
import { useMemo } from "react";

const TAGS: Tag[] = ["Audited", "New", "Trending", "Experimental"];

export default function Sidebar({
  filters,
  onChange,
  labels,
  categories,
}: {
  filters: Filters;
  onChange: (next: Filters) => void;
  labels: string[];
  categories: Category[];
}) {
  const counts = useMemo(() => ({ categories: {}, networks: {}, tags: {} }), [
    filters,
  ]);

  return (
    <aside className="w-full shrink-0 border-zinc-200 sm:w-64 sm:border-r dark:border-zinc-800">
      <div className="sticky top-14">
        <div className="p-4">
          <label className="block text-sm font-medium text-zinc-800 dark:text-zinc-200">
            Search
          </label>
          <input
            type="text"
            placeholder="Search dApps"
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            className="mt-1 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30 dark:border-zinc-800 dark:bg-black"
          />
        </div>

        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
          <div className="mb-2 text-sm font-medium text-zinc-800 dark:text-zinc-200">
            Categories
          </div>
          <div className="flex max-h-48 flex-wrap gap-2 overflow-y-auto pr-1">
            {categories.map((c) => {
              const active = filters.categories.has(c);
              return (
                <button
                  key={c}
                  onClick={() => {
                    const next = new Set(filters.categories);
                    active ? next.delete(c) : next.add(c);
                    onChange({ ...filters, categories: next });
                  }}
                  className={`rounded-md border px-2 py-1 text-xs ${
                    active
                      ? "border-primary bg-primary text-white"
                      : "border-zinc-200 bg-white text-zinc-800 dark:border-zinc-800 dark:bg-black dark:text-zinc-200"
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
          <div className="mb-2 text-sm font-medium text-zinc-800 dark:text-zinc-200">
            Labels
          </div>
          <div className="flex max-h-56 flex-wrap gap-2 overflow-y-auto pr-1">
            {labels.map((l) => {
              const active = filters.labels.has(l);
              return (
                <button
                  key={l}
                  onClick={() => {
                    const next = new Set(filters.labels);
                    active ? next.delete(l) : next.add(l);
                    onChange({ ...filters, labels: next });
                  }}
                  className={`rounded-md border px-2 py-1 text-xs ${
                    active
                      ? "border-primary bg-primary text-white"
                      : "border-zinc-200 bg-white text-zinc-800 dark:border-zinc-800 dark:bg-black dark:text-zinc-200"
                  }`}
                >
                  {l}
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
          <div className="mb-2 text-sm font-medium text-zinc-800 dark:text-zinc-200">
            Tags
          </div>
          <div className="flex max-h-48 flex-wrap gap-2 overflow-y-auto pr-1">
            {TAGS.map((t) => {
              const active = filters.tags.has(t);
              return (
                <button
                  key={t}
                  onClick={() => {
                    const next = new Set(filters.tags);
                    active ? next.delete(t) : next.add(t);
                    onChange({ ...filters, tags: next });
                  }}
                  className={`rounded-md border px-2 py-1 text-xs ${
                    active
                      ? "border-primary bg-primary text-white"
                      : "border-zinc-200 bg-white text-zinc-800 dark:border-zinc-800 dark:bg-black dark:text-zinc-200"
                  }`}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
}
