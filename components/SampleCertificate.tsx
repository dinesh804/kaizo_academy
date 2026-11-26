const certificatePath = "/images/certificates/sample-certificate.png";

export default function SampleCertificate() {
  return (
    <section id="sample-certificate" className="py-7 sm:py-9">
      <div className="mx-auto grid max-w-7xl items-center gap-5 px-5 lg:grid-cols-[1.4fr_.6fr]">
        <a
          href={certificatePath}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View Sample Certificate (opens in a new tab)"
          className="block overflow-hidden rounded-xl border-2 border-crimson bg-white shadow-[0_10px_38px_rgba(181,18,38,.18)]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={certificatePath}
            alt="Landscape sample certificate design, watermarked SAMPLE - NOT VALID, with no learner or completion details"
            className="aspect-[16/10] w-full object-contain"
            loading="lazy"
          />
        </a>
        <div>
          <span className="tag">Preview only</span>
          <h2 className="mt-3 font-display text-2xl font-bold sm:text-3xl">Sample Certificate</h2>
          <p className="mt-2 text-sm text-muted">
            Design preview only. No learner, credential, or course-completion claim is represented.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <a href={certificatePath} target="_blank" rel="noopener noreferrer" className="btn btn-s !py-2">
              View Sample Certificate
            </a>
            <a href={certificatePath} download="kaizo-labs-sample-certificate.png" className="btn btn-p !py-2">
              Download Sample
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
