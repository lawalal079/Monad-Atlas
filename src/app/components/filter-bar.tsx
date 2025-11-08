"use client";
import { useRef, useState } from "react";

export function FilterBar({
  labels,
  selectedLabels,
  onToggleLabel,
  selectedCategory,
  onSelectCategory,
}: {
  labels: string[];
  selectedLabels: string[];
  onToggleLabel: (label: string) => void;
  selectedCategory: "All" | "App" | "Infrastructure";
  onSelectCategory: (cat: "All" | "App" | "Infrastructure") => void;
}) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const pos = useRef<{ startX: number; scrollLeft: number }>({ startX: 0, scrollLeft: 0 });

  const onMouseDown: React.MouseEventHandler<HTMLDivElement> = (e) => {
    const el = scrollerRef.current;
    if (!el) return;
    setDragging(true);
    pos.current = { startX: e.clientX, scrollLeft: el.scrollLeft };
  };
  const onMouseMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (!dragging) return;
    e.preventDefault();
    const el = scrollerRef.current;
    if (!el) return;
    const dx = e.clientX - pos.current.startX;
    el.scrollLeft = pos.current.scrollLeft - dx;
  };
  const endDrag = () => setDragging(false);

  const onTouchStart: React.TouchEventHandler<HTMLDivElement> = (e) => {
    const el = scrollerRef.current;
    if (!el) return;
    const t = e.touches[0];
    setDragging(true);
    pos.current = { startX: t.clientX, scrollLeft: el.scrollLeft };
  };
  const onTouchMove: React.TouchEventHandler<HTMLDivElement> = (e) => {
    if (!dragging) return;
    const el = scrollerRef.current;
    if (!el) return;
    const t = e.touches[0];
    const dx = t.clientX - pos.current.startX;
    el.scrollLeft = pos.current.scrollLeft - dx;
  };
  const onTouchEnd: React.TouchEventHandler<HTMLDivElement> = () => setDragging(false);

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 py-2 sm:static sm:border-b sm:px-6 sm:py-4">
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {["All", "App", "Infrastructure"].map((cat) => (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat as any)}
              className={`px-3 py-2 sm:px-4 rounded-full font-medium transition-colors whitespace-nowrap text-sm ${
                selectedCategory === cat ? "bg-primary text-primary-foreground" : "bg-muted text-foreground hover:bg-muted/80"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div
          ref={scrollerRef}
          className={`flex-1 overflow-x-auto no-scrollbar select-none ${
            dragging ? "cursor-grabbing" : "cursor-grab"
          }`}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseLeave={endDrag}
          onMouseUp={endDrag}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div className="flex items-center gap-2 sm:gap-3 pb-1 sm:pb-2 w-max">
            {labels.map((label) => {
              const active = selectedLabels.some((l) => l.toLowerCase() === label.toLowerCase());
              return (
                <button
                  key={label}
                  onClick={() => onToggleLabel(label)}
                  className={`px-3 py-2 sm:px-4 rounded-full font-medium transition-colors whitespace-nowrap text-sm ${
                    active ? "bg-primary text-primary-foreground" : "bg-muted text-foreground hover:bg-muted/80"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
