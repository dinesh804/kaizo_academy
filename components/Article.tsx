export default function Article({ body }: { body: string[] }) {
  return <div className="space-y-4 text-muted">{body.map(t => t.startsWith("## ") ? <h2 key={t} className="pt-4 font-display text-xl font-semibold text-white">{t.slice(3)}</h2> : <p key={t}>{t}</p>)}</div>;
}
