import { courses, FEE } from "@/lib/content";
const planned = [
  ["Digital Marketing", "SEO, social media, content, paid campaigns and analytics."],
  ["Data Analytics & Business Intelligence", "Excel, SQL, Python analytics and dashboarding."],
  ["Cloud Computing & Multi-Cloud", "Cloud fundamentals across Google Cloud, AWS and Azure."],
];
export function CourseCards() {
  return (
    <section id="academy" className="bg-bg2 py-12 sm:py-14"><div className="mx-auto max-w-7xl px-5">
      <h2 className="font-display text-3xl font-bold sm:text-4xl">Our programmes.</h2>
      <p className="mt-2 max-w-2xl text-muted">Five focused learning paths. Two detailed curricula are available; proposed programme details remain subject to confirmation.</p>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((c, i) => (
          <article key={c.slug} className="glass flex flex-col rounded-xl p-4">
            <span className="tag w-fit">Available curriculum</span>
            <h3 className="mt-2 font-display text-lg font-bold grad">{c.n}</h3>
            <p className="mt-1 text-sm text-muted">{c.obj}</p>
            <dl className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm"><div><dt className="inline text-muted">Duration </dt><dd className="inline">8 weeks</dd></div><div><dt className="inline text-muted">Indicative fee </dt><dd className="inline">{FEE}</dd></div></dl>
            <div className="mt-auto flex flex-wrap gap-2 pt-4">
              <a href={`/academy/${c.slug}`} className="btn btn-s !py-2">View curriculum</a>
              <a href={`/academy/${c.slug}#contact`} className="btn btn-p !py-2">Enquire</a>
            </div>
          </article>))}
        {planned.map(([title, description], i) => <article key={title} className="glass flex flex-col rounded-xl p-4"><span className="tag w-fit">Proposed · details to be confirmed</span><h3 className="mt-2 font-display text-lg font-bold grad">{title}</h3><p className="mt-1 text-sm text-muted">{description}</p><dl className="mt-3 flex gap-5 text-sm"><div><dt className="text-muted">Duration</dt><dd>Proposed: 8 weeks</dd></div><div><dt className="text-muted">Indicative fee</dt><dd>{FEE} (proposed)</dd></div></dl><a href="/#contact" className="btn btn-s mt-auto w-fit !py-2 pt-4">Enquire about this programme</a></article>)}
      </div></div></section>);
}
export function Compare() {
  return (
    <details id="compare" className="mx-auto max-w-7xl px-5 py-5">
      <summary className="cursor-pointer font-display text-lg font-semibold">Compare the two available AI programmes</summary>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm"><caption className="sr-only">Comparison of available AI programmes</caption><thead><tr className="text-cyan"><th className="p-3" /><th className="p-3">Applied AI & Machine Learning</th><th className="p-3">Generative AI & Agentic AI</th></tr></thead><tbody><tr className="border-t border-white/10"><th scope="row" className="p-3 text-muted">Best for</th><td className="p-3">Beginners, students, aspiring data scientists</td><td className="p-3">Learners who already code in Python</td></tr><tr className="border-t border-white/10"><th scope="row" className="p-3 text-muted">Focus</th><td className="p-3">Python, data science, ML and deployment</td><td className="p-3">LLMs, RAG, agents and GenAI apps</td></tr><tr className="border-t border-white/10"><th scope="row" className="p-3 text-muted">Duration · fee</th><td className="p-3">8 weeks · {FEE}</td><td className="p-3">8 weeks · {FEE}</td></tr></tbody></table>
      </div>
    </details>);
}
