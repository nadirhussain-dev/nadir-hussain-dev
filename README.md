# nadir-hussain.dev

Personal engineering portfolio for **Nadir Hussain**, Full-Stack Software Engineer.

The brief was not "a website with my projects on it". It was to build something
that answers a question before a visitor thinks to ask it: _how does this person
think about systems?_

## Concept: the studio

The site is a tour of Nadir's developer studio, built from his character art.
A real-time 3D room sits behind the page, and scrolling flies the camera from
stop to stop: the neon sign, the monitor, the shelves, the book stack and the
robot. The monitor's text follows the section you are reading.

- **The character has depth.** The cut-out is pushed forward by a depth map in
  a vertex shader, so it shifts with the camera instead of reading as a flat
  sticker.
- **The room reacts.** When the simulator's circuit breaker opens, the neon and
  the robot's eyes turn red until it recovers.
- **No model files.** Geometry and textures are generated in code in
  `src/components/studio/build-studio.ts`.
- **The flight path is pure.** `src/lib/scene/path.ts` runs without a GPU and is
  unit-tested. Stops live in `src/lib/scene/stations.ts`.
- **It degrades cleanly.** three.js loads in its own lazy chunk, after a poster
  image. With reduced motion or no WebGL the poster stays. Weak devices drop
  resolution automatically.

## The simulator

The playground is a deterministic payments simulation. Set the traffic, then
break something: cold cache, slow database, processor timing out. Queue depth
grows, the circuit breaker trips on failure rate over a rolling window, retries
back off, and idempotency keys stop duplicate charges.

It lives in `src/lib/sim/` as pure TypeScript with no React, no DOM and no
timers, under unit tests.

## Other things worth trying

**A guide walks the page.** A small avatar of Nadir comments on each section,
and panics when the simulator's breaker opens.

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
├── components/   ui/ primitives, studio/ 3D scene, trace/ navigation
├── sections/     one module per tour stop
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

three.js is about 130KB gzipped and loads in its own chunk after first paint, so
the headline is static HTML and never waits for it. Rendering pauses in hidden
tabs, and resolution drops if a device cannot hold about 28fps.

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
