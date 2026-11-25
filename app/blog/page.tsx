import Nav from "@/components/Nav"; import Footer from "@/components/Footer";
import { posts } from "@/lib/blog";
export const metadata = { title: "Blog | KAIZO LABS", description: "Articles on AI, machine learning and generative AI." };
export default function Blog() {
  return (<><Nav /><main className="mx-auto max-w-4xl px-5 pb-20 pt-32">
    <h1 className="font-display text-4xl font-bold grad">Blog</h1>
    <div className="mt-10 space-y-5">{posts.map(p => <a key={p.slug} href={`/blog/${p.slug}`} className="glass block rounded-2xl p-6"><h2 className="font-display text-xl font-semibold">{p.title}</h2><p className="mt-2 text-muted">{p.summary}</p></a>)}</div>
  </main><Footer /></>);
}
