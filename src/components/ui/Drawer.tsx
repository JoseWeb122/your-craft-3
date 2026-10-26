"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** Accessible right-side drawer with focus trap, Escape to close and body scroll lock. */
export function Drawer({
  open,
  onClose,
  title,
  children,
  side = "right",
  labelledBy,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  side?: "right" | "left";
  labelledBy?: string;
}) {
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    const first = panel.current?.querySelector<HTMLElement>(
      "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])",
    );
    first?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && panel.current) {
        const f = Array.from(
          panel.current.querySelectorAll<HTMLElement>(
            "button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex='-1'])",
          ),
        );
        if (!f.length) return;
        const a = f[0], z = f[f.length - 1];
        if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
        else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
      prev?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[80]">
      <button
        aria-label="Close"
        onClick={onClose}
        className="anim-fade-in absolute inset-0 bg-charcoal/40 backdrop-blur-[2px]"
      />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        aria-labelledby={labelledBy}
        className={`absolute top-0 flex h-full w-full max-w-md flex-col bg-white shadow-lift ${
          side === "right" ? "right-0 anim-slide-in-right" : "left-0 anim-fade-in"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
