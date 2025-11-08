"use client";
import type { Project } from "@/app/types";
import { useState } from "react";

export default function FeaturedSection({
  featured,
  alts,
}: {
  featured: Project;
  alts: Project[];
}) {
  const [featErr, setFeatErr] = useState(false);
  const [altErr0, setAltErr0] = useState(false);
  const [altErr1, setAltErr1] = useState(false);
  const metric = (featured.labels?.length ?? 0) > 0 ? featured.labels!.length : undefined;
  return (
    <section className="relative px-4 py-8 sm:px-6 sm:py-12 overflow-hidden">
      {/* Background Network Visualization */}
      <div className="absolute inset-0 opacity-30 pointer-events-none z-0">
        <svg className="w-full h-full" preserveAspectRatio="xMidYMid slice">
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {/* Nodes */}
          {Array.from({ length: 20 }).map((_, i) => (
            <circle
              key={`node-${i}`}
              cx={Math.random() * 100 + "%"}
              cy={Math.random() * 100 + "%"}
              r="2"
              fill="#a78bfa"
              opacity={Math.random() * 0.6 + 0.2}
              filter="url(#glow)"
            />
          ))}
          {/* Lines */}
          {Array.from({ length: 15 }).map((_, i) => (
            <line
              key={`line-${i}`}
              x1={Math.random() * 100 + "%"}
              y1={Math.random() * 100 + "%"}
              x2={Math.random() * 100 + "%"}
              y2={Math.random() * 100 + "%"}
              stroke="#8b5cf6"
              strokeWidth="1"
              opacity={Math.random() * 0.3 + 0.1}
            />
          ))}
        </svg>
      </div>

      {/* Content: two separate cards (left spotlight, right combined list+actions) */}
      <div className="relative z-10 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6 items-stretch max-w-7xl mx-auto">
        {/* Left - Featured Spotlight (glowy) */}
        <div className="sm:col-span-2">
          <div className="relative h-full border-2 border-primary/50 rounded-2xl p-5 sm:p-8 bg-gradient-to-br from-primary/10 to-transparent overflow-hidden">
          {/* Crystalline glow blobs (inside only) */}
          <div
            className="absolute inset-0 z-0 rounded-[inherit] opacity-70"
            style={{
              backgroundImage:
                "radial-gradient(160px 120px at 18% 25%, rgba(168,85,247,0.30), transparent 60%)," +
                "radial-gradient(220px 160px at 78% 32%, rgba(99,102,241,0.24), transparent 60%)," +
                "radial-gradient(240px 200px at 58% 78%, rgba(56,189,248,0.18), transparent 65%)," +
                "radial-gradient(110px 80px at 36% 62%, rgba(236,72,153,0.14), transparent 60%)",
              backgroundColor: "transparent",
              filter: "saturate(120%)",
            }}
          />
          {/* Subtle crystalline diagonal lines */}
          <div
            className="absolute inset-0 z-0 rounded-[inherit] opacity-30"
            style={{
              backgroundImage:
                "repeating-linear-gradient(115deg, rgba(139,92,246,0.22) 0px, rgba(139,92,246,0.22) 1px, transparent 1px, transparent 12px)," +
                "repeating-linear-gradient(65deg, rgba(59,130,246,0.16) 0px, rgba(59,130,246,0.16) 1px, transparent 1px, transparent 16px)",
            }}
          />
          {/* Inner border glow */}
          <div className="absolute inset-0 z-0 rounded-[inherit] ring-1 ring-primary/25 shadow-[inset_0_0_80px_rgba(167,139,250,0.25)]" />
          {typeof metric !== "undefined" && (
            <div className="absolute top-4 right-4 z-20 text-xl sm:text-2xl font-extrabold text-primary drop-shadow-[0_0_6px_rgba(167,139,250,0.6)]">
              {metric}
            </div>
          )}
          <div className="relative z-10">
            <div className="text-lg sm:text-xl font-semibold text-muted-foreground mb-6">Featured DApp Spotlight</div>
            <div className="flex items-start gap-4 sm:gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center overflow-hidden">
                  {featured.logo && !featErr ? (
                    <img
                      src={featured.logo}
                      alt={`${featured.name} logo`}
                      className="w-full h-full object-contain"
                      onError={() => setFeatErr(true)}
                    />
                  ) : (
                    <span className="text-white text-4xl font-bold">{featured.name.slice(0,1)}</span>
                  )}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">{featured.name}</h2>
                {featured.description && (
                  <p className="text-muted-foreground text-sm mb-4">{featured.description}</p>
                )}
                {/* metric moved to top-right */}
              </div>
            </div>
          </div>
        </div>
        </div>

        {/* Right - Single card that contains list + actions (separate from left) */}
        <div>
          <div className="relative h-full bg-muted/40 rounded-2xl p-4 sm:p-5 border border-border overflow-hidden w-full flex flex-col">
            {/* Soft internal background */}
            <div
              className="absolute inset-0 z-0 rounded-[inherit] opacity-30"
              style={{
                backgroundImage:
                  "radial-gradient(140px 100px at 80% 20%, rgba(99,102,241,0.20), transparent 60%)," +
                  "radial-gradient(160px 120px at 30% 70%, rgba(168,85,247,0.16), transparent 60%)",
              }}
            />
            <div className="relative z-10 flex flex-col gap-3 flex-1">
              {/* Mini-card 1 */}
              {alts[0] && (
                <a href={alts[0].url} target="_blank" rel="noreferrer" className="bg-muted/50 rounded-xl p-4 border border-border block">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {alts[0].logo && !altErr0 ? (
                        <img
                          src={alts[0].logo}
                          alt={`${alts[0].name} logo`}
                          className="w-full h-full object-contain"
                          onError={() => setAltErr0(true)}
                        />
                      ) : (
                        <span className="text-white text-lg font-bold">{alts[0].name.slice(0,1)}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-foreground text-sm">{alts[0].name}</div>
                      {alts[0].description && (
                        <div className="text-xs text-muted-foreground truncate">{alts[0].description}</div>
                      )}
                    </div>
                  </div>
                </a>
              )}

              {/* Mini-card 2 */}
              {alts[1] && (
                <a href={alts[1].url} target="_blank" rel="noreferrer" className="bg-muted/50 rounded-xl p-4 border border-border block">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {alts[1].logo && !altErr1 ? (
                        <img
                          src={alts[1].logo}
                          alt={`${alts[1].name} logo`}
                          className="w-full h-full object-contain"
                          onError={() => setAltErr1(true)}
                        />
                      ) : (
                        <span className="text-white text-lg font-bold">{alts[1].name.slice(0,1)}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-foreground text-sm">{alts[1].name}</div>
                      {alts[1].description && (
                        <div className="text-xs text-muted-foreground truncate">{alts[1].description}</div>
                      )}
                    </div>
                  </div>
                </a>
              )}

              {/* Actions row inside the right card */}
              <div className="flex gap-2 pt-1 mt-auto">
                <a
                  href={featured.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className={`flex-1 px-4 py-2 rounded-lg text-center text-sm font-medium transition-colors ${featured.url ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-muted text-foreground/50 cursor-not-allowed pointer-events-none"}`}
                >
                  Visit
                </a>
                <a
                  href={featured.docsUrl ?? "#"}
                  target="_blank"
                  rel="noreferrer noopener"
                  className={`flex-1 px-4 py-2 rounded-lg text-center text-sm font-medium transition-colors ${featured.docsUrl ? "bg-muted text-foreground hover:bg-muted/80" : "bg-muted text-foreground/50 cursor-not-allowed pointer-events-none"}`}
                >
                  Docs
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
