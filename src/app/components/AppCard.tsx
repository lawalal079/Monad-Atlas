"use client";

import Tag from "@/app/components/Tag";
import { Project } from "@/app/types";
import { useMemo } from "react";

export default function AppCard({ project }: { project: Project }) {
  const logoSrc = useMemo(() => project.logo ?? "", [project.logo]);

  return (
    <div
      className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white p-4 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:ring-1 hover:ring-primary/30 dark:border-zinc-800 dark:bg-zinc-950"
    >
      {/* Crystalline glow layer */}
      <div
        className="pointer-events-none absolute inset-0 z-0 rounded-[inherit] opacity-70 mix-blend-screen"
        style={{
          backgroundImage:
            "radial-gradient(100px 80px at 20% 25%, rgba(168,85,247,0.28), transparent 60%)," +
            "radial-gradient(160px 120px at 80% 40%, rgba(99,102,241,0.22), transparent 60%)," +
            "radial-gradient(140px 110px at 60% 80%, rgba(56,189,248,0.18), transparent 60%)",
          backgroundColor: "transparent",
          filter: "saturate(120%)",
        }}
      />
      {/* Inner border glow */}
      <div className="pointer-events-none absolute inset-0 z-0 rounded-[inherit] ring-1 ring-primary/20 shadow-[inset_0_0_40px_rgba(167,139,250,0.25)]" />
      <div className="relative z-10 flex-1">
        <div className="flex items-start gap-3">
          {logoSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoSrc}
              alt=""
              className="h-10 w-10 rounded-md border border-zinc-200 object-cover dark:border-zinc-800"
              loading="lazy"
              referrerPolicy="no-referrer"
              crossOrigin="anonymous"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-md border border-zinc-200 bg-zinc-50 text-sm font-semibold text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
              {project.name.slice(0, 2).toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {project.name}
            </div>
            <div className="mt-1 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
              {project.description}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {project.labels?.map((l) => (
                <Tag key={`label-${l}`}>{l}</Tag>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <a
          href={project.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-3 text-xs font-medium text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          Visit
        </a>
        {project.docsUrl && (
          <a
            href={project.docsUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-9 items-center justify-center rounded-md border border-zinc-200 bg-white px-3 text-xs font-medium text-zinc-900 hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-primary/30 dark:border-zinc-800 dark:bg-black dark:text-zinc-100 dark:hover:bg-zinc-900"
          >
            Docs
          </a>
        )}
      </div>
    </div>
  );
}
