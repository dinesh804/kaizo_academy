export default function Logo({ size = "md", sub = "LABS" }: { size?: "md" | "lg"; sub?: string }) {
  const lg = size === "lg";
  return (
    <span className="inline-flex flex-col leading-none" aria-label={`KAIZO ${sub}`}>
      <span className={`logo-kaizo font-display font-extrabold tracking-wide ${lg ? "text-5xl sm:text-7xl" : "text-xl"}`}>KAIZO</span>
      <span className={`font-display uppercase text-crimson-soft ${lg ? "mt-2 text-sm tracking-[.55em]" : "text-[.6rem] tracking-[.35em]"}`}>{sub}</span>
    </span>);
}
