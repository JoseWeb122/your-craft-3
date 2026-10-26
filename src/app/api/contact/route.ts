import { db } from "@/db";
import { contactMessages } from "@/db/schema";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { name?: string; email?: string; phone?: string; message?: string };
    const errors: Record<string, string> = {};
    if (!body.name?.trim()) errors.name = "Please enter your name.";
    if (!body.email || !EMAIL_RE.test(body.email)) errors.email = "Please enter a valid email address.";
    if (!body.message || body.message.trim().length < 10) errors.message = "Please enter a message of at least 10 characters.";
    if (body.phone && !/^[\d\s()+\-.]{7,20}$/.test(body.phone)) errors.phone = "Please enter a valid phone number.";
    if (Object.keys(errors).length) return Response.json({ errors }, { status: 400 });

    const [row] = await db
      .insert(contactMessages)
      .values({
        name: body.name!.trim(),
        email: body.email!.trim().toLowerCase(),
        phone: body.phone?.trim() || null,
        message: body.message!.trim(),
      })
      .returning({ id: contactMessages.id });
    return Response.json({ ok: true, id: row.id, demo: true });
  } catch {
    return Response.json({ error: "Unable to send your message right now." }, { status: 500 });
  }
}
