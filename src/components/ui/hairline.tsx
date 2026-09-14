import { cn } from '@/lib/utils';

/**
 * A single structural hairline.
 *
 * Separate component rather than a border utility because these lines carry
 * meaning in this design — they delineate the drawing sheet — and centralising
 * them keeps every rule on the site at exactly one weight and opacity.
 */
export function Hairline({
  orientation = 'horizontal',
  className,
}: {
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'block bg-rule',
        orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
        className,
      )}
    />
  );
}
