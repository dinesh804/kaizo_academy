import Image from "next/image";

export default function FirstBatchShowcase() {
  return (
    <section aria-labelledby="first-batch-title" className="py-7 sm:py-9">
      <div className="mx-auto max-w-7xl px-5">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 id="first-batch-title" className="font-display text-2xl font-bold sm:text-3xl">
              KAIZO LABS – Our First Batch
            </h2>
            <p className="mt-1 text-sm text-muted">
              Celebrating our learning community and the beginning of the KAIZO LABS Academy journey.
            </p>
          </div>
          <span className="tag">Illustrative showcase artwork · portraits and certificate are not verified records</span>
        </div>
        <figure className="group overflow-hidden rounded-2xl border border-neon/40 bg-bg2 shadow-[0_8px_28px_rgba(181,18,38,.08)] transition-shadow duration-300 hover:shadow-[0_12px_40px_rgba(230,57,70,.22)] motion-reduce:transition-none">
          <div className="relative aspect-video w-full">
            <Image
              src="/images/students/kaizo-first-batch-showcase.png"
              alt="Illustrative KAIZO LABS first-batch showcase artwork with learner profile cards and a sample certificate; these are not verified student or course-completion records"
              fill
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-contain transition-transform duration-300 group-hover:scale-[1.005] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
          </div>
          <figcaption className="sr-only">
            Single showcase graphic. Its learner portraits and certificate are illustrative artwork, not verified records.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
