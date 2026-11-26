import Image from "next/image";

export default function LearningCommunity() {
  return (
    <section aria-labelledby="learning-community-title" className="py-7 sm:py-9">
      <div className="mx-auto max-w-7xl px-5">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 id="learning-community-title" className="font-display text-2xl font-bold sm:text-3xl">
              Our Learning Community
            </h2>
            <p className="mt-1 text-sm text-muted">
              A collaborative learning environment built around AI, technology and innovation.
            </p>
          </div>
          <span className="tag">Illustrative sample image · replace with an authentic batch photograph</span>
        </div>
        <figure className="group overflow-hidden rounded-2xl border border-neon/40 bg-bg2 shadow-[0_8px_28px_rgba(181,18,38,.08)] transition-shadow duration-300 hover:shadow-[0_12px_40px_rgba(230,57,70,.22)]">
          <div className="relative aspect-video w-full">
            <Image
              src="/images/students/kaizo-first-batch.png"
              alt="Illustrative sample image of learners talking together on a campus; not an authentic KAIZO LABS batch photograph"
              fill
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.01] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
          </div>
          <figcaption className="sr-only">Illustrative sample image until replaced with an authentic KAIZO LABS batch photograph.</figcaption>
        </figure>
      </div>
    </section>
  );
}
