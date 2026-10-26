"use client";

import { useState, type FormEvent } from "react";
import { Field } from "./CheckoutClient";
import { CheckIcon } from "@/components/ui/Icons";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">("idle");

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    setErrors((er) => ({ ...er, [k]: "" }));
  };

  const validate = () => {
    const er: Record<string, string> = {};
    if (!form.name.trim()) er.name = "Please enter your name.";
    if (!EMAIL_RE.test(form.email)) er.email = "Please enter a valid email address.";
    if (form.phone && !/^[\d\s()+\-.]{7,20}$/.test(form.phone)) er.phone = "Please enter a valid phone number.";
    if (form.message.trim().length < 10) er.message = "Please enter a message of at least 10 characters.";
    setErrors(er);
    return Object.keys(er).length === 0;
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus("loading");
    try {
      const r = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const d = await r.json();
      if (!r.ok) { setErrors(d.errors ?? {}); setStatus("error"); return; }
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div role="status" className="anim-slide-down rounded-card border border-line bg-white p-8 text-center shadow-soft">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-sage text-forest"><CheckIcon width={24} height={24} /></span>
        <h2 className="mt-5 text-2xl text-forest">Message received (simulated)</h2>
        <p className="mt-3 text-[15px] leading-7 text-charcoal/80">
          Thanks, {form.name.split(" ")[0]}. Your message was saved in the prototype database, but this preview has no connected email service, so it has <strong>not</strong> been delivered to the support team. For a real enquiry please email{" "}
          <a href="mailto:support@yourcraftstore.com" className="font-semibold text-forest hover:underline">support@yourcraftstore.com</a>.
        </p>
        <button onClick={() => { setForm({ name: "", email: "", phone: "", message: "" }); setStatus("idle"); }} className="btn-secondary mt-6">Send another message</button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="rounded-card border border-line bg-white p-6 shadow-soft sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="name" label="Name" value={form.name} onChange={set("name")} error={errors.name} autoComplete="name" />
        <Field id="email" label="Email" type="email" value={form.email} onChange={set("email")} error={errors.email} autoComplete="email" />
      </div>
      <div className="mt-5">
        <Field id="phone" label="Phone number" hint="optional" type="tel" value={form.phone} onChange={set("phone")} error={errors.phone} autoComplete="tel" />
      </div>
      <div className="mt-5">
        <label htmlFor="message" className="mb-1.5 block text-sm font-semibold">Message</label>
        <textarea id="message" rows={5} value={form.message} onChange={set("message")} className={`input ${errors.message ? "input-error" : ""}`} aria-invalid={!!errors.message} aria-describedby={errors.message ? "message-err" : undefined} />
        {errors.message && <p id="message-err" className="mt-1 text-xs text-terracotta">{errors.message}</p>}
      </div>
      {status === "error" && !Object.values(errors).some(Boolean) && <p role="alert" className="mt-4 text-sm text-terracotta">Something went wrong. Please try again.</p>}
      <button type="submit" disabled={status === "loading"} className="btn-primary mt-6 w-full sm:w-auto disabled:opacity-60">
        {status === "loading" ? "Sending…" : "Send Message"}
      </button>
      <p className="mt-3 text-xs text-stone">Prototype: messages are stored for demonstration and are not emailed.</p>
    </form>
  );
}
