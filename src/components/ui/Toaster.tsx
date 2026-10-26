"use client";

import { useUI } from "./UIProvider";
import { CheckIcon, CloseIcon } from "./Icons";

export function Toaster() {
  const { toasts, dismissToast } = useUI();
  if (!toasts.length) return null;
  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-4 z-[90] flex flex-col items-center gap-2 px-4 sm:items-end sm:px-6"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className="anim-slide-down pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-2xl border border-line bg-white p-3 shadow-lift"
        >
          {t.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={t.image} alt="" className="h-12 w-12 rounded-lg object-cover" />
          ) : (
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-sage text-forest">
              <CheckIcon width={18} height={18} />
            </span>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{t.title}</p>
            {t.body && <p className="truncate text-xs text-stone">{t.body}</p>}
          </div>
          <button
            onClick={() => dismissToast(t.id)}
            aria-label="Dismiss"
            className="rounded-full p-1 text-stone hover:bg-ivory"
          >
            <CloseIcon width={16} height={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
