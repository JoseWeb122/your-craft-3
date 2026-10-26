"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useUI } from "@/components/ui/UIProvider";
import { CloseIcon, SearchIcon, ArrowRight } from "@/components/ui/Icons";
import { bestsellers, categoryName, formatPrice, minPrice, searchProducts } from "@/data/products";
import { Price } from "@/components/product/Price";

export function SearchOverlay() {
  const { searchOpen, closeSearch } = useUI();
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!searchOpen) return;
    setQ("");
    setTimeout(() => inputRef.current?.focus(), 30);
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeSearch();
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [searchOpen, closeSearch]);

  const results = useMemo(() => searchProducts(q), [q]);
  const trimmed = q.trim();

  if (!searchOpen) return null;

  const go = () => {
    if (!trimmed) return;
    closeSearch();
    router.push(`/shop?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <div className="fixed inset-0 z-[85]" role="dialog" aria-modal="true" aria-label="Search">
      <button aria-label="Close search" onClick={closeSearch} className="anim-fade-in absolute inset-0 bg-charcoal/40 backdrop-blur-[2px]" />
      <div className="anim-slide-down absolute inset-x-0 top-0 max-h-[100dvh] overflow-y-auto bg-ivory shadow-lift">
        <div className="container-x py-5 sm:py-8">
          <form
            onSubmit={(e) => { e.preventDefault(); go(); }}
            className="flex items-center gap-3 border-b-2 border-forest/20 pb-3 focus-within:border-forest"
          >
            <SearchIcon className="shrink-0 text-forest" />
            <label htmlFor="site-search" className="sr-only">Search products</label>
            <input
              ref={inputRef}
              id="site-search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search templates, mats, guides…"
              className="min-w-0 flex-1 bg-transparent font-display text-2xl text-charcoal placeholder:text-stone/50 outline-none sm:text-3xl"
              autoComplete="off"
            />
            {q && (
              <button type="button" onClick={() => { setQ(""); inputRef.current?.focus(); }} className="text-xs font-semibold uppercase tracking-widest text-stone hover:text-forest">
                Clear
              </button>
            )}
            <button type="button" onClick={closeSearch} aria-label="Close search" className="rounded-full p-2 hover:bg-sage/60">
              <CloseIcon />
            </button>
          </form>

          <div className="mt-6">
            {!trimmed ? (
              <>
                <p className="eyebrow">Popular right now</p>
                <ResultList items={bestsellers} onPick={closeSearch} />
              </>
            ) : results.length ? (
              <>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-stone">{results.length} result{results.length === 1 ? "" : "s"} for “{trimmed}”</p>
                  <button onClick={go} className="inline-flex items-center gap-1 text-sm font-semibold text-forest hover:underline">
                    View all in Shop <ArrowRight width={16} height={16} />
                  </button>
                </div>
                <ResultList items={results.slice(0, 8)} onPick={closeSearch} />
              </>
            ) : (
              <>
                <p className="font-display text-xl">No products match “{trimmed}”.</p>
                <p className="mt-1 text-sm text-stone">Try “template”, “mat”, “ruler” or “guide”. Here are a few favorites instead:</p>
                <ResultList items={bestsellers} onPick={closeSearch} />
              </>
            )}
          </div>
          <p className="mt-6 text-[11px] text-stone">Press <kbd className="rounded border border-line bg-white px-1">Enter</kbd> to search the shop · <kbd className="rounded border border-line bg-white px-1">Esc</kbd> to close</p>
        </div>
      </div>
    </div>
  );
}

function ResultList({ items, onPick }: { items: typeof bestsellers; onPick: () => void }) {
  return (
    <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((p) => (
        <li key={p.handle}>
          <Link
            href={`/products/${p.handle}`}
            onClick={onPick}
            className="flex items-center gap-3 rounded-2xl border border-line bg-white p-2.5 transition hover:-translate-y-0.5 hover:shadow-soft"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.images[0]} alt={p.title} className="h-16 w-16 shrink-0 rounded-xl object-cover" loading="lazy" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{p.title}</p>
              <p className="text-[11px] uppercase tracking-wider text-stone">{categoryName(p.category)}</p>
              <Price product={p} compact />
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export { formatPrice, minPrice };
