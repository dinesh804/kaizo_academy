import { validateContact, type ContactData } from "@/lib/contact";

// The form ID is public and can be safely exposed in the browser.
const FORM_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID?.trim() || "";
export const ENDPOINT = FORM_ID ? `https://formspree.io/f/${FORM_ID}` : "";
export const COOLDOWN_MS = 30_000, MIN_FILL_MS = 2_000;

/** Contact details sent to Formspree. No IP, user agent, analytics or tracking IDs are added. */
export function buildPayload(d: ContactData) {
  return {
    _subject: `New Contact Enquiry – KAIZO LABS: ${d.subject}`,
    _replyto: d.email,
    _gotcha: "",
    name: d.name,
    email: d.email,
    phone: d.phone || "Not provided",
    programme: d.programme || "Not specified",
    subject: d.subject,
    status: d.status || "Not provided",
    message: d.message,
  };
}

export type Result =
  | { ok: true }
  | { ok: false; kind: "invalid" | "cooldown" | "not-configured" | "network" | "timeout" | "rejected" | "unavailable" | "unexpected"; message: string; code?: string; errors?: Record<string, string> };

const CONTACT = "contact us by WhatsApp or email";
const fail = (kind: Extract<Result, { ok: false }>["kind"], code: string, message: string): Result => ({ ok: false, kind, code, message });

/** Plain mailto link used as a fallback when sending fails. */
export const mailtoFallback = (raw: Record<string, unknown>, to: string) => {
  const get = (key: string) => typeof raw[key] === "string" ? (raw[key] as string).slice(0, 1500) : "";
  return `mailto:${to}?subject=${encodeURIComponent(get("subject") || "Website enquiry")}&body=${encodeURIComponent(`${get("message")}\n\n${get("name")}\n${get("email")}\n${get("phone")}`)}`;
};

export async function sendEnquiry(
  raw: Record<string, unknown>,
  options: { openedAt: number; lastSent?: number; now?: number; fetchImpl?: typeof fetch },
): Promise<Result> {
  const now = options.now ?? Date.now();
  if ((typeof raw._gotcha === "string" && raw._gotcha.trim()) || (typeof raw._honey === "string" && raw._honey.trim())) return { ok: true };
  if (options.lastSent && now - options.lastSent < COOLDOWN_MS) return fail("cooldown", "COOLDOWN", "Your message was just sent. Please wait a little before sending another.");
  if (now - options.openedAt < MIN_FILL_MS) return fail("cooldown", "TOO-FAST", "Please take a moment to review your message, then send it again.");

  const validated = validateContact(raw);
  if (!validated.ok) return { ok: false, kind: "invalid", message: "Please check the highlighted fields.", errors: validated.errors };
  if (!ENDPOINT) return fail("not-configured", "FORM-ID-MISSING", `The contact form is not connected yet. Please ${CONTACT} in the meantime.`);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15_000);
  try {
    const response = await (options.fetchImpl ?? fetch)(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(buildPayload(validated.data)),
      signal: controller.signal,
      credentials: "omit",
    });
    const text = await response.text().catch(() => "");
    let body: { errors?: Array<{ field?: string; message?: string }>; error?: unknown } = {};
    try { body = JSON.parse(text); } catch { /* A non-JSON reply is handled below. */ }

    if (response.ok) return { ok: true };
    const errors: Record<string, string> = {};
    for (const error of body.errors ?? []) if (error.field && error.message) errors[error.field] = error.message;
    if (Object.keys(errors).length) return { ok: false, kind: "invalid", message: "Please check the highlighted fields.", errors };
    if (response.status === 429) return fail("rejected", "FS-HTTP-429", "Too many messages have been sent recently. Please wait a few minutes and try again.");
    if (response.status >= 500) return fail("unavailable", `FS-HTTP-${response.status}`, `The email service is temporarily unavailable. Please try again shortly or ${CONTACT}.`);
    if (!text) return fail("unexpected", "FS-NONJSON", `The email service sent an unexpected reply. Please ${CONTACT}.`);
    console.warn(`[contact] Formspree did not accept the request: HTTP ${response.status}`, typeof body.error === "string" ? body.error : text.slice(0, 200));
    return fail("rejected", `FS-HTTP-${response.status}`, `The email service did not accept this enquiry. Please check your details or ${CONTACT}.`);
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") return fail("timeout", "FS-TIMEOUT", `The email service took too long to respond. Please try again, or ${CONTACT}.`);
    console.warn("[contact] Request to Formspree failed:", error instanceof Error ? error.message : error);
    return fail("network", "FS-NETWORK", "We could not reach the email service. Check your internet connection and try again.");
  } finally {
    clearTimeout(timer);
  }
}
