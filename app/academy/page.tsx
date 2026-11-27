import Nav from "@/components/Nav"; import Footer from "@/components/Footer"; import Contact from "@/components/Contact";
import { CourseCards, Compare } from "@/components/Courses";
import SampleCertificate from "@/components/SampleCertificate";
import LearningCommunity from "@/components/LearningCommunity";
import FirstBatchShowcase from "@/components/FirstBatchShowcase";
export const metadata = { title: "Technology programmes", description: "Explore KAIZO ACADEMY AI and technology curricula, training volume, course outcomes and transparent proposed pricing.", alternates: { canonical: "/academy" } };
export default function Academy() { return (<><Nav /><main className="pt-16"><section className="py-10 sm:py-14"><div className="mx-auto max-w-7xl px-5"><p className="text-sm tracking-widest text-neon">KAIZO ACADEMY</p><h1 className="mt-3 max-w-4xl font-display text-3xl font-bold sm:text-5xl">Practical AI &amp; technology programmes</h1><p className="mt-4 max-w-2xl text-muted">Explore structured curricula, learning outcomes and proposed training details for beginner-friendly AI education.</p></div></section><CourseCards /><Compare /><LearningCommunity /><FirstBatchShowcase /><SampleCertificate /><Contact /></main><Footer /></>); }
