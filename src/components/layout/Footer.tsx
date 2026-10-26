import Link from "next/link";
import { Logo } from "./Header";
import { NewsletterForm } from "@/components/forms/NewsletterForm";

const company = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop All" },
  { href: "/track-order", label: "Track Order" },
  { href: "/contact", label: "Contact" },
];
export const policyLinks = [
  { href: "/policies/privacy-policy", label: "Privacy Policy" },
  { href: "/policies/refund-policy", label: "Refund Policy" },
  { href: "/policies/shipping-policy", label: "Shipping Policy" },
  { href: "/policies/terms-of-service", label: "Terms of Service" },
];

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative mt-24 overflow-hidden bg-forest text-white">
      <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-gold/10 blur-3xl" />
      <div className="container-x grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-12 lg:py-20">
        <div className="lg:col-span-4">
          <Logo light />
          <p className="mt-5 max-w-xs text-[15px] leading-7 text-white/75">
            Thoughtful quilting essentials for creative minds and carefully crafted projects.
          </p>
          <p className="mt-6 text-xs font-semibold tracking-[0.22em] text-gold">FREE SHIPPING ALL OVER USA</p>
        </div>

        <div className="lg:col-span-2">
          <h3 className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-white/60">Company</h3>
          <ul className="mt-5 space-y-3">
            {company.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-[15px] text-white/85 transition hover:text-gold">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-2">
          <h3 className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-white/60">Information</h3>
          <ul className="mt-5 space-y-3">
            {policyLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-[15px] text-white/85 transition hover:text-gold">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-2 lg:col-span-4">
          <h3 className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-white/60">Newsletter</h3>
          <p className="mt-4 text-sm text-white/70">New quilting essentials and offers, straight to your inbox.</p>
          <div className="mt-4"><NewsletterForm /></div>
          <h3 className="mt-8 font-sans text-xs font-bold uppercase tracking-[0.2em] text-white/60">Contact</h3>
          <a href="mailto:support@yourcraftstore.com" className="mt-3 inline-block text-[15px] text-white/85 underline-offset-4 hover:text-gold hover:underline">
            support@yourcraftstore.com
          </a>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col items-center justify-between gap-3 py-6 text-xs text-white/60 sm:flex-row">
          <p>© {year} Your Craft Store. All rights reserved.</p>
          <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2">
            {policyLinks.map((l) => (
              <li key={l.href}><Link href={l.href} className="hover:text-white">{l.label}</Link></li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
