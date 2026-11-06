'use client';

import { SquareTerminal } from 'lucide-react';

export const TERMINAL_EVENT = 'nadir:terminal';

export function TerminalButton() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(TERMINAL_EVENT))}
      className="inline-flex min-h-11 items-center gap-2 rounded-sm border border-rule bg-ink-850 px-4 font-mono text-meta text-paper-200 transition-colors duration-(--duration-quick) hover:border-rule-strong"
    >
      <SquareTerminal aria-hidden="true" className="size-4" />
      Open terminal
    </button>
  );
}
