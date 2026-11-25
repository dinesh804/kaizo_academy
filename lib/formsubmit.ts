import { validateContact, type ContactData } from "@/lib/contact";
// FormSubmit (formsubmit.co) AJAX endpoint. No API key. Set NEXT_PUBLIC_FORMSUBMIT_ID to the random alias FormSubmit gives you after activation
// to keep the email address out of the page's network requests; until then the notification address is used.
const TARGET = process.env.NEXT_PUBLIC_FORMSUBMIT_ID || "vdn23022003@gmail.com";
export const ENDPOINT = `https://formsubmit.co/ajax/${TARGET}`;
export const COOLDOWN_MS = 30_000, MIN_FILL_MS = 2_000;
/** Exactly the visitor's own fields plus FormSubmit settings. Nothing else (no IP, user agent, analytics or tracking IDs) is added. */
export function buildPayload(d: ContactData) {
  return { _subject: "New Contact Enquiry – KAIZO LABS", _replyto: d.email, _template: "table", _captcha: "false",
    "Full name": d.name, "Email address": d.email, "Phone number": d.phone || "Not provided", "Interested programme": d.programme || "Not specified",
    Subject: d.subject, "Current education or professional status": d.status || "Not provided", Message: d.message };
}
export type Result = { ok: true } | { ok: false; kind: "invalid" | "cooldown" | "activation" | "network" | "timeout" | "rejected" | "unavailable" | "unexpected"; message: string; code?: string; errors?: Record<string, string> };
const CONTACT = "contact us by WhatsApp or email";
const fail = (kind: Extract<Result, { ok: false }>["kind"], code: string, message: string): Result => ({ ok: false, kind, code, message });
/** Plain mailto link used as a fallback when sending fails (nothing is sent to any third party). */
export const mailtoFallback = (raw: Record<string, unknown>, to: string) => { const g = (k: string) => (typeof raw[k] === "string" ? (raw[k] as string).slice(0, 1500) : "");
  return `mailto:${to}?subject=${encodeURIComponent(g("subject") || "Website enquiry")}&body=${encodeURIComponent(`${g("message")}

${g("name")}
${g("email")}
${g("phone")}`)}`; };
export async function sendEnquiry(raw: Record<string, unknown>, o: { openedAt: number; lastSent?: number; now?: number; fetchImpl?: typeof fetch }): Promise<Result> {
  const now = o.now ?? Date.now();
  if (typeof raw._honey === "string" && raw._honey.trim()) return { ok: true }; // honeypot: bots fill the hidden field; nothing is sent
  if (o.lastSent && now - o.lastSent < COOLDOWN_MS) return fail("cooldown", "COOLDOWN", "Your message was just sent. Please wait a little before sending another.");
  if (now - o.openedAt < MIN_FILL_MS) return fail("cooldown", "TOO-FAST", "Please take a moment to review your message, then send it again.");
  const v = validateContact(raw); if (!v.ok) return { ok: false, kind: "invalid", message: "Please check the highlighted fields.", errors: v.errors };
  const ctl = new AbortController(), timer = setTimeout(() => ctl.abort(), 15_000);
  try {
    const res = await (o.fetchImpl ?? fetch)(ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(buildPayload(v.data)), signal: ctl.signal, credentials: "omit" });
    const text = await res.text().catch(() => ""); let j: { success?: unknown; message?: unknown } = {}; try { j = JSON.parse(text); } catch { /* not JSON */ }
    const msg = typeof j.message === "string" ? j.message : "", okBody = j.success === true || j.success === "true";
    if (/activat/i.test(msg) || (!msg && /activat/i.test(text))) { console.warn("[contact] FormSubmit has not been activated yet. Open the activation email sent to the notification address and confirm it, then try again. FormSubmit said:", msg || text.slice(0, 200));
      return fail("activation", "FS-ACTIVATION", `Our contact form is still being activated and cannot accept messages yet. Please ${CONTACT} in the meantime.`); }
    if (res.ok && okBody) return { ok: true };
    console.warn(`[contact] FormSubmit did not accept the request: HTTP ${res.status}`, msg || text.slice(0, 200));
    if (res.status === 429) return fail("rejected", "FS-HTTP-429", "Too many messages have been sent recently. Please wait a few minutes and try again.");
    if (res.status >= 500) return fail("unavailable", `FS-HTTP-${res.status}`, `The email service is temporarily unavailable. Please try again shortly or ${CONTACT}.`);
    if (!msg) return fail("unexpected", "FS-NONJSON", `The email service sent an unexpected reply. Please ${CONTACT}.`);
    const why = msg.length <= 160 && !/[<>]/.test(msg) ? ` (${msg})` : "";
    return fail("rejected", `FS-HTTP-${res.status}`, `The email service did not accept this enquiry${why}. Please check your details or ${CONTACT}.`);
  } catch (e) {
    if (e instanceof DOMException && e.name === "AbortError") return fail("timeout", "FS-TIMEOUT", `The email service took too long to respond. Please try again, or ${CONTACT}.`);
    console.warn("[contact] request to FormSubmit failed (network, CORS or blocked request):", e instanceof Error ? e.message : e);
    return fail("network", "FS-NETWORK", "We could not reach the email service. Check your internet connection and try again.");
  } finally { clearTimeout(timer); }
}
