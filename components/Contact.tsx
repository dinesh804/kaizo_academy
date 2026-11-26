"use client";
import { useRef, useState } from "react";
import { PHONE_DISPLAY, programmes } from "@/lib/content";
import { mailtoFallback, sendEnquiry } from "@/lib/formspree";
const GFORM = process.env.NEXT_PUBLIC_GOOGLE_FORM_URL || "https://forms.gle/FDBdNuYpocwoQJsD9"; // course enrolment: separate workflow
const EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "vdn23022003@gmail.com";
const WA = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919150835164";
type St = "idle" | "sending" | "done" | "error";
export default function Contact({ programme }: { programme?: string }) {
  const [st, setSt] = useState<St>("idle"), [errs, setErrs] = useState<Record<string, string>>({}), [msg, setMsg] = useState(""), [code, setCode] = useState(""), [mailto, setMailto] = useState(""), busy = useRef(false), openedAt = useRef(Date.now());
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); if (busy.current) return; busy.current = true; // blocks duplicate submissions
    const form = e.currentTarget; setSt("sending"); setErrs({}); setMsg(""); setCode("");
    let last = 0; try { last = Number(sessionStorage.getItem("kaizo_last_enquiry") || 0); } catch { /* storage unavailable */ }
    try {
      const raw = Object.fromEntries(new FormData(form)); const r = await sendEnquiry(raw, { openedAt: openedAt.current, lastSent: last });
      if (r.ok) { try { sessionStorage.setItem("kaizo_last_enquiry", String(Date.now())); } catch { /* ignore */ } form.reset(); setSt("done"); }
      else if (r.kind === "invalid") { setErrs(r.errors ?? {}); setSt("idle"); }
      else { setMsg(r.message); setCode(r.code ?? ""); setMailto(mailtoFallback(raw, EMAIL)); setSt("error"); }
    } finally { busy.current = false; }
  }
  const f = "mt-1 block w-full min-w-0 max-w-full rounded-lg border border-white/15 bg-bg2 p-3 text-white";
  const Err = ({ k }: { k: string }) => errs[k] ? <p role="alert" className="mt-1 text-sm text-magenta">{errs[k]}</p> : null;
  return (
    <section id="contact" className="py-14 sm:py-20"><div className="mx-auto grid min-w-0 max-w-7xl gap-8 px-4 sm:gap-12 sm:px-5 lg:grid-cols-3">
      <div className="min-w-0"><h2 className="font-display text-3xl font-bold">Start a conversation</h2>
        <p className="mt-4 text-muted">Ask about the programme or request a free introductory session.</p>
        <div className="mt-6 flex flex-col gap-3">
          <a className="btn btn-s" href="tel:+919150835164">Call {PHONE_DISPLAY}</a>
          <a className="btn btn-s" href={`https://wa.me/${WA}`}>WhatsApp us</a>
          <a className="btn btn-s" href={`mailto:${EMAIL}`}>Email us</a>
          <a className="btn btn-p" href={GFORM} rel="noopener noreferrer" target="_blank">Enrol via Google Form</a>
        </div></div>
      <form onSubmit={submit} noValidate className="glass relative w-full min-w-0 rounded-2xl p-4 sm:p-6 lg:col-span-2">
        {st === "done" ? (
          <div role="status"><h3 className="font-display text-xl font-semibold">Thank you! Your message has been sent.</h3><p className="mt-2 text-muted">We will reply to the email address you provided.</p>
            <button type="button" className="btn btn-s mt-5" onClick={() => setSt("idle")}>Send another message</button></div>
        ) : (<div className="grid min-w-0 gap-4 md:grid-cols-2">
          <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", height: 0, overflow: "hidden" }}><label>Website<input name="_gotcha" tabIndex={-1} autoComplete="off" /></label></div>
          <label className="min-w-0">Full name<input name="name" required maxLength={100} className={f} autoComplete="name" /><Err k="name" /></label>
          <label className="min-w-0">Email address<input name="email" type="email" required maxLength={254} className={f} autoComplete="email" /><Err k="email" /></label>
          <label className="min-w-0">Phone number<input name="phone" type="tel" maxLength={20} className={f} autoComplete="tel" /><Err k="phone" /></label>
          <label className="min-w-0">Interested programme (optional)<select name="programme" className={f} defaultValue={programme ?? ""}>
            <option value="">Choose one</option>{programmes.map(p => <option key={p}>{p}</option>)}</select></label>
          <label className="min-w-0 md:col-span-2">Subject<input name="subject" required maxLength={150} className={f} /><Err k="subject" /></label>
          <label className="min-w-0 md:col-span-2">Current education or professional status (optional)<input name="status" maxLength={200} className={f} /></label>
          <label className="min-w-0 md:col-span-2">Message<textarea name="message" rows={4} required maxLength={3000} className={`${f} resize-y`} /><Err k="message" /></label>
          <div className="min-w-0 md:col-span-2"><button className="btn btn-p w-full justify-center sm:w-auto" disabled={st === "sending"}>{st === "sending" ? "Sending…" : "Send enquiry"}</button>
            {st === "error" && <p role="alert" className="mt-3 break-words text-magenta">{msg}{code && <span className="text-muted"> (Ref: {code})</span>} <a href={mailto} className="underline">Send by email instead</a></p>}</div>
        </div>)}
      </form></div></section>);
}
