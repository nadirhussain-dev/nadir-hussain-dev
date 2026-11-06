import type { Provenance } from '@/types/content';

/**
 * The stack, organised by the layer it operates at.
 *
 * A logo wall says "I have heard of these". Grouping by layer says something
 * about how the person thinks the system divides up, which is the only
 * interesting thing a stack list can communicate.
 *
 * Names and notes come from Nadir's CV and the READMEs of his repositories.
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

const tech = (id: string, name: string, note: string): Technology => ({
  id,
  name,
  note,
  provenance: 'verified',
});

export const STACK: readonly StackLayer[] = [
  {
    id: 'interface',
    label: 'Interface',
    role: 'What the user touches, and the only layer where latency is felt directly.',
    technologies: [
      tech(
        'react',
        'React',
        'Daily since 2023: subscription flows, dashboards and real-time interfaces.',
      ),
      tech(
        'nextjs',
        'Next.js',
        'Client work and personal products, including this site on Next.js 16.',
      ),
      tech(
        'typescript',
        'TypeScript',
        'The default everywhere, from UI to shared Zod contracts.',
      ),
      tech(
        'zustand',
        'Zustand',
        'Domain-sync hooks with optimistic updates and automatic rollback.',
      ),
    ],
  },
  {
    id: 'services',
    label: 'Services',
    role: 'Where the rules that make the product what it is are enforced.',
    technologies: [
      tech('nestjs', 'NestJS', 'Payment APIs at work, and the Skolara API.'),
      tech(
        'fastapi',
        'FastAPI',
        'The SnapFind API, in front of a Python face-processing worker.',
      ),
      tech(
        'websockets',
        'WebSockets',
        'Live chat with history and notifications on the Venota app.',
      ),
    ],
  },
  {
    id: 'payments',
    label: 'Payments',
    role: 'The layer where a retry can cost someone real money.',
    technologies: [
      tech(
        'stripe',
        'Stripe',
        'Subscriptions and an event-driven webhook pipeline with idempotency keys.',
      ),
      tech(
        'paystack',
        'Paystack',
        'WebView checkout with webhook confirmation on Trek Train.',
      ),
      tech(
        'safepay',
        'Safepay',
        'Pakistani payments for Daynora, running in sandbox on staging.',
      ),
    ],
  },
  {
    id: 'data',
    label: 'Data',
    role: 'The layer permitted to be authoritative, and the hardest one to scale.',
    technologies: [
      tech(
        'postgres',
        'PostgreSQL',
        'Ledgers, row-level security and permissions enforced in the database.',
      ),
      tech(
        'supabase',
        'Supabase',
        'Auth, RLS, Edge Functions and Storage across personal products.',
      ),
      tech('prisma', 'Prisma', 'The data layer behind the Skolara API.'),
    ],
  },
  {
    id: 'mobile',
    label: 'Mobile',
    role: 'The same product under tighter constraints — network, battery, and no reload.',
    technologies: [
      tech(
        'react-native',
        'React Native',
        'Trek Train at work, and Daynora and Tessera on my own.',
      ),
      tech(
        'expo',
        'Expo',
        'Dev builds, local SQLite and notifications for local-first apps.',
      ),
    ],
  },
  {
    id: 'infrastructure',
    label: 'Infrastructure',
    role: 'How the thing gets built, shipped and kept running.',
    technologies: [
      tech(
        'docker',
        'Docker',
        'Local Postgres for Skolara and the production compose stack for SnapFind.',
      ),
      tech('ci-cd', 'CI/CD', 'Pipelines and release management in client work.'),
      tech(
        'cloudflare',
        'Cloudflare Workers',
        'Hosting for the Daynora web app and console.',
      ),
    ],
  },
] as const;

export const ALL_TECHNOLOGIES: readonly Technology[] = STACK.flatMap(
  (layer) => layer.technologies,
);
