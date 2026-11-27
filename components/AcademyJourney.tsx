import { ArrowRight, BookOpenCheck, Code2, GraduationCap, Handshake, Layers3 } from "lucide-react";
import { courses, feeStatus, formatINR, proposedTraining } from "@/lib/content";
import IntroRegistration from "./IntroRegistration";

const allocations = [
  ["Training volume", proposedTraining.totalHours, "proposed total hours", BookOpenCheck],
  ["Live instruction", proposedTraining.liveInstructionHours, "instructor-led hours", GraduationCap],
  ["Guided practical labs", proposedTraining.guidedLabHours, "supported practice hours", Code2],
  ["Supervised projects", proposedTraining.supervisedProjectHours, "project development hours", Layers3],
] as const;

export function TrainingValue() {
  return <section id="training-value" className="bg-bg2 py-14 sm:py-20">
    <div className="mx-auto max-w-7xl px-5">
      <p className="text-sm tracking-widest text-neon">A CLEAR LEARNING PATH</p>
      <h2 className="mt-3 max-w-3xl font-display text-3xl font-bold sm:text-4xl">120 Hours of Structured Practical Training</h2>
      <p className="mt-4 max-w-3xl text-muted">A {proposedTraining.confirmed ? "confirmed" : "proposed"} learning allocation for the Applied AI & Machine Learning course. {proposedTraining.confirmed ? "" : "These figures are subject to delivery confirmation;"} Calendar schedule and class timings have not yet been confirmed.</p>
      {!proposedTraining.confirmed && <p className="mt-3 inline-flex rounded-full border border-neon/35 px-3 py-1 text-xs text-crimson-soft">Proposed allocation · pending confirmation by the academy</p>}
      <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {allocations.map(([title, value, detail, Icon]) => <article key={title} className="glass rounded-2xl p-5">
          <Icon className="text-neon" aria-hidden size={20} />
          <p className="mt-4 font-display text-4xl font-bold">{value}<span className="ml-1 text-base font-medium text-muted">hours</span></p>
          <h3 className="mt-2 font-semibold">{title}</h3>
          <p className="mt-1 text-sm text-muted">{detail}</p>
        </article>)}
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {[["Learn together", "Live coding, structured instruction and time to ask questions."], ["Practise with guidance", "Guided exercises reinforce new concepts with instructor support."], ["Build and review", "Supervised projects help learners apply ideas and receive feedback."]].map(([title, body]) => <div key={title} className="rounded-xl border border-white/10 p-4"><h3 className="font-semibold">{title}</h3><p className="mt-1 text-sm text-muted">{body}</p></div>)}
      </div>
      <p className="mt-5 text-sm text-muted">Curriculum topics and learning outcomes are listed on each course page. Independent assignments are additional learning activities and are not counted as instructor-led hours.</p>
      <a href={`/academy/${courses[0].slug}`} className="btn btn-s mt-5">View curriculum <ArrowRight size={16} /></a>
    </div>
  </section>;
}

export function TrustSection() {
  return <section id="academy-trust" className="py-14 sm:py-20">
    <div className="mx-auto max-w-7xl px-5">
      <p className="text-sm tracking-widest text-neon">PRACTICE OVER PROMISES</p>
      <h2 className="mt-3 max-w-3xl font-display text-3xl font-bold sm:text-4xl">Learn Through Practice. Build With Confidence.</h2>
      <p className="mt-4 max-w-3xl text-muted">Explore KAIZO LABS research and development work below. We publish instructor credentials, student outcomes and personal feedback only when verified and authorised.</p>
      <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[["Instructor profile", "Verified profile and expertise details will be added when supplied."], ["Research and projects", "See current KAIZO LABS project and research demonstrations below."], ["Student work and feedback", "Genuine learner work and feedback will appear here with permission."], ["Batch photographs", "Authentic first-batch photographs will be added when available."]].map(([title, body]) => <article key={title} className="rounded-2xl border border-dashed border-white/20 bg-bg2/60 p-5"><Handshake size={19} className="text-neon" aria-hidden /><h3 className="mt-3 font-display font-semibold">{title}</h3><p className="mt-2 text-sm text-muted">{body}</p></article>)}
      </div>
      <p className="mt-4 text-xs text-muted">Existing community artwork is labelled illustrative and is not presented as a photograph of KAIZO students.</p>
    </div>
  </section>;
}

export function FoundingOffer() {
  return <section id="founding-offer" className="bg-bg2 py-14 sm:py-20">
    <div className="mx-auto grid max-w-7xl gap-8 px-5 lg:grid-cols-[1fr_.8fr] lg:items-center">
      <div><p className="text-sm tracking-widest text-neon">TRANSPARENT PRICING</p><h2 className="mt-3 max-w-2xl font-display text-3xl font-bold sm:text-4xl">Join the KAIZO ACADEMY Founding Batch</h2><p className="mt-4 max-w-xl text-muted">Explore the curriculum and register your interest. Batch dates and delivery schedule will be shared once confirmed.</p></div>
      <article className="glass rounded-3xl p-6 sm:p-8">
        <span className="tag">Founding batch · proposed offer</span>
        <h3 className="mt-4 font-display text-xl font-semibold">Applied AI & Machine Learning</h3>
        <p className="mt-3 font-display text-5xl font-bold grad">{formatINR(courses[0].fee)}</p><p className="mt-1 text-sm text-muted">{feeStatus}</p>
        <ul className="mt-6 space-y-3 border-t border-white/10 pt-5 text-sm text-muted">
          <li>• Full curriculum and learning outcomes on the course page</li>
          <li>• Training volume: {proposedTraining.totalHours} hours{proposedTraining.confirmed ? "" : ", proposed and pending confirmation"}</li>
          <li>• Practical labs, supervised projects and mentorship are planned; delivery details to be confirmed</li>
          <li>• Course schedule and batch dates: to be announced</li>
        </ul>
        <a href={`/academy/${courses[0].slug}`} className="btn btn-s mt-6 w-full">Review curriculum</a>
      </article>
    </div>
  </section>;
}

export function FreeIntroSection() {
  return <section id="free-intro" className="relative overflow-hidden py-16 sm:py-24">
    <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_50%,rgba(181,18,38,.22),transparent_55%)]" />
    <div className="relative mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-5 md:flex-row md:items-center">
      <div><p className="text-sm tracking-widest text-neon">YOUR NEXT STEP</p><h2 className="mt-3 max-w-2xl font-display text-3xl font-bold sm:text-4xl">Take Your First Step Into Technology</h2><p className="mt-4 max-w-2xl text-muted">Attend a free introductory class and discover how AI, Machine Learning and modern technology can shape your career.</p></div>
      <IntroRegistration courseOptions={courses.map(course => course.n)} />
    </div>
  </section>;
}
