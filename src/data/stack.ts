import type { Provenance } from '@/types/content';

/**
 * The stack, organised by the layer it operates at.
 *
 * A logo wall says "I have heard of these". Grouping by layer says something
 * about how the person thinks the system divides up, which is the only
 * interesting thing a stack list can communicate.
 *
 * The technology names come from Nadir's own description of his stack. The
 * per-technology notes do not — those are prompts, and every entry is marked
 * needs-confirmation until he writes them. Unconfirmed notes are hidden in
 * production; the layer structure and the names still render.
 */
export interface Technology {
  id: string;
  name: string;
  /** What Nadir actually does with it. Drafted as a prompt. */
  note: string;
  provenance: Provenance;
}

export interface StackLayer {
  id: string;
  label: string;
  /** Why this layer is a layer — honest framing, not a claim about Nadir. */
  role: string;
  technologies: readonly Technology[];
}

const draft = (id: string, name: string): Technology => ({
  id,
  name,
  note: `TODO: Where do you actually use ${name}, and what do you understand about it that someone who had only read the docs would not?`,
  provenance: 'needs-confirmation',
});

export const STACK: readonly StackLayer[] = [
  {
    id: 'interface',
    label: 'Interface',
    role: 'What the user touches, and the only layer where latency is felt directly.',
    technologies: [
      draft('react', 'React'),
      draft('nextjs', 'Next.js'),
      draft('typescript', 'TypeScript'),
    ],
  },
  {
    id: 'services',
    label: 'Services',
    role: 'Where the rules that make the product what it is are enforced.',
    technologies: [
      draft('node', 'Node.js'),
      draft('nestjs', 'NestJS'),
      draft('express', 'Express'),
    ],
  },
  {
    id: 'data',
    label: 'Data',
    role: 'The layer permitted to be authoritative, and the hardest one to scale.',
    technologies: [draft('postgres', 'PostgreSQL'), draft('supabase', 'Supabase')],
  },
  {
    id: 'mobile',
    label: 'Mobile',
    role: 'The same product under tighter constraints — network, battery, and no reload.',
    technologies: [draft('react-native', 'React Native'), draft('expo', 'Expo')],
  },
  {
    id: 'infrastructure',
    label: 'Infrastructure',
    role: 'How the thing gets built, shipped and kept running.',
    technologies: [
      draft('docker', 'Docker'),
      draft('ci-cd', 'CI/CD'),
      draft('cloud', 'Cloud'),
    ],
  },
] as const;

export const ALL_TECHNOLOGIES: readonly Technology[] = STACK.flatMap(
  (layer) => layer.technologies,
);
