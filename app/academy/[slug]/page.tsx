import { notFound } from "next/navigation";
import type { Metadata } from "next";
import CoursePage from "@/components/CoursePage";
import { courses } from "@/lib/content";
export const generateStaticParams = () => courses.map(c => ({ slug: c.slug }));
export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const c = courses.find(x => x.slug === params.slug);
  return c ? { title: `${c.n} | KAIZO ACADEMY`, description: c.obj } : {};
}
export default function Page({ params }: { params: { slug: string } }) {
  const c = courses.find(x => x.slug === params.slug);
  if (!c) notFound();
  return <CoursePage c={c} />;
}
