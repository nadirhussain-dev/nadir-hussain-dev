export interface ProjectView {
  slug: string;
  name: string;
  summary: string;
  period: string;
  outcome: string;
  stack: readonly string[];
  source?: string;
  decisions: readonly { choice: string; because: string }[];
}

/** The inside of a project, shared by the chest pop-up and the quest log. */
export function ProjectDetails({ project }: { project: ProjectView }) {
  return (
    <>
      <p className="text-lead text-pretty">{project.summary}</p>

      {project.decisions.length > 0 && (
        <>
          <h4 className="mt-5 font-display text-lead">Key decisions</h4>
          <ul className="mt-2 list-disc space-y-2 pl-5">
            {project.decisions.slice(0, 2).map((decision) => (
              <li key={decision.choice} className="text-pretty">
                <strong>{decision.choice}.</strong> {decision.because}
              </li>
            ))}
          </ul>
        </>
      )}

      <h4 className="mt-5 font-display text-lead">Result</h4>
      <p className="mt-1 text-pretty">{project.outcome}</p>

      <p className="mt-4 text-meta font-bold">{project.stack.join(', ')}</p>

      {project.source !== undefined && (
        <a
          href={project.source}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block font-extrabold underline underline-offset-4"
        >
          View the code
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      )}
    </>
  );
}
