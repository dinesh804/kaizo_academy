import { NextResponse } from "next/server";
import { Resend } from "resend";
import { buildEmail, validateContact } from "@/lib/contact";
import { checkLimit } from "@/lib/rateLimit";
export const runtime = "nodejs"; export const dynamic = "force-dynamic";
const json = (body: object, status = 200, headers?: Record<string, string>) => NextResponse.json(body, { status, headers: { "Cache-Control": "no-store", ...headers } });
const FROM_RE = /^([^<>\r\n]+<[^<>\s@]+@[^<>\s@]+\.[^<>\s@]+>|[^<>\s@\r\n]+@[^<>\s@]+\.[^<>\s@]+)$/, TO_RE = /^[^\s@<>,;]+@[^\s@<>,;]+\.[^\s@<>,;]+$/;
function config() { // environment validation: secrets stay on the server and are never sent to the browser
  const key = process.env.RESEND_API_KEY?.trim(), to = process.env.CONTACT_TO_EMAIL?.trim(), from = process.env.CONTACT_FROM_EMAIL?.trim(), missing: string[] = [];
  if (!key) missing.push("RESEND_API_KEY"); if (!to || !TO_RE.test(to)) missing.push("CONTACT_TO_EMAIL"); if (!from || !FROM_RE.test(from)) missing.push("CONTACT_FROM_EMAIL");
  return missing.length ? { ok: false as const, missing } : { ok: true as const, key: key!, to: to!, from: from!.includes("<") ? from! : `KAIZO LABS <${from}>` };
}
export async function POST(req: Request) {
  const cfg = config();
  if (!cfg.ok) { console.error("[contact] not configured, missing/invalid:", cfg.missing.join(", ")); return json({ error: "The contact form is not available right now." }, 503); }
  const origin = req.headers.get("origin"), host = req.headers.get("host"); // same-origin only
  if (origin && host && new URL(origin).host !== host) return json({ error: "Forbidden" }, 403);
  let raw: Record<string, unknown>;
  try { const text = await req.text(); if (text.length > 20_000) return json({ error: "Request too large" }, 413); raw = JSON.parse(text); if (!raw || typeof raw !== "object" || Array.isArray(raw)) throw new Error(); } catch { return json({ error: "Invalid request" }, 400); }
  if (typeof raw.website === "string" && raw.website.trim()) return json({ ok: true }); // honeypot: bots fill the hidden field; pretend success, send nothing
  const ip = (req.headers.get("x-forwarded-for")?.split(",")[0] || req.headers.get("x-real-ip") || "unknown").trim();
  let lim; try { lim = await checkLimit(ip); } catch (e) { console.error("[contact] rate limiter error", e); return json({ error: "The contact form is not available right now." }, 503); }
  if (lim.mode === "unavailable") { console.error("[contact] production requires UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN for rate limiting"); return json({ error: "The contact form is not available right now." }, 503); }
  if (!lim.ok) return json({ error: "Too many requests. Please try again later." }, 429, { "Retry-After": String(lim.retryAfter) });
  const v = validateContact(raw); if (!v.ok) return json({ errors: v.errors }, 422);
  const { subject, html, text } = buildEmail(v.data);
  try {
    const { error } = await new Resend(cfg.key).emails.send({ from: cfg.from, to: [cfg.to], replyTo: v.data.email, subject, html, text });
    if (error) { console.error("[contact] Resend rejected the email:", error.name, error.message); return json({ error: "Could not send your message." }, 502); }
  } catch (e) { console.error("[contact] send failed:", e instanceof Error ? e.message : e); return json({ error: "Could not send your message." }, 502); }
  if (process.env.GOOGLE_SCRIPT_URL) { // optional, best-effort copy to the Google Sheet (does not affect the response)
    try { await fetch(process.env.GOOGLE_SCRIPT_URL, { method: "POST", headers: { "Content-Type": "text/plain" }, body: JSON.stringify({ ...v.data, message: `[${v.data.subject}] ${v.data.message}`, secret: process.env.GOOGLE_SCRIPT_SECRET }), signal: AbortSignal.timeout(4000) }); } catch { /* ignore */ }
  }
  return json({ ok: true });
}
