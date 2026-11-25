import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
// Production: Upstash Redis (shared across all serverless instances). Local development: in-memory fallback.
// On Vercel production the in-memory limiter is NOT used: without Upstash the route refuses to run ("unavailable").
const url = () => process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL, token = () => process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
export const isProd = () => process.env.NODE_ENV === "production" || process.env.VERCEL_ENV === "production";
const RULES = [{ n: 3, ms: 60_000, label: "1 m" as const }, { n: 8, ms: 3_600_000, label: "1 h" as const }]; // burst 3/minute, 8/hour per IP
let upstash: Ratelimit[] | null = null; const mem = new Map<string, number[]>();
export type Limit = { ok: boolean; retryAfter: number; mode: "upstash" | "memory" | "unavailable" };
export async function checkLimit(ip: string): Promise<Limit> {
  if (url() && token()) {
    upstash ??= RULES.map(r => new Ratelimit({ redis: new Redis({ url: url()!, token: token()! }), limiter: Ratelimit.slidingWindow(r.n, r.label), prefix: `kaizo:contact:${r.label}` }));
    const res = await Promise.all(upstash.map(l => l.limit(ip))); const bad = res.find(r => !r.success);
    return { ok: !bad, retryAfter: bad ? Math.max(1, Math.ceil((bad.reset - Date.now()) / 1000)) : 0, mode: "upstash" };
  }
  if (isProd()) return { ok: false, retryAfter: 0, mode: "unavailable" };
  const now = Date.now(), hits = (mem.get(ip) ?? []).filter(t => now - t < 3_600_000);
  for (const r of RULES) { const inWin = hits.filter(t => now - t < r.ms); if (inWin.length >= r.n) { mem.set(ip, hits); return { ok: false, retryAfter: Math.ceil((inWin[0] + r.ms - now) / 1000), mode: "memory" }; } }
  hits.push(now); mem.set(ip, hits); return { ok: true, retryAfter: 0, mode: "memory" };
}
