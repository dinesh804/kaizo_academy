"use client";
import { useEffect, useRef, useState } from "react";
// Shows a real photo from /public when it exists; otherwise the supplied fallback. Generated people are never shown as real students.
export default function PhotoSlot({ src, alt, fallback, ratio = "aspect-[4/3]" }: { src: string; alt: string; fallback: React.ReactNode; ratio?: string }) {
  const [bad, setBad] = useState(false), ref = useRef<HTMLImageElement>(null);
  useEffect(() => { const i = ref.current; if (i && i.complete && i.naturalWidth === 0) setBad(true); }, []);
  // eslint-disable-next-line @next/next/no-img-element
  return bad ? <>{fallback}</> : <img ref={ref} src={src} alt={alt} loading="lazy" onError={() => setBad(true)} className={`${ratio} w-full rounded-2xl border border-neon/30 object-cover`} />;
}
