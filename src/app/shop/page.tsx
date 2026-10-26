import type { Metadata } from "next";
import { Suspense } from "react";
import { ShopClient } from "@/components/product/ShopClient";
import { products } from "@/data/products";

export const metadata: Metadata = {
  title: "Shop All",
  description:
    "Browse all quilting templates, cutting mats, quilt guides and cutting tools from Your Craft Store. Free shipping all over USA.",
};

export default function ShopPage() {
  return (
    <>
      <section className="container-x pb-8 pt-12 lg:pt-16">
        <p className="eyebrow">Shop All</p>
        <h1 className="mt-3 text-4xl text-forest sm:text-5xl">All Quilting Essentials</h1>
        <p className="mt-4 max-w-xl text-[16px] leading-7 text-charcoal/70">
          Templates, mats, guides and everyday cutting tools — {products.length} products curated from the Your Craft Store catalog.
        </p>
      </section>
      <Suspense fallback={<div className="container-x py-20 text-center text-stone">Loading products…</div>}>
        <ShopClient />
      </Suspense>
    </>
  );
}
