"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
const G = "#FFD700", D = "#D4AF37", C = "#F5E6B8";
function Net() { // Course 1: 3-layer neural network
  const L = [3, 4, 3], pts = useMemo(() => L.flatMap((n, l) => Array.from({ length: n }, (_, i) => new THREE.Vector3((l - 1) * 1.3, (i - (n - 1) / 2) * .7, 0))), []);
  const geo = useMemo(() => { const v: THREE.Vector3[] = []; pts.forEach(a => pts.forEach(b => { if (b.x - a.x > 1 && b.x - a.x < 1.4) v.push(a, b); })); return new THREE.BufferGeometry().setFromPoints(v); }, [pts]);
  return <><lineSegments geometry={geo}><lineBasicMaterial color={D} /></lineSegments>{pts.map((p, i) => <mesh key={i} position={p}><sphereGeometry args={[.13, 16, 16]} /><meshStandardMaterial color={i % 2 ? C : G} /></mesh>)}</>;
}
function Agents() { // Course 2: generative core with agent nodes
  return <><mesh><icosahedronGeometry args={[.7, 1]} /><meshStandardMaterial color={G} wireframe /></mesh>
    {[0, 1, 2, 3, 4].map(i => { const a = i / 5 * 6.28; return <mesh key={i} position={[Math.cos(a) * 1.5, Math.sin(a * 2) * .4, Math.sin(a) * 1.5]}><sphereGeometry args={[.18, 16, 16]} /><meshStandardMaterial color={i % 2 ? C : G} /></mesh>; })}
    <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[1.5, .012, 8, 64]} /><meshBasicMaterial color={G} /></mesh></>;
}
function Cloud() { // Course 3: server racks with a network ring
  return <>{[-.6, 0, .6].map((y, i) => <group key={i} position={[0, y, 0]}><mesh><boxGeometry args={[1.7, .4, 1]} /><meshStandardMaterial color="#1c1c1c" metalness={.7} roughness={.3} /></mesh>
    <mesh position={[.55, 0, .51]}><boxGeometry args={[.4, .06, .02]} /><meshBasicMaterial color={G} /></mesh><mesh position={[-.6, 0, .51]}><boxGeometry args={[.1, .1, .02]} /><meshBasicMaterial color={C} /></mesh></group>)}
    <mesh rotation={[Math.PI / 2.4, 0, 0]}><torusGeometry args={[1.7, .012, 8, 64]} /><meshBasicMaterial color={D} /></mesh>
    {[0, 1, 2, 3].map(i => { const a = i / 4 * 6.28; return <mesh key={i} position={[Math.cos(a) * 1.7, Math.sin(a) * .5, Math.sin(a) * .8]}><sphereGeometry args={[.1, 12, 12]} /><meshBasicMaterial color={G} /></mesh>; })}</>;
}
function Gem({ kind, calm }: { kind: number; calm: boolean }) {
  const g = useRef<THREE.Group>(null!);
  useFrame(({ clock, pointer, invalidate }) => { const t = clock.elapsedTime;
    g.current.rotation.y = calm ? .6 : t * .5 + pointer.x * .8; g.current.rotation.x = .3 + (calm ? 0 : -pointer.y * .4); g.current.position.y = calm ? 0 : Math.sin(t) * .08; if (calm) invalidate(); });
  return <group ref={g} scale={.85}>{kind === 0 ? <Net /> : kind === 1 ? <Agents /> : <Cloud />}</group>;
}
export default function CourseGemScene({ kind, calm }: { kind: number; calm: boolean }) {
  return (<Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 4.5], fov: 40 }} frameloop={calm ? "demand" : "always"} gl={{ antialias: true, powerPreference: "low-power" }}>
    <ambientLight intensity={.7} /><directionalLight position={[3, 4, 3]} intensity={2} /><pointLight position={[0, 0, 3]} intensity={10} color={G} /><Gem kind={kind} calm={calm} /></Canvas>);
}
