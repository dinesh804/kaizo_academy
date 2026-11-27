"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Nav from "./Nav"; import Footer from "./Footer"; import Contact from "./Contact";
import { Course, FEE, BATCH_DATES, SCHOLARSHIP_ENABLED, feeStatus, formatINR, commonBenefits, methodology, commonFaq } from "@/lib/content";
const S = ({ title, children, alt }: { title: string; children: React.ReactNode; alt?: boolean }) => (
  <section className={`py-14 ${alt ? "bg-bg2" : ""}`}><div className="mx-auto max-w-7xl px-5"><h2 className="font-display text-2xl font-bold sm:text-3xl">{title}</h2><div className="mt-6">{children}</div></div></section>);
const List = ({ items }: { items: string[] }) => <ul className="grid gap-2 text-muted sm:grid-cols-2 lg:grid-cols-3">{items.map(i => <li key={i}>• {i}</li>)}</ul>;
const scheduleSummary = (c: Course) => c.schedule.confirmed && c.schedule.daysPerWeek && c.schedule.hoursPerScheduledDay
  ? `${c.schedule.daysPerWeek} days per week · ${c.schedule.hoursPerScheduledDay} hours per scheduled day · ${c.schedule.calendarWeeks} calendar weeks`
  : "Schedule details to be confirmed";
export default function CoursePage({ c }: { c: Course }) {
  const [open, setOpen] = useState<number | null>(null);
  return (<><Nav /><main className="pt-16">
    <section className="relative overflow-hidden py-14 sm:py-16"><div className="mx-auto max-w-7xl px-5">
      <span className="tag">{c.level}</span>
      <h1 className="mt-4 max-w-4xl font-display text-4xl font-bold sm:text-5xl grad">{c.n}</h1>
      <p className="mt-3 text-xl text-neon">{c.tag}</p>
      <p className="mt-4 max-w-2xl text-muted">{c.obj}</p>
      <p className="mt-4 text-sm text-muted">{scheduleSummary(c)}. <b className="text-white">Founding batch fee: {formatINR(c.fee)} (proposed)</b></p>
      <a href="#contact" className="btn btn-p mt-6">Enrol now</a></div></section>
    <S title="Who should join" alt><List items={c.audience} /><p className="mt-5 text-muted"><b className="text-white">Prerequisites:</b> {c.prereq}</p></S>
    <S title="Learning outcomes"><List items={c.outcome} /></S>
    <S title="Course curriculum" alt>
      <div className="space-y-3">{c.weeks.map((wk, i) => (
        <div key={wk.t} className="glass rounded-xl">
          <button className="flex w-full items-center justify-between p-5 text-left font-display font-semibold" aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)}>
            Module {i + 1}: {wk.t}<ChevronDown className={`shrink-0 transition-transform ${open === i ? "rotate-180" : ""}`} /></button>
          {open === i && <div className="px-5 pb-5"><List items={wk.topics} /><p className="mt-3"><b className="text-neon">Mini-project:</b> {wk.p}</p>
            <p className="mt-1 text-sm text-muted">Includes a weekly assignment, assessment and code review.</p></div>}
        </div>))}</div></S>
    <S title="Training volume and learning format">
      <p className="mb-4 inline-flex rounded-full border border-neon/35 px-3 py-1 text-xs text-crimson-soft">Proposed allocation · pending delivery confirmation</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[["Total training", c.training.totalHours], ["Live instruction", c.training.liveInstructionHours], ["Guided practical labs", c.training.guidedLabHours], ["Supervised projects", c.training.supervisedProjectHours]].map(([title, hours]) => <div key={title} className="glass rounded-xl p-5"><p className="font-display text-3xl font-bold grad">{hours}<span className="ml-1 text-sm font-medium text-muted">hours</span></p><h3 className="mt-2 font-semibold">{title}</h3></div>)}</div>
      <p className="mt-4 text-sm text-muted">Independent assignments and self-study are separate from these instructor-led, guided practice and project hours. {c.training.confirmed ? "" : "The hour allocation is proposed and pending confirmation."} {c.schedule.confirmed ? `Current schedule: ${scheduleSummary(c)}.` : "Days per week, hours per scheduled day and calendar duration will be published when confirmed."}</p>
      <div className="mt-6"><h3 className="mb-3 font-display font-semibold">Planned learning activities</h3><List items={methodology} /></div></S>
    <S title="Project categories" alt><p className="mb-4 text-muted">Illustrative capstone project options for this curriculum:</p><List items={c.caps} /></S>
    <S title="Student benefits"><p className="mb-4 text-sm text-muted">What we intend to deliver, subject to actual delivery. No job or placement is guaranteed.</p><List items={commonBenefits} /></S>
    <S title="Pricing" alt><div className="glass max-w-md rounded-2xl p-7">
      <h3 className="font-display text-xl font-semibold">{c.n}</h3>
      <p className="mt-3 font-display text-4xl font-bold grad">{formatINR(c.fee)}</p><p className="text-sm text-muted">per student · proposed founding-batch fee</p>
      <p className="mt-1 text-xs text-muted">{feeStatus}</p>
      <p className="mt-3 text-sm text-muted">Next batch and schedule: {BATCH_DATES}</p>
      {SCHOLARSHIP_ENABLED && <p className="mt-1 text-sm text-muted">Scholarships available for eligible students.</p>}
      <a href="#contact" className="btn btn-p mt-5 w-full justify-center">Enrol now</a></div></S>
    <S title="FAQs"><div className="max-w-3xl space-y-3">{[...c.faq, ...commonFaq].map(([q, a]) => <details key={q} className="glass rounded-xl p-4"><summary className="cursor-pointer font-semibold">{q}</summary><p className="mt-2 text-muted">{a}</p></details>)}</div></S>
    <Contact programme={c.n} /></main><Footer /></>);
}
