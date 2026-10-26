import { db } from "@/db";
import { demoOrders } from "@/db/schema";
import { getProduct } from "@/data/products";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

interface IncomingLine { handle: string; variantId: string; quantity: number }

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { name?: string; email?: string; address?: string; lines?: IncomingLine[] };
    const errors: Record<string, string> = {};
    if (!body.name?.trim()) errors.name = "Please enter your full name.";
    if (!body.email || !EMAIL_RE.test(body.email)) errors.email = "Please enter a valid email address.";
    if (!body.address || body.address.trim().length < 8) errors.address = "Please enter a shipping address.";
    if (!body.lines?.length) errors.lines = "Your bag is empty.";
    if (Object.keys(errors).length) return Response.json({ errors }, { status: 400 });

    // Re-price server-side from the shared catalog so totals can't be tampered with.
    const items = body.lines!.flatMap((l) => {
      const p = getProduct(l.handle);
      const v = p?.variants.find((x) => x.id === l.variantId);
      if (!p || !v || l.quantity < 1) return [];
      return [{ handle: p.handle, title: p.title, variant: v.title === "Default Title" ? null : v.title, price: v.price, quantity: Math.floor(l.quantity) }];
    });
    if (!items.length) return Response.json({ errors: { lines: "No valid items." } }, { status: 400 });

    const subtotal = items.reduce((n, i) => n + i.price * i.quantity, 0);
    const itemCount = items.reduce((n, i) => n + i.quantity, 0);
    const reference = `DEMO-${Date.now().toString(36).toUpperCase()}`;

    await db.insert(demoOrders).values({
      reference,
      customerName: body.name!.trim(),
      email: body.email!.trim().toLowerCase(),
      address: body.address!.trim(),
      items,
      itemCount,
      subtotal: subtotal.toFixed(2),
    });
    return Response.json({ ok: true, demo: true, reference, subtotal, itemCount });
  } catch {
    return Response.json({ error: "Unable to record the demo order." }, { status: 500 });
  }
}
