"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getProduct, type Product, type Variant } from "@/data/products";

export interface CartLine {
  key: string; // handle::variantId
  handle: string;
  variantId: string;
  title: string;
  variantTitle: string | null;
  price: number;
  compareAtPrice: number | null;
  image: string;
  quantity: number;
}

interface CartState {
  lines: CartLine[];
  count: number;
  subtotal: number;
  hydrated: boolean;
  add: (product: Product, variant: Variant, quantity?: number) => CartLine;
  setQuantity: (key: string, quantity: number) => void;
  remove: (key: string) => void;
  clear: () => void;
}

const STORAGE_KEY = "ycs-cart-v1";
const Ctx = createContext<CartState | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartLine[];
        // Re-validate against the catalog so stale lines don't linger.
        setLines(parsed.filter((l) => getProduct(l.handle)));
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines, hydrated]);

  const add = useCallback<CartState["add"]>((product, variant, quantity = 1) => {
    const key = `${product.handle}::${variant.id}`;
    const line: CartLine = {
      key,
      handle: product.handle,
      variantId: variant.id,
      title: product.title,
      variantTitle: variant.title === "Default Title" ? null : variant.title,
      price: variant.price,
      compareAtPrice: variant.compareAtPrice,
      image: variant.image ?? product.images[0],
      quantity,
    };
    setLines((prev) => {
      const existing = prev.find((l) => l.key === key);
      if (existing) {
        return prev.map((l) =>
          l.key === key ? { ...l, quantity: l.quantity + quantity } : l,
        );
      }
      return [...prev, line];
    });
    return line;
  }, []);

  const setQuantity = useCallback((key: string, quantity: number) => {
    setLines((prev) =>
      quantity <= 0
        ? prev.filter((l) => l.key !== key)
        : prev.map((l) => (l.key === key ? { ...l, quantity } : l)),
    );
  }, []);

  const remove = useCallback(
    (key: string) => setLines((prev) => prev.filter((l) => l.key !== key)),
    [],
  );
  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartState>(() => {
    const count = lines.reduce((n, l) => n + l.quantity, 0);
    const subtotal = lines.reduce((n, l) => n + l.quantity * l.price, 0);
    return { lines, count, subtotal, hydrated, add, setQuantity, remove, clear };
  }, [lines, hydrated, add, setQuantity, remove, clear]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useCart = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error("useCart must be used within CartProvider");
  return v;
};
