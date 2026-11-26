"use client";
import { useEffect, useRef } from "react";
const LAYERS = [4, 6, 7, 5, 3];
// Living neural network: signals travel node to node and cascade forward; reacts to the pointer.
export default function NeuralViz() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current!, ctx = c.getContext("2d")!;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(devicePixelRatio || 1, 2), L = LAYERS.length - 1;
    let W = 0, H = 0, raf = 0, mx = 0, my = 0, tx = 0, ty = 0;
    const nodes = LAYERS.flatMap((n, l) => Array.from({ length: n }, (_, i) => ({ l, i, n, ph: Math.random() * 6.28, z: Math.random() })));
    const edges: [number, number][] = [];
    nodes.forEach((a, ai) => nodes.forEach((b, bi) => { if (b.l === a.l + 1 && Math.random() < .6) edges.push([ai, bi]); }));
    let pulses: { e: number; t: number; s: number }[] = [];
    const hue = (t: number) => `hsl(${44 + t * 8},100%,55%)`;
    const draw = (t: number) => {
      ctx.clearRect(0, 0, W, H);
      mx += (tx - mx) * .05; my += (ty - my) * .05;
      const P = nodes.map(n => ({
        x: W * (.07 + .86 * n.l / L) + Math.sin(t / 1400 + n.ph) * 7 + mx * (10 + n.z * 26),
        y: H * ((n.i + 1) / (n.n + 1)) + Math.cos(t / 1700 + n.ph) * 7 + my * (10 + n.z * 26),
      }));
      ctx.lineWidth = 1;
      for (const [a, b] of edges) {
        const g = ctx.createLinearGradient(P[a].x, P[a].y, P[b].x, P[b].y);
        g.addColorStop(0, "rgba(230,57,70,.16)"); g.addColorStop(1, "rgba(255,137,146,.16)");
        ctx.strokeStyle = g; ctx.beginPath(); ctx.moveTo(P[a].x, P[a].y); ctx.lineTo(P[b].x, P[b].y); ctx.stroke();
      }
      if (!reduce && pulses.length < 30 && Math.random() < .1) {
        const first = edges.map((e, i) => [e, i] as const).filter(([e]) => nodes[e[0]].l === 0);
        pulses.push({ e: first[(Math.random() * first.length) | 0][1], t: 0, s: .012 + Math.random() * .01 });
      }
      const next: typeof pulses = [];
      for (const p of pulses) {
        p.t += p.s; const [a, b] = edges[p.e], u = Math.min(p.t, 1);
        const x = P[a].x + (P[b].x - P[a].x) * u, y = P[a].y + (P[b].y - P[a].y) * u;
        const col = hue((nodes[a].l + u) / L);
        ctx.shadowColor = col; ctx.shadowBlur = 14; ctx.fillStyle = col;
        ctx.beginPath(); ctx.arc(x, y, 2.6, 0, 6.28); ctx.fill();
        if (p.t < 1) next.push(p);
        else { // cascade: signal fires the next layer
          const out = edges.map((e, i) => [e, i] as const).filter(([e]) => e[0] === b);
          out.forEach(([, i]) => { if (Math.random() < .55) next.push({ e: i, t: 0, s: p.s }); });
        }
      }
      pulses = next;
      nodes.forEach((n, i) => {
        const r = 3 + n.z * 3 + Math.sin(t / 500 + n.ph) * 1.2, col = hue(n.l / L);
        ctx.shadowColor = col; ctx.shadowBlur = 18; ctx.fillStyle = col;
        ctx.beginPath(); ctx.arc(P[i].x, P[i].y, Math.max(r, 2), 0, 6.28); ctx.fill();
      });
      ctx.shadowBlur = 0;
    };
    const loop = (t: number) => { draw(t); raf = requestAnimationFrame(loop); };
    const resize = () => { W = c.offsetWidth; H = c.offsetHeight; c.width = W * dpr; c.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); if (reduce) draw(0); };
    resize(); addEventListener("resize", resize);
    if (!reduce) raf = requestAnimationFrame(loop);
    const move = (e: PointerEvent) => { tx = (e.offsetX / W - .5) * 2; ty = (e.offsetY / H - .5) * 2; };
    const leave = () => { tx = 0; ty = 0; };
    c.addEventListener("pointermove", move); c.addEventListener("pointerleave", leave);
    return () => { cancelAnimationFrame(raf); removeEventListener("resize", resize); c.removeEventListener("pointermove", move); c.removeEventListener("pointerleave", leave); };
  }, []);
  return (
    <div className="relative aspect-[5/4] w-full max-w-xl">
      <div aria-hidden className="absolute inset-0 rounded-full bg-crimson/20 blur-3xl" />
      <canvas ref={ref} role="img" aria-label="Animated neural network with glowing signals travelling between nodes" className="relative h-full w-full" />
    </div>);
}
