/**
 * The tour.
 *
 * Each section is a stop in the 3D studio. This registry is the single source of
 * truth for section identity, order and depth — the navigation rail, the
 * scroll observer, the skip links and the sitemap all derive from it, so
 * section order can never drift between them.
 */
export type SpanId =
  | 'identity'
  | 'systems'
  | 'work'
  | 'fit'
  | 'timeline'
  | 'stack'
  | 'playground'
  | 'contact';

export interface Span {
  id: SpanId;
  /** Rendered in the navigation. */
  label: string;
  /** Human heading for the section itself. */
  heading: string;
  /**
   * Nesting depth in the trace. Root spans sit flush; child spans indent,
   * the way a real span waterfall shows causal nesting.
   */
  depth: 0 | 1;
}

export const SPANS: readonly Span[] = [
  { id: 'identity', label: 'Home', heading: 'Identity', depth: 0 },
  {
    id: 'systems',
    label: 'Approach',
    heading: 'How I think about systems',
    depth: 0,
  },
  { id: 'work', label: 'Work', heading: 'Selected work', depth: 1 },
  { id: 'fit', label: 'Role match', heading: 'Check me against your role', depth: 1 },
  { id: 'timeline', label: 'Journey', heading: 'Trajectory', depth: 1 },
  { id: 'stack', label: 'Stack', heading: 'Stack, by layer', depth: 0 },
  {
    id: 'playground',
    label: 'Lab',
    heading: 'Resilience simulator',
    depth: 0,
  },
  { id: 'contact', label: 'Contact', heading: 'Get in touch', depth: 0 },
] as const;
