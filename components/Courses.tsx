import CourseGem from "./CourseGem";
import { cloudCourse, courses, FEE, compareRows, SCHOLARSHIP_ENABLED } from "@/lib/content";
export function CourseCards() {
  return (
    <section id="academy" className="bg-bg2 py-20"><div className="mx-auto max-w-7xl px-5">
      <h2 className="font-display text-3xl font-bold sm:text-4xl">Our programmes.</h2>
      <p className="mt-4 max-w-2xl text-muted">Practical, project-based AI training under KAIZO ACADEMY.</p>
      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((c, i) => (
          <article key={c.slug} className="glass flex flex-col rounded-2xl p-7">
            <CourseGem kind={i} />
            <span className="tag w-fit">Course {i + 1}</span>
            <h3 className="mt-3 font-display text-2xl font-bold grad">{c.n}</h3>
            <p className="mt-1 text-cyan">{c.tag}</p>
            <p className="mt-3 text-muted">{c.obj}</p>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div><dt className="text-muted">Duration</dt><dd>8 weeks · 120 live hours</dd></div>
              <div><dt className="text-muted">Fee</dt><dd className="font-semibold">{FEE} per student</dd></div>
              <div className="col-span-2"><dt className="text-muted">Eligibility</dt><dd>{c.prereq}</dd></div>
            </dl>
            {SCHOLARSHIP_ENABLED && <p className="mt-3 text-xs text-muted">Scholarships available for eligible students.</p>}
            <div className="mt-auto flex flex-wrap gap-3 pt-6">
              <a href={`/academy/${c.slug}`} className="btn btn-s !py-2">View curriculum</a>
              <a href={`/academy/${c.slug}#contact`} className="btn btn-p !py-2">Enrol</a>
            </div>
          </article>))}
        <article className="glass flex flex-col rounded-2xl p-7">
          <CourseGem kind={2} /><span className="tag w-fit">Course 3 · Coming soon</span>
          <h3 className="mt-3 font-display text-2xl font-bold grad">{cloudCourse.n}</h3>
          <p className="mt-3 text-muted">Duration, fee and curriculum will be announced. Send an enquiry and we will tell you first.</p>
          <dl className="mt-4 grid grid-cols-2 gap-3 text-sm"><div><dt className="text-muted">Duration</dt><dd className="text-magenta">To be announced</dd></div><div><dt className="text-muted">Fee</dt><dd className="text-magenta">To be announced</dd></div></dl>
          <div className="mt-auto pt-6"><a href="/#contact" className="btn btn-p !py-2">Enquire</a></div>
        </article>
      </div></div></section>);
}
export function Compare() {
  return (
    <section className="py-20"><div className="mx-auto max-w-7xl px-5">
      <h2 className="font-display text-3xl font-bold">Which programme is right for you?</h2>
      <p className="mt-3 text-muted">New to coding? Start with Course 1. Already write Python? Course 2 may suit you.</p>
      <div className="mt-8 overflow-x-auto"><table className="w-full min-w-[640px] text-left text-sm">
        <thead><tr className="text-cyan"><th className="p-3" /><th className="p-3">Applied AI & Machine Learning</th><th className="p-3">Generative AI & Agentic AI</th></tr></thead>
        <tbody>{compareRows.map(([a, b, c]) => <tr key={a} className="border-t border-white/10"><th scope="row" className="p-3 text-muted">{a}</th><td className="p-3">{b}</td><td className="p-3">{c}</td></tr>)}</tbody>
      </table></div></div></section>);
}
