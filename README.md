# nadir-hussain.dev

Personal engineering portfolio for **Nadir Hussain**, Full-Stack Software Engineer.

The brief was not "a website with my projects on it". It was to build something
that answers a question before a visitor thinks to ask it: _how does this person
think about systems?_

## Concept: Nadir's Quest

The resume is a side-scrolling game. Scrolling drives Nadir's kart past his
university and Devnodes, opens a chest for each project, and ends at a castle
after the Timeout Monster. Arrow keys work too.

The same content follows in a normal resume, reached at any time with "Skip to
resume", so nobody has to play. Visitors who prefer reduced motion get the title
screen, then the resume.

- `src/data/quest.ts` is the road: every stop, in order.
- `src/lib/game/world.ts` turns scroll into road position. It is pure and tested.
- `src/components/game/` draws the world in CSS and SVG, with no game engine.

Also on the page: a role matcher that links job requirements to proof and lists
gaps (`src/lib/fit/`), a deterministic payments simulator (`src/lib/sim/`), and
a Ctrl/Cmd+K terminal (`src/lib/terminal/`).

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

Server Components by default. The game, quest log, role matcher, simulator
and terminal are client islands. Fonts are self-hosted from `src/fonts/`, so a
build needs no network access. Section order comes from `src/data/spans.ts`.

## Commands

```bash
pnpm dev             # dev server
pnpm verify          # typecheck + lint + test + build
pnpm test            # unit tests
pnpm content:audit   # unconfirmed content claims
```

## Still needed

The production domain and a Search Console token. Run `pnpm content:audit` for the current list.
