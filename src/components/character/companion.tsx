'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import { X } from 'lucide-react';
import type { SpanId } from '@/data/spans';
import { useTraceProgress } from '@/hooks/use-trace-progress';
import { MonoLabel } from '@/components/ui/mono-label';

/** Fired by the simulator, so the character can react to a live failure. */
export const BREAKER_EVENT = 'nadir:breaker';

const STORAGE_KEY = 'companion-dismissed';

const LINES: Readonly<Record<SpanId, string | null>> = {
  identity: null,
  systems: 'Click a node. I like to explain the boring parts.',
  work: 'Open one. The rejected options are the good bit.',
  fit: 'Paste a job description. I’ll show proof, and admit the gaps.',
  timeline: 'Three-plus years at Devnodes and counting.',
  stack: 'Grouped by layer, because that’s how I think.',
  playground: 'Go on, break the payment processor.',
  contact: 'You made it to the end. Say hello?',
};

const subscribeToNothing = (): (() => void) => () => undefined;

const readDismissed = (): boolean => {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    return false;
  }
};

const ALARM_LINE = 'Breaker’s open! That’s it protecting the processor.';

/**
 * The character walking the page with you.
 *
 * Hidden on the hero, where the full drawing is already on screen, and below
 * the lg breakpoint, where it would sit on top of the content. The bubble fades
 * after a few seconds so it never covers the page for long, and hovering the
 * avatar brings it back. Dismissal is remembered per visitor, and storage
 * failures simply mean it comes back.
 */
export function Companion() {
  const { activeId } = useTraceProgress();
  const [alarm, setAlarm] = useState(false);
  const [hidden, setHidden] = useState(false);
  const stored = useSyncExternalStore(subscribeToNothing, readDismissed, () => true);
  const dismissed = hidden || stored;

  useEffect(() => {
    const onBreaker = (event: Event): void => {
      setAlarm((event as CustomEvent<string>).detail === 'open');
    };
    window.addEventListener(BREAKER_EVENT, onBreaker);
    return () => window.removeEventListener(BREAKER_EVENT, onBreaker);
  }, []);

  const line =
    alarm && activeId === 'playground' ? ALARM_LINE : activeId && LINES[activeId];
  if (dismissed || !line) return null;

  const dismiss = (): void => {
    setHidden(true);
    try {
      window.localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      // Private mode: it stays dismissed until the next visit.
    }
  };

  return (
    <aside
      aria-label="Page guide"
      className="nadir-companion fixed right-5 bottom-5 z-30 hidden max-w-72 items-end gap-3 lg:flex"
    >
      <div
        key={line}
        className="nadir-bubble rule-frame relative rounded-sm border border-rule bg-ink-850 py-2.5 pr-8 pl-3"
      >
        <MonoLabel tone={alarm ? 'signal' : 'flow'} className="mb-1 block">
          nadir
        </MonoLabel>
        <p className="text-meta text-pretty text-paper-200">{line}</p>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Hide the guide"
          className="absolute top-1.5 right-1.5 grid size-6 place-items-center text-paper-500 hover:text-paper-100"
        >
          <X aria-hidden="true" className="size-3.5" />
        </button>
      </div>
      <div
        data-alarm={alarm}
        className="nadir-avatar size-16 shrink-0 overflow-hidden rounded-full border border-signal bg-ink-800"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/character/nadir-avatar.webp"
          alt=""
          className="size-full object-cover"
        />
      </div>
    </aside>
  );
}
