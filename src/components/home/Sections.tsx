import Link from "next/link";
import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowRight, LeafIcon, RulerIcon, ScissorsIcon, SparkleIcon, TruckIcon } from "@/components/ui/Icons";
import { bestsellers, categories, getProduct, products } from "@/data/products";
import { ProductCard } from "@/components/product/ProductCard";

/* ---------- 6. Benefit strip ---------- */
const benefits = [
  { icon: SparkleIcon, label: "Designed for Creative Projects" },
  { icon: ScissorsIcon, label: "Tools for Precise Cutting" },
  { icon: LeafIcon, label: "Beginner-Friendly Essentials" },
  { icon: TruckIcon, label: "Free Shipping Across the USA" },
];

export function BenefitStrip() {
  return (
    <section aria-label="Why shop with us" className="container-x mt-6 lg:mt-14">
      <Reveal>
        <ul className="grid grid-cols-2 divide-line overflow-hidden rounded-card border border-line bg-white lg:grid-cols-4 lg:divide-x">
          {benefits.map((b, i) => (
            <li key={b.label} className={`flex items-center gap-3 px-4 py-5 sm:px-6 ${i < 2 ? "border-b border-line lg:border-b-0" : ""} ${i % 2 === 0 ? "border-r border-line lg:border-r-0" : ""}`}>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sage/70 text-forest">
                <b.icon width={19} height={19} />
              </span>
              <span className="text-[13px] font-semibold leading-snug sm:text-sm">{b.label}</span>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}

/* ---------- 7. Featured product story ---------- */
export function FeaturedStory() {
  const product = getProduct("5-in-1-quilt-cutting-template")!;
  return (
    <section className="container-x mt-24 lg:mt-32">
      <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-6">
          <div className="relative">
            <div className="absolute -left-6 -top-6 h-40 w-40 rounded-full bg-sage/70 blur-2xl" />
            <div className="relative aspect-square overflow-hidden rounded-[1.5rem] bg-white shadow-soft ring-1 ring-line">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={product.images[0]} alt={product.title} className="h-full w-full object-cover" loading="lazy" />
            </div>
            <div className="absolute -bottom-6 -right-2 hidden w-40 overflow-hidden rounded-2xl shadow-lift ring-4 ring-ivory sm:block lg:-right-8 lg:w-48">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={product.images[2]} alt="" className="aspect-square w-full object-cover" loading="lazy" />
            </div>
          </div>
        </Reveal>
        <Reveal className="lg:col-span-6" delay={120}>
          <p className="eyebrow">Featured essential</p>
          <h2 className="mt-4 text-3xl leading-tight text-forest sm:text-4xl lg:text-[2.9rem]">
            The Quilter&apos;s Companion: Your 5-in-1 Essential for Perfect Cuts
          </h2>
          <p className="mt-6 text-[16px] leading-8 text-charcoal/75">
            Simplify your quilting projects with the versatile Quilter&apos;s Companion. This 5-in-1 ruler features precise grid lines and multiple shapes, eliminating the need for numerous tools. Crafted from durable, clear acrylic, it ensures smooth rotary cutter use and accurate cuts. Achieve professional-quality results and unlock your creative potential. Experience the ease and efficiency of quilting with the Quilter&apos;s Companion.
          </p>
          <ul className="mt-7 grid gap-3 sm:grid-cols-2">
            {[
              "Cut up to six 2-inch strips or twelve 1-inch strips without moving the ruler",
              "Precise grid lines and multiple shapes in one tool",
              "Durable, clear acrylic for smooth rotary cutter use",
              "Regular 6\" and Large 12\" sizes available",
            ].map((b) => (
              <li key={b} className="flex items-start gap-2.5 text-sm text-charcoal/80">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                {b}
              </li>
            ))}
          </ul>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href={`/products/${product.handle}`} className="btn-primary">Shop Now</Link>
            <Link href="/shop?category=cutting-templates" className="inline-flex items-center gap-1.5 px-2 text-sm font-semibold text-forest hover:underline">
              Explore related templates <ArrowRight width={16} height={16} />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- 8. Bestsellers ---------- */
export function Bestsellers() {
  return (
    <section id="bestsellers" className="container-x mt-28 scroll-mt-28 lg:mt-36">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="eyebrow">Customer favorites</p>
        <h2 className="mt-4 text-3xl text-forest sm:text-4xl lg:text-[2.9rem]">Essentials for Your Creative Journey</h2>
        <p className="mt-4 text-[16px] leading-7 text-charcoal/70">
          Explore practical quilting tools and guides that help bring your next project together.
        </p>
      </Reveal>
      <ul className="mt-12 grid grid-cols-1 gap-4 min-[420px]:grid-cols-2 sm:gap-6 xl:grid-cols-4">
        {bestsellers.map((p, i) => (
          <Reveal as="li" key={p.handle} delay={i * 80}>
            <ProductCard product={p} priority={i < 2} />
          </Reveal>
        ))}
      </ul>
      <div className="mt-12 text-center">
        <Link href="/shop" className="btn-secondary">View All Products</Link>
      </div>
    </section>
  );
}

/* ---------- 9. Precision feature ---------- */
export function PrecisionFeature() {
  return (
    <section className="mt-28 bg-sage/50 lg:mt-36">
      <div className="container-x grid items-center gap-10 py-16 lg:grid-cols-2 lg:gap-20 lg:py-24">
        <Reveal className="order-2 lg:order-1">
          <p className="eyebrow">Cutting tools</p>
          <h2 className="mt-4 text-3xl leading-tight text-forest sm:text-4xl lg:text-[2.9rem]">Precision That Makes Every Piece Fit.</h2>
          <p className="mt-6 max-w-lg text-[16px] leading-8 text-charcoal/75">
            Bring more confidence to your quilting process with tools and guides designed to help you plan, measure, and cut with greater clarity.
          </p>
          <div className="mt-8 flex flex-wrap gap-6 text-sm">
            <span className="flex items-center gap-2 text-charcoal/80"><RulerIcon width={18} height={18} className="text-forest" /> Clear grid markings</span>
            <span className="flex items-center gap-2 text-charcoal/80"><ScissorsIcon width={18} height={18} className="text-forest" /> Rotary-cutter friendly</span>
          </div>
          <Link href="/shop?category=cutting-templates" className="btn-primary mt-9">Discover Cutting Tools</Link>
        </Reveal>
        <Reveal className="order-1 lg:order-2" delay={100}>
          <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] shadow-lift">
            <Image src="/images/precision.jpg" alt="Close-up of an acrylic quilting ruler positioned over neatly arranged fabric strips" fill loading="lazy" sizes="(min-width:1024px) 50vw, 100vw" className="object-cover transition-transform duration-[1500ms] hover:scale-105" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- 10. Shop by need ---------- */
export function ShopByNeed() {
  const counts = Object.fromEntries(categories.map((c) => [c.slug, products.filter((p) => p.category === c.slug).length]));
  return (
    <section className="container-x mt-28 lg:mt-36">
      <Reveal className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow">Shop by need</p>
          <h2 className="mt-4 text-3xl text-forest sm:text-4xl lg:text-[2.9rem]">Find the Right Tool for the Job</h2>
        </div>
        <Link href="/shop" className="inline-flex items-center gap-1.5 text-sm font-semibold text-forest hover:underline">
          Browse everything <ArrowRight width={16} height={16} />
        </Link>
      </Reveal>
      <ul className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
        {categories.map((c, i) => (
          <Reveal as="li" key={c.slug} delay={i * 70}>
            <Link href={`/shop?category=${c.slug}`} className="group relative block aspect-[4/5] overflow-hidden rounded-card">
              <Image src={c.image} alt={c.name} fill loading="lazy" sizes="(min-width:1024px) 25vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/75 via-charcoal/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 text-white sm:p-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold">{counts[c.slug]} products</p>
                <h3 className="mt-1 text-xl sm:text-2xl">{c.name}</h3>
                <p className="mt-1 hidden text-xs leading-5 text-white/75 sm:block">{c.tagline}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">
                  Shop now <ArrowRight width={14} height={14} />
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}

/* ---------- 11. Inspiration ---------- */
export function Inspiration() {
  return (
    <section className="container-x mt-28 lg:mt-36">
      <Reveal>
        <div className="relative overflow-hidden rounded-[1.75rem] bg-forest text-white">
          <div className="grid lg:grid-cols-2">
            <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[520px]">
              <Image src="/images/inspiration.jpg" alt="A bright creative workspace with folded quilting fabrics, a cutting mat and a finished quilt" fill loading="lazy" sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-forest/20" />
            </div>
            <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-16">
              <p className="eyebrow text-gold">Creative inspiration</p>
              <h2 className="mt-4 text-3xl leading-tight sm:text-4xl lg:text-[2.9rem]">Your Ideas. Your Fabrics. Your Next Creation.</h2>
              <p className="mt-6 max-w-md text-[16px] leading-8 text-white/75">
                Find the tools and inspiration to help turn thoughtful planning into something you are proud to make.
              </p>
              <div className="mt-9">
                <Link href="/shop" className="btn-light">Explore the Store</Link>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
