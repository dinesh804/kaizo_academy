"use client";
import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

type Status = "idle" | "sending" | "done" | "error";
export default function IntroRegistration({ courseOptions }: { courseOptions: string[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const openForm = () => dialogRef.current?.showModal();
    window.addEventListener("kaizo:open-intro", openForm);
    return () => window.removeEventListener("kaizo:open-intro", openForm);
  }, []);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;
    setStatus("sending"); setMessage(""); setErrors({});
    const data = new FormData(event.currentTarget);
    const interest = String(data.get("courseInterest") || "");
    const level = String(data.get("level") || "");
    const timing = String(data.get("preferredTiming") || "");
    const payload = {
      formType: "intro-class",
      name: String(data.get("name") || ""),
      email: String(data.get("email") || ""),
      phone: String(data.get("phone") || ""),
      programme: interest,
      status: level,
      subject: "Free introductory class registration",
      preferredTiming: timing,
      consent: data.get("consent") === "yes",
      website: String(data.get("website") || ""),
      message: `Free introductory class registration. Course interest: ${interest}. Education or experience: ${level}. Preferred class timing: ${timing}. Contact consent: ${data.get("consent") === "yes" ? "yes" : "no"}.`,
    };
    try {
      const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const result = await response.json().catch(() => ({}));
      if (response.ok && result.ok) { setStatus("done"); return; }
      if (response.status === 422 && result.errors) { setErrors(result.errors as Record<string, string>); setStatus("idle"); return; }
      setMessage(typeof result.error === "string" ? result.error : "We could not send your registration. Please try again or contact us directly.");
      setStatus("error");
    } catch {
      setMessage("We could not reach the registration service. Check your connection and try again."); setStatus("error");
    }
  }

  const field = "mt-1 block w-full rounded-lg border border-white/15 bg-bg2 p-3 text-white";
  const fieldError = (name: string) => errors[name] ? <span id={`${name}-error`} className="mt-1 block text-sm text-crimson-soft">{errors[name]}</span> : null;

  return <>
    <button type="button" className="btn btn-p shrink-0" onClick={() => dialogRef.current?.showModal()}>Attend a Free Introductory Class</button>
    <dialog ref={dialogRef} aria-labelledby="intro-title" onClose={() => { setStatus("idle"); setErrors({}); setMessage(""); }} className="w-[min(42rem,calc(100%-2rem))] max-h-[90dvh] overflow-y-auto rounded-2xl border border-neon/40 bg-[#0d0d0d] p-0 text-white shadow-[0_24px_90px_rgba(0,0,0,.75)] backdrop:bg-black/75">
      <div className="flex items-start justify-between gap-5 border-b border-white/10 px-5 py-4 sm:px-7">
        <div><p className="text-xs tracking-widest text-neon">FREE INTRODUCTORY CLASS</p><h2 id="intro-title" className="mt-1 font-display text-2xl font-bold">Reserve your place</h2><p className="mt-1 text-sm text-muted">Share your details and we’ll contact you about the introductory class.</p></div>
        <button type="button" aria-label="Close registration form" onClick={() => dialogRef.current?.close()} className="rounded-lg p-2 text-muted hover:bg-white/10 hover:text-white"><X size={20} /></button>
      </div>
      {status === "done" ? <div role="status" className="p-6 sm:p-7"><h3 className="font-display text-xl font-semibold">Thanks for registering your interest.</h3><p className="mt-2 text-muted">Your details have been sent to KAIZO ACADEMY. We’ll follow up about the introductory class timing.</p><button type="button" className="btn btn-p mt-5" onClick={() => dialogRef.current?.close()}>Done</button></div> : <form onSubmit={submit} className="grid gap-4 p-5 sm:grid-cols-2 sm:p-7" aria-busy={status === "sending"}>
        <div aria-hidden="true" className="absolute -left-[10000px] h-px w-px overflow-hidden"><label>Leave this field empty<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
        <label className="sm:col-span-2">Full name<input name="name" required autoComplete="name" maxLength={100} className={field} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "name-error" : undefined} />{fieldError("name")}</label>
        <label>Email address<input name="email" required type="email" autoComplete="email" maxLength={254} className={field} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "email-error" : undefined} />{fieldError("email")}</label>
        <label>WhatsApp / mobile number<input name="phone" required type="tel" autoComplete="tel" inputMode="tel" minLength={10} maxLength={20} pattern="[+0-9 ()-]{10,20}" placeholder="+91 98765 43210" className={field} aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? "phone-error" : undefined} />{fieldError("phone")}</label>
        <label>Course interest<select name="courseInterest" required defaultValue="" className={field} aria-invalid={Boolean(errors.programme)} aria-describedby={errors.programme ? "programme-error" : undefined}><option value="" disabled>Select an area</option>{courseOptions.map(option => <option key={option} value={option}>{option}</option>)}<option value="Other">Not sure yet</option></select>{fieldError("programme")}</label>
        <label>Education or experience level<select name="level" required defaultValue="" className={field} aria-invalid={Boolean(errors.status)} aria-describedby={errors.status ? "status-error" : undefined}><option value="" disabled>Select your level</option><option>School student</option><option>College student</option><option>Recent graduate</option><option>Working professional</option><option>New to technology</option><option>Other</option></select>{fieldError("status")}</label>
        <label className="sm:col-span-2">Preferred class timing<select name="preferredTiming" required defaultValue="" className={field} aria-invalid={Boolean(errors.preferredTiming)} aria-describedby={errors.preferredTiming ? "preferredTiming-error" : "timing-note"}><option value="" disabled>Select a preference</option><option>Morning</option><option>Afternoon</option><option>Evening</option><option>Flexible</option></select><span id="timing-note" className="mt-1 block text-xs text-muted">This is a preference only; available timings have not yet been confirmed.</span>{fieldError("preferredTiming")}</label>
        <label className="flex items-start gap-3 text-sm text-muted sm:col-span-2"><input name="consent" type="checkbox" value="yes" required className="mt-1 size-4 accent-[#E63946]" />I agree that KAIZO ACADEMY may contact me about this introductory class.</label>
        {errors.consent && <p role="alert" className="text-sm text-crimson-soft sm:col-span-2">{errors.consent}</p>}
        <div className="sm:col-span-2"><button className="btn btn-p w-full justify-center sm:w-auto" disabled={status === "sending"}>{status === "sending" ? "Sending…" : "Submit registration"}</button>{status === "error" && <p role="alert" className="mt-3 text-sm text-crimson-soft">{message}</p>}</div>
      </form>}
    </dialog>
  </>;
}
