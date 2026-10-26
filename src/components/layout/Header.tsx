"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { useUI } from "@/components/ui/UIProvider";
import { BagIcon, SearchIcon } from "@/components/ui/Icons";

export const NAV = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop All" },
  { href: "/track-order", label: "Track Order" },
  { href: "/contact", label: "Contact" },
];

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" aria-label="Your Craft Store — home" className="group inline-flex items-center gap-2.5">
      <span
        className={`flex h-9 w-9 items-center justify-center rounded-full border transition group-hover:rotate-6 ${
          light ? "border-white/30 text-gold" : "border-forest/20 bg-sage/60 text-forest"
        }`}
      >
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
          <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />
          <path d="M4 4l7 7M20 4l-7 7M4 20l7-7M20 20l-7-7" strokeOpacity=".5" />
        </svg>
      </span>
      <span className={`font-display text-[22px] leading-none ${light ? "text-white" : "text-forest"}`}>
        Your Craft Store
      </span>
    </Link>
  );
}

export function Header() {
  const pathname = usePathname();
  const { count, hydrated } = useCart();
  const { openCart, openSearch } = useUI();
  const [scrolled, setScrolled] = useState(false);
  const [bump, setBump] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!hydrated || count === 0) return;
    setBump(true);
    const t = setTimeout(() => setBump(false), 350);
    return () => clearTimeout(t);
  }, [count, hydrated]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={`sticky top-0 z-[60] border-b transition-all duration-300 ${
        scrolled
          ? "border-line bg-ivory/90 shadow-header backdrop-blur-md"
          : "border-transparent bg-ivory"
      }`}
    >
      <div className={`container-x flex items-center justify-between gap-4 transition-all ${scrolled ? "h-16" : "h-20"}`}>
        <div className="flex min-w-0 flex-1 items-center gap-5 lg:gap-10">
        <Logo />

        <nav aria-label="Primary" className="no-scrollbar min-w-0 overflow-x-auto">
          <ul className="flex items-center gap-5 whitespace-nowrap lg:gap-9">
            {NAV.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  className={`relative py-2 text-[14px] font-semibold tracking-wide transition-colors hover:text-forest ${
                    isActive(n.href) ? "text-forest" : "text-charcoal/75"
                  }`}
                >
                  {n.label}
                  <span
                    className={`absolute -bottom-0.5 left-0 h-[2px] rounded-full bg-forest transition-all duration-300 ${
                      isActive(n.href) ? "w-full" : "w-0"
                    }`}
                  />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        </div>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <button
            onClick={openSearch}
            aria-label="Search products"
            className="rounded-full p-2 text-charcoal hover:bg-sage/60"
          >
            <SearchIcon />
          </button>
          <button
            onClick={openCart}
            aria-label={`Open cart, ${count} items`}
            className="relative rounded-full p-2 text-charcoal hover:bg-sage/60"
          >
            <BagIcon />
            {hydrated && count > 0 && (
              <span
                className={`absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-terracotta px-1 text-[10px] font-bold text-charcoal transition-transform ${
                  bump ? "scale-125" : "scale-100"
                }`}
              >
                {count}
              </span>
            )}
          </button>
        </div>
      </div>

    </header>
  );
}
