"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import Logo from "./Logo";
import HeroVisual from "./HeroVisual";
function Particles() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current!, x = c.getContext("2d")!;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let w = 0, h = 0, raf = 0;
    const size = () => { w = c.width = c.offsetWidth; h = c.height = c.offsetHeight; };
    size(); addEventListener("resize", size);
    const ps = Array.from({ length: 50 }, () => ({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - .5) * .3, vy: (Math.random() - .5) * .3 }));
    const tick = () => {
      x.clearRect(0, 0, w, h);
      for (const p of ps) {
        p.x = (p.x + p.vx + w) % w; p.y = (p.y + p.vy + h) % h;
        x.fillStyle = "rgba(255,215,0,.6)"; x.fillRect(p.x, p.y, 1.5, 1.5);
      }
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => { cancelAnimationFrame(raf); removeEventListener("resize", size); };
  }, []);
  return <canvas ref={ref} aria-hidden className="absolute inset-0 h-full w-full" />;
}
export default function Hero() {
  const root = useRef<HTMLElement>(null);
  useEffect(() => { // short cinematic intro; navigation and CTAs are usable immediately
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.timeline({ defaults: { ease: "power3.out" } })
        .from(".h-vis", { opacity: 0, scale: 1.08, duration: 1.4 })
        .from(".h-logo", { opacity: 0, y: 20, duration: .6 }, "-=.7")
        .from(".h-line", { opacity: 0, y: 28, duration: .6, stagger: .1 }, "-=.3")
        .from(".h-cta", { opacity: 0, y: 16, duration: .4, stagger: .08 }, "-=.3");
    }, root);
    return () => ctx.revert();
  }, []);
  return (
    <section ref={root} id="home" className="relative flex min-h-[100svh] flex-col justify-center gap-6 overflow-hidden bg-bg pb-8 pt-24 lg:flex-row lg:items-center lg:gap-0 lg:pb-14 lg:pt-28">
      <div className="relative z-20 mx-auto w-full max-w-7xl px-5">
        <div className="max-w-xl">
          <div className="h-logo"><Logo size="lg" /></div>
          <p className="h-line mt-6 text-sm tracking-widest text-cyan">IMAGINE. IMPROVE. INNOVATE.</p>
          <h1 className="h-line mt-3 font-display text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">DON'T JUST LEARN AI. <span className="grad">BUILD IT.</span></h1>
          <p className="h-line mt-6 text-lg text-muted">Transform your curiosity into real-world technology skills through practical learning, innovative projects and expert guidance.</p>
          <div className="pointer-events-auto mt-8 hidden flex-wrap gap-4 lg:flex"><a href="/academy" className="h-cta btn btn-p">EXPLORE COURSES</a><a href="/#contact" className="h-cta btn btn-s">ENROL NOW</a></div>
        </div>
      </div>
      <div className="h-vis relative z-0 mx-4 h-[30svh] min-h-[220px] max-h-[320px] shrink-0 overflow-hidden rounded-2xl border border-cyan/25 sm:mx-5 lg:absolute lg:inset-0 lg:mx-0 lg:h-full lg:max-h-none lg:rounded-none lg:border-0"><HeroVisual /></div>
      <div aria-hidden className="pointer-events-none absolute inset-0 z-10 hidden bg-gradient-to-t from-bg via-bg/60 to-transparent lg:block lg:bg-gradient-to-r lg:from-bg lg:via-bg/55 lg:to-transparent" />
      <div className="relative z-20 mx-4 flex shrink-0 flex-col gap-3 pb-4 sm:mx-auto sm:w-auto sm:flex-row sm:justify-center lg:hidden">
        <a href="/academy" className="h-cta btn btn-p w-full justify-center sm:w-auto">EXPLORE COURSES</a>
        <a href="/#contact" className="h-cta btn btn-s w-full justify-center sm:w-auto">ENROL NOW</a>
      </div>
    </section>);
}
