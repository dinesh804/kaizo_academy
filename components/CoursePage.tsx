"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Nav from "./Nav"; import Footer from "./Footer"; import Contact from "./Contact";
import { Course, FEE, BATCH_DATES, SCHOLARSHIP_ENABLED, schedule, commonBenefits, methodology, commonFaq } from "@/lib/content";
const S = ({ title, children, alt }: { title: string; children: React.ReactNode; alt?: boolean }) => (
  <section className={`py-14 ${alt ? "bg-bg2" : ""}`}><div className="mx-auto max-w-7xl px-5"><h2 className="font-display text-2xl font-bold sm:text-3xl">{title}</h2><div className="mt-6">{children}</div></div></section>);
const List = ({ items }: { items: string[] }) => <ul className="grid gap-2 text-muted sm:grid-cols-2 lg:grid-cols-3">{items.map(i => <li key={i}>• {i}</li>)}</ul>;
export default function CoursePage({ c }: { c: Course }) {
  const [open, setOpen] = useState<number | null>(null);
  return (<><Nav /><main className="pt-16">
    <section className="relative overflow-hidden py-14 sm:py-16"><div className="mx-auto max-w-7xl px-5">
      <span className="tag">{c.level}</span>
      <h1 className="mt-4 max-w-4xl font-display text-4xl font-bold sm:text-5xl grad">{c.n}</h1>
      <p className="mt-3 text-xl text-cyan">{c.tag}</p>
      <p className="mt-4 max-w-2xl text-muted">{c.obj}</p>
      <p className="mt-4 text-sm">8 weeks · 5 days a week · 3 hours a day · 120 live hours · <b>{FEE}</b></p>
      <a href="#contact" className="btn btn-p mt-6">Enrol now</a></div></section>
    <S title="Who should join" alt><List items={c.audience} /><p className="mt-5 text-muted"><b className="text-white">Prerequisites:</b> {c.prereq}</p></S>
    <S title="Learning outcomes"><List items={c.outcome} /></S>
    <S title="8-week curriculum" alt>
      <div className="space-y-3">{c.weeks.map((wk, i) => (
        <div key={wk.t} className="glass rounded-xl">
          <button className="flex w-full items-center justify-between p-5 text-left font-display font-semibold" aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)}>
            Week {i + 1}: {wk.t}<ChevronDown className={`shrink-0 transition-transform ${open === i ? "rotate-180" : ""}`} /></button>
          {open === i && <div className="px-5 pb-5"><List items={wk.topics} /><p className="mt-3"><b className="text-cyan">Mini-project:</b> {wk.p}</p>
            <p className="mt-1 text-sm text-muted">Includes a weekly assignment, assessment and code review.</p></div>}
        </div>))}</div></S>
    <S title="Teaching methodology and schedule">
      <div className="grid gap-4 md:grid-cols-3">{schedule.map(([h, t, d]) => <div key={h} className="glass rounded-xl p-5"><p className="text-sm text-cyan">{h}</p><h3 className="font-display font-semibold">{t}</h3><p className="mt-1 text-sm text-muted">{d}</p></div>)}</div>
      <div className="mt-6"><List items={methodology} /></div></S>
    <S title="Projects" alt><p className="mb-4 text-muted">Eight mini-projects, one per week, then one capstone. Capstone options:</p><List items={c.caps} /></S>
    <S title="Student benefits"><p className="mb-4 text-sm text-muted">What we intend to deliver, subject to actual delivery. No job or placement is guaranteed.</p><List items={commonBenefits} /></S>
    <S title="Pricing" alt><div className="glass max-w-md rounded-2xl p-7">
      <h3 className="font-display text-xl font-semibold">{c.n}</h3>
      <p className="mt-3 font-display text-4xl font-bold grad">{FEE}</p><p className="text-sm text-muted">per student · 8 weeks · 120 live hours</p>
      <p className="mt-3 text-sm text-muted">Next batch: {BATCH_DATES}</p>
      {SCHOLARSHIP_ENABLED && <p className="mt-1 text-sm text-muted">Scholarships available for eligible students.</p>}
      <a href="#contact" className="btn btn-p mt-5 w-full justify-center">Enrol now</a></div></S>
    <S title="FAQs"><div className="max-w-3xl space-y-3">{[...c.faq, ...commonFaq].map(([q, a]) => <details key={q} className="glass rounded-xl p-4"><summary className="cursor-pointer font-semibold">{q}</summary><p className="mt-2 text-muted">{a}</p></details>)}</div></S>
    <Contact programme={c.n} /></main><Footer /></>);
}
