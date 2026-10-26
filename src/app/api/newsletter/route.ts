import { db } from "@/db";
import { newsletterSignups } from "@/db/schema";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(req: Request) {
  try {
    const { email } = (await req.json()) as { email?: string };
    if (!email || !EMAIL_RE.test(email)) {
      return Response.json({ error: "Please provide a valid email address." }, { status: 400 });
    }
    const inserted = await db
      .insert(newsletterSignups)
      .values({ email: email.toLowerCase().trim() })
      .onConflictDoNothing()
      .returning({ id: newsletterSignups.id });
    return Response.json({ ok: true, duplicate: inserted.length === 0, demo: true });
  } catch {
    return Response.json({ error: "Unable to save your signup right now." }, { status: 500 });
  }
}
