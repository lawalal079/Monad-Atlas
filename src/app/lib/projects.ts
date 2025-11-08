import raw from "@/data/projects_raw.json";
import type { Category, Network, Project, Tag } from "@/app/types";
import overridesRaw from "@/data/overrides.json";
import fs from "fs";
import path from "path";

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

function normalizeName(s: string) {
  return slugify(s);
}

function makeLogoCandidates(projectUrl?: string, twitterUrl?: string, githubUrl?: string, slug?: string): string[] {
  const cands: string[] = [];
  const push = (s?: string) => {
    if (s && !cands.includes(s)) cands.push(s);
  };

  // External CDN (e.g., GitHub Pages) override
  const cdnBase = process.env.NEXT_PUBLIC_LOGO_CDN_BASE?.replace(/\/$/, "");
  if (slug && cdnBase) {
    push(`${cdnBase}/logos/${slug}.png`);
    push(`${cdnBase}/logos/${slug}.jpg`);
    push(`${cdnBase}/logos/${slug}.jpeg`);
    push(`${cdnBase}/logos/${slug}.webp`);
    push(`${cdnBase}/logos/${slug}.svg`);
    push(`${cdnBase}/logos/${slug}.ico`);
  }

  // Local, manually provided overrides first (placed in public/logos)
  if (slug) {
    push(`/logos/${slug}.png`);
    push(`/logos/${slug}.jpg`);
    push(`/logos/${slug}.jpeg`);
    push(`/logos/${slug}.webp`);
    push(`/logos/${slug}.svg`);
    push(`/logos/${slug}.ico`);
  }

  // Domain-based candidates
  if (projectUrl) {
    try {
      const u = new URL(projectUrl);
      const base = u.origin;
      const host = u.hostname;
      push(`${base}/favicon.ico`);
      push(`${base}/favicon.png`);
      push(`${base}/favicon-32x32.png`);
      push(`${base}/favicon-196x196.png`);
      push(`${base}/apple-touch-icon.png`);
      push(`${base}/apple-touch-icon-precomposed.png`);
      push(`${base}/logo.svg`);
      push(`${base}/logo.png`);
      push(`${base}/images/logo.svg`);
      push(`${base}/images/logo.png`);
      push(`${base}/img/logo.svg`);
      push(`${base}/img/logo.png`);
      push(`${base}/assets/logo.svg`);
      push(`${base}/assets/logo.png`);

      // 3rd-party favicon providers
      push(`https://icons.duckduckgo.com/ip3/${host}.ico`);
      push(`https://logo.clearbit.com/${host}`);
      push(`https://unavatar.io/${host}`);
      push(`https://www.google.com/s2/favicons?sz=128&domain=${host}`);
    } catch {}
  }

  // Social-based avatars
  if (twitterUrl) {
    try {
      const u = new URL(twitterUrl);
      const handle = u.pathname.replace(/\/$/, "").split("/").filter(Boolean)[0];
      if (handle) {
        push(`https://unavatar.io/twitter/${handle}`);
      }
    } catch {}
  }
  if (githubUrl) {
    try {
      const u = new URL(githubUrl);
      const org = u.pathname.replace(/\/$/, "").split("/").filter(Boolean)[0];
      if (org) {
        push(`https://unavatar.io/github/${org}`);
      }
    } catch {}
  }

  return cands;
}

function inferCategory(name: string): Category {
  const n = name.toLowerCase();
  if (/(swap|dex|exchange|market)/.test(n)) return "DEX";
  if (/(lend|borro)/.test(n)) return "Lending";
  if (/(wallet)/.test(n)) return "Wallet";
  if (/(nft|mint)/.test(n)) return "NFT";
  if (/(explorer|bridge|router|protocol|rpc|node|index|oracle|graph|infra|network)/.test(n))
    return "Infrastructure";
  if (/(analytics|data)/.test(n)) return "Analytics";
  return "Other";
}

function defaultNetwork(name: string): Network {
  return "Monad Mainnet";
}

type ParsedInfo = {
  description?: string;
  hint?: "App" | "Infra" | "App/Infra";
  tags?: string[];
};

function safeReadDescriptions(): string[] {
  const candidates = [
    path.resolve(process.cwd(), "description.md"),
    path.resolve(process.cwd(), "category", "description.md"),
  ];
  for (const pth of candidates) {
    try {
      if (fs.existsSync(pth)) {
        const content = fs.readFileSync(pth, "utf8");
        return content.split(/\r?\n/);
      }
    } catch {
      // continue
    }
  }
  return [];
}

function parseDescriptions(knownNames: Set<string>): Map<string, ParsedInfo> {
  const lines = safeReadDescriptions();
  if (lines.length === 0) return new Map();

  const headerSkips = new Set([
    "Monad Logo",
    "Copied SVG to clipboard.",
    "Join Testnet",
    "Ecosystem",
    "Apps & Infrastructure Live on Testnet",
    "Categories",
    "App",
    "Infra",
    "Only on Monad",
    "Reset",
    "Search Ecosystem",
  ]);

  const catHints = new Set(["App", "Infra", "App/Infra"]);

  const result = new Map<string, ParsedInfo>();

  const isProjectName = (s: string) => knownNames.has(normalizeName(s.trim()));
  const labelSkips = new Set([
    "Monad Logo",
    "Monad Memo",
    "Looking to grow your career?",
    "Explore Ecosystem Jobs",
    "Stay up to date with the latest news, announcements and events with Monad's exclusive newsletter.",
  ]);
  const nextNonEmpty = (i: number) => {
    let j = i + 1;
    while (j < lines.length && lines[j].trim() === "") j++;
    return j;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || headerSkips.has(line)) continue;

    if (!isProjectName(line)) continue;

    const name = line;
    let j = nextNonEmpty(i);
    let hint: ParsedInfo["hint"] | undefined = undefined;
    if (j < lines.length && catHints.has(lines[j].trim())) {
      hint = lines[j].trim() as ParsedInfo["hint"];
      j = nextNonEmpty(j);
    }

    if (j < lines.length && lines[j].trim() === name) {
      j = nextNonEmpty(j);
    }

    let description: string | undefined = undefined;
    if (j < lines.length && lines[j].trim() && !isProjectName(lines[j].trim())) {
      description = lines[j].trim();
      j++;
    }

    const tags: string[] = [];
    while (j < lines.length) {
      const t = lines[j].trim();
      if (!t) {
        j++;
        continue;
      }
      if (isProjectName(t) || catHints.has(t)) break;
      if (
        t === "Home" ||
        t === "Technology" ||
        t === "Careers" ||
        t === "Developer Portal" ||
        t === "Documentation"
      ) {
        break;
      }
      if (labelSkips.has(t)) {
        j++;
        continue;
      }
      tags.push(t);
      j++;
    }

    result.set(normalizeName(name), { description, hint, tags });
  }

  return result;
}

function safeReadCategoryFile(): string[] {
  try {
    const pth = path.resolve(process.cwd(), "category.md");
    if (fs.existsSync(pth)) {
      return fs.readFileSync(pth, "utf8").split(/\r?\n/);
    }
  } catch {}
  return [];
}

function parseCategoryFile(): Map<string, ParsedInfo> {
  const lines = safeReadCategoryFile();
  if (!lines.length) return new Map();

  const result = new Map<string, ParsedInfo>();
  const catHints = new Set(["App", "Infra", "App/Infra"]);

  let i = 0;
  while (i < lines.length) {
    let name = lines[i].trim();
    if (!name || /^Showing\s+\d+\s+matching\s+results\.?$/i.test(name)) {
      i++;
      continue;
    }
    const norm = normalizeName(name);
    // Next line should be a hint (App/Infra/App/Infra), skip blanks in between already handled by trim check
    let j = i + 1;
    while (j < lines.length && !lines[j].trim()) j++;
    let hint: ParsedInfo["hint"] | undefined = undefined;
    if (j < lines.length && catHints.has(lines[j].trim())) {
      hint = lines[j].trim() as ParsedInfo["hint"];
      j++;
    } else {
      // Not a valid block start; move to next line
      i++;
      continue;
    }
    // skip blanks
    while (j < lines.length && !lines[j].trim()) j++;
    // Some sections repeat the name again
    if (j < lines.length && normalizeName(lines[j].trim()) === norm) {
      j++;
    }
    // Description line
    let description: string | undefined = undefined;
    while (j < lines.length && !lines[j].trim()) j++;
    if (j < lines.length && lines[j].trim()) {
      description = lines[j].trim();
      j++;
    }
    // Collect labels until next project name pattern (heuristic: a non-empty line followed by maybe a hint line)
    const labels: string[] = [];
    while (j < lines.length) {
      const t = lines[j].trim();
      if (!t) {
        j++;
        continue;
      }
      if (catHints.has(t)) {
        break;
      }
      // Heuristic: if the next non-empty line is a hint, then this line is likely a name; stop
      const kStart = j;
      let k = kStart + 1;
      while (k < lines.length && !lines[k].trim()) k++;
      if (k < lines.length && catHints.has(lines[k].trim())) {
        break;
      }
      // Otherwise treat as label
      labels.push(t);
      j++;
    }
    result.set(norm, { description, hint, tags: labels });
    i = j;
  }

  return result;
}

export function loadProjects(): Project[] {
  const compiledPath = path.resolve(process.cwd(), "data", "projects_compiled.json");
  // Authoritative build from Mon@las eco.json if available
  try {
    const ecoCandidates = [
      path.resolve(process.cwd(), "mon@las eco.json"),
      path.resolve(process.cwd(), "data", "mon@las eco.json"),
    ];
    const ecoPath = ecoCandidates.find((p) => fs.existsSync(p));
    if (ecoPath && fs.existsSync(ecoPath)) {
      // The eco file may contain non-standard JSON tokens like NaN; sanitize to valid JSON
      let ecoText = fs.readFileSync(ecoPath, "utf8");
      if (ecoText.charCodeAt(0) === 0xfeff) ecoText = ecoText.slice(1);
      ecoText = ecoText.replace(/:\s*NaN/gi, ": null");
      {
        const s = ecoText.indexOf("[");
        const e = ecoText.lastIndexOf("]");
        if (s >= 0 && e > s) ecoText = ecoText.slice(s, e + 1);
      }
      const rows = JSON.parse(ecoText) as Array<Record<string, any>>;
      if (Array.isArray(rows) && rows.length) {
        // Labels from category.md if present
        const categoryInfo = parseCategoryFile();
        // Docs links from protocols
        const docsMap = new Map<string, string>();
        try {
          const protoRoots = [
            path.resolve(process.cwd(), "protocols", "testnet"),
            path.resolve(process.cwd(), "protocols", "mainnet"),
          ];
          for (const root of protoRoots) {
            try {
              if (!fs.existsSync(root)) continue;
              const entries = fs.readdirSync(root).filter((f) => f.toLowerCase().endsWith(".json"));
              for (const file of entries) {
                try {
                  const full = path.join(root, file);
                  const json = JSON.parse(fs.readFileSync(full, "utf8"));
                  const pname: string = json.name ?? file.replace(/\.json$/i, "");
                  const norm = normalizeName(pname);
                  const durl: string | undefined = json.links?.docs;
                  if (durl) docsMap.set(norm, durl);
                } catch {}
              }
            } catch {}
          }
        } catch {}

        const toArray = (v: any): string[] => {
          if (!v) return [];
          if (Array.isArray(v)) return v.map((x) => String(x).trim()).filter(Boolean);
          return String(v)
            .split(/[,;\|]/)
            .map((s) => s.trim())
            .filter(Boolean);
        };

        const items: Project[] = rows.map((row) => {
          const name: string = String(row["NAME"] ?? "").trim();
          if (!name) return undefined as any;
          const id = slugify(name);
          let url: string | undefined = row["WEB"] ? String(row["WEB"]).trim() : undefined;
          if (url === "#" || url === "") url = undefined;
          if (url && !/^https?:\/\//i.test(url)) url = `https://${url}`;
          const twitterUrl: string | undefined = row["X"] ? String(row["X"]).trim() : undefined;
          const info: string = String(row["INFO"] ?? "").trim();
          const pjType: string = String(row["PJ TYPE"] ?? "App").trim();
          const primaryLogo: string | undefined = row["LOGO"] ? String(row["LOGO"]).trim() : undefined;

          // Labels: prefer category.md, fallback to TAGS in eco file
          let labels = (() => {
            const fromCat = categoryInfo.get(normalizeName(name))?.tags ?? [];
            const cleanedCat = Array.from(new Set(fromCat.map((t) => String(t).trim()).filter((t) => t && !/^coming\s*soon$/i.test(t))));
            if (cleanedCat.length) return cleanedCat;
            const tags = toArray(row["TAGS"]);
            return tags.length ? tags : undefined;
          })();

          const category: Category = /infra/i.test(pjType) ? "Infrastructure" : "App";

          // Use only the sheet-provided LOGO as the logo
          const logo = primaryLogo;

          return {
            id,
            name,
            description: info,
            url: url ?? "#",
            docsUrl: docsMap.get(normalizeName(name)),
            logo,
            category,
            tags: [],
            labels,
          } as Project;
        }).filter(Boolean) as Project[];

        items.sort((a, b) => a.name.localeCompare(b.name));
        try {
          const dataDir = path.resolve(process.cwd(), "data");
          if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
          fs.writeFileSync(compiledPath, JSON.stringify(items, null, 2), "utf8");
        } catch {}
        return items;
      }
    }
  } catch {}
  // Authoritative build from moneco JSON if available
  const monecoPaths = [
    path.resolve(process.cwd(), "moneco_data.json"),
    path.resolve(process.cwd(), "MonEco_Sheet1.json"),
  ];
  for (const mp of monecoPaths) {
    try {
      if (fs.existsSync(mp)) {
        const arr = JSON.parse(fs.readFileSync(mp, "utf8")) as Array<Record<string, any>>;
        if (Array.isArray(arr) && arr.length) {
          // Also read category.md labels to merge in
          const categoryInfo = parseCategoryFile();
          // Gather docs links from protocols (testnet/mainnet) to preserve Docs buttons where available
          const docsMap = new Map<string, string>();
          try {
            const protoRoots = [
              path.resolve(process.cwd(), "protocols", "testnet"),
              path.resolve(process.cwd(), "protocols", "mainnet"),
            ];
            for (const root of protoRoots) {
              try {
                if (!fs.existsSync(root)) continue;
                const entries = fs.readdirSync(root).filter((f) => f.toLowerCase().endsWith(".json"));
                for (const file of entries) {
                  try {
                    const full = path.join(root, file);
                    const json = JSON.parse(fs.readFileSync(full, "utf8"));
                    const pname: string = json.name ?? file.replace(/\.json$/i, "");
                    const norm = normalizeName(pname);
                    const durl: string | undefined = json.links?.docs;
                    if (durl) docsMap.set(norm, durl);
                  } catch {}
                }
              } catch {}
            }
          } catch {}
          const items: Project[] = arr.map((row) => {
            const name: string = String(row["NAME"] ?? "").trim();
            const id = slugify(name);
            const url: string | undefined = row["WEB"] ? String(row["WEB"]).trim() : undefined;
            const twitterUrl: string | undefined = row["X"] ? String(row["X"]).trim() : undefined;
            const info: string = String(row["INFO"] ?? "").trim();
            const pjType: string = String(row["PJ TYPE"] ?? "App").trim();
            // Use labels only from category.md
            let labels = (() => {
              try {
                const ls = categoryInfo.get(normalizeName(name))?.tags ?? [];
                const seen = new Set<string>();
                const out: string[] = [];
                for (const t of ls) {
                  const key = String(t).trim();
                  if (!key || /^coming\s*soon$/i.test(key)) continue;
                  const lower = key.toLowerCase();
                  if (!seen.has(lower)) {
                    seen.add(lower);
                    out.push(key);
                  }
                }
                return out.length ? out : undefined;
              } catch {
                return undefined;
              }
            })();
            const category: Category = /infra/i.test(pjType) ? "Infrastructure" : "App";
            const primaryLogo: string | undefined = row["LOGO"] ? String(row["LOGO"]).trim() : undefined;

            // Restrict candidates: sheet logo first, then minimal CDN/local overrides to avoid endless loading
            const logoCandidates: string[] = [];
            const push = (s?: string) => { if (s && !logoCandidates.includes(s)) logoCandidates.push(s); };
            // Primary from sheet
            push(primaryLogo);
            // External CDN overrides (png, webp) if configured
            const cdnBase = process.env.NEXT_PUBLIC_LOGO_CDN_BASE?.replace(/\/$/, "");
            if (cdnBase) {
              push(`${cdnBase}/logos/${id}.png`);
              push(`${cdnBase}/logos/${id}.webp`);
            }
            // Local overrides (png, webp)
            push(`/logos/${id}.png`);
            push(`/logos/${id}.webp`);

            const logo = logoCandidates[0];

            return {
              id,
              name,
              description: info,
              url: url ?? "#",
              docsUrl: docsMap.get(normalizeName(name)),
              logo,
              logoCandidates,
              category,
              tags: [],
              labels,
            } as Project;
          }).filter((p) => p.name);

          items.sort((a, b) => a.name.localeCompare(b.name));
          // Enforce 303 if more for any reason
          const finalItems = items.slice(0, 303);
          try {
            const dataDir = path.resolve(process.cwd(), "data");
            if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
            fs.writeFileSync(compiledPath, JSON.stringify(finalItems, null, 2), "utf8");
          } catch {}
          return finalItems;
        }
      }
    } catch {}
  }
  // Fallback: Authoritative build from category.md if available
  try {
    const categoryInfo = parseCategoryFile();
    if (categoryInfo.size > 0) {
      const urlsPath = path.resolve(process.cwd(), "monad-ecosystem", "data", "projects.json");
      let urlMap = new Map<string, string>();
      try {
        if (fs.existsSync(urlsPath)) {
          const arr = JSON.parse(fs.readFileSync(urlsPath, "utf8")) as Array<{ name: string; url: string }>;
          urlMap = new Map(arr.map((x) => [normalizeName(x.name), x.url]));
        }
      } catch {}

      // Gather docs links from protocols/testnet to preserve Docs buttons where available
      const docsMap = new Map<string, string>();
      try {
        const protoDir = path.resolve(process.cwd(), "protocols", "testnet");
        if (fs.existsSync(protoDir)) {
          const entries = fs.readdirSync(protoDir).filter((f) => f.toLowerCase().endsWith(".json"));
          for (const file of entries) {
            try {
              const full = path.join(protoDir, file);
              const json = JSON.parse(fs.readFileSync(full, "utf8"));
              const pname: string = json.name ?? file.replace(/\.json$/i, "");
              const norm = normalizeName(pname);
              const durl: string | undefined = json.links?.docs;
              if (durl) docsMap.set(norm, durl);
            } catch {}
          }
        }
      } catch {}

      const items: Project[] = [];
      for (const [normName, info] of categoryInfo.entries()) {
        const id = normName;
        const name = normName.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
        const url = urlMap.get(normName) ?? "#";
        const category: Category = info.hint === "Infra" ? "Infrastructure" : "App";
        const labels = info.tags && info.tags.length ? info.tags : undefined;
        const logoCandidates = makeLogoCandidates(url, undefined, undefined, id);
        const logo = logoCandidates[0];
        items.push({
          id,
          name,
          description: info.description ?? "",
          url,
          docsUrl: docsMap.get(normName),
          logo,
          logoCandidates,
          category,
          tags: [],
          labels,
        });
      }
      items.sort((a, b) => a.name.localeCompare(b.name));
      try {
        const dataDir = path.resolve(process.cwd(), "data");
        if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
        fs.writeFileSync(compiledPath, JSON.stringify(items, null, 2), "utf8");
      } catch {}
      return items;
    }
  } catch {}
  try {
    if (fs.existsSync(compiledPath)) {
      const data = JSON.parse(fs.readFileSync(compiledPath, "utf8"));
      if (Array.isArray(data) && data.length) {
        // Merge in URLs from src/data/projects.json if present
        let urlMap = new Map<string, string>();
        try {
          const srcProjectsPath = path.resolve(process.cwd(), "src", "data", "projects.json");
          if (fs.existsSync(srcProjectsPath)) {
            const arr = JSON.parse(fs.readFileSync(srcProjectsPath, "utf8")) as Array<{ name: string; url: string }>;
            urlMap = new Map(arr.map((x) => [normalizeName(x.name), x.url]));
          }
        } catch {}

        // Also merge from Mon@las eco sheet (authoritative for WEB/LOGO when present)
        type EcoRow = { NAME?: string; WEB?: string; LOGO?: string };
        const ecoMap = new Map<string, { web?: string; logo?: string }>();
        try {
          const ecoCandidates2 = [
            path.resolve(process.cwd(), "mon@las eco.json"),
            path.resolve(process.cwd(), "data", "mon@las eco.json"),
          ];
          const ecoPath2 = ecoCandidates2.find((p) => fs.existsSync(p));
          if (ecoPath2 && fs.existsSync(ecoPath2)) {
            let ecoText = fs.readFileSync(ecoPath2, "utf8");
            if (ecoText.charCodeAt(0) === 0xfeff) ecoText = ecoText.slice(1);
            ecoText = ecoText.replace(/:\s*NaN/gi, ": null");
            {
              const s = ecoText.indexOf("[");
              const e = ecoText.lastIndexOf("]");
              if (s >= 0 && e > s) ecoText = ecoText.slice(s, e + 1);
            }
            const rows = JSON.parse(ecoText) as EcoRow[];
            for (const r of rows) {
              const nm = (r.NAME ?? "").toString().trim();
              if (!nm) continue;
              let web = (r.WEB ?? "").toString().trim() || undefined;
              if (web === "#" || web === "") web = undefined;
              if (web && !/^https?:\/\//i.test(web)) web = `https://${web}`;
              const logo = (r.LOGO ?? "").toString().trim() || undefined;
              ecoMap.set(normalizeName(nm), { web, logo });
            }
          }
        } catch {}

        let enhanced = (data as Project[]).map((p) => {
          // Prefer URL from src/data/projects.json when current is empty or '#'
          const norm = normalizeName(p.name);
          const eco = ecoMap.get(norm);
          const mergedUrl = (!p.url || p.url === "#") ? (eco?.web ?? urlMap.get(norm) ?? p.url) : p.url;
          const generated = makeLogoCandidates(mergedUrl, undefined, undefined, p.id);
          const existing = Array.isArray(p.logoCandidates) ? p.logoCandidates : [];
          const merged: string[] = [];
          // Put eco logo first if provided
          if (eco?.logo) merged.push(eco.logo);
          for (const s of [...existing, ...generated]) {
            if (s && !merged.includes(s)) merged.push(s);
          }
          const logo = p.logo ?? eco?.logo ?? merged[0];
          return { ...p, url: mergedUrl ?? p.url, logo, logoCandidates: merged } as Project;
        });
        // Augment from category.md + monad-ecosystem URLs without touching existing ones
        const categoryInfo = parseCategoryFile();
        const urlsPath = path.resolve(process.cwd(), "monad-ecosystem", "data", "projects.json");
        let monoEcoUrlMap = new Map<string, string>();
        try {
          if (fs.existsSync(urlsPath)) {
            const arr = JSON.parse(fs.readFileSync(urlsPath, "utf8")) as Array<{ name: string; url: string }>;
            monoEcoUrlMap = new Map(arr.map((x) => [normalizeName(x.name), x.url]));
          }
        } catch {}

        const existingNames = new Set(enhanced.map((p) => normalizeName(p.name)));
        const additions: Project[] = [];
        for (const [normName, info] of categoryInfo.entries()) {
          if (existingNames.has(normName)) continue;
          const name = normName.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
          const url = monoEcoUrlMap.get(normName) ?? "#";
          const category: Category = info.hint === "Infra" ? "Infrastructure" : "App";
          const labels = info.tags && info.tags.length ? info.tags : undefined;
          const id = normName;
          const logoCandidates = makeLogoCandidates(url, undefined, undefined, id);
          const logo = logoCandidates[0];
          additions.push({
            id,
            name,
            description: info.description ?? "",
            url,
            docsUrl: undefined,
            logo,
            logoCandidates,
            category,
            tags: [],
            labels,
          });
        }
        if (additions.length) additions.sort((a, b) => a.name.localeCompare(b.name));
        const updated = additions.length ? [...enhanced, ...additions] : enhanced;
        try {
          fs.writeFileSync(compiledPath, JSON.stringify(updated, null, 2), "utf8");
        } catch {}
        return updated;
      }
    }
  } catch {}

  const protocolsDir = path.resolve(process.cwd(), "protocols", "testnet");
  try {
    if (fs.existsSync(protocolsDir)) {
      const entries = fs.readdirSync(protocolsDir).filter((f) => f.toLowerCase().endsWith(".json"));
      if (entries.length) {
        const projects: Project[] = [];
        for (const file of entries) {
          try {
            const full = path.join(protocolsDir, file);
            const json = JSON.parse(fs.readFileSync(full, "utf8"));
            const name: string = json.name ?? file.replace(/\.json$/i, "");
            const description: string = json.description ?? "";
            const projectUrl: string | undefined = json.links?.project;
            const docsUrl: string | undefined = json.links?.docs;
            const twitterUrl: string | undefined = json.links?.twitter;
            const githubUrl: string | undefined = json.links?.github;
            const cats: string[] = Array.isArray(json.categories) ? json.categories : [];

            const hasInfra = cats.some((c: string) => /^\s*Infra::/i.test(c));
            const hasApp = cats.some((c: string) => !/^\s*Infra::/i.test(c));
            const category: Category = hasInfra && !hasApp ? "Infrastructure" : "App";

            const labels: string[] = cats.map((c: string) => {
              const parts = String(c).split("::");
              return parts.length > 1 ? parts[1].trim() : parts[0].trim();
            });

            const logoCandidates = makeLogoCandidates(projectUrl, twitterUrl, githubUrl, slugify(name));
            const logo = logoCandidates[0];

            projects.push({
              id: slugify(name),
              name,
              description,
              url: projectUrl ?? "#",
              docsUrl,
              logo,
              logoCandidates,
              category,
              tags: [],
              labels: labels.length ? labels : undefined,
            });
          } catch {}
        }
        if (projects.length) {
          // Augment with category.md + monad-ecosystem URLs on first build too
          try {
            const categoryInfo = parseCategoryFile();
            const urlsPath = path.resolve(process.cwd(), "monad-ecosystem", "data", "projects.json");
            let urlMap = new Map<string, string>();
            try {
              if (fs.existsSync(urlsPath)) {
                const arr = JSON.parse(fs.readFileSync(urlsPath, "utf8")) as Array<{ name: string; url: string }>;
                urlMap = new Map(arr.map((x) => [normalizeName(x.name), x.url]));
              }
            } catch {}

            const existingNames = new Set(projects.map((p) => normalizeName(p.name)));
            const additions: Project[] = [];
            for (const [normName, info] of categoryInfo.entries()) {
              if (existingNames.has(normName)) continue;
              const name = normName.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
              const url = urlMap.get(normName) ?? "#";
              const category: Category = info.hint === "Infra" ? "Infrastructure" : "App";
              const labels = info.tags && info.tags.length ? info.tags : undefined;
              const id = normName;
              const logoCandidates = makeLogoCandidates(url, undefined, undefined, id);
              const logo = logoCandidates[0];
              additions.push({
                id,
                name,
                description: info.description ?? "",
                url,
                docsUrl: undefined,
                logo,
                logoCandidates,
                category,
                tags: [],
                labels,
              });
            }
            if (additions.length) additions.sort((a, b) => a.name.localeCompare(b.name));
            const combined = additions.length ? [...projects, ...additions] : projects;

            const dataDir = path.resolve(process.cwd(), "data");
            if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
            fs.writeFileSync(compiledPath, JSON.stringify(combined, null, 2), "utf8");
            return combined;
          } catch {
            try {
              const dataDir = path.resolve(process.cwd(), "data");
              if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
              fs.writeFileSync(compiledPath, JSON.stringify(projects, null, 2), "utf8");
            } catch {}
            return projects;
          }
        }
      }
    }
  } catch {}

  const overrides = (overridesRaw as Array<Partial<Project> & { name: string }>);
  const byName = new Map<string, Partial<Project>>(
    overrides.map((o) => [o.name.toLowerCase(), o])
  );

  const knownNames = new Set(
    (raw as Array<{ name: string; url: string }>).map((p) => normalizeName(p.name))
  );
  const parsed = parseDescriptions(knownNames);

  return (raw as Array<{ name: string; url: string }>).map((p, idx) => {
    const id = slugify(p.name) || String(idx + 1);
    const parsedInfo = parsed.get(normalizeName(p.name));

    let category: Category | undefined;
    const labels = parsedInfo?.tags ?? [];
    const tagsLower = new Set(labels.map((t) => t.toLowerCase()));

    // Hints first: App/Infra
    if (parsedInfo?.hint === "Infra") category = "Infrastructure";
    else if (parsedInfo?.hint === "App") category = "App";
    else if (parsedInfo?.hint === "App/Infra") category = "App";

    // Label groups: Infra vs App
    if (!category) {
      const infraKeys = [
        "indexer",
        "oracle",
        "rpc",
        "dev tooling",
        "cross-chain",
        "onramp",
        "identity",
        "privacy",
        "zero-knowledge",
        "account abstraction",
        "governance",
        "stablecoin",
        "wallet",
        "other infra",
      ];
      const appKeys = [
        "ai",
        "betting",
        "defi",
        "depin",
        "gaming",
        "nft",
        "payments",
        "prediction market",
        "rwa",
        "social",
        "other apps",
      ];
      const hasInfra = infraKeys.some((k) => tagsLower.has(k));
      const hasApp = appKeys.some((k) => tagsLower.has(k));
      if (hasInfra && !hasApp) category = "Infrastructure";
      else if (hasApp) category = "App";
    }

    // Fallback: name heuristic -> collapse to App/Infra only
    if (!category) {
      const nameCat = inferCategory(p.name);
      category = nameCat === "Infrastructure" ? "Infrastructure" : "App";
    }

    const tags: Tag[] = [];

    const base: Project = {
      id,
      name: p.name,
      description: parsedInfo?.description ?? "",
      url: p.url,
      logo: undefined,
      docsUrl: undefined,
      category,
      tags,
      labels: labels.length ? labels : undefined,
    } satisfies Project;

    const o = byName.get(p.name.toLowerCase());
    if (!o) return base;

    return {
      ...base,
      description: o.description ?? base.description,
      category: (o.category as Category) ?? base.category,
      tags: (o.tags as Tag[]) ?? base.tags,
      docsUrl: o.docsUrl ?? base.docsUrl,
      logo: o.logo ?? base.logo,
    };
  });
}
