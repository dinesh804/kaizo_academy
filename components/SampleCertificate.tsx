"use client";
import Image from "next/image";

const certificatePath = "/images/certificates/sample-certificate.png";

export default function SampleCertificate() {
  return (
    <section id="sample-certificate" className="py-7 sm:py-9">
      <div className="mx-auto grid max-w-7xl items-center gap-5 px-5 lg:grid-cols-[1.4fr_.6fr]">
        <div
          className="certificate-preview relative overflow-hidden rounded-xl border-2 border-crimson bg-white shadow-[0_10px_38px_rgba(181,18,38,.18)]"
          onContextMenu={event => event.preventDefault()}
          onDragStart={event => event.preventDefault()}
          aria-label="Protected sample certificate preview"
        >
          <Image
            src={certificatePath}
            alt="Low-resolution sample KAIZO LABS Academy certificate design preview, overlaid with SAMPLE - NOT VALID and KAIZO LABS / KAIZO ACADEMY watermarks; no learner or completion details are shown"
            width={960}
            height={600}
            sizes="(max-width: 1024px) 100vw, 720px"
            className="pointer-events-none aspect-[16/10] h-auto w-full select-none object-contain"
            draggable={false}
            loading="lazy"
          />
          <div aria-hidden="true" className="certificate-preview__watermark">SAMPLE – NOT VALID</div>
          <div aria-hidden="true" className="absolute inset-0 select-none bg-transparent" />
        </div>
        <div>
          <span className="tag">Protected design preview</span>
          <h2 className="mt-3 font-display text-2xl font-bold sm:text-3xl">Sample Certificate</h2>
          <p className="mt-2 text-sm text-muted">Design preview only. It contains no learner identity, credential, or course-completion claim and is not a valid certificate.</p>
          <p className="mt-3 text-xs text-muted">The preview is reduced in resolution and watermarked. These deterrents cannot prevent screenshots, browser developer tools, screen recording or other image extraction.</p>
        </div>
      </div>
    </section>
  );
}
