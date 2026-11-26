import { programmes } from "@/lib/content";
export type ContactData = { name: string; email: string; phone: string; subject: string; message: string; programme: string; status: string };
const EMAIL_RE = /^[^\s@<>()",;:\\]+@[^\s@<>()",;:\\]+\.[^\s@<>()",;:\\]{2,}$/;
// Removes control characters; single-line fields also lose CR/LF/Unicode line separators (blocks email header injection).
const clean = (v: unknown, max: number, multi = false) => {
  let s = typeof v === "string" ? v.normalize("NFKC") : "";
  s = s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, ""); if (!multi) s = s.replace(/[\r\n\u2028\u2029]+/g, " ");
  return s.trim().slice(0, max + 1);
};
export function validateContact(raw: Record<string, unknown>): { ok: true; data: ContactData } | { ok: false; errors: Record<string, string> } {
  const d: ContactData = { name: clean(raw.name, 100), email: clean(raw.email, 254).toLowerCase(), phone: clean(raw.phone, 20), subject: clean(raw.subject, 150), message: clean(raw.message, 3000, true), programme: clean(raw.programme, 100), status: clean(raw.status, 200) };
  const errors: Record<string, string> = {};
  if (d.name.length < 2 || d.name.length > 100) errors.name = "Enter your full name (2 to 100 characters).";
  if (!EMAIL_RE.test(d.email) || d.email.length > 254) errors.email = "Enter a valid email address.";
  if (d.phone && !/^[+\d\s()-]{7,20}$/.test(d.phone)) errors.phone = "Enter a valid phone number.";
  if (d.subject.length < 3 || d.subject.length > 150) errors.subject = "Enter a subject (3 to 150 characters).";
  if (d.message.length < 10 || d.message.length > 3000) errors.message = "Write a message (10 to 3000 characters).";
  else if ((d.message.match(/https?:\/\//gi) || []).length > 3) errors.message = "Please remove extra links from your message.";
  if (d.programme && !programmes.includes(d.programme)) d.programme = "";
  if (d.status.length > 200) errors.status = "Please shorten this field.";
  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, data: d };
}

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (char) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
})[char]!);

export function buildEmail(data: ContactData) {
  const subject = "New Contact Enquiry – KAIZO LABS";
  const fields = [
    ["Name", data.name],
    ["Email", data.email],
    ["Phone", data.phone || "Not provided"],
    ["Programme", data.programme || "Not specified"],
    ["Subject", data.subject],
    ["Status", data.status || "Not provided"],
    ["Message", data.message],
  ] as const;
  const text = ["KAIZO LABS – NEW WEBSITE ENQUIRY", ...fields.map(([label, value]) => `${label}: ${value}`)].join("\n\n");
  const rows = fields.map(([label, value]) => `<tr><th align="left" style="padding:8px 12px;color:#B51226">${escapeHtml(label)}</th><td style="padding:8px 12px">${escapeHtml(value).replace(/\n/g, "<br>")}</td></tr>`).join("");
  const html = `<div style="font-family:Arial,sans-serif;color:#222"><h1 style="font-size:20px;color:#B51226">KAIZO LABS – NEW WEBSITE ENQUIRY</h1><table style="border-collapse:collapse">${rows}</table></div>`;
  return { subject, text, html };
}
