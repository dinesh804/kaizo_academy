import * as THREE from "three";
// ---------- deterministic RNG + CPU port of the brain surface (so the real mesh exists on the CPU for sampling) ----------
export const rng = (s: number) => () => { s |= 0; s = (s + 0x6d2b79f5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const fr = (x: number) => x - Math.floor(x), lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const hh = (x: number, y: number, z: number) => { const a = fr(x * .3183099 + .1) * 17, b = fr(y * .3183099 + .1) * 17, c = fr(z * .3183099 + .1) * 17; return fr(a * b * c * (a + b + c)); };
function vn(x: number, y: number, z: number) {
  const ix = Math.floor(x), iy = Math.floor(y), iz = Math.floor(z); let fx = x - ix, fy = y - iy, fz = z - iz;
  fx = fx * fx * (3 - 2 * fx); fy = fy * fy * (3 - 2 * fy); fz = fz * fz * (3 - 2 * fz);
  const L = (a: number, b: number, c: number) => hh(ix + a, iy + b, iz + c);
  return lerp(lerp(lerp(L(0, 0, 0), L(1, 0, 0), fx), lerp(L(0, 1, 0), L(1, 1, 0), fx), fy), lerp(lerp(L(0, 0, 1), L(1, 0, 1), fx), lerp(L(0, 1, 1), L(1, 1, 1), fx), fy), fz);
}
const ss = (a: number, b: number, x: number) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
function brainPos(d: THREE.Vector3, out: THREE.Vector3): number {
  let px = d.x * 1.22, py = d.y * 1.08, pz = d.z * 1.6; if (d.y < 0) py *= .55;
  px *= 1 - .14 * ss(.3, 1, d.z); px += Math.sign(d.x) * .2 * Math.exp(-(((d.y + .35) * 3) ** 2)) * Math.exp(-((d.z * 1.8) ** 2));
  const fis = Math.exp(-((d.x * 8) ** 2)) * ss(-.15, .45, d.y); px -= d.x * fis * .22; py -= d.y * fis * .22; pz -= d.z * fis * .22;
  const qx = d.x * 2.2, qy = d.y * 2.2, qz = d.z * 2.2, w0 = vn(qx * 1.3, qy * 1.3, qz * 1.3) - .5, w1 = vn(qx * 1.3 + 7.1, qy * 1.3 + 7.1, qz * 1.3 + 7.1) - .5, w2 = vn(qx * 1.3 + 13.7, qy * 1.3 + 13.7, qz * 1.3 + 13.7) - .5;
  const n1 = Math.abs(vn(qx * 2 + w0 * 1.6, qy * 2 + w1 * 1.6, qz * 2 + w2 * 1.6) * 2 - 1), n2 = Math.abs(vn(qx * 4.4 + w0 * 2.4, qy * 4.4 + w1 * 2.4, qz * 4.4 + w2 * 2.4) * 2 - 1);
  let g = (1 - ss(0, .11, n1)) * .8 + (1 - ss(0, .08, n2)) * .35; g *= 1 - fis * .9; const fold = Math.min(1, Math.max(0, g));
  const k = -fold * .11 + (vn(qx * 2, qy * 2, qz * 2) - .5) * .05; out.set(px + d.x * k, py + d.y * k, pz + d.z * k); return fold;
}
/** Cerebral hemispheres + cerebellum as one non-indexed mesh with position, normal and fold (aF) attributes. */
export function buildBrainGeometry(detail: number) {
  const ico = new THREE.IcosahedronGeometry(1, detail), src = ico.attributes.position, n = src.count, m0 = new THREE.Vector3();
  const sph = new THREE.SphereGeometry(1, 64, 40).toNonIndexed(), sp = sph.attributes.position, sn = sph.attributes.normal, m = sp.count;
  const pos = new Float32Array((n + m) * 3), nrm = new Float32Array((n + m) * 3), aF = new Float32Array(n + m);
  const d = new THREE.Vector3(), t1 = new THREE.Vector3(), t2 = new THREE.Vector3(), p0 = new THREE.Vector3(), p1 = new THREE.Vector3(), p2 = new THREE.Vector3(), q = new THREE.Vector3();
  for (let i = 0; i < n; i++) {
    d.fromBufferAttribute(src, i).normalize(); aF[i] = brainPos(d, p0);
    t1.crossVectors(d, m0.set(0, 1, .0013)).normalize(); t2.crossVectors(d, t1);
    brainPos(q.copy(d).addScaledVector(t1, .012).normalize(), p1); brainPos(q.copy(d).addScaledVector(t2, .012).normalize(), p2);
    q.crossVectors(p1.sub(p0), p2.sub(p0)).normalize(); if (q.dot(d) < 0) q.negate();
    p0.toArray(pos, i * 3); q.toArray(nrm, i * 3);
  }
  for (let i = 0; i < m; i++) {
    const x = sp.getX(i), y = sp.getY(i), z = sp.getZ(i), f = ss(.5, 1, -Math.sin(y * 34)), nx = sn.getX(i), ny = sn.getY(i), nz = sn.getZ(i), o = (n + i) * 3;
    pos[o] = (x - nx * f * .04) * .8; pos[o + 1] = (y - ny * f * .04) * .4 - .88; pos[o + 2] = (z - nz * f * .04) * .55 - .95;
    q.set(nx / .8, ny / .4, nz / .55).normalize().toArray(nrm, o); aF[n + i] = f;
  }
  const geo = new THREE.BufferGeometry(); geo.setAttribute("position", new THREE.BufferAttribute(pos, 3)); geo.setAttribute("normal", new THREE.BufferAttribute(nrm, 3)); geo.setAttribute("aF", new THREE.BufferAttribute(aF, 1));
  return { geo, brainTris: n / 3 };
}
/** Optional: use a real anatomical GLB placed at /public/models/brain.glb (scaled/centred automatically). */
const concat = (parts: ArrayLike<number>[]) => { const out = new Float32Array(parts.reduce((a, b) => a + b.length, 0)); let o = 0; for (const x of parts) { out.set(x as ArrayLike<number>, o); o += x.length; } return out; };
export async function loadGLB(url: string) {
  const { GLTFLoader } = await import("three/examples/jsm/loaders/GLTFLoader.js");
  const gltf = await new GLTFLoader().loadAsync(url); gltf.scene.updateMatrixWorld(true);
  const PP: ArrayLike<number>[] = [], NN: ArrayLike<number>[] = [];
  gltf.scene.traverse(o => { const me = o as THREE.Mesh; if (!me.isMesh) return; let g = me.geometry.clone().applyMatrix4(me.matrixWorld); if (g.index) g = g.toNonIndexed(); if (!g.attributes.normal) g.computeVertexNormals();
    PP.push(g.attributes.position.array); NN.push(g.attributes.normal.array); });
  const P = concat(PP), N = concat(NN), geo = new THREE.BufferGeometry(); geo.setAttribute("position", new THREE.BufferAttribute(P, 3)); geo.setAttribute("normal", new THREE.BufferAttribute(N, 3));
  geo.computeBoundingBox(); const bb = geo.boundingBox!, c = bb.getCenter(new THREE.Vector3()), sz = bb.getSize(new THREE.Vector3()), s = 3.2 / Math.max(sz.x, sz.y, sz.z);
  geo.translate(-c.x, -c.y, -c.z); geo.scale(s, s, s); geo.setAttribute("aF", new THREE.BufferAttribute(new Float32Array(P.length / 3), 1));
  return { geo, brainTris: P.length / 9 };
}
// ---------- network: area-weighted Poisson-disc surface sampling, grid-accelerated neighbours, local + long-distance curved connectors ----------
export type Graph = { n: number; ne: number; rmin: number; pos: Float32Array; nrm: Float32Array; rad: Float32Array; inten: Float32Array; hub: Uint8Array; region: Uint8Array; nodeEdges: number[][]; ea: Uint32Array; eb: Uint32Array; ec: Float32Array; elen: Float32Array; elong: Uint8Array; hubs: number[] };
export const bez = (A: THREE.Vector3, C: THREE.Vector3, B: THREE.Vector3, t: number, o: THREE.Vector3) => { const u = 1 - t; return o.set(u * u * A.x + 2 * u * t * C.x + t * t * B.x, u * u * A.y + 2 * u * t * C.y + t * t * B.y, u * u * A.z + 2 * u * t * C.z + t * t * B.z); };
/** Exact inside/outside test: for each xy column store the sorted z-crossings of the mesh; odd count below a point = inside. */
function makeInside(P: Float32Array, cell = .04) {
  const cols = new Map<number, number[]>(), key = (i: number, j: number) => (i + 400) * 1000 + (j + 400);
  for (let t = 0; t < P.length / 9; t++) { const o = t * 9, ax = P[o], ay = P[o + 1], az = P[o + 2], bx = P[o + 3], by = P[o + 4], bz = P[o + 5], cx = P[o + 6], cy = P[o + 7], cz = P[o + 8];
    const d = (by - cy) * (ax - cx) + (cx - bx) * (ay - cy); if (Math.abs(d) < 1e-12) continue;
    const i0 = Math.floor(Math.min(ax, bx, cx) / cell), i1 = Math.floor(Math.max(ax, bx, cx) / cell), j0 = Math.floor(Math.min(ay, by, cy) / cell), j1 = Math.floor(Math.max(ay, by, cy) / cell);
    for (let i = i0; i <= i1; i++) for (let j = j0; j <= j1; j++) { const x = (i + .5) * cell, y = (j + .5) * cell, l1 = ((by - cy) * (x - cx) + (cx - bx) * (y - cy)) / d, l2 = ((cy - ay) * (x - cx) + (ax - cx) * (y - cy)) / d, l3 = 1 - l1 - l2;
      if (l1 < 0 || l2 < 0 || l3 < 0) continue; const k = key(i, j); (cols.get(k) ?? cols.set(k, []).get(k)!).push(l1 * az + l2 * bz + l3 * cz); } }
  cols.forEach(a => a.sort((p, q) => p - q));
  return (x: number, y: number, z: number) => { const l = cols.get(key(Math.floor(x / cell), Math.floor(y / cell))); if (!l) return false; let c = 0; for (const v of l) if (v < z) c++; return c % 2 === 1; };
}
export function buildNetwork(geo: THREE.BufferGeometry, brainTris: number | number[], target: number, seed = 1337, bound: [number, number, number] = [1.3, 1.15, 1.7]): Graph {
  const R = rng(seed), P = geo.attributes.position.array as Float32Array, Nm = geo.attributes.normal.array as Float32Array, T = P.length / 9, cum = new Float64Array(T);
  const bt = Array.isArray(brainTris) ? brainTris : [brainTris], layered = bt.length > 1; // layered = several concentric shells; region = shell index
  const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3(); let tot = 0;
  for (let i = 0; i < T; i++) { a.fromArray(P, i * 9); b.fromArray(P, i * 9 + 3); c.fromArray(P, i * 9 + 6); tot += b.sub(a).cross(c.sub(a)).length() / 2; cum[i] = tot; }
  const rmin = Math.sqrt(tot / target) * .62, cs = rmin, cell = (x: number) => Math.floor(x / cs) + 64, K = (x: number, y: number, z: number) => (x * 128 + y) * 128 + z;
  const pos: number[] = [], nrm: number[] = [], reg: number[] = [], grid = new Map<number, number[]>();
  for (let at = 0; at < target * 14 && pos.length / 3 < target; at++) { // area-weighted pick -> uniform point on triangle -> reject if closer than rmin (even spread, no clumps)
    const r = R() * tot; let lo = 0, hi = T - 1; while (lo < hi) { const mid = (lo + hi) >> 1; if (cum[mid] < r) lo = mid + 1; else hi = mid; }
    let u = R(), v = R(); if (u + v > 1) { u = 1 - u; v = 1 - v; } const w = 1 - u - v, o = lo * 9;
    const x = P[o] * w + P[o + 3] * u + P[o + 6] * v, y = P[o + 1] * w + P[o + 4] * u + P[o + 7] * v, z = P[o + 2] * w + P[o + 5] * u + P[o + 8] * v;
    const ix = cell(x), iy = cell(y), iz = cell(z); let ok = true;
    for (let dx = -1; dx <= 1 && ok; dx++) for (let dy = -1; dy <= 1 && ok; dy++) for (let dz = -1; dz <= 1 && ok; dz++) { const l = grid.get(K(ix + dx, iy + dy, iz + dz)); if (l) for (const j of l) { const ex = pos[j * 3] - x, ey = pos[j * 3 + 1] - y, ez = pos[j * 3 + 2] - z; if (ex * ex + ey * ey + ez * ez < rmin * rmin) { ok = false; break; } } }
    if (!ok) continue;
    const id = pos.length / 3; c.set(Nm[o] * w + Nm[o + 3] * u + Nm[o + 6] * v, Nm[o + 1] * w + Nm[o + 4] * u + Nm[o + 7] * v, Nm[o + 2] * w + Nm[o + 5] * u + Nm[o + 8] * v).normalize();
    pos.push(x + c.x * .012, y + c.y * .012, z + c.z * .012); nrm.push(c.x, c.y, c.z); reg.push(bt.filter(b2 => lo >= b2).length);
    const key = K(ix, iy, iz); (grid.get(key) ?? grid.set(key, []).get(key)!).push(id);
  }
  const n = pos.length / 3, hub = new Uint8Array(n), rad = new Float32Array(n), inten = new Float32Array(n), hubs: number[] = [];
  for (let i = 0; i < n; i++) { const h = R() < .045; hub[i] = h ? 1 : 0; rad[i] = (.013 + R() * .007) * (h ? 1.9 : 1) * (layered ? 1.5 : 1); inten[i] = h ? 1 : .5 + R() * .45; if (h) hubs.push(i); }
  const g2 = new Map<number, number[]>(), c2 = rmin * 2.2, k2 = (x: number, y: number, z: number) => (x * 128 + y) * 128 + z;
  for (let i = 0; i < n; i++) { const k = k2(Math.floor(pos[i * 3] / c2) + 64, Math.floor(pos[i * 3 + 1] / c2) + 64, Math.floor(pos[i * 3 + 2] / c2) + 64); (g2.get(k) ?? g2.set(k, []).get(k)!).push(i); }
  const c3 = .2, g3 = new Map<number, number[]>(), k3 = (x: number, y: number, z: number) => (x * 128 + y) * 128 + z;
  for (let i = 0; i < n; i++) { const k = k3(Math.floor(pos[i * 3] / c3) + 64, Math.floor(pos[i * 3 + 1] / c3) + 64, Math.floor(pos[i * 3 + 2] / c3) + 64); (g3.get(k) ?? g3.set(k, []).get(k)!).push(i); }
  const hit = (p: THREE.Vector3) => { const ix = Math.floor(p.x / c3) + 64, iy = Math.floor(p.y / c3) + 64, iz = Math.floor(p.z / c3) + 64; let best = -1, bd = 9;
    for (let dx = -2; dx <= 2; dx++) for (let dy = -2; dy <= 2; dy++) for (let dz = -2; dz <= 2; dz++) { const l = g3.get(k3(ix + dx, iy + dy, iz + dz)); if (l) for (const j of l) { const e2 = (pos[j * 3] - p.x) ** 2 + (pos[j * 3 + 1] - p.y) ** 2 + (pos[j * 3 + 2] - p.z) ** 2; if (e2 < bd) { bd = e2; best = j; } } } return best; };
  const inside = makeInside(P), isIn = (p: THREE.Vector3) => inside(p.x, p.y, p.z) || inside(p.x + .03, p.y, p.z) || inside(p.x - .03, p.y, p.z) || inside(p.x, p.y + .03, p.z) || inside(p.x, p.y - .03, p.z);
  const seen = new Set<number>(), EA: number[] = [], EB: number[] = [], EC: number[] = [], LG: number[] = [];
  const A = new THREE.Vector3(), B = new THREE.Vector3(), C = new THREE.Vector3(), na = new THREE.Vector3(), nb = new THREE.Vector3();
  const addEdge = (i: number, j: number, long: boolean) => { const key = Math.min(i, j) * n + Math.max(i, j); if (seen.has(key)) return; seen.add(key);
    A.fromArray(pos, i * 3); B.fromArray(pos, j * 3); na.fromArray(nrm, i * 3); nb.fromArray(nrm, j * 3); const d = A.distanceTo(B);
    C.addVectors(A, B).multiplyScalar(.5); if (!long) C.addScaledVector(na.add(nb).normalize(), d * .2);
    else { C.addScaledVector(na.add(nb).add(new THREE.Vector3(0, .8, 0)).normalize(), d * .35 + .15); // arch over the surface, then lift until every sample is outside the mesh (nearest-node normal test)
      let clear = false;
      for (let it = 0; it < 40 && !clear; it++) { clear = true;
        for (let sIdx = 1; sIdx <= 13 && clear; sIdx++) { bez(A, C, B, sIdx / 14, na); const end = sIdx <= 2 ? i : sIdx >= 12 ? j : -1;
          if (end >= 0 && (na.x - pos[end * 3]) * nrm[end * 3] + (na.y - pos[end * 3 + 1]) * nrm[end * 3 + 1] + (na.z - pos[end * 3 + 2]) * nrm[end * 3 + 2] < .01) { clear = false; C.x += nrm[end * 3] * .1; C.y += nrm[end * 3 + 1] * .1; C.z += nrm[end * 3 + 2] * .1; } // must leave/enter the surface outward
          else if (isIn(na)) { clear = false; const k = hit(na); if (k >= 0) { C.x += nrm[k * 3] * .1; C.y += nrm[k * 3 + 1] * .1; C.z += nrm[k * 3 + 2] * .1; } else C.addScaledVector(na.copy(C).normalize(), .1); } } }
      if (!clear) return; } // a connector that cannot clear the surface is dropped rather than drawn through the mesh
    EA.push(i); EB.push(j); EC.push(C.x, C.y, C.z); LG.push(long ? 1 : 0); };
  for (let i = 0; i < n; i++) { // local: 3-6 nearest neighbours within a distance limit
    const ix = Math.floor(pos[i * 3] / c2) + 64, iy = Math.floor(pos[i * 3 + 1] / c2) + 64, iz = Math.floor(pos[i * 3 + 2] / c2) + 64, cand: [number, number][] = [];
    for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) for (let dz = -1; dz <= 1; dz++) { const l = g2.get(k2(ix + dx, iy + dy, iz + dz)); if (l) for (const j of l) if (j !== i) { const d = Math.hypot(pos[i * 3] - pos[j * 3], pos[i * 3 + 1] - pos[j * 3 + 1], pos[i * 3 + 2] - pos[j * 3 + 2]); if (d < rmin * 3.6) cand.push([d, j]); } }
    cand.sort((p, q) => p[0] - q[0]); for (const [, j] of cand.slice(0, 3 + (i % 4))) addEdge(i, j, false);
  }
  if (layered) for (let i = 0; i < n; i += 2) if (reg[i] > 0) { // radial spokes: inner-shell nodes link to the nearest node on the next shell out
    let best = -1, bd = 1.2; for (let j = 0; j < n; j++) if (reg[j] === reg[i] - 1) { const dd = Math.hypot(pos[i * 3] - pos[j * 3], pos[i * 3 + 1] - pos[j * 3 + 1], pos[i * 3 + 2] - pos[j * 3 + 2]); if (dd < bd) { bd = dd; best = j; } }
    if (best >= 0) addEdge(i, best, false); }
  for (const h of hubs) { // long-distance: each hub links to one of its 4 farthest hubs
    const far = hubs.filter(o => o !== h).map(o => [Math.hypot(pos[h * 3] - pos[o * 3], pos[h * 3 + 1] - pos[o * 3 + 1], pos[h * 3 + 2] - pos[o * 3 + 2]), o] as [number, number]).filter(x => x[0] > (layered ? 1.2 : 1.8) && x[0] < (layered ? 2.6 : 99)).sort((p, q) => q[0] - p[0]).slice(0, 4);
    if (far.length) addEdge(h, far[(R() * far.length) | 0][1], true);
  }
  const ne = EA.length, ea = Uint32Array.from(EA), eb = Uint32Array.from(EB), ec = Float32Array.from(EC), elen = new Float32Array(ne), nodeEdges: number[][] = Array.from({ length: n }, () => []), p1 = new THREE.Vector3(), p0 = new THREE.Vector3();
  for (let e = 0; e < ne; e++) { nodeEdges[ea[e]].push(e); nodeEdges[eb[e]].push(e); A.fromArray(pos, ea[e] * 3); B.fromArray(pos, eb[e] * 3); C.fromArray(ec, e * 3); p0.copy(A); let L = 0; for (let s = 1; s <= 8; s++) { bez(A, C, B, s / 8, p1); L += p1.distanceTo(p0); p0.copy(p1); } elen[e] = L; }
  return { n, ne, rmin, pos: Float32Array.from(pos), nrm: Float32Array.from(nrm), rad, inten, hub, region: Uint8Array.from(reg), nodeEdges, ea, eb, ec, elen, elong: Uint8Array.from(LG), hubs };
}
/** One LineSegments buffer for every connector, sampled from the exact Bezier curve each signal will follow. */
export function buildEdgeGeometry(g: Graph) {
  const segs = (e: number) => (g.elong[e] ? 28 : 5); let V = 0; for (let e = 0; e < g.ne; e++) V += segs(e) * 2;
  const pos = new Float32Array(V * 3), aT = new Float32Array(V), aH = new Float32Array(V), aL = new Float32Array(V), start = new Uint32Array(g.ne), cnt = new Uint16Array(g.ne);
  const A = new THREE.Vector3(), B = new THREE.Vector3(), C = new THREE.Vector3(), p = new THREE.Vector3(); let v = 0;
  for (let e = 0; e < g.ne; e++) { A.fromArray(g.pos, g.ea[e] * 3); B.fromArray(g.pos, g.eb[e] * 3); C.fromArray(g.ec, e * 3); const s = segs(e); start[e] = v; cnt[e] = s * 2;
    for (let k = 0; k < s; k++) for (let h = 0; h < 2; h++) { const t = (k + h) / s; bez(A, C, B, t, p).toArray(pos, v * 3); aT[v] = t; aL[v] = g.elong[e]; v++; } }
  const geo = new THREE.BufferGeometry(); geo.setAttribute("position", new THREE.BufferAttribute(pos, 3)); geo.setAttribute("aT", new THREE.BufferAttribute(aT, 1)); geo.setAttribute("aH", new THREE.BufferAttribute(aH, 1).setUsage(THREE.DynamicDrawUsage)); geo.setAttribute("aL", new THREE.BufferAttribute(aL, 1));
  return { edgeGeo: geo, start, cnt };
}

/** Hero centrepiece: set NEXT_PUBLIC_HERO_SHAPE=brain to bring the brain back. */
export const HERO_SHAPE: "knot" | "brain" | "sphere" = process.env.NEXT_PUBLIC_HERO_SHAPE === "brain" ? "brain" : process.env.NEXT_PUBLIC_HERO_SHAPE === "knot" ? "knot" : "sphere";
/** Golden neural knot: a (2,3) torus knot, the "infinity loop" of continuous improvement. Ring grooves along the tube give it a segmented, engineered look. */
export function buildKnotGeometry(hi: boolean) {
  const g = new THREE.TorusKnotGeometry(1, .3, hi ? 420 : 220, hi ? 72 : 40, 2, 3).toNonIndexed(), uv = g.attributes.uv, f = new Float32Array(uv.count);
  for (let i = 0; i < uv.count; i++) f[i] = ss(.86, 1, Math.sin(uv.getX(i) * Math.PI * 2 * 90)) * .9;
  g.setAttribute("aF", new THREE.BufferAttribute(f, 1)); g.deleteAttribute("uv");
  return { geo: g, brainTris: Infinity };
}

/** Golden intelligence core: three concentric shells (outer 1.7, middle 1.25, inner 0.8). Nodes are area-weighted across all shells, so the outer shell is densest. */
export function buildSphereGeometry(hi: boolean) {
  const layers = [[1.7, hi ? 30 : 18], [1.25, hi ? 22 : 14], [.8, hi ? 14 : 10]], PP: ArrayLike<number>[] = [], NN: ArrayLike<number>[] = [], bounds: number[] = []; let tris = 0;
  layers.forEach(([r, d], li) => { const g = new THREE.IcosahedronGeometry(r, d); PP.push(g.attributes.position.array); NN.push(g.attributes.normal.array); tris += g.attributes.position.count / 3; if (li < layers.length - 1) bounds.push(tris); });
  const P = concat(PP), geo = new THREE.BufferGeometry(); geo.setAttribute("position", new THREE.BufferAttribute(P, 3)); geo.setAttribute("normal", new THREE.BufferAttribute(concat(NN), 3)); geo.setAttribute("aF", new THREE.BufferAttribute(new Float32Array(P.length / 3), 1));
  return { geo, brainTris: bounds };
}
