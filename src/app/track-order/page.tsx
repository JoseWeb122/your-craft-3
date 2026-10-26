import type { Metadata } from "next";
import { TrackOrderForm } from "@/components/forms/TrackOrderForm";

export const metadata: Metadata = {
  title: "Track Your Order",
  description: "Track the status of your Your Craft Store order using the tracking number from your confirmation email.",
};

export default function TrackOrderPage() {
  return (
    <section className="container-x py-14 lg:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <p className="eyebrow">Track your order</p>
        <h1 className="mt-3 text-4xl text-forest sm:text-5xl">Where&apos;s My Order?</h1>
        <p className="mt-5 text-[16px] leading-7 text-charcoal/70">
          Welcome to our tracking page! Here you can easily track the status of your order by simply entering the tracking number we provided in your confirmation email. If you have any questions don&apos;t hesitate to contact us.
        </p>
      </div>
      <div className="mt-10">
        <TrackOrderForm />
      </div>
    </section>
  );
}
