import { cn } from '@/lib/utils';

interface LabelProps extends React.ComponentPropsWithoutRef<'span'> {
  children: React.ReactNode;
  /** `signal` marks live or active state, `flow` marks data. Default is muted. */
  tone?: 'muted' | 'signal' | 'flow';
}

const TONE_CLASS = {
  muted: 'text-paper-500',
  signal: 'text-signal',
  flow: 'text-flow',
} as const;

/** A small, plain label for readings and field names. */
export function MonoLabel({ children, tone = 'muted', className }: LabelProps) {
  return (
    <span className={cn('text-meta font-semibold', TONE_CLASS[tone], className)}>
      {children}
    </span>
  );
}
