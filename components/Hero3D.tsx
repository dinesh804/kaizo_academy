"use client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Billboard, OrbitControls } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import gsap from "gsap";
import NeuralBrain, { type NeuralApi } from "./NeuralBrain";
import { HERO_SHAPE } from "@/lib/neural/engine";
// ---- Brain surface: lobes, temporal bulge, longitudinal fissure, domain-warped sulci. Normals come from finite differences, so folds light correctly.

const wallV = `varying vec2 vU; void main(){ vU=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }`;
const wallF = `uniform float uT; varying vec2 vU;
float hd(vec2 p){p=abs(p);return max(dot(p,normalize(vec2(1.,1.73))),p.x);}
void main(){ vec2 uv=vU*vec2(40.,6.); vec2 r=vec2(1.,1.73),h=r*.5; vec2 a=mod(uv,r)-h,b=mod(uv-h,r)-h; vec2 g=dot(a,a)<dot(b,b)?a:b; vec2 id=uv-g;
 float e=smoothstep(.05,0.,abs(.5-hd(g))); float rn=fract(sin(dot(floor(id),vec2(12.9,78.2)))*43758.5);
 float al=e*(.12+.7*step(.92,rn)*(.5+.5*sin(uT*1.5+rn*30.))); al*=smoothstep(0.,.25,vU.y)*smoothstep(1.,.75,vU.y);
 gl_FragColor=vec4(1.,.75,.1,al); }`;
const edgeV = `attribute float aT; attribute float aS; varying float vT; varying float vS; void main(){ vT=aT; vS=aS; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }`;
const edgeF = `uniform float uT; uniform float uB; varying float vT; varying float vS; void main(){ float p=pow(1.-fract(vT-uT*.35+vS),8.); gl_FragColor=vec4(1.,.84,0.,.12+p*.9+uB*.3); }`;
const haloF = `varying vec2 vU; void main(){ float d=length(vU-.5)*2.; gl_FragColor=vec4(1.,.78,.1,smoothstep(.15,.5,d)*(1.-smoothstep(.5,1.,d))*.22); }`;
const haloV = `varying vec2 vU; void main(){ vU=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }`;
function Offset() { // shifts the brain to the right on wide screens so the headline stays readable on the left
  const { camera, size } = useThree();
  useEffect(() => { const c = camera as THREE.PerspectiveCamera;
    if (size.width > 1000) c.setViewOffset(size.width, size.height, -size.width * .17, 0, size.width, size.height);
    else c.setViewOffset(size.width, size.height, 0, size.height * .14, size.width, size.height);
    c.updateProjectionMatrix(); return () => c.clearViewOffset(); }, [camera, size]);
  return null;
}
type EU = { uT: { value: number }; uB: { value: number } };
// Reference-style lab: glowing platform, orbiting energy ribbons, rising light streaks, honeycomb walls all around (360°).
function Extras({ eu, calm, hi }: { eu: EU; calm: boolean; hi: boolean }) {
  const rib = useRef<THREE.Group>(null!);
  const ell = useMemo(() => new THREE.BufferGeometry().setFromPoints(Array.from({ length: 129 }, (_, i) => { const a = i / 128 * Math.PI * 2; return new THREE.Vector3(Math.cos(a) * (HERO_SHAPE === "sphere" ? 2.5 : 4.4), 0, Math.sin(a) * (HERO_SHAPE === "sphere" ? 2.5 : 1.7)); })), []);
  const beams = useMemo(() => { const pos: number[] = [], aT: number[] = [], aS: number[] = [];
    for (let i = 0; i < (hi ? 80 : 30); i++) { const a = Math.random() * 6.28, r = Math.random() * 3.4, x = Math.cos(a) * r, z = Math.sin(a) * r, s = Math.random(), y1 = -1.95 + 1 + Math.random() * 4.5; pos.push(x, -1.95, z, x, y1, z); aT.push(0, 1); aS.push(s, s); }
    const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute("aT", new THREE.Float32BufferAttribute(aT, 1)); g.setAttribute("aS", new THREE.Float32BufferAttribute(aS, 1)); return g; }, [hi]);
  useFrame((_, dt) => { if (!calm) rib.current.rotation.y += dt * .15; });
  return (<>
    <group ref={rib}>{[[.3, 0, .2], [-.4, 0, -.5], [.9, 0, .1]].map((r, i) =>
      <lineLoop key={i} geometry={ell} rotation={[r[0], r[1], r[2]]} scale={1 - i * .12}><lineBasicMaterial color="#FFD700" transparent opacity={.7} blending={THREE.AdditiveBlending} depthWrite={false} /></lineLoop>)}</group>
    <group position={[0, -1.95, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[3.4, 64]} /><meshStandardMaterial color="#0c0c0c" metalness={.9} roughness={.25} /></mesh>
      {[.6, 1.1, 1.7, 2.4, 3.2].map(r => <mesh key={r} rotation={[-Math.PI / 2, 0, 0]} position={[0, .01, 0]}><ringGeometry args={[r, r + .04, 96]} /><meshBasicMaterial color={r < 1.5 ? "#FFD700" : "#D4AF37"} transparent opacity={.85} side={THREE.DoubleSide} /></mesh>)}
      <pointLight position={[0, .4, 0]} intensity={25} color="#FFB800" />
    </group>
    <lineSegments geometry={beams}><shaderMaterial vertexShader={edgeV} fragmentShader={edgeF} uniforms={eu} transparent depthWrite={false} blending={THREE.AdditiveBlending} /></lineSegments>
    <mesh position={[0, 1.2, 0]}><cylinderGeometry args={[9, 9, 8, 96, 1, true]} /><shaderMaterial vertexShader={wallV} fragmentShader={wallF} uniforms={eu} transparent depthWrite={false} blending={THREE.AdditiveBlending} side={THREE.BackSide} /></mesh>
  </>);
}
const panelF = `uniform float uT; varying vec2 vU; float hs(vec2 p){ return fract(sin(dot(p,vec2(12.9,78.2)))*43758.5); }
void main(){ vec2 g=vU*vec2(14.,9.); vec2 id=floor(g), f=fract(g); float r=hs(id);
 float line=r<.5?step(abs(f.y-.5),.03):step(abs(f.x-.5),.03); float dt=step(length(f-.5),.12)*step(.7,hs(id+3.));
 float fm=step(vU.x,.015)+step(.985,vU.x)+step(vU.y,.02)+step(.98,vU.y); float scan=pow(max(sin(vU.y*40.-uT*3.),0.),20.)*.25;
 float a=(line*.35+dt*.8+fm*.7+scan)*(.55+.45*hs(id+floor(uT*1.5))); gl_FragColor=vec4(1.,.78,.15,clamp(a,0.,1.)*.8); }`;
// Floating holographic circuit panels (always face the camera)
function Panels({ eu }: { eu: EU }) {
  return (<>{([[-4.6, 1.1, -1.5, 2.6, 1.7], [4.4, -.6, -2, 2.2, 1.5], [1.2, 3, -4, 3, 1.4]] as const).map(([x, y, z, w, h], i) =>
    <Billboard key={i} position={[x, y, z]}><mesh><planeGeometry args={[w, h]} /><shaderMaterial vertexShader={haloV} fragmentShader={panelF} uniforms={eu} transparent depthWrite={false} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} /></mesh></Billboard>)}</>);
}
function Scene({ api, calm, hi, pulseRef }: { api: React.MutableRefObject<NeuralApi>; calm: boolean; hi: boolean; pulseRef: React.MutableRefObject<() => void> }) {
  const t = useRef(calm ? 1.2 : 0), brain = useRef<THREE.Group>(null!), hexM = useRef<THREE.InstancedMesh>(null!), hexG = useRef<THREE.Group>(null!), partG = useRef<THREE.Group>(null!);
  const rings = useRef<THREE.Mesh[]>([]), o = useMemo(() => new THREE.Object3D(), []), eu = useMemo(() => ({ uT: { value: 0 }, uB: { value: 0 } }), []);
  const pts = useMemo(() => { const n = hi ? 420 : 120, a = new Float32Array(n * 3); for (let i = 0; i < n; i++) new THREE.Vector3().randomDirection().multiplyScalar(2.8 + Math.random() * 3.6).toArray(a, i * 3); return a; }, [hi]);
  useEffect(() => { const n = hi ? 26 : 12; for (let i = 0; i < n; i++) { const a = Math.random() * 6.28, r = 3.6 + Math.random() * 1.6; o.position.set(Math.cos(a) * r, -1.8 + Math.random() * 4.2, Math.sin(a) * r); o.rotation.set(Math.random() * 3, Math.random() * 3, 0); o.scale.setScalar(.6 + Math.random() * .9); o.updateMatrix(); hexM.current.setMatrixAt(i, o.matrix); } hexM.current.count = n; hexM.current.instanceMatrix.needsUpdate = true; }, [hi, o]);
  useFrame((_, dt) => {
    const run = !calm && !api.current.paused; if (run) t.current += dt; eu.uT.value = t.current;
    if (run) { if (!api.current.sel) brain.current.rotation.y += dt * .08; hexG.current.rotation.y += dt * .05; partG.current.rotation.y -= dt * .03; }
    rings.current.forEach((r, i) => { const k = calm ? i / 3 : (t.current * .3 + i / 3) % 1; r.scale.setScalar(1.4 + k * 3.2); (r.material as THREE.MeshBasicMaterial).opacity = (1 - k) * .5; });
  });
  return (<>
    <Offset />
    <ambientLight intensity={.35} /><pointLight position={[3, 3, 3]} intensity={60} color="#FFD700" /><pointLight position={[-3, -1, 2]} intensity={40} color="#D4AF37" />
    <Billboard><mesh><planeGeometry args={[10, 10]} /><shaderMaterial vertexShader={haloV} fragmentShader={haloF} transparent depthWrite={false} blending={THREE.AdditiveBlending} /></mesh></Billboard>
    <group ref={brain} rotation={HERO_SHAPE === "knot" ? [.55, 0, .1] : [0, 0, 0]}>
      <NeuralBrain api={api} hi={hi} calm={calm} pulseRef={pulseRef} />
      {HERO_SHAPE === "brain" && <mesh position={[0, -1.15, -.35]} rotation={[.35, 0, 0]}><cylinderGeometry args={[.2, .15, .9, 24]} /><meshStandardMaterial color="#D4AF37" metalness={.9} roughness={.35} /></mesh>}
    </group>
    {[0, 1, 2].map(i => <mesh key={i} ref={el => { if (el) rings.current[i] = el; }} rotation={[Math.PI / 2, 0, 0]} position={[0, -1.9, 0]}><torusGeometry args={[1, .008, 8, 96]} /><meshBasicMaterial color="#FFD700" transparent opacity={.4} /></mesh>)}
    <Extras eu={eu} calm={calm} hi={hi} /><Panels eu={eu} />
    <group ref={hexG}><instancedMesh ref={hexM} args={[undefined, undefined, 26]}><cylinderGeometry args={[.2, .2, .07, 6]} /><meshStandardMaterial color="#D4AF37" metalness={.85} roughness={.3} flatShading /></instancedMesh></group>
    <group ref={partG}><points><bufferGeometry><bufferAttribute attach="attributes-position" args={[pts, 3]} /></bufferGeometry><pointsMaterial size={.035} color="#FFD700" transparent opacity={.8} /></points></group>
  </>);
}
export default function Hero3D({ onReady }: { onReady?: () => void }) {
  const api = useRef<NeuralApi>({ paused: false }), ctrl = useRef<any>(null), pulse = useRef<() => void>(() => {}), idle = useRef<number>();
  const [paused, setPaused] = useState(false);
  const wide = useMemo(() => innerWidth >= 1024, []);
  const [touch, setTouch] = useState(wide); // on phones the background lets the page scroll until "Touch control" is switched on
  const calm = useMemo(() => matchMedia("(prefers-reduced-motion: reduce)").matches, []);
  const hi = useMemo(() => innerWidth >= 768, []);
  useEffect(() => { // GSAP camera dolly-in on load; the saved state is the final view, so Reset returns to it
    const c = ctrl.current; c?.saveState(); let tw: gsap.core.Tween | undefined;
    if (c && !calm) { const z = c.object.position.z; c.object.position.z = z * 1.6; tw = gsap.to(c.object.position, { z, duration: 2.4, ease: "power3.out", onUpdate: () => c.update() }); }
    return () => { tw?.kill(); clearTimeout(idle.current); }; }, [calm]);
  const toggle = () => { const p = !api.current.paused; api.current.paused = p; setPaused(p); if (ctrl.current) ctrl.current.autoRotate = !p && !calm; };
  return (
    <div className="absolute inset-0">
      <div className="absolute inset-0" style={{ pointerEvents: touch ? "auto" : "none" }} role="img" aria-label="Interactive 3D golden neural core. Drag to rotate, pinch to zoom on touch devices, and click the core to send a pulse.">
        <Canvas onPointerMissed={() => api.current.clear?.()} onCreated={() => onReady?.()} dpr={hi ? [1, 2] : [1, 1.5]} camera={{ position: [0, .9, wide ? { knot: 6.2, brain: 5.4, sphere: 7 }[HERO_SHAPE] : { knot: 9.5, brain: 8, sphere: 10 }[HERO_SHAPE]], fov: 42 }} frameloop={calm ? "demand" : "always"} gl={{ antialias: true, powerPreference: "high-performance" }}>
          <Scene api={api} calm={calm} hi={hi} pulseRef={pulse} />
          {hi && !calm && <EffectComposer multisampling={0}><Bloom mipmapBlur luminanceThreshold={.55} intensity={.8} /></EffectComposer>}
          <OrbitControls ref={ctrl} enableZoom={!wide && touch} enableDamping minDistance={3} maxDistance={13} autoRotate={!calm} autoRotateSpeed={.6}
            onStart={() => { clearTimeout(idle.current); if (ctrl.current) ctrl.current.autoRotate = false; }}
            onEnd={() => { idle.current = window.setTimeout(() => { if (ctrl.current && !api.current.paused && !calm) ctrl.current.autoRotate = true; }, 3000); }} />
        </Canvas>
      </div>
      <div className="absolute right-4 top-24 z-30 flex flex-wrap items-center justify-end gap-2">
        {!wide && <button className="btn btn-s !min-h-[36px] !py-1 text-sm" onClick={() => setTouch(!touch)}>{touch ? "Back to scrolling" : "Touch control"}</button>}
        <button className="btn btn-s !min-h-[36px] !py-1 text-sm" onClick={() => { ctrl.current?.reset(); api.current.clear?.(); }} aria-label="Reset camera view">Reset view</button>
        <button className="btn btn-s !min-h-[36px] !py-1 text-sm" onClick={toggle} aria-label={paused ? "Resume animation" : "Pause animation"}>{paused ? "Resume" : "Pause"}</button>
      </div>
    </div>);
}
