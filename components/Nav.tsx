"use client";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";
import { nav } from "@/lib/content";
export default function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed inset-x-0 top-0 z-50 glass border-x-0 border-t-0">
      <nav aria-label="Main" className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
        <a href="/#home" aria-label="KAIZO ACADEMY home"><Logo /></a>
        <ul className="hidden gap-6 text-sm text-muted lg:flex">
          {nav.map(([l, h]) => <li key={l}><a className="hover:text-white" href={h}>{l}</a></li>)}
        </ul>
        <div className="hidden gap-3 lg:flex">
          <a href="/academy" className="btn btn-s !py-2">Explore Programs</a>
          <a href="/#contact" className="btn btn-p !py-2">Contact Us</a>
        </div>
        <button className="lg:hidden p-2" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </button>
      </nav>
      {open && (
        <div className="lg:hidden bg-bg2 px-5 pb-5">
          {nav.map(([l, h]) => <a key={l} href={h} onClick={() => setOpen(false)} className="block py-3 text-muted border-b border-white/5">{l}</a>)}
          <a href="/academy" onClick={() => setOpen(false)} className="btn btn-p mt-4 w-full justify-center">Explore Programs</a>
        </div>)}
    </header>);
}
