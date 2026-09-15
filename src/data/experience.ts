import { parseExperience, type Experience } from '@/types/experience';

/**
 * Professional trajectory.
 *
 * DRAFT. The repository contained no resume, no CV and no employment history,
 * so there is nothing here to state as fact. This single placeholder exists to
 * hold the shape of the section; it is excluded from the production build.
 *
 * Fabricating an employer would be the single worst thing this site could do,
 * so the section renders an honest empty state in production instead.
 */
const drafts: Experience[] = [
  {
    slug: 'placeholder',
    company: 'TODO: Company name',
    role: 'TODO: Your title',
    period: '',
    startIso: '',
    endIso: '',
    summary: 'TODO: One line — what were you brought in to do?',
    responsibilities: ['TODO: What you actually owned, not what the team owned'],
    impact: [
      'TODO: What changed because you were there. Only include numbers that are real and that you are free to share.',
    ],
    technologies: [],
    provenance: 'needs-confirmation',
    needs:
      'Entire employment history. No resume, CV or role detail exists in the repository. Supply one entry per role: company, title, dates, what you owned, what changed, and the technologies involved.',
  },
];

export const experience = parseExperience(drafts);
