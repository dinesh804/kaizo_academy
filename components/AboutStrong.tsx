import { BookOpen, FlaskConical, Hammer } from "lucide-react";
import { PROOF, FEEDBACK_FORM_URL } from "@/lib/content";
import { story } from "@/lib/about";
const focus = [[BookOpen, "Practical Technology Education", "Concepts, live coding and guided practice, so knowledge becomes working skill."], [Hammer, "Hands-on Project Development", "Learners build, document and deploy real projects instead of only watching lectures."], [FlaskConical, "Research and Innovation", "We explore applied AI research and prototypes that turn ideas into technology solutions."]] as const;
export default function AboutStrong() {
  return (
    <section id="about" className="bg-bg2 py-12 sm:py-14"><div className="mx-auto max-w-7xl px-5">
      <p className="text-sm tracking-widest text-neon">ABOUT KAIZO LABS</p>
      <h2 className="mt-3 max-w-4xl font-display text-3xl font-bold sm:text-5xl">Imagine. Improve. <span className="grad">Innovate.</span></h2>
      <p className="mt-4 max-w-3xl text-muted">KAIZO comes from kaizen: continuous improvement. We make intelligent technology and practical innovation accessible through learning, research and hands-on building.</p>
      <div className="mt-6 grid gap-3 md:grid-cols-3">{focus.map(([Icon, t, d]) => <article key={t} className="glass rounded-xl p-4"><Icon className="text-neon" size={20} /><h4 className="mt-2 font-display font-semibold">{t}</h4><p className="mt-1 text-sm text-muted">{d}</p></article>)}</div>
      <details className="glass mt-4 rounded-xl p-4"><summary className="cursor-pointer font-semibold">Our story, vision and mission</summary><div className="mt-3 grid gap-4 text-sm text-muted md:grid-cols-2">{story.map(t => <p key={t}>{t}</p>)}<p><b className="text-white">Vision:</b> To make intelligent technology and practical innovation accessible to people and organisations.</p><p><b className="text-white">Mission:</b> To develop practical technology skills, explore advanced research and engineer meaningful AI-powered solutions.</p></div></details>
      {PROOF.learnersTrained && <p className="mt-8 text-center font-display text-2xl font-bold grad">{PROOF.learnersTrained}+ learners trained {PROOF.period}</p>}
      {PROOF.testimonials.length > 0 && <div className="mt-8 grid gap-4 md:grid-cols-3">{PROOF.testimonials.map(t => <figure key={t.n} className="glass rounded-xl border-l-4 !border-l-neon p-5"><blockquote className="text-muted">“{t.q}”</blockquote><figcaption className="mt-3 text-sm">{t.n}, {t.r}</figcaption></figure>)}</div>}
      {FEEDBACK_FORM_URL && <div className="mt-5 text-center"><a href={FEEDBACK_FORM_URL} className="btn btn-s">Share your feedback</a></div>}
    </div></section>);
}
