import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct, products, relatedProducts } from "@/data/products";
import { ProductDetail } from "@/components/product/ProductDetail";
import { ProductCard } from "@/components/product/ProductCard";
import { Reveal } from "@/components/ui/Reveal";

export function generateStaticParams() {
  return products.map((p) => ({ handle: p.handle }));
}

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }): Promise<Metadata> {
  const { handle } = await params;
  const p = getProduct(handle);
  if (!p) return { title: "Product not found" };
  return {
    title: p.title,
    description: p.description[0]?.slice(0, 155),
    openGraph: { images: [p.images[0]] },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params;
  const product = getProduct(handle);
  if (!product) notFound();
  const related = relatedProducts(product);

  return (
    <>
      <ProductDetail product={product} />
      <section className="container-x mt-24">
        <Reveal>
          <p className="eyebrow">You may also like</p>
          <h2 className="mt-3 text-3xl text-forest sm:text-4xl">Related Essentials</h2>
        </Reveal>
        <ul className="mt-8 grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 sm:gap-6 xl:grid-cols-4">
          {related.map((p, i) => (
            <Reveal as="li" key={p.handle} delay={i * 70}><ProductCard product={p} /></Reveal>
          ))}
        </ul>
      </section>
    </>
  );
}
