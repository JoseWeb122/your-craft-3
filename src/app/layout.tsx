import type { Metadata } from "next";
import type { ReactNode } from "react";
import { DM_Serif_Display, Manrope } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/cart/CartProvider";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { SearchOverlay } from "@/components/search/SearchOverlay";
import { UIProvider } from "@/components/ui/UIProvider";
import { Toaster } from "@/components/ui/Toaster";

const dmSerif = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-dm-serif",
  display: "swap",
});
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Your Craft Store — Quilting Templates, Cutting Mats & Guides",
    template: "%s | Your Craft Store",
  },
  description:
    "Thoughtful quilting essentials for creative minds: slotted cutting templates, self-healing cutting mats, quilt charts and guides. Free shipping all over USA.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${dmSerif.variable} ${manrope.variable}`}>
      <body>
        <UIProvider>
          <CartProvider>
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-forest focus:px-4 focus:py-2 focus:text-white"
            >
              Skip to content
            </a>
            <AnnouncementBar />
            <Header />
            <main id="main">{children}</main>
            <Footer />
            <CartDrawer />
            <SearchOverlay />
            <Toaster />
          </CartProvider>
        </UIProvider>
      </body>
    </html>
  );
}
