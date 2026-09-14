import type { Span } from '@/data/spans';
import { projects } from '@/data/projects';
import { isPublishable } from '@/types/project';
import { Section } from '@/components/ui/section';
import { CaseStudy } from './case-study';

/**
 * Selected work.
 *
 * Drafts render in development so they can be reviewed and filled in, and are
 * excluded from the production build entirely. That gate is the mechanism
 * behind "nothing invented ships" — it is enforced here rather than trusted.
 */
export function WorkSection({ span }: { span: Span }) {
  const isDev = process.env.NODE_ENV !== 'production';
  const publishable = projects.filter(isPublishable);
  const visible = isDev ? projects : publishable;

  return (
    <Section span={span}>
      {visible.length === 0 ? (
        <p className="max-w-2xl text-lead text-pretty text-paper-400">
          Case studies are being written. Rather than publish a placeholder that reads
          like a description, this section stays empty until each project has a real
          decision log behind it.
        </p>
      ) : (
        <>
          <p className="mb-2 max-w-2xl text-lead text-pretty text-paper-300">
            What a project was is less interesting than what it forced a choice about.
            Each of these opens into the decisions behind it, including the alternatives
            that were rejected and what that cost.
          </p>
          <div className="mt-12 border-b border-rule">
            {visible.map((project, index) => (
              <CaseStudy
                key={project.slug}
                project={project}
                index={index}
                isDraft={!isPublishable(project)}
              />
            ))}
          </div>
          {isDev && publishable.length !== projects.length && (
            <p className="mt-6 font-mono text-micro text-signal">
              {projects.length - publishable.length} draft(s) hidden from production.
              Run pnpm content:audit.
            </p>
          )}
        </>
      )}
    </Section>
  );
}
