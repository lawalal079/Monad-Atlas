"use client";

import { useEffect, useState } from "react";

export default function SplashScreen() {
  const [show, setShow] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setShow(false), 1800);
    return () => clearTimeout(t);
  }, []);
  if (!show) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur"
      onClick={() => setShow(false)}
      role="button"
      aria-label="Dismiss splash"
   >
      <div className="relative mx-4 w-full max-w-3xl rounded-3xl border-2 border-primary/30 ring-1 ring-primary/20 bg-gradient-to-br from-zinc-900/70 via-zinc-900/40 to-transparent p-8 sm:p-10 text-center shadow-[0_20px_80px_rgba(0,0,0,0.45)]">
        <div
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-70"
          style={{
            backgroundImage:
              "radial-gradient(220px 180px at 18% 28%, rgba(167,139,250,0.35), transparent 60%)," +
              "radial-gradient(280px 220px at 82% 30%, rgba(99,102,241,0.32), transparent 60%)," +
              "radial-gradient(300px 240px at 55% 80%, rgba(56,189,248,0.24), transparent 65%)",
          }}
        />
        <div className="relative z-10">
          <div className="text-4xl sm:text-5xl font-extrabold tracking-tight text-primary drop-shadow-[0_0_22px_rgba(167,139,250,0.55)]">
            Mon@las
          </div>
          <div className="mt-1 text-xl sm:text-2xl font-semibold text-foreground">Monad Atlas</div>
          <div className="mt-4 text-base sm:text-lg font-semibold text-foreground/95">Explore the Monad Universe in One Place</div>
          <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base text-foreground/90">
            Mon@las is a visual explorer that helps you discover, track, and understand every project, protocol, and tool in the Monad ecosystem — all in one place.
          </p>
          <div className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm sm:text-base font-semibold text-primary-foreground shadow-[0_8px_30px_rgba(167,139,250,0.45)] hover:brightness-110 transition">
            Tap to continue
          </div>
        </div>
        {/* Inner glow ring */}
        <div className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-primary/25 shadow-[inset_0_0_120px_rgba(167,139,250,0.25)]" />
      </div>
    </div>
  );
}
