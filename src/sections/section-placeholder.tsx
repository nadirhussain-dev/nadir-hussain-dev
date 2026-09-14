import { MonoLabel } from '@/components/ui/mono-label';

/**
 * Temporary body for spans whose real section has not landed yet.
 *
 * Deliberately explicit rather than lorem ipsum: an unbuilt section should
 * look unbuilt, so it is never mistaken for finished work in review.
 */
export function SectionPlaceholder({ note }: { note: string }) {
  return (
    <div className="rule-frame px-6 py-10">
      <MonoLabel tone="signal">not yet implemented</MonoLabel>
      <p className="mt-3 max-w-prose text-paper-400">{note}</p>
    </div>
  );
}
