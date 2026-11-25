import Logo from "./Logo";
const cols: [string, [string, string][]][] = [
 ["Company", [["About", "/#about"], ["Research", "/#divisions"], ["Projects", "/#projects"]]],
 ["Academy", [["Programs", "/academy"], ["Student Benefits", "/#benefits"], ["Learning Journey", "/#journey"], ["Contact", "/#contact"]]],
 ["Resources", [["Blog", "/blog"], ["Tutorials", "/#"], ["FAQs", "/#"], ["Privacy Policy", "/#"], ["Terms and Conditions", "/#"]]]];
export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-bg2 py-14"><div className="mx-auto grid max-w-7xl gap-10 px-5 md:grid-cols-4">
      <div><Logo /><p className="mt-2 text-muted">Imagine. Improve. Innovate.</p></div>
      {cols.map(([t, ls]) => (<nav key={t} aria-label={t}><h3 className="font-display font-semibold">{t}</h3>
        <ul className="mt-3 space-y-2 text-sm text-muted">{ls.map(([l, h]) => <li key={l}><a className="hover:text-white" href={h}>{l}</a></li>)}</ul></nav>))}
    </div>
    <p className="mx-auto mt-10 max-w-7xl px-5 text-sm text-muted">Don't just explore the future. Build it.</p></footer>);
}
