/**
 * Shared product data source for Your Craft Store.
 *
 * `catalog.json` was exported from the live Shopify storefront
 * (https://yourcraftstore.com/products.json) and contains the real product
 * titles, descriptions, variants, prices, compare-at prices and CDN images.
 *
 * To connect the live Shopify catalog later, replace `catalog.json` with a
 * fetch from the Storefront API and map it to the `Product` shape below.
 */
import catalog from "./catalog.json";

export type CategorySlug =
  | "cutting-templates"
  | "quilting-guides"
  | "cutting-mats"
  | "quilting-essentials";

export interface Variant {
  id: string;
  title: string;
  price: number;
  compareAtPrice: number | null;
  image: string | null;
}

export interface Product {
  id: string;
  handle: string;
  title: string;
  category: CategorySlug;
  featured: boolean;
  bestsellerRank: number | null;
  optionName: string | null;
  variants: Variant[];
  images: string[];
  description: string[];
  sourceUrl: string;
}

export interface Category {
  slug: CategorySlug;
  name: string;
  tagline: string;
  image: string;
}

export const categories: Category[] = [
  {
    slug: "cutting-templates",
    name: "Cutting Templates",
    tagline: "Slotted and acrylic templates for clean, repeatable shapes.",
    image: "/images/cat-templates.jpg",
  },
  {
    slug: "quilting-guides",
    name: "Quilting Guides",
    tagline: "Step-by-step charts and block guides to plan with confidence.",
    image: "/images/cat-guides.jpg",
  },
  {
    slug: "cutting-mats",
    name: "Cutting Mats",
    tagline: "Self-healing surfaces with clear grids and angle lines.",
    image: "/images/cat-mats.jpg",
  },
  {
    slug: "quilting-essentials",
    name: "Quilting Essentials",
    tagline: "Rulers, rotary sets and everyday tools for the cutting table.",
    image: "/images/cat-essentials.jpg",
  },
];

export const products: Product[] = catalog as Product[];

export const categoryName = (slug: string) =>
  categories.find((c) => c.slug === slug)?.name ?? "Quilting";

export const getProduct = (handle: string) =>
  products.find((p) => p.handle === handle);

export const bestsellers = products
  .filter((p) => p.bestsellerRank)
  .sort((a, b) => (a.bestsellerRank ?? 0) - (b.bestsellerRank ?? 0));

export const hasVariants = (p: Product) =>
  p.variants.length > 1 && p.optionName !== null;

export const minPrice = (p: Product) =>
  Math.min(...p.variants.map((v) => v.price));

/**
 * Card-level "was" price and savings claim exactly as shown on the live
 * storefront's Best Sellers grid (e.g. cutting mat "From $49.95 / $100.00 /
 * SAVE 50%"). Product detail pages use per-variant compare-at prices.
 */
export const cardCompare = (p: Product): { was: number; pct: number } | null => {
  if (p.handle === "quilters-cutting-mat") return { was: 100, pct: 50 };
  const v = [...p.variants].sort((a, b) => a.price - b.price)[0];
  if (v.compareAtPrice && v.compareAtPrice > v.price) {
    return {
      was: v.compareAtPrice,
      pct: Math.floor((1 - v.price / v.compareAtPrice) * 100),
    };
  }
  return null;
};

export const relatedProducts = (p: Product, n = 4) => {
  const same = products.filter(
    (x) => x.handle !== p.handle && x.category === p.category,
  );
  const rest = products.filter(
    (x) => x.handle !== p.handle && x.category !== p.category,
  );
  return [...same, ...rest].slice(0, n);
};

export const searchProducts = (q: string, list: Product[] = products) => {
  const term = q.trim().toLowerCase();
  if (!term) return [];
  return list.filter(
    (p) =>
      p.title.toLowerCase().includes(term) ||
      categoryName(p.category).toLowerCase().includes(term) ||
      p.description.some((d) => d.toLowerCase().includes(term)),
  );
};

export const formatPrice = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
