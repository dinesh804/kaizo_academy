import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import GsapReveal from "@/components/GsapReveal";
const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-display" });
const body = Inter({ subsets: ["latin"], variable: "--font-body" });
export const metadata: Metadata = {
  title: "KAIZO LABS | Imagine. Improve. Innovate.",
  description: "KAIZO LABS brings together AI, technology education, research and product innovation.",
  openGraph: { title: "KAIZO LABS", description: "Imagine. Improve. Innovate.", type: "website" },
};
const ld = { "@context": "https://schema.org", "@type": "Organization", name: "KAIZO LABS", slogan: "Imagine. Improve. Innovate." };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="en" className={`${display.variable} ${body.variable}`}><body>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    <GsapReveal />{children}</body></html>);
}
