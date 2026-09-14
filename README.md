# nadir-hussain.dev

Personal engineering portfolio for **Nadir Hussain**, Full-Stack Software Engineer.

The brief was not "a website with my projects on it". The brief was to build
something that answers a question before it is asked: _how does this person
think about systems?_

## Concept — "The Trace"

The site is structured as **a single traced request resolving through a system**.
Each section is a span; the navigation rail is the span waterfall.

This was chosen over the alternatives because the metaphor does real work rather
than decorating:

- the rail is simultaneously navigation, scroll progress and information
  hierarchy — three jobs, one element
- distributed tracing is native to the domain (scalable systems, payments),
  so the framing is honest rather than themed
- it degrades cleanly: with JavaScript disabled or motion reduced, the rail is
  still a working table of contents

A pan/zoom "blueprint canvas" was considered and rejected as the shell — it is
hostile on touch and effectively impossible to make keyboard-accessible. That
pattern survives only _inside_ the systems section, where it is scoped and
navigable.

## Content integrity

Nothing on this site is invented. That is enforced structurally, not by
convention: every factual claim in `src/data/` is wrapped in a `Claim<T>` that
must be explicitly marked `verified` or `needsConfirmation`. There is no
default, so an unmarked claim fails to compile.

```bash
pnpm content:audit   # lists every claim still awaiting confirmation
```

## Architecture

```
src/
├── app/          Server Components by default; metadata, sitemap, robots
├── components/   ui/ primitives, trace/ rail
├── sections/     one module per span
├── lib/
│   ├── sim/      pure-TS discrete-event simulation (no React, unit-tested)
│   └── seo/      metadata construction
├── data/         typed, provenance-tracked content
├── hooks/        client-only behaviour
├── styles/       tokens, grid, grain
└── types/        content schemas
```

**Client islands only.** The trace rail, the systems graph, the simulator and
the cursor layer are client components. Everything else renders on the server.

**The simulator is pure TypeScript.** `lib/sim/` has no React, no DOM and no
timers, so the simulation is deterministic and unit-testable, and the render
layer is replaceable. This separation is the point, not an accident.

## Stack

Next.js 16 (App Router, Turbopack) · React 19.2 · TypeScript (strict, no `any`)
· Tailwind CSS 4 · Motion · Vitest

## Commands

```bash
pnpm dev             # dev server
pnpm verify          # typecheck + lint + test + build
pnpm content:audit   # unconfirmed content claims
```

## Status

Early. See the open pull request for progress against the section plan.
