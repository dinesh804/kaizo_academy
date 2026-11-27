import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Contact from "@/components/Contact";
import { CourseCards } from "@/components/Courses";
import AboutStrong from "@/components/AboutStrong";
import ProjectCards from "@/components/ProjectCards";
import Footer from "@/components/Footer";
import { Divisions } from "@/components/Sections";
import { FoundingOffer, FreeIntroSection, TrainingValue, TrustSection } from "@/components/AcademyJourney";
export default function Home() {
  return (<><Nav /><main><Hero /><TrainingValue /><TrustSection /><FoundingOffer /><FreeIntroSection /><ProjectCards /><Divisions /><CourseCards /><AboutStrong /><Contact /></main><Footer /></>);
}
