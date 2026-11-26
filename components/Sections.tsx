"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, BookOpen, Code2, Hammer, Rocket, Trophy, CheckCircle2 } from "lucide-react";
import { divisions, benefits, extras, journey, modules, programMeta, projects } from "@/lib/content";
const Section = ({ id, title, sub, children, alt, cream }: { id: string; title: string; sub?: string; children: React.ReactNode; alt?: boolean; cream?: boolean }) => (
  <section id={id} className={`py-12 sm:py-14 ${alt ? "bg-bg2" : ""} ${cream ? "cream" : ""}`}>
    <div className="mx-auto max-w-7xl px-5">
      <h2 className="max-w-3xl font-display text-3xl font-bold sm:text-4xl">{title}</h2>
      {sub && <p className="mt-4 max-w-2xl text-muted">{sub}</p>}
      <div className="mt-6 sm:mt-8">{children}</div>
    </div>
  </section>);
export function Divisions() {
  return (
    <Section id="divisions" title="Where we're headed." sub="These are our intended divisions. Status labels show what is launched and what is still planned.">
      <div className="grid gap-4 md:grid-cols-2">
        {divisions.map(d => (
          <article key={d.n} className="glass rounded-2xl p-5 transition-colors">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-display text-xl font-bold grad">{d.n}</h3><span className="tag shrink-0">{d.status}</span>
            </div>
            <p className="mt-1 text-sm text-cyan">{d.s}</p>
            <p className="mt-2 text-sm text-muted">{d.d}</p>
            <ul className="mt-3 flex flex-wrap gap-2 text-xs text-muted">{d.f.slice(0, 5).map(f => <li key={f} className="rounded-full border border-white/10 px-3 py-1">{f}</li>)}</ul>
            <a href={d.href} className="btn btn-s mt-4 !py-2">{d.cta}</a>
          </article>))}
      </div>
      <details id="benefits" className="glass mt-4 rounded-xl p-4">
        <summary className="cursor-pointer font-semibold">How learning works and learner benefits</summary>
        <ol id="journey" className="mt-4 grid gap-2 sm:grid-cols-5">{journey.map(([title, desc], i) => <li key={title} className="rounded-lg border border-white/10 p-3"><span className="text-xs text-cyan">0{i + 1}</span><h3 className="font-semibold">{title}</h3><p className="text-xs text-muted">{desc}</p></li>)}</ol>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{benefits.map(([title, desc]) => <li key={title} className="text-sm"><b>{title}</b><span className="text-muted"> — {desc}</span></li>)}</ul>
        <details className="mt-3 text-sm"><summary className="cursor-pointer text-muted">Additional planned learner benefits</summary><ul className="mt-2 flex flex-wrap gap-2">{extras.map(item => <li key={item} className="tag">{item} · Planned</li>)}</ul></details>
      </details>
    </Section>);
}
export function Benefits() {
  return (
    <Section id="benefits" cream title="More than training. A foundation for your future." sub="At KAIZO LABS, we believe real learning happens when knowledge becomes practical ability.">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {benefits.map(([t, d]) => (
          <article key={t} className="glass rounded-2xl p-6"><h3 className="font-display text-lg font-semibold">{t}</h3><p className="mt-2 text-sm text-muted">{d}</p></article>))}
      </div>
      <div className="mt-10"><h3 className="font-display text-lg font-semibold">Additional learner benefits we intend to offer</h3>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{extras.map(e => <li key={e} className="flex items-center gap-2 text-muted"><CheckCircle2 size={18} className="text-cyan" />{e}<span className="tag ml-auto">Planned</span></li>)}</ul>
      </div>
    </Section>);
}
const icons = [BookOpen, Code2, Hammer, Rocket, Trophy];
export function Journey() {
  const [active, setActive] = useState(0);
  return (
    <Section id="journey" title="From learning to building real technology.">
      <div className="grid gap-4 md:grid-cols-5">
        {journey.map(([t, d], i) => { const I = icons[i]; const on = i <= active; return (
          <button key={t} onClick={() => setActive(i)} aria-pressed={i === active} className={`glass rounded-2xl p-5 text-left ${on ? "!border-cyan/70" : ""}`}>
            <I className={on ? "text-cyan" : "text-muted"} /><h3 className="mt-3 font-display font-bold">{t}</h3><p className="mt-1 text-sm text-muted">{d}</p>
          </button>); })}
      </div>
      <div className="mt-6 h-1.5 overflow-hidden rounded bg-white/10" role="progressbar" aria-valuenow={active + 1} aria-valuemin={1} aria-valuemax={5} aria-label="Learning journey progress">
        <motion.div className="h-full bg-gradient-to-r from-cyan via-violet to-magenta" animate={{ width: `${((active + 1) / 5) * 100}%` }} />
      </div>
    </Section>);
}
export function Program() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <Section id="academy" alt title="Applied AI & Machine Learning Program" sub="A practical programme designed to build skills in artificial intelligence, machine learning and real-world AI applications.">
      <div className="grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-3">
          {modules.map(([t, items], i) => (
            <div key={t as string} className="glass rounded-xl">
              <button className="flex w-full items-center justify-between p-5 text-left font-display font-semibold" aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)}>
                Module {i + 1}: {t as string}<ChevronDown className={`transition-transform ${open === i ? "rotate-180" : ""}`} />
              </button>
              {open === i && <ul className="grid gap-2 px-5 pb-5 text-muted sm:grid-cols-2">{(items as string[]).map(x => <li key={x}>• {x}</li>)}</ul>}
            </div>))}
          <div className="glass rounded-xl p-5"><h3 className="font-display font-semibold">Capstone project categories</h3>
            <p className="mt-2 text-muted">AI document assistant · Medical image analysis · Intelligent data analytics · Crop disease detection · Domain-specific RAG chatbot</p></div>
        </div>
        <aside className="glass h-fit rounded-xl p-6">
          <h3 className="font-display font-semibold">Programme details</h3>
          <dl className="mt-4 space-y-3 text-sm">{programMeta.map(([k, v]) => <div key={k}><dt className="text-muted">{k}</dt><dd className="text-magenta">{v}</dd></div>)}</dl>
          <p className="mt-3 text-xs text-muted">Placeholders: set once confirmed.</p>
          <a href="#contact" className="btn btn-p mt-5 w-full justify-center">Enquire to enrol</a>
        </aside>
      </div>
    </Section>);
}
export function Projects() {
  return (
    <Section id="projects" title="Project showcase" sub="Illustrative examples of the kinds of projects learners will build. Demonstrations only; real projects will replace these.">
      <div className="grid gap-5 sm:grid-cols-2">
        {projects.map(([n, p, t]) => (
          <article key={n} className="glass rounded-2xl p-6">
            <div className="mb-4 honey flex h-32 items-center justify-center rounded-lg bg-bg2 text-xs text-muted">Screenshot placeholder</div>
            <div className="flex items-center justify-between"><h3 className="font-display font-semibold">{n}</h3><span className="tag">Illustrative</span></div>
            <p className="mt-2 text-sm text-muted"><b className="text-white">Problem:</b> {p}</p>
            <p className="mt-1 text-sm text-muted"><b className="text-white">Tech:</b> {t}</p>
            <button disabled className="btn btn-s mt-4 !py-2 opacity-50">View project (coming soon)</button>
          </article>))}
      </div>
    </Section>);
}
export function About() {
  return (
    <Section id="about" alt title="Imagine. Improve. Innovate.">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="glass rounded-2xl p-6"><h3 className="font-display font-semibold text-cyan">Vision</h3><p className="mt-2 text-muted">To make intelligent technology and practical innovation accessible to people and organisations.</p></div>
        <div className="glass rounded-2xl p-6"><h3 className="font-display font-semibold text-cyan">Mission</h3><p className="mt-2 text-muted">To develop practical technology skills, explore advanced research and engineer meaningful AI-powered solutions.</p></div>
      </div>
      <ul className="mt-8 flex flex-wrap gap-3">{["Innovation", "Integrity", "Continuous learning", "Practical excellence", "Collaboration", "Real-world impact"].map(v => <li key={v} className="glass rounded-full px-4 py-2 text-sm">{v}</li>)}</ul>
      <h3 className="mt-14 font-display text-xl font-semibold">Trust and credibility</h3>
      <p className="mt-2 text-muted">These spaces stay empty until we have authentic material to show.</p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {["Founder profile", "Trainer profiles", "Qualifications & experience", "Research publications", "Student testimonials", "Completed projects", "Workshop photographs", "Verified learner statistics"].map(x => (
          <div key={x} className="rounded-xl border border-dashed border-white/20 p-5 text-sm text-muted">{x}<br /><span className="text-magenta">[Content to be supplied]</span></div>))}
      </div>
    </Section>);
}
