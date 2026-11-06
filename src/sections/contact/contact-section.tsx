import Image from 'next/image';
import type { Span } from '@/data/spans';
import { site } from '@/data/site';
import { getResumeStatus } from '@/lib/resume';

export function ContactSection({ span }: { span: Span }) {
  const resume = getResumeStatus();
  const links = [
    { label: 'GitHub', href: site.github.value },
    { label: 'LinkedIn', href: site.linkedin.value },
  ];

  return (
    <section
      id={span.id}
      aria-labelledby={`${span.id}-heading`}
      className="bg-night px-(--spacing-gutter) py-20 text-white md:py-28"
    >
      <div className="mx-auto grid w-full max-w-6xl items-center gap-10 md:grid-cols-[minmax(0,1fr)_auto]">
        <div>
          <h2 id={`${span.id}-heading`} className="text-h1 text-balance">
            {span.heading}
          </h2>
          <a
            href={`mailto:${site.email.value}`}
            className="mt-8 inline-flex min-h-14 items-center rounded-xl border-[5px] border-night bg-coin px-6 text-lead font-extrabold break-all text-night shadow-[0_6px_0_#0f1a31] hover:bg-white"
          >
            {site.email.value}
          </a>
          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 font-bold">
            {links.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="me noopener noreferrer"
                  className="underline underline-offset-4"
                >
                  {link.label}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
            {resume.available && (
              <li>
                <a href={resume.href} download className="underline underline-offset-4">
                  Download CV
                </a>
              </li>
            )}
          </ul>
          <p className="mt-6">{site.location.value}</p>
        </div>
        <Image
          src="/art/face.webp"
          alt=""
          width={880}
          height={880}
          className="mx-auto w-56 rounded-full border-8 border-night md:w-72"
        />
      </div>
    </section>
  );
}
