import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import policies from "@/data/policies.json";
import { policyLinks } from "@/components/layout/Footer";

const titles: Record<string, string> = {
  "privacy-policy": "Privacy Policy",
  "refund-policy": "Refund Policy",
  "shipping-policy": "Shipping Policy",
  "terms-of-service": "Terms of Service",
};

type Slug = keyof typeof policies;

export function generateStaticParams() {
  return Object.keys(titles).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return { title: titles[slug] ?? "Policy", description: `${titles[slug] ?? "Policy"} for Your Craft Store.` };
}

/** Headings in the original policy text are short lines without terminal punctuation. */
const isHeading = (p: string) =>
  p.length < 70 && !/[.!?]$/.test(p) && !/^\d/.test(p) && p.split(" ").length <= 9;

export default async function PolicyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!(slug in titles)) notFound();
  const paragraphs = policies[slug as Slug] as string[];

  return (
    <section className="container-x py-14 lg:py-20">
      <div className="grid gap-12 lg:grid-cols-12">
        <aside className="lg:col-span-3">
          <p className="eyebrow">Information</p>
          <ul className="mt-4 space-y-1">
            {policyLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={`block rounded-lg px-3 py-2 text-sm ${l.href.endsWith(slug) ? "bg-forest text-white" : "text-charcoal/80 hover:bg-sage/60"}`}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </aside>
        <article className="lg:col-span-8">
          <h1 className="text-4xl text-forest sm:text-5xl">{titles[slug]}</h1>
          <p className="mt-3 text-xs text-stone">Policy wording reproduced from yourcraftstore.com.</p>
          <div className="prose-policy mt-8">
            {paragraphs.map((p, i) => (
              <p key={i} className={isHeading(p) ? "heading" : undefined}>{p}</p>
            ))}
          </div>
          <p className="mt-10 text-sm text-stone">
            Questions? Email <a href="mailto:support@yourcraftstore.com" className="font-semibold text-forest hover:underline">support@yourcraftstore.com</a>.
          </p>
        </article>
      </div>
    </section>
  );
}
