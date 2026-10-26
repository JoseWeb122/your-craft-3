"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { categories, minPrice, products, searchProducts, type CategorySlug } from "@/data/products";
import { ProductCard } from "./ProductCard";
import { Drawer } from "@/components/ui/Drawer";
import { CloseIcon, FilterIcon, SearchIcon } from "@/components/ui/Icons";

type Sort = "featured" | "price-asc" | "price-desc" | "alpha-asc" | "alpha-desc";
const sorts: { value: Sort; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "alpha-asc", label: "Alphabetically: A–Z" },
  { value: "alpha-desc", label: "Alphabetically: Z–A" },
];
const priceBands = [
  { id: "under-20", label: "Under $20", min: 0, max: 19.99 },
  { id: "20-40", label: "$20 – $40", min: 20, max: 40 },
  { id: "over-40", label: "Over $40", min: 40.01, max: Infinity },
];

export function ShopClient() {
  const router = useRouter();
  const sp = useSearchParams();
  const q = sp.get("q") ?? "";
  const category = (sp.get("category") ?? "") as CategorySlug | "";
  const sort = (sp.get("sort") ?? "featured") as Sort;
  const price = sp.get("price") ?? "";
  const [drawer, setDrawer] = useState(false);

  const update = useCallback(
    (patch: Record<string, string | null>) => {
      const next = new URLSearchParams(sp.toString());
      Object.entries(patch).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)));
      const s = next.toString();
      router.replace(`/shop${s ? `?${s}` : ""}`, { scroll: false });
    },
    [router, sp],
  );

  const results = useMemo(() => {
    let list = q ? searchProducts(q) : [...products];
    if (category) list = list.filter((p) => p.category === category);
    const band = priceBands.find((b) => b.id === price);
    if (band) list = list.filter((p) => minPrice(p) >= band.min && minPrice(p) <= band.max);
    switch (sort) {
      case "price-asc": list.sort((a, b) => minPrice(a) - minPrice(b)); break;
      case "price-desc": list.sort((a, b) => minPrice(b) - minPrice(a)); break;
      case "alpha-asc": list.sort((a, b) => a.title.localeCompare(b.title)); break;
      case "alpha-desc": list.sort((a, b) => b.title.localeCompare(a.title)); break;
      default:
        list.sort((a, b) => (a.bestsellerRank ?? 99) - (b.bestsellerRank ?? 99));
    }
    return list;
  }, [q, category, sort, price]);

  const activeChips = [
    q && { key: "q", label: `“${q}”` },
    category && { key: "category", label: categories.find((c) => c.slug === category)?.name ?? category },
    price && { key: "price", label: priceBands.find((b) => b.id === price)?.label ?? price },
  ].filter(Boolean) as { key: string; label: string }[];

  const clearAll = () => router.replace("/shop", { scroll: false });

  const Filters = (
    <div className="space-y-8">
      <div>
        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-stone">Category</h3>
        <ul className="mt-3 space-y-1">
          <li>
            <FilterButton active={!category} onClick={() => update({ category: null })} count={products.length}>All products</FilterButton>
          </li>
          {categories.map((c) => (
            <li key={c.slug}>
              <FilterButton active={category === c.slug} onClick={() => update({ category: category === c.slug ? null : c.slug })} count={products.filter((p) => p.category === c.slug).length}>
                {c.name}
              </FilterButton>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-stone">Price</h3>
        <ul className="mt-3 space-y-1">
          {priceBands.map((b) => (
            <li key={b.id}>
              <FilterButton active={price === b.id} onClick={() => update({ price: price === b.id ? null : b.id })}>{b.label}</FilterButton>
            </li>
          ))}
        </ul>
      </div>
      {activeChips.length > 0 && (
        <button onClick={clearAll} className="text-sm font-semibold text-terracotta hover:underline">Clear all filters</button>
      )}
    </div>
  );

  return (
    <div className="container-x pb-10">
      {/* Toolbar */}
      <div className="sticky top-16 z-30 -mx-5 border-y border-line bg-ivory/95 px-5 py-3 backdrop-blur sm:-mx-8 sm:px-8 lg:static lg:mx-0 lg:border-0 lg:bg-transparent lg:px-0 lg:py-0">
        <div className="flex flex-wrap items-center gap-3">
          <form
            onSubmit={(e) => { e.preventDefault(); const v = (new FormData(e.currentTarget).get("q") as string) ?? ""; update({ q: v.trim() || null }); }}
            className="flex min-w-0 flex-1 items-center gap-2 rounded-full border border-line bg-white px-4 focus-within:border-forest"
          >
            <SearchIcon width={18} height={18} className="shrink-0 text-stone" />
            <label htmlFor="shop-q" className="sr-only">Search products</label>
            <input id="shop-q" name="q" key={q} defaultValue={q} placeholder="Search products…" className="min-w-0 flex-1 bg-transparent py-2.5 text-sm outline-none" />
            {q && <button type="button" onClick={() => update({ q: null })} aria-label="Clear search" className="text-stone hover:text-forest"><CloseIcon width={16} height={16} /></button>}
          </form>
          <button onClick={() => setDrawer(true)} className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2.5 text-sm font-semibold lg:hidden">
            <FilterIcon width={18} height={18} /> Filters {activeChips.length > 0 && <span className="rounded-full bg-forest px-1.5 text-[10px] text-white">{activeChips.length}</span>}
          </button>
          <label className="flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2.5 text-sm">
            <span className="sr-only sm:not-sr-only sm:text-stone">Sort</span>
            <select value={sort} onChange={(e) => update({ sort: e.target.value === "featured" ? null : e.target.value })} className="bg-transparent text-sm font-semibold outline-none">
              {sorts.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </label>
        </div>
      </div>

      <div className="mt-6 grid gap-10 lg:grid-cols-[240px_1fr] lg:gap-14">
        <aside className="hidden lg:block">
          <div className="sticky top-28">{Filters}</div>
        </aside>

        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="mr-2 text-sm text-stone" aria-live="polite">
              <span className="font-semibold text-charcoal">{results.length}</span> product{results.length === 1 ? "" : "s"}
            </p>
            {activeChips.map((c) => (
              <button key={c.key} onClick={() => update({ [c.key]: null })} className="inline-flex items-center gap-1.5 rounded-full bg-sage px-3 py-1 text-xs font-semibold text-forest hover:bg-sage-deep">
                {c.label} <CloseIcon width={12} height={12} />
              </button>
            ))}
            {activeChips.length > 0 && (
              <button onClick={clearAll} className="text-xs font-semibold text-terracotta hover:underline">Clear all</button>
            )}
          </div>

          {results.length ? (
            <ul className="mt-6 grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 sm:gap-6 xl:grid-cols-3">
              {results.map((p, i) => (
                <li key={p.handle}><ProductCard product={p} priority={i < 3} /></li>
              ))}
            </ul>
          ) : (
            <div className="mt-10 rounded-card border border-dashed border-line bg-white px-6 py-16 text-center">
              <p className="font-display text-2xl text-forest">No products found</p>
              <p className="mt-2 text-sm text-stone">We couldn&apos;t find anything matching your filters{q ? ` for “${q}”` : ""}.</p>
              <button onClick={clearAll} className="btn-primary mt-6">Reset filters</button>
            </div>
          )}
        </div>
      </div>

      <Drawer open={drawer} onClose={() => setDrawer(false)} title="Filters" side="left">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="font-display text-2xl text-forest">Filters</h2>
          <button onClick={() => setDrawer(false)} aria-label="Close filters" className="rounded-full p-2 hover:bg-sage/60"><CloseIcon /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-6">{Filters}</div>
        <div className="border-t border-line p-5">
          <button onClick={() => setDrawer(false)} className="btn-primary w-full">Show {results.length} product{results.length === 1 ? "" : "s"}</button>
        </div>
      </Drawer>
    </div>
  );
}

function FilterButton({ active, onClick, children, count }: { active: boolean; onClick: () => void; children: React.ReactNode; count?: number }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition ${active ? "bg-forest text-white" : "text-charcoal/80 hover:bg-sage/60"}`}
    >
      <span>{children}</span>
      {count !== undefined && <span className={`text-xs ${active ? "text-white/70" : "text-stone"}`}>{count}</span>}
    </button>
  );
}
