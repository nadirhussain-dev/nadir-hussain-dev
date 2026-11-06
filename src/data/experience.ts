import { parseExperience, type Experience } from '@/types/experience';

/**
 * Professional trajectory.
 *
 * Source: Nadir's own CV (June 2026). Client platform names the CV leaves out
 * stay out here too. Absolute claims from the CV ("zero errors") are stated as
 * what the mechanism does, because that is the part that can be defended.
 */
const entries: Experience[] = [
  {
    slug: 'devnodes',
    company: 'Devnodes · Multan, Pakistan',
    role: 'Frontend Engineer',
    period: 'Jun 2023 — present',
    startIso: '2023-06',
    endIso: '',
    summary:
      'Owning features end to end across web, mobile and Shopify, from the API contract to the interface. Deepest in two areas: payment systems and real-time products.',
    responsibilities: [
      'Multi-provider payments across a Next.js and NestJS monorepo, with Stripe behind a provider-agnostic adapter layer',
      'A REST layer of 25+ payment endpoints: checkout, subscriptions, installments, holds, wallet adjustments and reconciliation',
      'Subscription lifecycle UI for three plan tiers, with optimistic updates and automatic rollback',
      'Real-time train search, seat reservation, onboarding and Paystack checkout for Trek Train',
      'WebSocket chat with history and live notifications for the Venota app',
      'A Google Drive-style media library, release and build management, and a custom Shopify branch-locator app',
    ],
    impact: [
      'New payment gateways can be added without touching core business logic',
      'Webhooks are protected by HMAC verification, replay protection and idempotency keys',
      'Payment holds go through dual approval, leaving compliance-audited ledger entries',
      'Riders get booking confirmations and 30-minute arrival alerts without opening the app',
      'Recognised as Employee of the Quarter',
    ],
    technologies: [
      'TypeScript',
      'React',
      'Next.js',
      'React Native',
      'NestJS',
      'Stripe',
      'Paystack',
      'Zustand',
      'TanStack Query',
      'PostgreSQL',
      'WebSockets',
      'Shopify',
    ],
    provenance: 'verified',
  },
  {
    slug: 'bzu',
    company: 'Bahauddin Zakariya University · Multan',
    role: 'BS Information Technology',
    period: 'Aug 2019 — Jun 2023',
    startIso: '2019-08',
    endIso: '2023-06',
    summary: 'Software development, networking and database management.',
    responsibilities: [],
    impact: [],
    technologies: [],
    provenance: 'verified',
  },
];

export const experience = parseExperience(entries);
