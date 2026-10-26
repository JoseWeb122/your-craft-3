import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/ContactForm";
import { MailIcon, TruckIcon } from "@/components/ui/Icons";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Have a question about a product or your order? Contact Your Craft Store at support@yourcraftstore.com.",
};

export default function ContactPage() {
  return (
    <section className="container-x py-14 lg:py-20">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <p className="eyebrow">Contact</p>
          <h1 className="mt-3 text-4xl text-forest sm:text-5xl">We&apos;re Here to Help.</h1>
          <p className="mt-5 max-w-md text-[16px] leading-8 text-charcoal/70">
            Have a question about a product or your order? Send us a message and we&apos;ll be happy to help.
          </p>
          <div className="mt-8 space-y-4">
            <a href="mailto:support@yourcraftstore.com" className="flex items-center gap-4 rounded-2xl border border-line bg-white p-4 transition hover:border-forest/40 hover:shadow-soft">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-sage text-forest"><MailIcon width={20} height={20} /></span>
              <span>
                <span className="block text-xs font-bold uppercase tracking-[0.2em] text-stone">Email</span>
                <span className="font-semibold text-forest">support@yourcraftstore.com</span>
              </span>
            </a>
            <Link href="/track-order" className="flex items-center gap-4 rounded-2xl border border-line bg-white p-4 transition hover:border-forest/40 hover:shadow-soft">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-sage text-forest"><TruckIcon width={20} height={20} /></span>
              <span>
                <span className="block text-xs font-bold uppercase tracking-[0.2em] text-stone">Orders</span>
                <span className="font-semibold text-forest">Track your order</span>
              </span>
            </Link>
          </div>
        </div>
        <div className="lg:col-span-7">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
