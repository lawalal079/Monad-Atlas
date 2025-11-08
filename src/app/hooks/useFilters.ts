"use client";

import { Filters, Project } from "@/app/types";
import { useMemo, useState } from "react";

export function useFilters() {
  const [filters, setFilters] = useState<Filters>({
    search: "",
    categories: new Set(),
    tags: new Set(),
    labels: new Set<string>(),
  });

  const predicate = useMemo(() => {
    const searchLower = filters.search.trim().toLowerCase();

    // Static taxonomy for label groups
    const APP_LABELS = [
      "AI",
      "Betting",
      "DeFi",
      "DePIN",
      "Gaming",
      "Governance",
      "NFT",
      "Other Apps",
      "Payments",
      "Prediction Market",
      "RWA",
      "Social",
    ].map((x) => x.toLowerCase());
    const INFRA_LABELS = [
      "Account Abstraction",
      "Analytics",
      "Cross-Chain",
      "Dev Tooling",
      "Gaming Infra",
      "Identity",
      "Indexer",
      "Onramp",
      "Oracle",
      "Other Infra",
      "Privacy",
      "RPC",
      "Stablecoin",
      "Wallet",
      "Zero-Knowledge",
    ].map((x) => x.toLowerCase());
    const appLabelSet = new Set(APP_LABELS);
    const infraLabelSet = new Set(INFRA_LABELS);

    return (p: Project) => {
      if (searchLower) {
        const hay = `${p.name} ${p.description}`.toLowerCase();
        if (!hay.includes(searchLower)) return false;
      }
      if (filters.categories.size) {
        const wantsApp = filters.categories.has("App" as any);
        const wantsInfra = filters.categories.has("Infrastructure" as any);
        const labelsLower = new Set((p.labels ?? []).map((l) => l.toLowerCase()));
        const hasAppSideLabel = Array.from(labelsLower).some((l) => appLabelSet.has(l));
        const hasInfraSideLabel = Array.from(labelsLower).some((l) => infraLabelSet.has(l));

        const appPass = wantsApp && (p.category === "App" || hasAppSideLabel);
        const infraPass = wantsInfra && (p.category === "Infrastructure" || hasInfraSideLabel);

        if (!(appPass || infraPass || (!wantsApp && !wantsInfra))) return false;
      }
      if (filters.tags.size) {
        const match = p.tags.some((t) => filters.tags.has(t));
        if (!match) return false;
      }
      if (filters.labels.size) {
        const ls = new Set((p.labels ?? []).map((x) => x.toLowerCase()));
        const wants = Array.from(filters.labels).map((x) => x.toLowerCase());
        const match = wants.some((w) => ls.has(w));
        if (!match) return false;
      }
      return true;
    };
  }, [filters]);

  return { filters, setFilters, predicate };
}
