import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import GsapReveal from "@/components/GsapReveal";
const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-display" });
const body = Inter({ subsets: ["latin"], variable: "--font-body" });
export const metadata: Metadata = {
  metadataBase: new URL("https://kaizo-academy.vercel.app"),
  title: { default: "KAIZO ACADEMY | Practical AI & Technology Education", template: "%s | KAIZO ACADEMY" },
  description: "Start your AI career from zero with beginner-friendly curricula, practical coding and project-based technology education from KAIZO ACADEMY.",
  alternates: { canonical: "/" },
  openGraph: { title: "KAIZO ACADEMY | Practical AI & Technology Education", description: "Beginner-friendly AI and technology learning through practical coding and projects.", url: "https://kaizo-academy.vercel.app/", siteName: "KAIZO ACADEMY", type: "website", images: [{ url: "/hero-brain-crimson.png", width: 1662, height: 946, alt: "KAIZO ACADEMY AI learning visual" }] },
  twitter: { card: "summary_large_image", title: "KAIZO ACADEMY | Practical AI & Technology Education", description: "Start your AI career from zero with practical, beginner-friendly learning.", images: ["/hero-brain-crimson.png"] },
};
const ld = { "@context": "https://schema.org", "@type": "Organization", name: "KAIZO LABS", url: "https://kaizo-academy.vercel.app/", slogan: "Imagine. Improve. Innovate." };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="en" className={`${display.variable} ${body.variable}`}><body>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    <GsapReveal />{children}</body></html>);
}
