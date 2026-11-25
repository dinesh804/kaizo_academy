import Nav from "@/components/Nav"; import Footer from "@/components/Footer"; import Contact from "@/components/Contact";
import { CourseCards, Compare } from "@/components/Courses";
export const metadata = { title: "KAIZO ACADEMY | AI training programmes", description: "Two practical 8-week AI programmes." };
export default function Academy() { return (<><Nav /><main className="pt-16"><CourseCards /><Compare /><Contact /></main><Footer /></>); }
