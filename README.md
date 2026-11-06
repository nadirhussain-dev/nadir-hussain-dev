# nadir-hussain.dev

Personal engineering portfolio for **Nadir Hussain**, Full-Stack Software Engineer.

The brief was not "a website with my projects on it". It was to build something
that answers a question before a visitor thinks to ask it: _how does this person
think about systems?_

## Concept — "The Trace"

The site is structured as **a single traced request resolving through a system**.
Each section is a span; the navigation rail is the span waterfall.

This was chosen over the alternatives because the metaphor does real work rather
than decorating:

- the rail is simultaneously navigation, scroll progress and information
  hierarchy — three jobs, one element
- distributed tracing is native to the domain (scalable systems, payments), so
  the framing is honest rather than themed
- it degrades cleanly: with JavaScript disabled or motion reduced, the rail is
  still a working table of contents

A pan/zoom "blueprint canvas" was considered and rejected as the shell — it is
hostile on touch and effectively impossible to make keyboard-accessible. That
pattern survives only _inside_ the systems section, where it is scoped and
navigable.

## Two things worth opening the repo for

**The hero shows the trace of the request that delivered the page you are
looking at.** Real Navigation Timing measurements from the visitor's own
browser — DNS, TLS, request, response, DOM, paint, hydrate — not a mock and not
an animation on a loop. A portfolio claiming systems literacy should be able to
show its own request breakdown. The numbers stay honest even when unflattering.

**The playground is a deterministic payments simulation.** Set the traffic, then
break something: cold cache, slow database, processor timing out. The pipeline
responds honestly — queue depth grows, the circuit breaker trips on failure rate
over a rolling window, retries back off, and idempotency keys stop a duplicate
charge when an ambiguous timeout hid one that actually landed.

It lives in `src/lib/sim/` as pure TypeScript with no React, no DOM and no
timers, under 36 unit tests. Two of those tests found real modelling bugs, most
notably a circuit breaker that tripped on _consecutive_ failures and therefore
never opened under a 72% failure rate — exactly when it was needed.

## Three things nobody expects

**A drawn developer sits beside the headline.** `src/components/character/` is
plain inline SVG: it blinks, types, and its eyes follow the cursor. A smaller
version walks the page as a guide, and when the simulator's circuit breaker
opens, it panics. To use a finished illustration instead, drop
`public/character/nadir.png` in; the file is detected at build time.

**A real terminal.** Ctrl/Cmd+K opens it from anywhere. `ls`, `open tessera`,
`cv`, `contact` and a few others run through a pure, unit-tested interpreter in
`src/lib/terminal/`.

**The role matcher.** A recruiter pastes a job description and each requirement
is matched to work they can open, with gaps listed rather than hidden. It runs
in the browser, so nothing is sent or stored. See `src/lib/fit/`.

## Content integrity

Nothing on this site is invented. That is enforced structurally rather than by
convention: every factual claim in `src/data/` is a `Claim<T>` that must be
explicitly marked `verified` or `needs-confirmation`, with **no default**, so an
unmarked claim fails to compile.

Case studies and experience now come from Nadir's CV and his repositories'
READMEs. Anything unconfirmed is committed as a **draft whose fields hold
questions rather than answers**. `isPublishable` excludes them from the
production build entirely, so nothing unverified can ship — verified by asserting
against the production HTML, not assumed.

```bash
pnpm content:audit   # lists every claim still awaiting confirmation
```

## Architecture

```
src/
├── app/          Server Components by default; metadata, sitemap, robots, OG
├── components/   ui/ primitives, trace/ rail
├── sections/     one module per span
├── lib/
│   ├── sim/      pure-TS discrete-event simulation (no React, unit-tested)
│   ├── perf/     Navigation Timing → span waterfall (pure, unit-tested)
│   └── seo/      metadata and the structured-data entity graph
├── data/         typed, provenance-tracked content
├── hooks/        client-only behaviour
├── styles/       tokens, grid, grain, contrast tests
└── types/        content types (no zod) and schemas (zod, server only)
```

**Client islands only.** The rail, the systems graph and the simulator are
client components. Everything else renders on the server.

**Sections derive from one registry.** `SECTIONS` is typed as a total map over
`SpanId`, so adding a span without building its section is a type error, and
page order, rail order and sitemap order cannot drift.

## Performance

Client chunks were **696K**, down from 1.1M, after removing two dependencies that
were paying rent for nothing:

- `motion` backed a `Reveal` component that was never imported anywhere. Scroll
  reveals are now CSS scroll-driven animations — no dependency, no client
  component, and they run off the main thread. Where `animation-timeline` is
  unsupported, content is simply visible, which is the correct degradation.
- `zod` was reaching the browser because `types/content.ts` mixed helpers with
  schemas and a client component imported those helpers. Split.

The simulation state lives in a ref and the canvas reads it at 60fps; only the
numeric readout goes through React, five times a second.

## Accessibility

- The architecture map is a real tablist with roving tabindex: one tab stop,
  then arrow keys move through the diagram following the picture.
- The simulator's metrics are deliberately **not** a live region — they refresh
  five times a second, and announcing them would make the section unusable.
  Only the circuit breaker's discrete transitions are announced.
- Contrast is a **test**, parsed from the real tokens, asserted against both the
  ground and the lighter panel background. It caught a genuine AA failure.
- `prefers-reduced-motion` resolves to end states, never to hidden content.

## Commands

```bash
pnpm dev             # dev server
pnpm verify          # typecheck + lint + test + build
pnpm test            # unit tests
pnpm content:audit   # unconfirmed content claims
```

`scripts/prepare-portrait.mts` crops, adds synthetic depth of field to, and
compresses a camera original for the hero portrait slot.

## Still needed

The production domain and a Search Console token. Run `pnpm content:audit` for the current list.
