import Nav from "@/components/Nav"; import Footer from "@/components/Footer"; import Contact from "@/components/Contact";
import { CourseCards, Compare } from "@/components/Courses";
import SampleCertificate from "@/components/SampleCertificate";
import LearningCommunity from "@/components/LearningCommunity";
export const metadata = { title: "KAIZO ACADEMY | Technology programmes", description: "Explore five KAIZO ACADEMY technology programmes, including two detailed AI curricula and proposed upcoming paths." };
export default function Academy() { return (<><Nav /><main className="pt-16"><CourseCards /><Compare /><LearningCommunity /><SampleCertificate /><Contact /></main><Footer /></>); }
