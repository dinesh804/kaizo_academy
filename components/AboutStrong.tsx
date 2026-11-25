import { BookOpen, FlaskConical, Hammer } from "lucide-react";
import PhotoSlot from "./PhotoSlot";
import { ClassroomArt } from "./ProjectArt";
import { PROOF, FEEDBACK_FORM_URL } from "@/lib/content";
import { story } from "@/lib/about";
const focus = [[BookOpen, "Practical Technology Education", "Concepts, live coding and guided practice, so knowledge becomes working skill."], [Hammer, "Hands-on Project Development", "Learners build, document and deploy real projects instead of only watching lectures."], [FlaskConical, "Research and Innovation", "We explore applied AI research and prototypes that turn ideas into technology solutions."]] as const;
export default function AboutStrong() {
  return (
    <section id="about" className="bg-bg2 py-20"><div className="mx-auto max-w-7xl px-5">
      <p className="text-sm tracking-widest text-cyan">ABOUT KAIZO LABS</p>
      <h2 className="mt-3 max-w-4xl font-display text-3xl font-bold sm:text-5xl">Imagine. Improve. <span className="grad">Innovate.</span></h2>
      <p className="mt-6 max-w-3xl text-lg text-muted">KAIZO comes from kaizen, the idea of continuous improvement. We apply it to AI education: every learner gets a little better each day by building real things, not just watching lectures. Our goal is to make intelligent technology and practical innovation accessible to people and organisations.</p>
      <div className="mt-10 grid items-start gap-8 lg:grid-cols-2">
        <div className="glass rounded-2xl p-7"><h3 className="font-display text-xl font-semibold text-cyan">Our story</h3>{story.map(t => <p key={t} className="mt-3 text-muted">{t}</p>)}</div>
        <figure><PhotoSlot src="/photos/classroom.jpg" alt="KAIZO LABS learners in a live coding session" fallback={<div className="aspect-[4/3] overflow-hidden rounded-2xl border border-cyan/30"><ClassroomArt /></div>} /><figcaption className="mt-2 text-xs text-muted">Illustrative artwork of an AI learning lab.</figcaption></figure>
      </div>
      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <div className="glass rounded-2xl p-6"><h3 className="font-display font-semibold text-cyan">Our vision</h3><p className="mt-2 text-muted">To make intelligent technology and practical innovation accessible to people and organisations.</p></div>
        <div className="glass rounded-2xl p-6"><h3 className="font-display font-semibold text-cyan">Our mission</h3><p className="mt-2 text-muted">To develop practical technology skills, explore advanced research and engineer meaningful AI-powered solutions.</p></div>
      </div>
      <ul className="mt-8 flex flex-wrap gap-3">{["Innovation", "Integrity", "Continuous learning", "Practical excellence", "Collaboration", "Real-world impact"].map(v => <li key={v} className="glass rounded-full px-4 py-2 text-sm">{v}</li>)}</ul>
      <div className="mt-20 text-center"><h3 className="mx-auto max-w-3xl font-display text-3xl font-bold sm:text-4xl">Building the Next Generation of <span className="grad">Innovators.</span></h3>
        <p className="mx-auto mt-4 max-w-2xl text-muted">We are creating a learning environment where curiosity becomes practical knowledge and ideas become technology solutions.</p></div>
      <div className="mt-10 grid gap-5 md:grid-cols-3">{focus.map(([Icon, t, d]) => <article key={t} className="glass rounded-2xl p-6"><Icon className="text-cyan" /><h4 className="mt-4 font-display text-lg font-semibold">{t}</h4><p className="mt-2 text-sm text-muted">{d}</p></article>)}</div>
      {PROOF.learnersTrained && <p className="mt-8 text-center font-display text-2xl font-bold grad">{PROOF.learnersTrained}+ learners trained {PROOF.period}</p>}
      {PROOF.testimonials.length > 0 && <div className="mt-8 grid gap-4 md:grid-cols-3">{PROOF.testimonials.map(t => <figure key={t.n} className="glass rounded-xl border-l-4 !border-l-cyan p-5"><blockquote className="text-muted">“{t.q}”</blockquote><figcaption className="mt-3 text-sm">{t.n}, {t.r}</figcaption></figure>)}</div>}
      {FEEDBACK_FORM_URL && <div className="mt-8 text-center"><a href={FEEDBACK_FORM_URL} className="btn btn-s">Share your feedback</a></div>}
    </div></section>);
}
