'use client';

import { useEffect, useRef, useState } from 'react';
import { runCommand, type TerminalContext } from '@/lib/terminal/commands';
import { TERMINAL_EVENT } from './terminal-button';

interface Row {
  id: number;
  text: string;
  kind: 'input' | 'output';
}

const WELCOME = ['Welcome to nadir.sh. Type help, or try: ls'];

/**
 * A real command line for the site.
 *
 * A native <dialog> gives focus trapping, Escape to close and an inert page
 * behind it for free. Ctrl/Cmd+K opens it from anywhere.
 */
export function Terminal({ context }: { context: TerminalContext }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const log = useRef<HTMLDivElement>(null);
  const nextId = useRef(WELCOME.length);
  const [value, setValue] = useState('');
  const [history, setHistory] = useState<readonly string[]>([]);
  const [cursor, setCursor] = useState<number | null>(null);
  const [rows, setRows] = useState<readonly Row[]>(
    WELCOME.map((text, id) => ({ id, text, kind: 'output' })),
  );

  useEffect(() => {
    const open = (): void => {
      const element = dialog.current;
      if (!element) return;
      if (element.open) element.close();
      else {
        element.showModal();
        input.current?.focus();
      }
    };
    const onKey = (event: KeyboardEvent): void => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        open();
      }
    };
    window.addEventListener(TERMINAL_EVENT, open);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener(TERMINAL_EVENT, open);
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  useEffect(() => {
    log.current?.scrollTo({ top: log.current.scrollHeight });
  }, [rows]);

  const submit = (): void => {
    const output = runCommand(value, context);
    const added: Row[] = [
      { id: nextId.current++, text: value, kind: 'input' },
      ...output.lines.map((text): Row => ({
        id: nextId.current++,
        text,
        kind: 'output',
      })),
    ];

    setRows((current) =>
      output.action?.type === 'clear' ? [] : [...current, ...added],
    );
    if (value.trim() !== '') setHistory((current) => [...current, value]);
    setCursor(null);
    setValue('');

    const action = output.action;
    if (action?.type === 'close') dialog.current?.close();
    if (action?.type === 'open') window.open(action.href, '_blank', 'noopener');
    if (action?.type === 'navigate') {
      dialog.current?.close();
      window.location.hash = action.href;
    }
  };

  const recall = (direction: -1 | 1): void => {
    if (history.length === 0) return;
    const start = cursor ?? history.length;
    const next = Math.min(Math.max(start + direction, 0), history.length);
    setCursor(next === history.length ? null : next);
    setValue(history[next] ?? '');
  };

  return (
    <dialog
      ref={dialog}
      aria-label="Terminal"
      className="m-auto w-[min(44rem,calc(100vw-2rem))] rounded-sm border border-rule-strong bg-ink-900 p-0 text-paper-200 backdrop:bg-ink-950/70"
      onClick={(event) => {
        if (event.target === dialog.current) dialog.current?.close();
      }}
    >
      <div className="flex items-center justify-between border-b border-rule px-4 py-2 font-mono text-micro text-paper-500">
        <span>nadir.sh</span>
        <span>esc to close</span>
      </div>
      <div
        ref={log}
        role="log"
        aria-live="polite"
        className="h-80 overflow-y-auto px-4 py-3 font-mono text-meta"
      >
        {rows.map((row) => (
          <p
            key={row.id}
            className={
              row.kind === 'input'
                ? 'mt-2 break-words whitespace-pre-wrap text-signal'
                : 'break-words whitespace-pre-wrap text-paper-300'
            }
          >
            {row.kind === 'input' ? `$ ${row.text}` : row.text}
          </p>
        ))}
      </div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
        className="flex items-center gap-2 border-t border-rule px-4 py-3 font-mono text-meta"
      >
        <span aria-hidden="true" className="text-signal">
          $
        </span>
        <input
          ref={input}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
              event.preventDefault();
              recall(event.key === 'ArrowUp' ? -1 : 1);
            }
          }}
          aria-label="Command"
          autoComplete="off"
          autoCapitalize="none"
          spellCheck={false}
          className="min-w-0 flex-1 bg-transparent text-base text-paper-100 outline-none! sm:text-meta"
        />
      </form>
    </dialog>
  );
}
