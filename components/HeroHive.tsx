"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
type Ctl = { down: boolean; x: number; y: number; ry: number; rx: number; v: number };
const S = .62;
const cells = (() => { const a: { x: number; z: number; d: number }[] = [];
  for (let q = -2; q <= 2; q++) for (let r = -2; r <= 2; r++) if (Math.abs(q + r) <= 2) a.push({ x: S * Math.sqrt(3) * (q + r / 2), z: S * 1.5 * r, d: Math.hypot(q, r) });
  return a; })();
function Scene({ ctl, calm, count }: { ctl: React.MutableRefObject<Ctl>; calm: boolean; count: number }) {
  const g = useRef<THREE.Group>(null!), m = useRef<THREE.InstancedMesh>(null!), core = useRef<THREE.Mesh>(null!);
  const o = useMemo(() => new THREE.Object3D(), []);
  const pts = useMemo(() => { const a = new Float32Array(count * 3); for (let i = 0; i < count; i++) { const r = 2.5 + Math.random() * 2, t = Math.random() * 6.28, p = Math.acos(2 * Math.random() - 1); a.set([r * Math.sin(p) * Math.cos(t), r * Math.cos(p), r * Math.sin(p) * Math.sin(t)], i * 3); } return a; }, [count]);
  useEffect(() => { const c = new THREE.Color(); cells.forEach((_, i) => m.current.setColorAt(i, c.set(["#E63946", "#2a2a2a", "#FF8992"][i % 3]))); m.current.instanceColor!.needsUpdate = true; }, []);
  useFrame(({ clock, invalidate }) => {
    const t = clock.elapsedTime, k = ctl.current;
    cells.forEach((c, i) => { const h = calm ? 1 : .5 + .9 * (Math.sin(t * 1.3 - c.d * 1.2) + 1) / 2; o.position.set(c.x, h / 2 - .5, c.z); o.scale.set(1, h, 1); o.updateMatrix(); m.current.setMatrixAt(i, o.matrix); });
    m.current.instanceMatrix.needsUpdate = true;
    if (!k.down && !calm) { k.ry += k.v; k.v += (.004 - k.v) * .03; }
    g.current.rotation.set(k.rx, k.ry, 0); core.current.rotation.y = t * .6; core.current.position.y = 2 + (calm ? 0 : Math.sin(t) * .12);
    if (calm) invalidate();
  });
  return (<group ref={g}>
    <instancedMesh ref={m} args={[undefined, undefined, cells.length]}><cylinderGeometry args={[S * .92, S * .92, 1, 6]} /><meshStandardMaterial metalness={.3} roughness={.35} /></instancedMesh>
    <mesh ref={core}><icosahedronGeometry args={[.6, 1]} /><meshStandardMaterial color="#E63946" wireframe /></mesh>
    <points><bufferGeometry><bufferAttribute attach="attributes-position" args={[pts, 3]} /></bufferGeometry><pointsMaterial size={.04} color="#E63946" /></points>
  </group>);
}
export default function Hero3D() {
  const ctl = useRef<Ctl>({ down: false, x: 0, y: 0, ry: .5, rx: .6, v: .004 });
  const calm = useMemo(() => matchMedia("(prefers-reduced-motion: reduce)").matches, []);
  const count = useMemo(() => (innerWidth < 768 ? 80 : 220), []);
  return (
    <div className="relative aspect-square w-full cursor-grab" style={{ touchAction: "pan-y" }}
      onPointerDown={e => { const k = ctl.current; k.down = true; k.x = e.clientX; k.y = e.clientY; e.currentTarget.setPointerCapture(e.pointerId); }}
      onPointerMove={e => { const k = ctl.current; if (!k.down) return; const dx = e.clientX - k.x, dy = e.clientY - k.y; k.x = e.clientX; k.y = e.clientY; k.ry += dx * .008; k.v = dx * .008; k.rx = Math.min(1.1, Math.max(.1, k.rx + dy * .006)); }}
      onPointerUp={() => { ctl.current.down = false; }} role="img" aria-label="Interactive 3D honeycomb of technology cells. Drag to rotate.">
      <div aria-hidden className="absolute inset-0 rounded-full bg-neon/10 blur-3xl" />
      <Canvas dpr={[1, 1.75]} camera={{ position: [0, 2.5, 7], fov: 42 }} frameloop={calm ? "demand" : "always"} gl={{ antialias: true, powerPreference: "high-performance" }}>
        <ambientLight intensity={.6} /><directionalLight position={[3, 5, 2]} intensity={2.2} color="#FF8992" /><pointLight position={[0, 3, 0]} intensity={30} color="#E63946" />
        <Scene ctl={ctl} calm={calm} count={count} />
      </Canvas>
    </div>);
}
