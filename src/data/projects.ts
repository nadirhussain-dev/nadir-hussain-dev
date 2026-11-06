import { parseProjects, type Project } from '@/types/project';

/**
 * Project case studies.
 *
 * Sources: Nadir's CV for client work, and each repository's own README and
 * docs for personal products. Statuses are copied from those READMEs and are
 * deliberately unflattering where they are: "pilot" means pilot.
 *
 * Client work does not name unlisted clients and never links private code.
 * Entries still marked needs-confirmation stay out of production.
 */
const entries: Project[] = [
  {
    slug: 'payments-platform',
    name: 'Multi-provider payments platform',
    summary:
      'Subscriptions, holds, refunds and fundraising on one payment layer, across a web app and an admin backoffice.',
    period: 'Client work · Devnodes',
    role: 'Frontend Engineer, owning features through the API contract',
    problem:
      'A product needed subscriptions, installments, wallet adjustments and campaign contributions, without tying its business logic to a single payment provider.',
    constraints: [
      'Money movement has to be auditable after the fact',
      'Providers send events late, repeatedly and out of order',
      'The web app and the backoffice consume the same API',
    ],
    architecture:
      'A Next.js and NestJS monorepo. Providers sit behind an adapter layer, 25+ REST endpoints serve both clients, and Stripe events arrive through a verified webhook pipeline.',
    architectureNodes: [
      'Web + backoffice',
      'REST API',
      'Adapter layer',
      'Stripe / Paystack',
      'Webhooks',
      'Ledger',
    ],
    decisions: [
      {
        choice: 'A provider-agnostic adapter layer',
        insteadOf: 'calling the Stripe SDK from business logic',
        because:
          'A gateway such as Paystack can be onboarded without changing core logic.',
      },
      {
        choice: 'Dual approval for payment holds',
        insteadOf: 'a single admin action',
        because:
          'Create, second-admin approval, then release or auto-expiry leaves a compliance-audited ledger entry at each step.',
      },
      {
        choice: 'Optimistic subscription UI with automatic rollback',
        insteadOf: 'blocking on every server response',
        because:
          'Plan changes feel immediate, and a failure restores the true state through domain-sync hooks in Zustand.',
      },
    ],
    challenges: [
      'Handling replayed and duplicated webhooks safely, using HMAC verification, replay protection and idempotency keys',
      'Covering the full subscription lifecycle: trials, upgrades, downgrades, grace periods and cancellation',
    ],
    outcome:
      'In use across the web app and backoffice, covering checkout, subscriptions, installments, holds, reconciliation and campaign milestones triggered by confirmed contributions.',
    stack: [
      'TypeScript',
      'Next.js',
      'NestJS',
      'Stripe',
      'Paystack',
      'Zustand',
      'PostgreSQL',
    ],
    provenance: 'verified',
  },
  {
    slug: 'trek-train',
    name: 'Trek Train',
    summary:
      'A rail booking app: live timetables, seat reservation, in-app checkout and arrival alerts.',
    period: 'Client work · Devnodes',
    role: 'Frontend Engineer',
    problem:
      'Passengers needed to search trains, reserve a seat and pay from a phone, while many people competed for the same seats.',
    constraints: [
      'Simultaneous sessions must never double-book a seat',
      'First-run sign-up had to work by phone, email or Google',
    ],
    architecture:
      'A mobile app over real-time timetable queries and conflict-safe seat locking, with Paystack in a WebView and webhooks confirming each transaction.',
    architectureNodes: [
      'Mobile app',
      'Search + seat lock',
      'Paystack WebView',
      'Webhooks',
      'Notifications',
    ],
    decisions: [
      {
        choice: 'Webhook listeners as the record of payment',
        insteadOf: 'trusting the checkout screen’s result',
        because:
          'Ticket fulfilment follows the real-time transaction update from the provider.',
      },
    ],
    challenges: [
      'Concurrent seat locking under heavy passenger traffic',
      'An onboarding flow with OTP, terms and GPS city detection that still feels short',
    ],
    outcome:
      'Shipped booking, onboarding, payments, booking confirmations and alerts 30 minutes before a train arrives.',
    stack: ['React Native', 'TypeScript', 'Paystack'],
    provenance: 'verified',
  },
  {
    slug: 'daynora',
    name: 'Daynora',
    summary:
      'A calm, local-first home for habits, tasks, journal, budget and more, on phone and web, in four languages.',
    period: '2026 · Personal product',
    role: 'Solo builder',
    problem:
      'Life apps scatter across a dozen subscriptions and stop working without signal. Daynora keeps habits, notes, sleep, budget and split expenses in one calm place.',
    constraints: [
      'Phone and web must agree on data without a server in the middle of every write',
      'Every string ships in English, Urdu, Hindi and Arabic',
      'Solo-operated, so operator tooling and permissions had to be built in',
    ],
    architecture:
      'A monorepo of Expo, Next.js and a Vite admin PWA. Shared packages hold the local SQLite schema, domain logic, translations and the sync engine, over Supabase.',
    architectureNodes: [
      'Expo + web',
      'Local SQLite',
      'Sync engine',
      'Supabase Postgres',
      'Admin PWA',
    ],
    decisions: [
      {
        choice: 'One sync engine and schema package, shared by phone and web',
        insteadOf: 'a separate implementation per client',
        because:
          'Push, pull, cursors and conflicts have one definition, so clients cannot drift.',
      },
      {
        choice: 'Staff permissions enforced in Postgres',
        insteadOf: 'checking roles only in the admin UI',
        because: 'A permission holds no matter which client reaches the database.',
      },
      {
        choice: 'Append-only migrations',
        insteadOf: 'editing applied ones',
        because:
          'Every environment can replay the same history. The repo holds 100+ of them, tested against a real Postgres.',
      },
    ],
    challenges: [
      'Sync conflicts across devices with offline writes',
      'Keeping one React version across React Native and web in the same monorepo',
    ],
    outcome:
      'Android builds, web app and operator console built, with staging running Safepay in sandbox. Heading toward launch.',
    stack: [
      'React Native',
      'Expo',
      'Next.js',
      'TypeScript',
      'Supabase',
      'PostgreSQL',
      'Safepay',
    ],
    provenance: 'verified',
  },
  {
    slug: 'skolara',
    name: 'Skolara',
    summary:
      'Multi-tenant school management for South Asia: fees, attendance, exams and parent communication.',
    period: '2026 · Personal product',
    role: 'Solo builder',
    problem:
      'Small private schools are priced out of modern software, and the market hides pricing behind “book a demo”.',
    constraints: [
      'One school must never see another school’s data',
      'A person can be a parent at one school and a teacher at another',
      'Urdu with right-to-left layout, alongside English',
    ],
    architecture:
      'Turborepo with a NestJS and Prisma API as the only path to the database, Next.js dashboards and one Expo app for four roles, sharing Zod contracts.',
    architectureNodes: [
      'Web + Expo',
      'Typed API client',
      'NestJS API',
      'Prisma',
      'PostgreSQL',
    ],
    decisions: [
      {
        choice: 'Emails unique per school',
        insteadOf: 'globally unique accounts',
        because:
          'The same person can hold different roles at different schools. An ambiguous login is rejected rather than guessed.',
      },
      {
        choice: 'Tenant scoping from the JWT, with RLS and no policies behind it',
        insteadOf: 'relying on a single layer',
        because:
          'Every query is scoped in the service layer, and direct database access has a second line of defence.',
      },
    ],
    challenges: [
      'Subdomain tenancy with reserved hosts and a local setup that needs no DNS',
    ],
    outcome:
      'Runs end to end from a clean checkout, including Claude-assisted report-card comments and fee-defaulter risk.',
    stack: [
      'Next.js',
      'NestJS',
      'React Native',
      'Expo',
      'Prisma',
      'PostgreSQL',
      'Docker',
    ],
    provenance: 'verified',
  },
  {
    slug: 'snapfind',
    name: 'SnapFind',
    summary:
      'One link for an event: each guest takes a selfie and sees only the photos they appear in.',
    period: '2026 · Pilot',
    role: 'Solo builder',
    problem:
      'Event photographers hand over thousands of photos, and guests scroll through all of them to find themselves.',
    constraints: [
      'Faces are biometric data, including faces of people who never open the link',
      'Pilot scale on CPU: 2,000–8,000 photos and 100–500 guests',
    ],
    architecture:
      'Next.js guest app and organiser dashboard over FastAPI, with a background worker detecting and embedding every face behind a swappable FaceEngine.',
    architectureNodes: [
      'Guest selfie',
      'Liveness check',
      'FastAPI',
      'Face worker',
      'Event-scoped match',
    ],
    decisions: [
      {
        choice: 'Biometrics scoped to one event and deleted with it',
        insteadOf: 'a reusable cross-event face index',
        because:
          'It limits exposure, and any person can ask to have their face removed from an event.',
      },
      {
        choice: 'Matching a selfie against clusters of faces',
        insteadOf: 'searching every face vector',
        because:
          'Clusters also find side angles the selfie alone would miss, and shrink the search.',
      },
      {
        choice: 'Raw selfies kept in memory only',
        insteadOf: 'storing them',
        because: 'Verification needs the frames for one request, not forever.',
      },
    ],
    challenges: ['Calibrating thresholds on real event photos rather than benchmarks'],
    outcome: 'In pilot. The first real event is a wedding in November 2026.',
    stack: ['Next.js', 'Python', 'FastAPI', 'PostgreSQL', 'Docker'],
    provenance: 'verified',
  },
  {
    slug: 'tessera',
    name: 'Tessera',
    summary:
      'A hex-grid reward game on Telegram, iOS and Android, over one authoritative core.',
    period: '2026 · Personal product',
    role: 'Solo builder',
    problem:
      'In a game with withdrawable rewards, any client that can compute a balance is a client that can be cheated.',
    constraints: [
      'Rewards must stay hidden until earned',
      'Three surfaces must never disagree about a tile',
    ],
    architecture:
      'Pure TypeScript rules in a core package, an append-only double-entry ledger in Postgres, and Edge Functions as the only code allowed to seal a board.',
    architectureNodes: [
      'Mini App + Expo',
      'open_hex',
      'Edge Functions',
      'Double-entry ledger',
    ],
    decisions: [
      {
        choice: 'Balances as read-only projections of a ledger',
        insteadOf: 'a mutable balance column',
        because:
          'Triggers reject UPDATE and DELETE on entries, so history cannot be rewritten.',
      },
      {
        choice: 'Sealed boards, revealed one validated tap at a time',
        insteadOf: 'sending rewards to the client',
        because:
          'A test asserts the serialised payload contains no reward before play.',
      },
    ],
    challenges: [
      'Withdrawal reserves, which forced the ledger to represent negative deltas correctly',
    ],
    outcome:
      'Three surfaces, withdrawals with reserve semantics, a role-checked admin console and a referral tree, verified against real Postgres.',
    stack: ['Next.js', 'React Native', 'Expo', 'TypeScript', 'Supabase', 'PostgreSQL'],
    provenance: 'verified',
  },
  {
    slug: 'engforge',
    name: 'EngForge',
    summary:
      'An engineering career OS: roadmaps, mastery backed by evidence, interview simulation and a failure-to-skill loop.',
    period: '2026 · Personal product',
    role: 'Solo builder',
    problem:
      'Course platforms measure lessons finished. Hiring measures capability against a target role.',
    constraints: [
      'Every score must trace back to a scored attempt',
      'Interview transcripts and notebooks must stay private, even from admins',
    ],
    architecture:
      'Next.js 16 over Supabase with about 60 tables, RLS forced on every one, and an append-only skill_evidence ledger that mastery can be rebuilt from.',
    architectureNodes: [
      'Next.js',
      'Domain engines',
      'skill_evidence',
      'Postgres + RLS',
    ],
    decisions: [
      {
        choice: 'A deterministic roadmap engine',
        insteadOf: 'letting an LLM choose the syllabus',
        because:
          'Plans come from a skill graph and a constraint solver. The LLM only writes the framing.',
      },
    ],
    challenges: [
      'Privacy enforced at the RLS layer, so admin tooling is limited to aggregate tables',
    ],
    outcome: 'Fourteen build phases done, with hardening still partial.',
    stack: ['Next.js', 'TypeScript', 'Supabase', 'PostgreSQL'],
    source: 'https://github.com/nadirhussain-dev/DevForge',
    provenance: 'verified',
  },
  {
    slug: 'devsprint',
    name: 'DevSprint 60',
    summary:
      'A 60-day mid-to-senior interview tracker that measures readiness by what you can demonstrate.',
    period: '2026 · Personal product',
    role: 'Solo builder',
    problem:
      'Ticking boxes feels like progress. It does not tell you whether you can pass the interview.',
    constraints: ['Readiness has to be earned with evidence, not checkboxes'],
    architecture:
      'Next.js 15 Server Components and Server Actions over Supabase, installable as a PWA with Web Push reminders.',
    architectureNodes: ['Next.js PWA', 'Server Actions', 'Supabase', 'Web Push'],
    decisions: [
      {
        choice: 'Spaced repetition on 1, 3, 7, 14 and 30 days',
        insteadOf: 'a fixed revision list',
        because: 'Weak topics return on a schedule, triggered by low simulator scores.',
      },
    ],
    challenges: [],
    outcome:
      'Built with 60 days across 9 phases, a question bank, coding challenges and 10 system designs.',
    stack: ['Next.js', 'TypeScript', 'Supabase', 'PostgreSQL'],
    source: 'https://github.com/nadirhussain-dev/dev-sprint',
    provenance: 'verified',
  },
];

export const projects = parseProjects(entries);
