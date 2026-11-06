# nadir-hussain.dev

Personal engineering portfolio for **Nadir Hussain**, Full-Stack Software Engineer.

The brief was not "a website with my projects on it". It was to build something
that answers a question before a visitor thinks to ask it: _how does this person
think about systems?_

## Concept

The whole site is built from one picture: Nadir's character art.

- **Layered hero.** The art is split into back, middle and front layers in
  `public/art/`, which move at different speeds with the pointer and scroll.
- **Sampled palette.** Every colour comes from the art: wall, screen glow, desk,
  lamp and hoodie. See `src/styles/tokens.css`.
- **Projects as a book stack**, like the books on his desk. Each book opens in
  place to show the key decisions and the result.

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

Server Components by default. The hero parallax, books, role matcher, simulator
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
