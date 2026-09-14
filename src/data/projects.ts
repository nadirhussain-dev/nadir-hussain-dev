import { parseProjects, type Project } from '@/types/project';

/**
 * Project case studies.
 *
 * Every entry below is a DRAFT. The fields hold questions, not answers —
 * deliberately, because the alternative is inventing an architecture and
 * attributing it to Nadir. Drafts are excluded from production by
 * `isPublishable`, so nothing here can ship as though it were true.
 *
 * To publish one: replace the prompts with real detail and flip `provenance`
 * to 'verified'. `pnpm content:audit` tracks what is outstanding.
 *
 * Project names come from Nadir directly. Nothing else does.
 */
const drafts: Project[] = [
  {
    slug: 'plyaz',
    name: 'PLYAZ',
    summary: 'TODO: One line — what is PLYAZ and who is it for?',
    period: '',
    role: '',
    problem: 'TODO: What problem did this exist to solve, and for whom?',
    constraints: [
      'TODO: What constrained the design — scale, budget, regulation, team size, deadline, existing systems?',
    ],
    architecture:
      'TODO: How was it put together, and why that shape rather than a simpler one?',
    architectureNodes: [],
    decisions: [
      {
        choice: 'TODO: A decision you actually made',
        insteadOf: 'TODO: The alternative you rejected',
        because: 'TODO: Why — including what it cost you',
      },
    ],
    challenges: [
      'TODO: What was genuinely hard? Not "tight deadline" — the technical problem that took real thought.',
    ],
    outcome: 'TODO: What happened. Do not add metrics unless they are real.',
    stack: [],
    provenance: 'needs-confirmation',
    needs:
      'Full case study. Nadir mentioned PLYAZ by name; no other detail exists in the repository.',
  },
  {
    slug: 'venota',
    name: 'Venota',
    summary: 'TODO: One line — what is Venota and who is it for?',
    period: '',
    role: '',
    problem: 'TODO: What problem did this exist to solve, and for whom?',
    constraints: ['TODO: What constrained the design?'],
    architecture: 'TODO: How was it put together, and why that shape?',
    architectureNodes: [],
    decisions: [
      {
        choice: 'TODO: A decision you actually made',
        insteadOf: 'TODO: The alternative you rejected',
        because: 'TODO: Why — including what it cost you',
      },
    ],
    challenges: ['TODO: What was genuinely hard?'],
    outcome: 'TODO: What happened.',
    stack: [],
    provenance: 'needs-confirmation',
    needs:
      'Full case study. Nadir mentioned Venota by name; no other detail exists in the repository.',
  },
  {
    slug: 'trek-prasa',
    name: 'Trek PRASA',
    summary: 'TODO: One line — what is Trek PRASA and who is it for?',
    period: '',
    role: '',
    problem: 'TODO: What problem did this exist to solve, and for whom?',
    constraints: ['TODO: What constrained the design?'],
    architecture: 'TODO: How was it put together, and why that shape?',
    architectureNodes: [],
    decisions: [
      {
        choice: 'TODO: A decision you actually made',
        insteadOf: 'TODO: The alternative you rejected',
        because: 'TODO: Why — including what it cost you',
      },
    ],
    challenges: ['TODO: What was genuinely hard?'],
    outcome: 'TODO: What happened.',
    stack: [],
    provenance: 'needs-confirmation',
    needs:
      'Full case study. Nadir mentioned Trek PRASA by name; no other detail exists in the repository.',
  },
  {
    slug: 'lifeos',
    name: 'LifeOS',
    summary: 'TODO: One line — what is LifeOS and who is it for?',
    period: '',
    role: '',
    problem: 'TODO: What problem did this exist to solve, and for whom?',
    constraints: ['TODO: What constrained the design?'],
    architecture: 'TODO: How was it put together, and why that shape?',
    architectureNodes: [],
    decisions: [
      {
        choice: 'TODO: A decision you actually made',
        insteadOf: 'TODO: The alternative you rejected',
        because: 'TODO: Why — including what it cost you',
      },
    ],
    challenges: ['TODO: What was genuinely hard?'],
    outcome: 'TODO: What happened.',
    stack: [],
    provenance: 'needs-confirmation',
    needs:
      'Full case study. Nadir mentioned LifeOS by name; no other detail exists in the repository.',
  },
];

export const projects = parseProjects(drafts);
