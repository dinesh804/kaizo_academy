"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
const Scene = dynamic(() => import("./CourseGemScene"), { ssr: false });
const Fallback = () => <svg viewBox="0 0 100 100" className="mx-auto h-full w-auto p-4" aria-hidden><polygon points="50,8 88,29 88,71 50,92 12,71 12,29" fill="none" stroke="#FFD700" strokeWidth="2" /><polygon points="50,28 70,39 70,61 50,72 30,61 30,39" fill="#FFD700" opacity=".8" /></svg>;
export default function CourseGem({ kind }: { kind: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false), [gl, setGl] = useState(true), [calm, setCalm] = useState(false);
  useEffect(() => {
    setCalm(matchMedia("(prefers-reduced-motion: reduce)").matches);
    try { const c = document.createElement("canvas"); setGl(!!(c.getContext("webgl2") || c.getContext("webgl"))); } catch { setGl(false); }
    const io = new IntersectionObserver(([e]) => setOn(e.isIntersecting), { rootMargin: "100px" }); io.observe(ref.current!); return () => io.disconnect();
  }, []);
  return (<motion.div ref={ref} initial={{ opacity: 0, scale: .92 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} aria-hidden className="honey relative mb-4 h-40 w-full overflow-hidden rounded-xl bg-bg">
    {on && gl ? <Scene kind={kind} calm={calm} /> : <Fallback />}</motion.div>);
}
