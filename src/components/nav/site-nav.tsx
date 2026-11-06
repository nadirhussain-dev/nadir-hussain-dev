'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { SPANS } from '@/data/spans';
import { TERMINAL_EVENT } from '@/components/terminal/events';

const LINKS = SPANS.filter((span) => span.id !== 'identity');

export function SiteNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b-[5px] border-night bg-coin text-night">
      <nav
        aria-label="Main"
        className="mx-auto flex min-h-14 max-w-6xl items-center gap-2 px-(--spacing-gutter)"
      >
        <a href="#resume" className="mr-auto font-display text-xl">
          Nadir Hussain
        </a>
        <ul className="hidden items-center gap-1 lg:flex">
          {LINKS.map((span) => (
            <li key={span.id}>
              <a
                href={`#${span.id}`}
                className="rounded-lg px-3 py-2 font-extrabold hover:bg-cream"
              >
                {span.label}
              </a>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() => window.dispatchEvent(new Event(TERMINAL_EVENT))}
          className="hidden rounded-lg px-3 py-2 font-extrabold hover:bg-cream lg:block"
        >
          Terminal
        </button>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? 'Close menu' : 'Open menu'}
          className="grid size-10 place-items-center rounded-lg lg:hidden"
        >
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </nav>
      {open && (
        <ul id="mobile-nav" className="border-t border-night/20 p-2 lg:hidden">
          {LINKS.map((span) => (
            <li key={span.id}>
              <a
                href={`#${span.id}`}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-3 font-semibold"
              >
                {span.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
