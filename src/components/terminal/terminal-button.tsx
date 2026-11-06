'use client';

import { SquareTerminal } from 'lucide-react';

export const TERMINAL_EVENT = 'nadir:terminal';

export function TerminalButton() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(TERMINAL_EVENT))}
      className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-rule-strong bg-ink-850/80 px-4 font-mono text-meta text-paper-100 transition-colors duration-(--duration-quick) hover:border-signal"
    >
      <SquareTerminal aria-hidden="true" className="size-4" />
      Open terminal
    </button>
  );
}
