"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
const Hero3D = dynamic(() => import("./Hero3D"), { ssr: false });
// Your reference render shows instantly (so the page never feels empty), then fades out once the live 3D scene is running.
// It also stays as the backdrop on devices without WebGL.
export default function HeroVisual() {
  const [ok, setOk] = useState<boolean | null>(null), [ready, setReady] = useState(false);
  useEffect(() => { try { const c = document.createElement("canvas"); setOk(!!(c.getContext("webgl2") || c.getContext("webgl"))); } catch { setOk(false); } }, []);
  return (<div className="hero-bg absolute inset-0">
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src="/hero-brain-crimson.png" alt="" aria-hidden fetchPriority="high" className={`absolute inset-0 h-full w-full object-cover object-[70%_50%] transition-opacity duration-1000 ${ready ? "opacity-0" : "opacity-70"}`} />
    {ok && <Hero3D onReady={() => setReady(true)} />}
  </div>);
}
