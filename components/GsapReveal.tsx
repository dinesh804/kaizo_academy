"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
export default function GsapReveal() {
  const path = usePathname();
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo("main", { opacity: 0 }, { opacity: 1, duration: .6, ease: "power2.out" });
      gsap.utils.toArray<HTMLElement>("main section h2, main article.glass, main figure").forEach(el =>
        gsap.from(el, { y: 36, opacity: 0, duration: .9, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 90%", once: true } }));
      if (document.querySelector(".hero-visual") && document.querySelector("#home"))
        gsap.to(".hero-visual", { yPercent: -8, ease: "none", scrollTrigger: { trigger: "#home", start: "top top", end: "bottom top", scrub: true } });
    });
    return () => ctx.revert();
  }, [path]);
  return null;
}
