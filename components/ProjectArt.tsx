// Custom concept artwork (illustrative, NOT application screenshots). Black and gold.
const Base = ({ id, children }: { id: string; children: React.ReactNode }) => (
  <svg viewBox="0 0 640 360" className="h-full w-full" role="img" aria-label="Illustrative concept artwork" preserveAspectRatio="xMidYMid slice">
    <defs>
      <radialGradient id={`${id}g`} cx=".72" cy=".28" r=".9"><stop offset="0" stopColor="#FFD700" stopOpacity=".28" /><stop offset="1" stopColor="#080808" stopOpacity="0" /></radialGradient>
      <linearGradient id={`${id}f`} x1="0" x2="1"><stop offset="0" stopColor="#B8860B" /><stop offset=".5" stopColor="#FFD700" /><stop offset="1" stopColor="#F5E6B8" /></linearGradient>
      <pattern id={`${id}h`} width="28" height="48.5" patternUnits="userSpaceOnUse"><path d="M14 33L0 25V8L14 0l14 8v17zM14 48.5L0 40.5V33l14 8 14-8v7.5z" fill="none" stroke="#FFD700" strokeOpacity=".07" /></pattern>
    </defs>
    <rect width="640" height="360" fill="#0b0b0b" /><rect width="640" height="360" fill={`url(#${id}h)`} /><rect width="640" height="360" fill={`url(#${id}g)`} />
    {children}<rect x="1" y="1" width="638" height="358" fill="none" stroke="#D4AF37" strokeOpacity=".35" />
  </svg>);
const G = "#FFD700", D = "#D4AF37", C = "#F5E6B8";
const Net = ({ x, cols, y0 = 80, gap = 52 }: { x: number; cols: number[]; y0?: number; gap?: number }) => {
  const pts = cols.map((n, c) => Array.from({ length: n }, (_, i) => [x + c * 60, y0 + (i + (5 - n) / 2) * 38] as const));
  return <g>{pts.slice(1).map((col, c) => col.map(([bx, by], j) => pts[c].map(([ax, ay], i) => <line key={`${c}${i}${j}`} x1={ax} y1={ay} x2={bx} y2={by} stroke={D} strokeOpacity=".3" />)))}{pts.flat().map(([px, py], i) => <circle key={i} cx={px} cy={py} r="5" fill={i % 3 ? G : C} />)}</g>;
};
function Crop() { const id = "crop"; return (<Base id={id}>
  <g stroke={D} strokeOpacity=".28" fill="none">{[0, 1, 2, 3, 4, 5, 6].map(i => <path key={i} d={`M${30 + i * 36} 340 L${140 + i * 14} 190`} />)}</g>
  <path d="M110 250C100 140 200 80 320 90C330 200 250 280 110 250Z" fill={`url(#${id}f)`} opacity=".92" /><path d="M118 246C190 200 250 150 312 98" stroke="#080808" strokeWidth="3" fill="none" />
  <text x="360" y="62" fill={C} fontSize="12" letterSpacing="3">NDVI · ExG</text>
  {[0, 1, 2, 3, 4].map(i => <rect key={i} x="360" y={72 + i * 20} width={70 + i * 20} height="12" rx="3" fill={G} opacity={.15 + i * .18} />)}
  <Net x={420} cols={[3, 4, 2]} y0={170} /></Base>); }
function Rag() { const id = "rag"; return (<Base id={id}>
  {[0, 1, 2].map(i => <g key={i} transform={`translate(${44 + i * 16} ${86 + i * 16})`}><rect width="110" height="140" rx="8" fill="#141414" stroke={D} strokeOpacity=".7" />{[0, 1, 2, 3, 4, 5].map(l => <rect key={l} x="14" y={20 + l * 18} width={l === 5 ? 50 : 82} height="5" fill={D} opacity=".4" />)}</g>)}
  <path d="M200 180H250" stroke={G} strokeWidth="2" /><path d="M244 172l10 8-10 8" fill="none" stroke={G} strokeWidth="2" />
  {Array.from({ length: 46 }, (_, i) => <circle key={i} cx={280 + (Math.sin(i * 12.9) * .5 + .5) * 150} cy={90 + (Math.sin(i * 78.2) * .5 + .5) * 190} r={2.5 + (i % 4)} fill={i % 7 === 0 ? G : D} opacity={i % 7 === 0 ? 1 : .5} />)}
  <circle cx="365" cy="185" r="48" fill="none" stroke={G} strokeWidth="3" /><path d="M399 219l28 28" stroke={G} strokeWidth="5" strokeLinecap="round" />
  <rect x="470" y="110" width="140" height="120" rx="14" fill="#141414" stroke={G} strokeOpacity=".8" /><circle cx="490" cy="132" r="6" fill={G} />{[0, 1, 2, 3].map(l => <rect key={l} x="486" y={152 + l * 17} width={l === 3 ? 60 : 108} height="6" rx="3" fill={C} opacity=".55" />)}</Base>); }
function Analytics() { const id = "ana"; const h = [60, 110, 85, 150, 120, 185]; return (<Base id={id}>
  {h.map((v, i) => <rect key={i} x={60 + i * 52} y={300 - v} width="34" height={v} rx="4" fill={`url(#${id}f)`} opacity={.5 + i * .08} />)}
  <polyline points={h.map((v, i) => `${77 + i * 52},${280 - v * 1.05}`).join(" ")} fill="none" stroke={C} strokeWidth="2.5" />{h.map((v, i) => <circle key={i} cx={77 + i * 52} cy={280 - v * 1.05} r="5" fill={G} />)}
  <g stroke={D} strokeOpacity=".5">{[0, 1, 2, 3].map(r => <line key={r} x1="400" y1={60 + r * 26} x2="600" y2={60 + r * 26} />)}{[0, 1, 2, 3].map(c => <line key={c} x1={400 + c * 66} y1="60" x2={400 + c * 66} y2="164" />)}</g>
  <rect x="400" y="200" width="200" height="90" rx="14" fill="#141414" stroke={G} strokeOpacity=".8" /><circle cx="422" cy="224" r="6" fill={G} />{[0, 1, 2].map(l => <rect key={l} x="440" y={216 + l * 18} width={l === 2 ? 70 : 130} height="6" rx="3" fill={C} opacity=".55" />)}</Base>); }
function Sign() { const id = "sgn"; const f = [[[290, 250], [285, 220], [284, 170], [282, 135], [280, 105]], [[320, 250], [320, 215], [320, 160], [320, 122], [320, 90]], [[350, 250], [352, 220], [356, 170], [358, 135], [360, 108]], [[376, 258], [384, 232], [394, 196], [402, 168], [410, 145]], [[300, 272], [268, 255], [240, 228], [222, 202], [210, 180]]]; return (<Base id={id}>
  {[[60, 50, 1, 1], [580, 50, -1, 1], [60, 310, 1, -1], [580, 310, -1, -1]].map(([x, y, a, b], i) => <path key={i} d={`M${x} ${y + 28 * b}V${y}H${x + 28 * a}`} fill="none" stroke={G} strokeWidth="3" />)}
  <line x1="60" y1="160" x2="580" y2="160" stroke={G} strokeOpacity=".4" strokeDasharray="4 6" />
  <path d="M290 250L376 258 340 310 300 310Z" fill={D} opacity=".25" />
  {f.map((p, k) => <g key={k}><polyline points={`320,300 ${p.map(q => q.join(",")).join(" ")}`} fill="none" stroke={D} strokeOpacity=".8" strokeWidth="2" />{p.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={i === 4 ? 6 : 4.5} fill={i === 4 ? G : C} />)}</g>)}
  <circle cx="320" cy="300" r="7" fill={G} /></Base>); }
export default function ProjectArt({ kind }: { kind: "crop" | "rag" | "analytics" | "sign" }) { return kind === "crop" ? <Crop /> : kind === "rag" ? <Rag /> : kind === "analytics" ? <Analytics /> : <Sign />; }
export function ClassroomArt() { return (
  <svg viewBox="0 0 640 480" className="h-full w-full" role="img" aria-label="Illustration of an AI learning lab with a wall display and laptops" preserveAspectRatio="xMidYMid slice">
    <defs><linearGradient id="cf" x1="0" x2="1"><stop offset="0" stopColor="#B8860B" /><stop offset=".5" stopColor="#FFD700" /><stop offset="1" stopColor="#F5E6B8" /></linearGradient>
      <radialGradient id="cg" cx=".5" cy=".3" r=".8"><stop offset="0" stopColor="#FFD700" stopOpacity=".22" /><stop offset="1" stopColor="#080808" stopOpacity="0" /></radialGradient></defs>
    <rect width="640" height="480" fill="#0b0b0b" /><rect width="640" height="480" fill="url(#cg)" />
    {[0, 1, 2, 3, 4].map(i => <rect key={i} x={60 + i * 120} y="20" width="70" height="6" rx="3" fill="#FFD700" opacity=".6" />)}
    <rect x="130" y="60" width="380" height="200" rx="10" fill="#121212" stroke="#D4AF37" strokeOpacity=".8" />
    <g stroke="#D4AF37" strokeOpacity=".4">{[0, 1, 2].flatMap(a => [0, 1, 2, 3].map(b => <line key={`${a}${b}`} x1={190} y1={110 + a * 40} x2={290} y2={100 + b * 36} />))}</g>
    {[0, 1, 2].map(a => <circle key={a} cx="190" cy={110 + a * 40} r="6" fill="#FFD700" />)}{[0, 1, 2, 3].map(b => <circle key={b} cx="290" cy={100 + b * 36} r="6" fill="#F5E6B8" />)}
    {[0, 1, 2, 3, 4, 5].map(l => <rect key={l} x="340" y={95 + l * 22} width={l % 3 ? 120 : 80} height="6" rx="3" fill="url(#cf)" opacity=".7" />)}
    {[0, 1, 2].map(i => <g key={i} transform={`translate(${70 + i * 170} 330)`}><path d="M10 0h110l20 70H-10z" fill="#141414" stroke="#D4AF37" strokeOpacity=".7" /><path d="M30 8h70l10 40H20z" fill="#FFD700" opacity=".18" /><rect x="-20" y="80" width="170" height="10" rx="4" fill="#D4AF37" opacity=".5" /></g>)}
    <rect x="1" y="1" width="638" height="478" fill="none" stroke="#D4AF37" strokeOpacity=".35" /></svg>); }
