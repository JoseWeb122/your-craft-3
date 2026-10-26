"use client";

import { useState, type FormEvent } from "react";
import { Field } from "./CheckoutClient";
import { InfoIcon, PackageIcon } from "@/components/ui/Icons";

export function TrackOrderForm() {
  const [tracking, setTracking] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<string | null>(null);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const v = tracking.trim();
    if (!v) return setError("Please enter your tracking number.");
    if (!/^[A-Za-z0-9\-]{6,40}$/.test(v)) return setError("Tracking numbers are 6–40 letters, numbers or dashes.");
    setError(null);
    setSubmitted(v);
  };

  return (
    <div className="mx-auto max-w-xl">
      <form onSubmit={submit} noValidate className="rounded-card border border-line bg-white p-6 shadow-soft sm:p-8">
        <Field
          id="tracking"
          label="Tracking Number"
          placeholder="e.g. the number from your confirmation email"
          value={tracking}
          onChange={(e) => { setTracking(e.target.value); setError(null); setSubmitted(null); }}
          error={error ?? undefined}
          autoComplete="off"
        />
        <button type="submit" className="btn-primary mt-5 w-full">Track</button>
      </form>

      {submitted && (
        <div role="status" className="anim-slide-down mt-6 rounded-card border border-line bg-sage/40 p-6">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-forest"><PackageIcon width={20} height={20} /></span>
            <div>
              <p className="font-semibold">Tracking number received: <span className="font-mono">{submitted}</span></p>
              <p className="mt-2 text-sm leading-6 text-charcoal/80">
                Live tracking is unavailable in this preview. The production store looks up shipments through its tracking provider; this prototype is not connected to it, so no shipping events can be shown here.
              </p>
              <p className="mt-2 text-sm text-charcoal/80">
                Need help with an order? Email <a href="mailto:support@yourcraftstore.com" className="font-semibold text-forest underline-offset-2 hover:underline">support@yourcraftstore.com</a>.
              </p>
            </div>
          </div>
        </div>
      )}

      <p className="mt-6 flex items-start gap-2 text-xs text-stone">
        <InfoIcon width={16} height={16} className="mt-0.5 shrink-0" />
        No tracking events, dates or carrier updates are simulated in this prototype.
      </p>
    </div>
  );
}
