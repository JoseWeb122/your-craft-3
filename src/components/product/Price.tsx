import { cardCompare, formatPrice, hasVariants, minPrice, type Product } from "@/data/products";

export function Price({ product, compact = false }: { product: Product; compact?: boolean }) {
  const from = hasVariants(product) && new Set(product.variants.map((v) => v.price)).size > 1;
  const cmp = cardCompare(product);
  return (
    <p className={`flex flex-wrap items-baseline gap-x-2 ${compact ? "text-sm" : "text-[15px]"}`}>
      <span className="font-semibold text-charcoal tabular-nums">
        {from && <span className="text-xs font-medium text-stone">From </span>}
        {formatPrice(minPrice(product))}
      </span>
      {cmp && <span className="text-stone line-through tabular-nums">{formatPrice(cmp.was)}</span>}
    </p>
  );
}
