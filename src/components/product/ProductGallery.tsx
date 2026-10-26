"use client";

import { useEffect, useState } from "react";
import { ChevronRight, CloseIcon, ZoomIcon } from "@/components/ui/Icons";

export function ProductGallery({ images, title, activeIndex, onChange }: { images: string[]; title: string; activeIndex: number; onChange: (i: number) => void }) {
  const [zoom, setZoom] = useState(false);
  const active = images[activeIndex] ?? images[0];

  useEffect(() => {
    if (!zoom) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setZoom(false);
      if (e.key === "ArrowRight") onChange((activeIndex + 1) % images.length);
      if (e.key === "ArrowLeft") onChange((activeIndex - 1 + images.length) % images.length);
    };
    document.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = ""; document.removeEventListener("keydown", onKey); };
  }, [zoom, activeIndex, images.length, onChange]);

  return (
    <div className="lg:sticky lg:top-28">
      <div className="relative aspect-square overflow-hidden rounded-[1.5rem] bg-white ring-1 ring-line">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img key={active} src={active} alt={title} className="anim-fade-in h-full w-full object-cover" />
        <button onClick={() => setZoom(true)} aria-label="Open full-screen image viewer" className="absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-forest shadow-soft transition hover:bg-white">
          <ZoomIcon width={20} height={20} />
        </button>
        {images.length > 1 && (
          <>
            <button onClick={() => onChange((activeIndex - 1 + images.length) % images.length)} aria-label="Previous image" className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-soft hover:bg-white">
              <ChevronRight width={18} height={18} className="rotate-180" />
            </button>
            <button onClick={() => onChange((activeIndex + 1) % images.length)} aria-label="Next image" className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 shadow-soft hover:bg-white">
              <ChevronRight width={18} height={18} />
            </button>
          </>
        )}
      </div>
      {images.length > 1 && (
        <ul className="no-scrollbar mt-4 flex gap-3 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <li key={src} className="shrink-0">
              <button
                onClick={() => onChange(i)}
                aria-label={`View image ${i + 1}`}
                aria-current={i === activeIndex}
                className={`block h-20 w-20 overflow-hidden rounded-xl bg-white ring-2 transition ${i === activeIndex ? "ring-forest" : "ring-transparent hover:ring-sage-deep"}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {zoom && (
        <div role="dialog" aria-modal="true" aria-label={`${title} image viewer`} className="anim-fade-in fixed inset-0 z-[95] flex flex-col bg-charcoal/95">
          <div className="flex items-center justify-between p-4 text-white">
            <p className="text-sm text-white/70">{activeIndex + 1} / {images.length}</p>
            <button onClick={() => setZoom(false)} aria-label="Close image viewer" className="rounded-full bg-white/10 p-2 hover:bg-white/20" autoFocus><CloseIcon /></button>
          </div>
          <div className="relative flex flex-1 items-center justify-center px-4 pb-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={active} alt={title} className="max-h-full max-w-full rounded-2xl object-contain" />
            {images.length > 1 && (
              <>
                <button onClick={() => onChange((activeIndex - 1 + images.length) % images.length)} aria-label="Previous image" className="absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"><ChevronRight className="rotate-180" /></button>
                <button onClick={() => onChange((activeIndex + 1) % images.length)} aria-label="Next image" className="absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"><ChevronRight /></button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
