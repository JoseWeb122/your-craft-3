import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "@/components/ui/Icons";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute -left-40 top-20 h-[32rem] w-[32rem] rounded-full bg-sage/60 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-72 w-72 rounded-full bg-terracotta/10 blur-3xl" />
      <div className="container-x grid items-center gap-12 py-12 lg:grid-cols-12 lg:gap-8 lg:py-20">
        <div className="relative z-10 lg:col-span-6 xl:col-span-5">
          <p className="anim-fade-up eyebrow">Made for your next masterpiece</p>
          <h1 className="anim-fade-up delay-1 mt-5 text-[2.6rem] leading-[1.05] text-forest sm:text-[3.4rem] lg:text-[4rem] xl:text-[4.5rem]">
            Every Cut. Every Detail.{" "}
            <span className="relative inline-block">
              Beautifully Crafted.
              <svg className="absolute -bottom-2 left-0 w-full text-gold" viewBox="0 0 300 12" fill="none" preserveAspectRatio="none" aria-hidden>
                <path d="M2 9c60-6 180-8 296-3" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </span>
          </h1>
          <p className="anim-fade-up delay-2 mt-7 max-w-md text-[17px] leading-8 text-charcoal/75">
            Discover quilting essentials designed to bring greater precision, confidence, and creativity to every project.
          </p>
          <div className="anim-fade-up delay-3 mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/shop" className="btn-primary">
              Shop Quilting Essentials <ArrowRight width={16} height={16} />
            </Link>
            <a href="#bestsellers" className="btn-secondary">Explore Our Bestsellers</a>
          </div>
          <p className="anim-fade-up delay-4 mt-8 text-xs font-semibold tracking-[0.2em] text-stone">
            FREE SHIPPING ALL OVER USA
          </p>
        </div>

        <div className="relative lg:col-span-6 xl:col-span-7">
          <div className="anim-reveal-img relative aspect-[4/5] overflow-hidden rounded-[1.5rem] shadow-lift sm:aspect-[5/4] lg:aspect-[6/5] xl:aspect-[4/3]">
            <Image
              src="/images/hero.jpg"
              alt="Quilting workspace with a cutting mat, acrylic template, rotary cutter and neatly arranged colorful fabric"
              fill
              priority
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/25 via-transparent to-transparent" />
          </div>
          <div className="anim-fade-up delay-4 absolute -bottom-5 left-4 hidden rounded-2xl border border-line bg-white/95 px-5 py-4 shadow-soft backdrop-blur sm:block lg:-left-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-terracotta">Customer favorite</p>
            <p className="mt-1 font-display text-lg text-forest">5 In 1 Slotted Quilt Cutting Template</p>
            <p className="text-sm text-stone">From $29.99 <span className="line-through">$80.00</span> · Save 62%</p>
          </div>
        </div>
      </div>
    </section>
  );
}
