"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { categoryName, formatPrice, hasVariants, type Product } from "@/data/products";
import { ProductGallery } from "./ProductGallery";
import { useAddToCart } from "@/components/cart/useAddToCart";
import { ChevronDown, ChevronRight, MinusIcon, PackageIcon, PlusIcon, TruckIcon } from "@/components/ui/Icons";

export function ProductDetail({ product }: { product: Product }) {
  const router = useRouter();
  const addToCart = useAddToCart();
  const needsVariant = hasVariants(product);
  const [variantId, setVariantId] = useState<string | null>(needsVariant ? null : product.variants[0].id);
  const [qty, setQty] = useState(1);
  const [imgIndex, setImgIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const variant = product.variants.find((v) => v.id === variantId) ?? null;
  const shown = variant ?? [...product.variants].sort((a, b) => a.price - b.price)[0];
  const prices = new Set(product.variants.map((v) => v.price));
  const showFrom = !variant && prices.size > 1;
  const pct = shown.compareAtPrice ? Math.floor((1 - shown.price / shown.compareAtPrice) * 100) : null;

  const pickVariant = (id: string) => {
    setVariantId(id);
    setError(null);
    const v = product.variants.find((x) => x.id === id);
    if (v?.image) {
      const i = product.images.indexOf(v.image);
      if (i >= 0) setImgIndex(i);
    }
  };

  const ensure = () => {
    if (!variant) {
      setError(`Please select a ${product.optionName?.toLowerCase() ?? "variant"} first.`);
      document.getElementById("variant-group")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return null;
    }
    return variant;
  };

  const onAdd = () => {
    const v = ensure();
    if (v) addToCart(product, v, qty, { openDrawer: true });
  };
  const onBuy = () => {
    const v = ensure();
    if (!v) return;
    addToCart(product, v, qty);
    router.push("/checkout");
  };
  const onImg = useCallback((i: number) => setImgIndex(i), []);

  // Description: first paragraph is treated as a headline on the live store.
  const [headline, ...body] = product.description;
  const bullets = body.filter((p) => /^[A-Z][\w\s&\-°/]+:\s/.test(p));
  const paragraphs = body.filter((p) => !bullets.includes(p));

  return (
    <div className="container-x">
      <nav aria-label="Breadcrumb" className="pt-6 text-xs text-stone sm:pt-8">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li><Link href="/" className="hover:text-forest">Home</Link></li>
          <li aria-hidden><ChevronRight width={12} height={12} /></li>
          <li><Link href="/shop" className="hover:text-forest">Shop All</Link></li>
          <li aria-hidden><ChevronRight width={12} height={12} /></li>
          <li><Link href={`/shop?category=${product.category}`} className="hover:text-forest">{categoryName(product.category)}</Link></li>
          <li aria-hidden><ChevronRight width={12} height={12} /></li>
          <li aria-current="page" className="truncate text-charcoal">{product.title}</li>
        </ol>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-7">
          <ProductGallery images={product.images} title={product.title} activeIndex={imgIndex} onChange={onImg} />
        </div>

        <div className="lg:col-span-5">
          <p className="eyebrow">{categoryName(product.category)}</p>
          <h1 className="mt-3 text-3xl leading-tight text-forest sm:text-4xl">{product.title}</h1>

          <div className="mt-5 flex flex-wrap items-baseline gap-3">
            <p className="font-display text-3xl tabular-nums">
              {showFrom && <span className="font-sans text-sm text-stone">From </span>}
              {formatPrice(shown.price)}
            </p>
            {shown.compareAtPrice && (
              <>
                <p className="text-lg text-stone line-through tabular-nums">{formatPrice(shown.compareAtPrice)}</p>
                <span className="rounded-full bg-terracotta px-2.5 py-1 text-[11px] font-bold tracking-wider text-charcoal">SAVE {pct}%</span>
              </>
            )}
          </div>
          {headline && <p className="mt-5 text-[16px] font-medium leading-7 text-charcoal/85">{headline}</p>}

          {needsVariant && (
            <fieldset id="variant-group" className="mt-7">
              <legend className="text-sm font-semibold">
                {product.optionName}: <span className="font-normal text-stone">{variant ? variant.title : "Select an option"}</span>
              </legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => pickVariant(v.id)}
                    aria-pressed={variantId === v.id}
                    className={`rounded-full border px-4 py-2 text-sm transition ${variantId === v.id ? "border-forest bg-forest text-white" : error ? "border-terracotta/60 hover:border-forest" : "border-line bg-white hover:border-forest"}`}
                  >
                    {v.title} <span className={`ml-1 text-xs ${variantId === v.id ? "text-white/70" : "text-stone"}`}>{formatPrice(v.price)}</span>
                  </button>
                ))}
              </div>
              {error && <p role="alert" className="mt-2 text-sm text-terracotta">{error}</p>}
            </fieldset>
          )}

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <div className="inline-flex h-12 items-center self-start rounded-full border border-line bg-white">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity" className="px-4 hover:text-forest"><MinusIcon width={16} height={16} /></button>
              <span className="w-8 text-center text-sm font-semibold tabular-nums" aria-live="polite">{qty}</span>
              <button onClick={() => setQty((q) => Math.min(99, q + 1))} aria-label="Increase quantity" className="px-4 hover:text-forest"><PlusIcon width={16} height={16} /></button>
            </div>
            <button onClick={onAdd} className="btn-primary h-12 flex-1">Add to Cart</button>
          </div>
          <button onClick={onBuy} className="btn-terracotta mt-3 h-12 w-full">Buy Now</button>
          <p className="mt-3 text-center text-[11px] text-stone">Prototype checkout — no real payment is collected.</p>

          <ul className="mt-7 grid gap-3 rounded-2xl bg-sage/50 p-4 text-sm sm:grid-cols-2">
            <li className="flex items-center gap-2.5"><TruckIcon width={18} height={18} className="text-forest" /> Free shipping all over USA</li>
            <li className="flex items-center gap-2.5"><PackageIcon width={18} height={18} className="text-forest" /> Processed in 1–3 business days</li>
          </ul>

          <div className="mt-8 divide-y divide-line border-y border-line">
            <Accordion title="Description" defaultOpen>
              {paragraphs.map((p, i) => <p key={i} className="mb-3 text-[15px] leading-7 text-charcoal/80 last:mb-0">{p}</p>)}
            </Accordion>
            {bullets.length > 0 && (
              <Accordion title="Key features">
                <ul className="space-y-2.5">
                  {bullets.map((b) => {
                    const [k, ...rest] = b.split(": ");
                    return (
                      <li key={b} className="flex gap-2.5 text-[15px] leading-6 text-charcoal/80">
                        <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                        <span><strong className="font-semibold text-charcoal">{k}:</strong> {rest.join(": ")}</span>
                      </li>
                    );
                  })}
                </ul>
              </Accordion>
            )}
            <Accordion title="Shipping & returns">
              <p className="text-[15px] leading-7 text-charcoal/80">
                Orders are typically processed within 1–3 business days, and delivery is estimated at 7–10 working days from dispatch. Replacements are provided for items that arrive damaged when reported within 7 days of delivery.
              </p>
              <div className="mt-3 flex flex-wrap gap-4 text-sm font-semibold text-forest">
                <Link href="/policies/shipping-policy" className="hover:underline">Shipping Policy</Link>
                <Link href="/policies/refund-policy" className="hover:underline">Refund Policy</Link>
              </div>
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
}

function Accordion({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <button onClick={() => setOpen((o) => !o)} aria-expanded={open} className="flex w-full items-center justify-between py-4 text-left text-[15px] font-semibold hover:text-forest">
        {title}
        <ChevronDown width={18} height={18} className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      <div className={`grid transition-all duration-300 ${open ? "grid-rows-[1fr] pb-5 opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
        <div className="overflow-hidden">{children}</div>
      </div>
    </div>
  );
}
