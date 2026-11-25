import { NextResponse } from "next/server";
const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const cut = (v: unknown, n: number) => String(v ?? "").trim().slice(0, n);
export async function POST(req: Request) {
  let b: Record<string, unknown>;
  try { b = await req.json(); } catch { return NextResponse.json({ error: "Invalid request" }, { status: 400 }); }
  const d = { name: cut(b.name, 100), email: cut(b.email, 200), phone: cut(b.phone, 20), programme: cut(b.programme, 100), status: cut(b.status, 200), message: cut(b.message, 2000) };
  const errors: Record<string, string> = {};
  if (d.name.length < 2) errors.name = "Enter your full name.";
  if (!email.test(d.email)) errors.email = "Enter a valid email address.";
  if (d.phone && !/^[+\d\s()-]{7,20}$/.test(d.phone)) errors.phone = "Enter a valid phone number.";
  if (!d.programme) errors.programme = "Choose a programme.";
  if (d.message.length < 5) errors.message = "Write a short message.";
  if (Object.keys(errors).length) return NextResponse.json({ errors }, { status: 422 });
  const url = process.env.GOOGLE_SCRIPT_URL;
  if (!url) return NextResponse.json({ ok: true, stored: false });
  try { // Google Apps Script saves to Google Sheets and emails the owner (see docs/google-apps-script.gs)
    const r = await fetch(url, { method: "POST", headers: { "Content-Type": "text/plain" }, body: JSON.stringify({ ...d, secret: process.env.GOOGLE_SCRIPT_SECRET }), redirect: "follow" });
    const j = await r.json().catch(() => ({}));
    return NextResponse.json({ ok: true, stored: j.ok === true });
  } catch { return NextResponse.json({ ok: true, stored: false }); }
}
