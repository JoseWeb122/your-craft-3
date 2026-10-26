"use client";

import { useCallback } from "react";
import { useCart } from "./CartProvider";
import { useUI } from "@/components/ui/UIProvider";
import type { Product, Variant } from "@/data/products";

export function useAddToCart() {
  const { add } = useCart();
  const { toast, openCart } = useUI();
  return useCallback(
    (product: Product, variant: Variant, quantity = 1, opts?: { openDrawer?: boolean }) => {
      const line = add(product, variant, quantity);
      if (opts?.openDrawer) openCart();
      else
        toast({
          title: "Added to bag",
          body: `${product.title}${line.variantTitle ? ` · ${line.variantTitle}` : ""} × ${quantity}`,
          image: line.image,
        });
      return line;
    },
    [add, toast, openCart],
  );
}
