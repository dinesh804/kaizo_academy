import { courses } from "@/lib/content"; import { posts } from "@/lib/blog"; import { projects } from "@/lib/projects";
const base = "https://kaizo-academy.vercel.app";
export default function sitemap() { return [base, `${base}/academy`, `${base}/blog`, ...courses.map(c => `${base}/academy/${c.slug}`), ...posts.map(p => `${base}/blog/${p.slug}`), ...projects.map(p => `${base}/projects/${p.slug}`)].map(url => ({ url, lastModified: new Date() })); }
