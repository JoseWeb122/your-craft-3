"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { formatPrice } from "@/data/products";
import { CheckIcon, InfoIcon } from "@/components/ui/Icons";

interface Done { reference: string; subtotal: number; itemCount: number }

export function CheckoutClient() {
  const { lines, subtotal, count, hydrated, clear } = useCart();
  const [form, setForm] = useState({ name: "", email: "", address: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [done, setDone] = useState<Done | null>(null);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setErrors((er) => ({ ...er, [k]: "" }));
  };

  const validate = () => {
    const er: Record<string, string> = {};
    if (!form.name.trim()) er.name = "Please enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email)) er.email = "Please enter a valid email address.";
    if (form.address.trim().length < 8) er.address = "Please enter a shipping address.";
    setErrors(er);
    return Object.keys(er).length === 0;
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus("loading");
    try {
      const r = await fetch("/api/demo-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, lines: lines.map((l) => ({ handle: l.handle, variantId: l.variantId, quantity: l.quantity })) }),
      });
      const d = await r.json();
      if (!r.ok) { setErrors(d.errors ?? {}); setStatus("error"); return; }
      setDone(d);
      clear();
      setStatus("idle");
    } catch {
      setStatus("error");
    }
  };

  if (done) {
    return (
      <div className="container-x py-16">
        <div className="mx-auto max-w-lg rounded-card border border-line bg-white p-8 text-center shadow-soft">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-sage text-forest"><CheckIcon width={28} height={28} /></span>
          <h1 className="mt-6 text-3xl text-forest">Demo order recorded</h1>
          <p className="mt-2 text-sm text-stone">Reference <span className="font-mono font-semibold text-charcoal">{done.reference}</span></p>
          <p className="mt-4 text-[15px] leading-7 text-charcoal/80">
            {done.itemCount} item{done.itemCount === 1 ? "" : "s"} · {formatPrice(done.subtotal)}
          </p>
          <div className="mt-6 flex items-start gap-2 rounded-xl bg-ivory p-4 text-left text-sm text-charcoal/80">
            <InfoIcon width={18} height={18} className="mt-0.5 shrink-0 text-terracotta" />
            <p><strong>This is a prototype.</strong> No payment was taken and no real order has been placed with Your Craft Store. The checkout data was saved to the preview database only.</p>
          </div>
          <Link href="/shop" className="btn-primary mt-8">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  if (hydrated && lines.length === 0) {
    return (
      <div className="container-x py-24 text-center">
        <h1 className="text-3xl text-forest">Your bag is empty</h1>
        <p className="mt-2 text-stone">Add a few quilting essentials before checking out.</p>
        <Link href="/shop" className="btn-primary mt-8">Shop All Products</Link>
      </div>
    );
  }

  return (
    <div className="container-x py-10 lg:py-16">
      <div className="mb-8 flex items-start gap-3 rounded-2xl border border-terracotta/30 bg-terracotta/10 p-4 text-sm text-charcoal/85">
        <InfoIcon width={20} height={20} className="mt-0.5 shrink-0 text-terracotta" />
        <p><strong>Demo checkout.</strong> This preview is not connected to Shopify or a payment provider. Do not enter real card details — none are requested. Submitting records a demo order in the prototype database only.</p>
      </div>
      <div className="grid gap-12 lg:grid-cols-12">
        <form onSubmit={submit} noValidate className="lg:col-span-7">
          <h1 className="text-3xl text-forest sm:text-4xl">Checkout</h1>
          <div className="mt-8 grid gap-5">
            <Field id="name" label="Full name" value={form.name} onChange={set("name")} error={errors.name} autoComplete="name" />
            <Field id="email" label="Email" type="email" value={form.email} onChange={set("email")} error={errors.email} autoComplete="email" />
            <div>
              <label htmlFor="address" className="mb-1.5 block text-sm font-semibold">Shipping address</label>
              <textarea id="address" rows={3} value={form.address} onChange={set("address")} className={`input ${errors.address ? "input-error" : ""}`} aria-invalid={!!errors.address} aria-describedby={errors.address ? "address-err" : undefined} autoComplete="street-address" />
              {errors.address && <p id="address-err" className="mt-1 text-xs text-terracotta">{errors.address}</p>}
            </div>
          </div>
          <div className="mt-6 rounded-2xl border border-dashed border-line bg-white p-5 text-sm text-stone">
            <p className="font-semibold text-charcoal">Payment</p>
            <p className="mt-1">Payment is intentionally disabled in this prototype. In production this step would hand off to Shopify&apos;s secure checkout.</p>
          </div>
          {status === "error" && !Object.keys(errors).length && <p role="alert" className="mt-4 text-sm text-terracotta">Something went wrong. Please try again.</p>}
          <button type="submit" disabled={status === "loading" || !hydrated} className="btn-primary mt-8 w-full sm:w-auto disabled:opacity-60">
            {status === "loading" ? "Recording demo order…" : "Place Demo Order"}
          </button>
        </form>

        <aside className="lg:col-span-5">
          <div className="rounded-card border border-line bg-white p-6 lg:sticky lg:top-28">
            <h2 className="font-display text-2xl text-forest">Order summary <span className="font-sans text-sm text-stone">({count})</span></h2>
            <ul className="mt-5 divide-y divide-line">
              {lines.map((l) => (
                <li key={l.key} className="flex gap-3 py-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={l.image} alt="" className="h-16 w-16 rounded-lg object-cover ring-1 ring-line" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{l.title}</p>
                    {l.variantTitle && <p className="text-xs text-stone">{l.variantTitle}</p>}
                    <p className="text-xs text-stone">Qty {l.quantity}</p>
                  </div>
                  <p className="text-sm font-semibold tabular-nums">{formatPrice(l.price * l.quantity)}</p>
                </li>
              ))}
            </ul>
            <dl className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
              <div className="flex justify-between"><dt className="text-stone">Subtotal</dt><dd className="tabular-nums">{formatPrice(subtotal)}</dd></div>
              <div className="flex justify-between"><dt className="text-stone">Shipping (USA)</dt><dd className="font-semibold text-forest">Free</dd></div>
              <div className="flex justify-between border-t border-line pt-3 text-base font-semibold"><dt>Total</dt><dd className="tabular-nums">{formatPrice(subtotal)}</dd></div>
            </dl>
          </div>
        </aside>
      </div>
    </div>
  );
}

export function Field({ id, label, error, hint, ...rest }: { id: string; label: string; error?: string; hint?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold">
        {label} {hint && <span className="font-normal text-stone">({hint})</span>}
      </label>
      <input id={id} className={`input ${error ? "input-error" : ""}`} aria-invalid={!!error} aria-describedby={error ? `${id}-err` : undefined} {...rest} />
      {error && <p id={`${id}-err`} className="mt-1 text-xs text-terracotta">{error}</p>}
    </div>
  );
}
