"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight } from "@/components/ui/Icons";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "dupe" | "error">("idle");
  const [err, setErr] = useState<string | null>(null);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!EMAIL_RE.test(email)) {
      setErr("Please enter a valid email address.");
      return;
    }
    setErr(null);
    setStatus("loading");
    try {
      const r = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error ?? "Failed");
      setStatus(d.duplicate ? "dupe" : "ok");
      setEmail("");
    } catch {
      setStatus("error");
    }
  };

  if (status === "ok" || status === "dupe") {
    return (
      <p className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white/85">
        {status === "ok" ? "Thanks — you're on the list for this preview." : "That email is already on the preview list."}{" "}
        <span className="text-white/60">
          Demo only: this signup is stored in the prototype database and is not connected to a live mailing service.
        </span>
      </p>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-2">
      <label htmlFor="newsletter-email" className="sr-only">Email address</label>
      <div className={`flex overflow-hidden rounded-full border bg-white/5 transition focus-within:border-gold ${err ? "border-terracotta" : "border-white/20"}`}>
        <input
          id="newsletter-email"
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setErr(null); }}
          placeholder="Your email address"
          className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-white placeholder:text-white/50 outline-none"
          aria-invalid={!!err}
          aria-describedby={err ? "newsletter-err" : undefined}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          aria-label="Subscribe"
          className="flex items-center gap-1 bg-gold px-4 text-xs font-bold uppercase tracking-widest text-charcoal transition hover:bg-[#ffd43b] disabled:opacity-60"
        >
          {status === "loading" ? "…" : <ArrowRight width={18} height={18} />}
        </button>
      </div>
      {err && <p id="newsletter-err" className="text-xs text-terracotta">{err}</p>}
      {status === "error" && <p className="text-xs text-terracotta">Something went wrong. Please try again.</p>}
    </form>
  );
}
