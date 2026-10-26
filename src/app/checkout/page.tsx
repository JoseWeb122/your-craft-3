import type { Metadata } from "next";
import { CheckoutClient } from "@/components/forms/CheckoutClient";

export const metadata: Metadata = { title: "Demo Checkout", robots: { index: false } };

export default function CheckoutPage() {
  return <CheckoutClient />;
}
