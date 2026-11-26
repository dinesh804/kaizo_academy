import { notFound } from "next/navigation";
import Nav from "@/components/Nav"; import Footer from "@/components/Footer"; import Article from "@/components/Article";
import { posts } from "@/lib/blog";
export const generateStaticParams = () => posts.map(p => ({ slug: p.slug }));
export function generateMetadata({ params }: { params: { slug: string } }) {
  const p = posts.find(x => x.slug === params.slug); return p ? { title: `${p.title} | KAIZO LABS`, description: p.summary } : {};
}
export default function Post({ params }: { params: { slug: string } }) {
  const p = posts.find(x => x.slug === params.slug); if (!p) notFound();
  return (<><Nav /><main className="mx-auto max-w-3xl px-5 pb-20 pt-32">
    <a href="/blog" className="text-sm text-neon">← All articles</a>
    <h1 className="mt-4 font-display text-3xl font-bold sm:text-4xl">{p.title}</h1><p className="mt-2 text-sm text-muted">{p.date} · KAIZO LABS</p>
    <div className="mt-8"><Article body={p.body} /></div>
    <a href="/academy" className="btn btn-p mt-10">Explore our programmes</a>
  </main><Footer /></>);
}
