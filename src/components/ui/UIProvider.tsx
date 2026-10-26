"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface Toast {
  id: number;
  title: string;
  body?: string;
  image?: string;
}

interface UIState {
  cartOpen: boolean;
  searchOpen: boolean;
  menuOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  openSearch: () => void;
  closeSearch: () => void;
  setMenuOpen: (v: boolean) => void;
  toasts: Toast[];
  toast: (t: Omit<Toast, "id">) => void;
  dismissToast: (id: number) => void;
}

const Ctx = createContext<UIState | null>(null);

export function UIProvider({ children }: { children: ReactNode }) {
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismissToast = useCallback(
    (id: number) => setToasts((t) => t.filter((x) => x.id !== id)),
    [],
  );
  const toast = useCallback(
    (t: Omit<Toast, "id">) => {
      const id = Date.now() + Math.random();
      setToasts((list) => [...list, { ...t, id }]);
      setTimeout(() => dismissToast(id), 3200);
    },
    [dismissToast],
  );

  const value = useMemo<UIState>(
    () => ({
      cartOpen,
      searchOpen,
      menuOpen,
      openCart: () => {
        setSearchOpen(false);
        setMenuOpen(false);
        setCartOpen(true);
      },
      closeCart: () => setCartOpen(false),
      openSearch: () => {
        setCartOpen(false);
        setMenuOpen(false);
        setSearchOpen(true);
      },
      closeSearch: () => setSearchOpen(false),
      setMenuOpen,
      toasts,
      toast,
      dismissToast,
    }),
    [cartOpen, searchOpen, menuOpen, toasts, toast, dismissToast],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useUI = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error("useUI must be used within UIProvider");
  return v;
};
