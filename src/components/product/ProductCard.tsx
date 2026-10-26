"use client";

import Link from "next/link";
import { useState } from "react";
import { cardCompare, categoryName, formatPrice, hasVariants, type Product } from "@/data/products";
import { Price } from "./Price";
import { useAddToCart } from "@/components/cart/useAddToCart";
import { BagIcon, CloseIcon, CheckIcon } from "@/components/ui/Icons";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const addToCart = useAddToCart();
  const [picker, setPicker] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [added, setAdded] = useState(false);
  const cmp = cardCompare(product);
  const needsVariant = hasVariants(product);
  const img2 = product.images[1];

  const flash = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  const quickAdd = () => {
    if (!needsVariant) {
      addToCart(product, product.variants[0]);
      flash();
      return;
    }
    setPicker(true);
  };

  const confirmVariant = () => {
    const v = product.variants.find((x) => x.id === selected);
    if (!v) return;
    addToCart(product, v);
    setPicker(false);
    setSelected(null);
    flash();
  };

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-card border border-line bg-white transition-all duration-500 hover:-translate-y-1 hover:border-sage-deep hover:shadow-lift">
      <Link href={`/products/${product.handle}`} className="relative block aspect-square overflow-hidden bg-[#f5f1f8]" aria-label={product.title}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.images[0]}
          alt={product.title}
          loading={priority ? "eager" : "lazy"}
          className={`h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${img2 ? "group-hover:opacity-0" : ""}`}
        />
        {img2 && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={img2}
            alt=""
            loading="lazy"
            aria-hidden
            className="absolute inset-0 h-full w-full scale-105 object-cover opacity-0 transition-all duration-700 ease-out group-hover:scale-100 group-hover:opacity-100"
          />
        )}
        {cmp && (
          <span className="absolute left-3 top-3 rounded-full bg-terracotta px-2.5 py-1 text-[11px] font-bold tracking-wider text-charcoal shadow-sm">
            SAVE {cmp.pct}%
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone">{categoryName(product.category)}</p>
        <h3 className="mt-1.5 font-sans text-[15px] font-semibold leading-snug">
          <Link href={`/products/${product.handle}`} className="hover:text-forest">
            <span className="absolute inset-x-0 top-0 aspect-square" aria-hidden />
            {product.title}
          </Link>
        </h3>
        {needsVariant && (
          <p className="mt-1 text-xs text-stone">
            {product.variants.length} {product.optionName?.toLowerCase() ?? "option"}s available
          </p>
        )}
        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <Price product={product} />
          <button
            onClick={quickAdd}
            aria-label={needsVariant ? `Choose options for ${product.title}` : `Add ${product.title} to bag`}
            className={`relative z-10 inline-flex h-10 shrink-0 items-center gap-1.5 rounded-full px-3.5 text-xs font-semibold transition-all ${
              added ? "bg-forest text-white" : "bg-sage text-forest hover:bg-forest hover:text-white"
            }`}
          >
            {added ? <CheckIcon width={16} height={16} /> : <BagIcon width={16} height={16} />}
            <span className="hidden sm:inline">{added ? "Added" : needsVariant ? "Options" : "Quick Add"}</span>
          </button>
        </div>
      </div>

      {picker && (
        <div className="anim-fade-in absolute inset-0 z-20 flex flex-col bg-white/95 p-4 backdrop-blur-sm sm:p-5">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="eyebrow">Select {product.optionName}</p>
              <p className="mt-1 text-sm font-semibold leading-snug">{product.title}</p>
            </div>
            <button onClick={() => { setPicker(false); setSelected(null); }} aria-label="Close options" className="rounded-full p-1.5 hover:bg-sage/60">
              <CloseIcon width={18} height={18} />
            </button>
          </div>
          <div className="mt-3 flex-1 space-y-2 overflow-y-auto">
            {product.variants.map((v) => (
              <button
                key={v.id}
                onClick={() => setSelected(v.id)}
                aria-pressed={selected === v.id}
                className={`flex w-full items-center justify-between rounded-xl border px-3 py-2.5 text-left text-sm transition ${
                  selected === v.id ? "border-forest bg-sage/50 ring-1 ring-forest" : "border-line hover:border-forest/40"
                }`}
              >
                <span className="pr-2 leading-snug">{v.title}</span>
                <span className="shrink-0 text-right">
                  <span className="font-semibold tabular-nums">{formatPrice(v.price)}</span>
                  {v.compareAtPrice && <span className="ml-1.5 text-xs text-stone line-through">{formatPrice(v.compareAtPrice)}</span>}
                </span>
              </button>
            ))}
          </div>
          <button onClick={confirmVariant} disabled={!selected} className="btn-primary mt-3 w-full py-3 disabled:cursor-not-allowed disabled:opacity-50">
            Add to Bag
          </button>
        </div>
      )}
    </article>
  );
}
