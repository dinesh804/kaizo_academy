import { notFound } from "next/navigation";
import Nav from "@/components/Nav"; import Footer from "@/components/Footer";
import { Cover, Tech } from "@/components/ProjectCards";
import { projects } from "@/lib/projects";
export const generateStaticParams = () => projects.map(p => ({ slug: p.slug }));
export function generateMetadata({ params }: { params: { slug: string } }) {
  const p = projects.find(x => x.slug === params.slug); return p ? { title: p.title, description: p.desc, alternates: { canonical: `/projects/${p.slug}` } } : {};
}
export default function ProjectPage({ params }: { params: { slug: string } }) {
  const p = projects.find(x => x.slug === params.slug); if (!p) notFound();
  return (<><Nav /><main className="mx-auto max-w-4xl px-5 pb-20 pt-32">
    <a href="/#projects" className="text-sm text-neon">← All projects</a>
    <span className="tag ml-3">{p.label}</span>
    <h1 className="mt-4 font-display text-3xl font-bold sm:text-4xl grad">{p.title}</h1>
    <p className="mt-4 text-lg text-muted">{p.desc}</p>
    <div className="mt-6"><Tech items={p.tech} /></div>
    <div className="mt-8"><Cover p={p} /></div>
    {p.screenshots.length > 1 && <div className="mt-6 grid gap-4 sm:grid-cols-2">{p.screenshots.slice(1).map(s => /* eslint-disable-next-line @next/next/no-img-element */ <img key={s} src={s} alt={`${p.title} screenshot`} loading="lazy" className="aspect-video w-full rounded-xl border border-neon/30 object-cover" />)}</div>}
    {!p.screenshots.length && <p className="mt-4 text-sm text-muted">{p.coverImage ? "This AI-generated concept visual illustrates the project domain; it is not an application screenshot." : "The image above is an illustrative concept visual, not an application screenshot. Real screenshots will appear here as they become available."}</p>}
    {(p.github || p.demo) && <div className="mt-8 flex flex-wrap gap-3">{p.github && <a className="btn btn-s" href={p.github} rel="noopener noreferrer">View on GitHub</a>}{p.demo && <a className="btn btn-p" href={p.demo} rel="noopener noreferrer">Live demo</a>}</div>}
    <a href="/#contact" className="btn btn-s mt-10">Discuss a project with us</a>
  </main><Footer /></>);
}
