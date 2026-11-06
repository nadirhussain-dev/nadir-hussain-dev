import type { Span } from '@/data/spans';
import { site } from '@/data/site';
import { HeroStage } from '@/components/hero/hero-stage';
import { getResumeStatus } from '@/lib/resume';

export function IdentitySection({ span }: { span: Span }) {
  const resume = getResumeStatus();
  const [firstName, lastName] = site.name.split(' ');

  return (
    <section id={span.id} aria-labelledby={`${span.id}-heading`} className="hero">
      <div className="mx-auto w-full max-w-6xl px-(--spacing-gutter) pt-24 xl:px-4 xl:pt-16">
        <div className="max-w-md">
          <h1 id={`${span.id}-heading`} className="text-h1 font-extrabold">
            {firstName}
            <br />
            {lastName}
          </h1>
          <p className="mt-5 text-lead font-medium text-pretty">
            Full-stack engineer. I build web and mobile apps, from the screen down to
            the payments.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href="#work"
              className="inline-flex min-h-12 items-center rounded-xl bg-lamp px-5 font-bold text-hoodie transition-colors hover:bg-white"
            >
              See my work
            </a>
            {resume.available && (
              <a
                href={resume.href}
                download
                className="inline-flex min-h-12 items-center rounded-xl border-2 border-white px-5 font-bold transition-colors hover:bg-white hover:text-hoodie"
              >
                Download CV
              </a>
            )}
          </div>
        </div>
      </div>
      <HeroStage />
    </section>
  );
}
