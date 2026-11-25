import ProjectArt from "./ProjectArt";
import { projects, type Project } from "@/lib/projects";
export function Cover({ p }: { p: Project }) {
  const shot = p.screenshots[0];
  return (<div className="relative aspect-video overflow-hidden rounded-xl border border-cyan/30 bg-bg">
    {shot ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={shot} alt={`${p.title} screenshot`} loading="lazy" className="h-full w-full object-cover" /> : <ProjectArt kind={p.art} />}
    <span className="absolute bottom-2 left-2 rounded bg-bg/85 px-2 py-0.5 text-[10px] tracking-wider text-muted">{shot ? "SCREENSHOT" : "ILLUSTRATIVE CONCEPT VISUAL"}</span></div>);
}
export const Tech = ({ items }: { items: string[] }) => <ul className="flex flex-wrap gap-2 text-xs text-muted">{items.map(t => <li key={t} className="rounded-full border border-white/10 px-3 py-1">{t}</li>)}</ul>;
export default function ProjectCards() {
  return (
    <section id="projects" className="py-20"><div className="mx-auto max-w-7xl px-5">
      <h2 className="font-display text-3xl font-bold sm:text-4xl">Project showcase</h2>
      <p className="mt-4 max-w-2xl text-muted">Research and development work from KAIZO LABS. Cover images are illustrative concept visuals unless marked as screenshots.</p>
      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {projects.map(p => (
          <article key={p.slug} className="glass flex h-full flex-col rounded-2xl p-5">
            <Cover p={p} />
            <span className="tag mt-4 w-fit">{p.label}</span>
            <h3 className="mt-3 font-display text-xl font-semibold">{p.title}</h3>
            <p className="mt-2 text-sm text-muted">{p.desc}</p>
            <div className="mt-4"><Tech items={p.tech} /></div>
            <div className="mt-auto flex flex-wrap gap-3 pt-5">
              <a href={`/projects/${p.slug}`} className="btn btn-s !py-2">View details</a>
              {p.github && <a href={p.github} className="btn btn-s !py-2" rel="noopener noreferrer">GitHub</a>}
              {p.demo && <a href={p.demo} className="btn btn-p !py-2" rel="noopener noreferrer">Live demo</a>}
            </div>
          </article>))}
      </div></div></section>);
}
