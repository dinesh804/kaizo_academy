"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { HERO_SHAPE, buildBrainGeometry, buildEdgeGeometry, buildKnotGeometry, buildSphereGeometry, buildNetwork, loadGLB, rng, type Graph } from "@/lib/neural/engine";
const K = 8; // trail points per signal
const surfV = `attribute float aF; varying vec3 vP; varying vec3 vN; varying vec3 vV; varying float vF;
void main(){ vP=position; vF=aF; vN=normalize(normalMatrix*normal); vec4 mv=modelViewMatrix*vec4(position,1.); vV=-mv.xyz; gl_Position=projectionMatrix*mv; }`;
const surfF = `uniform float uT; uniform float uW; varying vec3 vP; varying vec3 vN; varying vec3 vV; varying float vF;
void main(){ vec3 N=normalize(vN),V=normalize(vV),L=normalize(vec3(.5,.8,.6)),R=reflect(-V,N);
 float dif=max(dot(N,L),0.), spec=pow(max(dot(R,L),0.),60.), fr=pow(1.-max(dot(N,V),0.),3.), env=pow(clamp(R.y*.5+.5,0.,1.),3.);
 vec3 c=mix(vec3(.012,.01,.01),vec3(.32,.035,.06),dif*.6+.04)*(1.-vF*.7);
 c+=mix(vec3(.03,.02,.02),vec3(.71,.07,.15),env)*.35*(1.-vF*.6); c+=vec3(1.,.54,.57)*spec*.9*(1.-vF); c+=vec3(.9,.22,.27)*fr*.7;
 float flow=pow(sin(vP.y*4.+vP.z*3.-uT*1.6+vP.x*2.)*.5+.5,5.); c+=vec3(.9,.22,.27)*vF*(.3+flow*1.0);
 float w=exp(-pow((vP.y-(uW*3.2-1.6))*3.,2.))*step(0.,uW)*step(uW,1.); c+=vec3(1.,.25,.31)*w*1.2; gl_FragColor=vec4(c,1.); }`;
const glassF = `uniform float uT; uniform float uW; varying vec3 vP; varying vec3 vN; varying vec3 vV; varying float vF;
void main(){ vec3 N=normalize(vN),V=normalize(vV); float fr=pow(1.-abs(dot(N,V)),2.5); float scan=pow(max(sin(vP.y*7.-uT*1.4),0.),16.)*.25;
 float w=exp(-pow((vP.y-(uW*3.4-1.7))*3.,2.))*step(0.,uW)*step(uW,1.); vec3 c=vec3(.71,.07,.15)*(fr*.9+.05+scan)+vec3(1.,.25,.31)*w; gl_FragColor=vec4(c,fr*.55+.03+scan*.5+w*.5); }`;
const nodeV = `attribute vec3 aPos; attribute float aRad; attribute float aInt; attribute float aAct; attribute float aSel; varying vec2 vU; varying float vB;
void main(){ vU=position.xy; vB=aInt*.6+aAct*1.4+aSel*1.2; vec4 mv=modelViewMatrix*vec4(aPos,1.); mv.xy+=position.xy*aRad*3.*(1.+aAct*.9+aSel*.8); gl_Position=projectionMatrix*mv; }`;
const nodeF = `varying vec2 vU; varying float vB; void main(){ float d=length(vU); if(d>1.) discard; float core=smoothstep(.34,0.,d), halo=pow(smoothstep(1.,0.,d),2.);
 gl_FragColor=vec4(mix(vec3(.71,.07,.15),vec3(1.,.54,.57),core),(core+halo*.55)*clamp(vB,0.,1.6)); }`;
const edgeV = `attribute float aT; attribute float aH; attribute float aL; varying float vH; varying float vL; void main(){ vH=aH; vL=aL; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }`;
const edgeF = `varying float vH; varying float vL; void main(){ gl_FragColor=vec4(.9,.22,.27,(vL>.5?.34:.22)+vH*.7); }`;
const sigV = `attribute vec3 aA; attribute vec3 aC; attribute vec3 aB; attribute float aP; attribute float aK; attribute float aBr; uniform float uDpr; varying float vA; varying float vHead;
void main(){ float tp=aP-aK*.035; float t=clamp(tp,0.,1.),u=1.-t; vec3 p=u*u*aA+2.*u*t*aC+t*t*aB;
 vA=aBr*(1.-aK/${K}.)*step(0.,tp)*step(aP,1.02); vHead=step(aK,.5); vec4 mv=modelViewMatrix*vec4(p,1.); gl_Position=projectionMatrix*mv; gl_PointSize=uDpr*(aK<.5?8.:4.5)*(5./(-mv.z)); }`;
const sigF = `varying float vA; varying float vHead; void main(){ float d=length(gl_PointCoord-.5)*2.; float a=smoothstep(1.,0.,d); gl_FragColor=vec4(mix(vec3(.71,.07,.15),vec3(1.,.54,.57),vHead*a),a*a*vA); }`;
type Net = { geo: THREE.BufferGeometry; g: Graph; edgeGeo: THREE.BufferGeometry; start: Uint32Array; cnt: Uint16Array; act: Float32Array; sel: Float32Array; source: string };
type Info = { id: number; layer: number; hub: boolean; cereb: boolean; deg: number; at: [number, number, number] };
export type NeuralApi = { paused: boolean; sel?: boolean; clear?: () => void };
export default function NeuralBrain({ api, hi, calm, pulseRef }: { api: React.MutableRefObject<NeuralApi>; hi: boolean; calm: boolean; pulseRef: React.MutableRefObject<() => void> }) {
  const [net, setNet] = useState<Net | null>(null), [info, setInfo] = useState<Info | null>(null);
  const invalidate = useThree(s => s.invalidate), dpr = useThree(s => s.gl.getPixelRatio());
  const sel = useRef(-1), wave = useRef({ c: -1, t: 0, next: 3 }), R = useMemo(() => rng(99), []);
  const M = calm ? 0 : hi ? 300 : 90;
  const uni = useMemo(() => ({ uT: { value: 0 }, uW: { value: -1 } }), []), sigU = useMemo(() => ({ uDpr: { value: dpr } }), [dpr]);
  useEffect(() => { let dead = false; (async () => { // build once: GLB if provided, otherwise the procedural anatomical mesh; same seed => same network every load
    let built: { geo: THREE.BufferGeometry; brainTris: number | number[] } | null = null, source = "procedural";
    if (HERO_SHAPE === "brain") try { const r = await fetch("/models/brain.glb", { method: "HEAD" }); if (r.ok) { built = await loadGLB("/models/brain.glb"); source = "glb"; } } catch { /* use procedural */ }
    if (!built) built = HERO_SHAPE === "sphere" ? buildSphereGeometry(hi) : HERO_SHAPE === "knot" ? buildKnotGeometry(hi) : buildBrainGeometry(hi ? 40 : 22);
    const g = buildNetwork(built.geo, built.brainTris, hi ? 2400 : 1500, 1337, HERO_SHAPE === "knot" ? [1.9, 1.9, 1] : undefined), e = buildEdgeGeometry(g);
    if (!dead) { setNet({ geo: built.geo, g, edgeGeo: e.edgeGeo, start: e.start, cnt: e.cnt, act: new Float32Array(g.n), sel: new Float32Array(g.n), source }); invalidate(); } })(); return () => { dead = true; }; }, [hi, invalidate]);
  const nodeGeo = useMemo(() => { if (!net) return null; const q = new THREE.PlaneGeometry(2, 2), ig = new THREE.InstancedBufferGeometry(); ig.index = q.index; ig.setAttribute("position", q.attributes.position);
    ig.setAttribute("aPos", new THREE.InstancedBufferAttribute(net.g.pos, 3)); ig.setAttribute("aRad", new THREE.InstancedBufferAttribute(net.g.rad, 1)); ig.setAttribute("aInt", new THREE.InstancedBufferAttribute(net.g.inten, 1));
    ig.setAttribute("aAct", new THREE.InstancedBufferAttribute(net.act, 1).setUsage(THREE.DynamicDrawUsage)); ig.setAttribute("aSel", new THREE.InstancedBufferAttribute(net.sel, 1).setUsage(THREE.DynamicDrawUsage)); ig.instanceCount = net.g.n; return ig; }, [net]);
  const sigGeo = useMemo(() => { const V = Math.max(M, 1) * K, geo = new THREE.BufferGeometry(), mk = (n: number) => new THREE.BufferAttribute(new Float32Array(V * n), n);
    (["position", "aA", "aC", "aB"] as const).forEach(k => geo.setAttribute(k, mk(3))); (["aP", "aK", "aBr"] as const).forEach(k => geo.setAttribute(k, mk(1)));
    for (let i = 0; i < V; i++) { geo.attributes.aK.array[i] = i % K; geo.attributes.aP.array[i] = -1; } return geo; }, [M]);
  const sim = useMemo(() => ({ e: new Int32Array(M), dir: new Uint8Array(M), t: Float32Array.from({ length: M }, () => -R() * 2), sp: new Float32Array(M) }), [M, R]);
  const select = (i: number) => { if (!net) return; const { g, sel: s, edgeGeo, start, cnt, act } = net, H = edgeGeo.attributes.aH as THREE.BufferAttribute;
    s.fill(0); H.array.fill(0); sel.current = i; s[i] = 1; act[i] = 1;
    for (const e of g.nodeEdges[i]) { const o = g.ea[e] === i ? g.eb[e] : g.ea[e]; s[o] = .5; (H.array as Float32Array).fill(1, start[e], start[e] + cnt[e]); }
    H.needsUpdate = true; api.current.sel = true; setInfo({ id: i, hub: !!g.hub[i], cereb: !!g.region[i], layer: g.region[i], deg: g.nodeEdges[i].length, at: [g.pos[i * 3] + g.nrm[i * 3] * .12, g.pos[i * 3 + 1] + g.nrm[i * 3 + 1] * .12, g.pos[i * 3 + 2] + g.nrm[i * 3 + 2] * .12] }); invalidate(); };
  const clear = () => { if (!net || sel.current < 0) return; net.sel.fill(0); (net.edgeGeo.attributes.aH.array as Float32Array).fill(0); net.edgeGeo.attributes.aH.needsUpdate = true; sel.current = -1; api.current.sel = false; setInfo(null); invalidate(); };
  useEffect(() => { api.current.clear = clear; });
  useEffect(() => { pulseRef.current = () => { if (uni.uW.value < 0) uni.uW.value = 0; if (net && wave.current.c < 0) { wave.current.c = net.g.hubs[(R() * net.g.hubs.length) | 0] ?? 0; wave.current.t = 0; } invalidate(); }; });
  const nearest = (p: THREE.Vector3, maxD: number) => { if (!net) return -1; const P = net.g.pos; let best = -1, bd = maxD * maxD; for (let i = 0; i < net.g.n; i++) { const dx = P[i * 3] - p.x, dy = P[i * 3 + 1] - p.y, dz = P[i * 3 + 2] - p.z, d = dx * dx + dy * dy + dz * dz; if (d < bd) { bd = d; best = i; } } return best; };
  const assign = (i: number, from: number) => { if (!net) return; const g = net.g, A = sigGeo.attributes; let e = 0, dir = 0;
    const pick = (node: number) => { const ed = g.nodeEdges[node]; if (!ed.length) return false; e = ed[(R() * ed.length) | 0]; dir = g.ea[e] === node ? 0 : 1; return true; };
    if (!((sel.current >= 0 && R() < .7 && pick(sel.current)) || (from >= 0 && pick(from)))) { e = (R() * g.ne) | 0; dir = R() < .5 ? 0 : 1; }
    const s = dir ? g.eb[e] : g.ea[e], d = dir ? g.ea[e] : g.eb[e]; sim.e[i] = e; sim.dir[i] = dir; sim.t[i] = 0; sim.sp[i] = (.35 + R() * .65) * (g.elong[e] ? 2.2 : 1); const br = .7 + R() * .3;
    for (let k = 0; k < K; k++) { const o = (i * K + k) * 3; for (let c = 0; c < 3; c++) { (A.aA.array as Float32Array)[o + c] = g.pos[s * 3 + c]; (A.aC.array as Float32Array)[o + c] = g.ec[e * 3 + c]; (A.aB.array as Float32Array)[o + c] = g.pos[d * 3 + c]; } (A.aBr.array as Float32Array)[i * K + k] = br; }
    A.aA.needsUpdate = A.aC.needsUpdate = A.aB.needsUpdate = A.aBr.needsUpdate = true; };
  useFrame((_, dt0) => {
    if (!net) return; const dt = Math.min(dt0, .05), run = !calm && !api.current.paused, g = net.g, act = net.act;
    if (!run) return; uni.uT.value += dt;
    if (uni.uW.value >= 0) { uni.uW.value += dt * .9; if (uni.uW.value > 1) uni.uW.value = -1; }
    const w = wave.current; w.next -= dt; if (w.next < 0 && w.c < 0 && g.hubs.length) { w.c = g.hubs[(R() * g.hubs.length) | 0]; w.t = 0; w.next = 8 + R() * 6; }
    if (w.c >= 0) { w.t += dt; const front = w.t * 1.7, cx = g.pos[w.c * 3], cy = g.pos[w.c * 3 + 1], cz = g.pos[w.c * 3 + 2];
      for (let i = 0; i < g.n; i++) { const d = Math.hypot(g.pos[i * 3] - cx, g.pos[i * 3 + 1] - cy, g.pos[i * 3 + 2] - cz), k = Math.exp(-(((d - front) / .14) ** 2)); if (k > .05) act[i] = Math.max(act[i], k * .9); } if (front > 3.6) w.c = -1; }
    const aP = sigGeo.attributes.aP as THREE.BufferAttribute;
    for (let i = 0; i < M; i++) { let t = sim.t[i]; // time-based progress: distance/s divided by the connector's real length
      if (t < 0) { t += dt; sim.t[i] = t; if (t >= 0) assign(i, -1); }
      else { const e = sim.e[i]; t += (sim.sp[i] * dt) / g.elen[e]; sim.t[i] = t;
        if (t >= 1) { const dst = sim.dir[i] ? g.ea[e] : g.eb[e]; act[dst] = 1; if (R() < .62) assign(i, dst); else sim.t[i] = -(.2 + R() * 1.4); } }
      for (let k = 0; k < K; k++) (aP.array as Float32Array)[i * K + k] = sim.t[i]; }
    aP.needsUpdate = true; const decay = Math.exp(-dt * 2.4); for (let i = 0; i < g.n; i++) act[i] *= decay; (nodeGeo!.attributes.aAct as THREE.BufferAttribute).needsUpdate = true; });
  if (!net || !nodeGeo) return null;
  return (<group>
    <mesh geometry={net.geo} onClick={e => { e.stopPropagation(); const i = nearest(e.object.worldToLocal(e.point.clone()), .09); if (i >= 0) select(i); else { clear(); pulseRef.current(); } }}
      onPointerMove={e => { document.body.style.cursor = nearest(e.object.worldToLocal(e.point.clone()), .07) >= 0 ? "pointer" : ""; }} onPointerOut={() => { document.body.style.cursor = ""; }}>
      <shaderMaterial vertexShader={surfV} fragmentShader={HERO_SHAPE === "sphere" ? glassF : surfF} uniforms={uni} transparent={HERO_SHAPE === "sphere"} depthWrite={HERO_SHAPE !== "sphere"} blending={HERO_SHAPE === "sphere" ? THREE.AdditiveBlending : THREE.NormalBlending} /></mesh>
    <lineSegments geometry={net.edgeGeo} frustumCulled={false}><shaderMaterial vertexShader={edgeV} fragmentShader={edgeF} transparent depthWrite={false} blending={THREE.AdditiveBlending} /></lineSegments>
    <mesh geometry={nodeGeo} frustumCulled={false}><shaderMaterial vertexShader={nodeV} fragmentShader={nodeF} transparent depthWrite={false} blending={THREE.AdditiveBlending} /></mesh>
    {M > 0 && <points geometry={sigGeo} frustumCulled={false}><shaderMaterial vertexShader={sigV} fragmentShader={sigF} uniforms={sigU} transparent depthWrite={false} blending={THREE.AdditiveBlending} /></points>}
    {info && <Html position={info.at} center style={{ pointerEvents: "none" }}><div className="glass w-44 rounded-lg border border-neon/60 p-3 text-left text-xs" style={{ boxShadow: "0 0 18px rgba(230,57,70,.35)" }}>
      <p className="font-display text-neon">NODE #{info.id}</p><p className="mt-1 text-muted">{info.hub ? "Neural hub" : "Surface node"} · {HERO_SHAPE === "sphere" ? ["Outer shell", "Middle layer", "Inner core"][info.layer] ?? "Core" : HERO_SHAPE === "knot" ? "KAIZO core" : info.cereb ? "Cerebellum" : "Cerebrum"}</p><p className="text-muted">{info.deg} connections</p></div></Html>}
  </group>);
}
