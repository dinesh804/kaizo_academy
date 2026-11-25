import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Contact from "@/components/Contact";
import { CourseCards } from "@/components/Courses";
import AboutStrong from "@/components/AboutStrong";
import ProjectCards from "@/components/ProjectCards";
import Footer from "@/components/Footer";
import { Divisions, Benefits, Journey } from "@/components/Sections";
export default function Home() {
  return (<><Nav /><main><Hero /><Divisions /><Benefits /><Journey /><CourseCards /><ProjectCards /><AboutStrong /><Contact /></main><Footer /></>);
}
