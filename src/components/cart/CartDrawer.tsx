"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "./CartProvider";
import { useUI } from "@/components/ui/UIProvider";
import { Drawer } from "@/components/ui/Drawer";
import { BagIcon, CloseIcon, MinusIcon, PlusIcon, TrashIcon } from "@/components/ui/Icons";
import { formatPrice } from "@/data/products";

export function CartDrawer() {
  const { cartOpen, closeCart } = useUI();
  const { lines, count, subtotal, setQuantity, remove } = useCart();
  const router = useRouter();

  return (
    <Drawer open={cartOpen} onClose={closeCart} labelledBy="cart-title">
      <div className="flex items-center justify-between border-b border-line px-5 py-4">
        <h2 id="cart-title" className="font-display text-2xl text-forest">
          Your Bag <span className="font-sans text-sm text-stone">({count})</span>
        </h2>
        <button onClick={closeCart} aria-label="Close cart" className="rounded-full p-2 hover:bg-sage/60">
          <CloseIcon />
        </button>
      </div>

      {lines.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-sage/70 text-forest">
            <BagIcon width={32} height={32} />
          </span>
          <h3 className="mt-6 font-display text-2xl">Your bag is empty</h3>
          <p className="mt-2 text-sm text-stone">Discover quilting essentials made for your next masterpiece.</p>
          <Link href="/shop" onClick={closeCart} className="btn-primary mt-7">Continue Shopping</Link>
        </div>
      ) : (
        <>
          <ul className="flex-1 divide-y divide-line overflow-y-auto px-5">
            {lines.map((l) => (
              <li key={l.key} className="flex gap-4 py-5">
                <Link href={`/products/${l.handle}`} onClick={closeCart} className="shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={l.image} alt={l.title} className="h-24 w-24 rounded-xl bg-white object-cover ring-1 ring-line" />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Link href={`/products/${l.handle}`} onClick={closeCart} className="line-clamp-2 text-sm font-semibold leading-snug hover:text-forest">
                        {l.title}
                      </Link>
                      {l.variantTitle && <p className="mt-0.5 text-xs text-stone">{l.variantTitle}</p>}
                    </div>
                    <button onClick={() => remove(l.key)} aria-label={`Remove ${l.title}`} className="rounded-full p-1.5 text-stone hover:bg-ivory hover:text-terracotta">
                      <TrashIcon width={17} height={17} />
                    </button>
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-3">
                    <div className="inline-flex items-center rounded-full border border-line">
                      <button onClick={() => setQuantity(l.key, l.quantity - 1)} aria-label="Decrease quantity" className="p-2 hover:text-forest">
                        <MinusIcon width={14} height={14} />
                      </button>
                      <span className="w-7 text-center text-sm font-semibold tabular-nums" aria-live="polite">{l.quantity}</span>
                      <button onClick={() => setQuantity(l.key, l.quantity + 1)} aria-label="Increase quantity" className="p-2 hover:text-forest">
                        <PlusIcon width={14} height={14} />
                      </button>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold tabular-nums">{formatPrice(l.price * l.quantity)}</p>
                      {l.quantity > 1 && <p className="text-[11px] text-stone">{formatPrice(l.price)} each</p>}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="border-t border-line bg-ivory px-5 py-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-stone">Subtotal</span>
              <span className="font-display text-2xl tabular-nums">{formatPrice(subtotal)}</span>
            </div>
            <p className="mt-1 text-xs text-stone">Free shipping all over USA. Taxes calculated at checkout.</p>
            <button
              onClick={() => { closeCart(); router.push("/checkout"); }}
              className="btn-primary mt-4 w-full"
            >
              Checkout
            </button>
            <button onClick={closeCart} className="mt-2 w-full py-2 text-center text-sm font-semibold text-forest hover:underline">
              Continue Shopping
            </button>
          </div>
        </>
      )}
    </Drawer>
  );
}
