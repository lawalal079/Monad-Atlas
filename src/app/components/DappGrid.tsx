import AppCard from "@/app/components/AppCard";
import { Project } from "@/app/types";

export default function DappGrid({ projects }: { projects: Project[] }) {
  if (!projects.length) {
    return (
      <div className="flex w-full items-center justify-center rounded-lg border border-dashed border-zinc-200 p-10 text-sm text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
        No dApps match your filters.
      </div>
    );
  }

  return (
    <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((p) => (
        <AppCard key={p.id} project={p} />
      ))}
    </div>
  );
}
