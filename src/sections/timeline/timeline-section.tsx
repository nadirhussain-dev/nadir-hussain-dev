import type { Span } from '@/data/spans';
import { experience } from '@/data/experience';
import { isPublishable } from '@/types/experience';
import { Section } from '@/components/ui/section';
import { Portrait } from '@/components/ui/portrait';

export function TimelineSection({ span }: { span: Span }) {
  const [job, school] = experience.filter(isPublishable);

  return (
    <Section span={span} className="bg-screen">
      <div className="grid grid-cols-[minmax(0,1fr)] gap-10 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:gap-16">
        <div>
          {job && (
            <>
              <p className="text-h3 font-bold">
                {job.role} at Devnodes, {job.period.replace('—', 'to')}
              </p>
              <p className="mt-3 max-w-xl text-lead text-pretty">{job.summary}</p>
              <ul className="mt-6 max-w-xl list-disc space-y-2 pl-5">
                {job.responsibilities.slice(0, 4).map((item) => (
                  <li key={item} className="text-pretty">
                    {item}
                  </li>
                ))}
              </ul>
            </>
          )}
          {school && (
            <p className="mt-8 font-semibold">
              {school.role}, {school.company.replace(' · ', ', ')}
            </p>
          )}
        </div>
        <Portrait
          className="mx-auto w-full max-w-[18rem] -rotate-2 self-start md:mt-2"
          lazy
        />
      </div>
    </Section>
  );
}
