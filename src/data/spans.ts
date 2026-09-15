/**
 * The trace spine.
 *
 * The site is structured as a single traced request resolving through a
 * system, where each section is a span. This registry is the single source of
 * truth for section identity, order and depth — the navigation rail, the
 * scroll observer, the skip links and the sitemap all derive from it, so
 * section order can never drift between them.
 */
export type SpanId =
  'identity' | 'systems' | 'work' | 'timeline' | 'stack' | 'playground' | 'contact';

export interface Span {
  id: SpanId;
  /** Rendered in the rail, in mono. */
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
  { id: 'identity', label: 'resolve/identity', heading: 'Identity', depth: 0 },
  {
    id: 'systems',
    label: 'trace/systems',
    heading: 'How I think about systems',
    depth: 0,
  },
  { id: 'work', label: 'query/work', heading: 'Selected work', depth: 1 },
  { id: 'timeline', label: 'query/history', heading: 'Trajectory', depth: 1 },
  { id: 'stack', label: 'inspect/stack', heading: 'Stack, by layer', depth: 0 },
  {
    id: 'playground',
    label: 'simulate/payments',
    heading: 'Resilience simulator',
    depth: 0,
  },
  { id: 'contact', label: 'open/channel', heading: 'Get in touch', depth: 0 },
] as const;
