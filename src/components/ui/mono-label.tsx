import { cn } from '@/lib/utils';

interface MonoLabelProps extends React.ComponentPropsWithoutRef<'span'> {
  children: React.ReactNode;
  /** `signal` marks live/active state. `flow` marks data. Default is muted. */
  tone?: 'muted' | 'signal' | 'flow';
}

const TONE_CLASS = {
  muted: 'text-paper-500',
  signal: 'text-signal',
  flow: 'text-flow',
} as const;

/**
 * Monospaced metadata label.
 *
 * Mono is used here as a typographic device rather than as "code styling" —
 * it marks anything that is machine-ish: span ids, counts, keys, statuses.
 * Keeping that rule consistent is what makes the site read as instrumentation.
 */
export function MonoLabel({ children, tone = 'muted', className }: MonoLabelProps) {
  return (
    <span
      className={cn(
        'font-mono text-micro tracking-[0.08em] uppercase',
        TONE_CLASS[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
