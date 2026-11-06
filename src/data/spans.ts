/**
 * The page, in order. Navigation and the sitemap derive from this list, and
 * `app/page.tsx` must supply a section for every id.
 */
export type SpanId =
  'identity' | 'work' | 'timeline' | 'stack' | 'fit' | 'playground' | 'contact';

export interface Span {
  id: SpanId;
  /** Short name for the navigation. */
  label: string;
  heading: string;
}

export const SPANS: readonly Span[] = [
  { id: 'identity', label: 'Home', heading: 'Nadir Hussain' },
  { id: 'work', label: 'Work', heading: 'Quest log' },
  { id: 'timeline', label: 'About', heading: 'My character' },
  { id: 'stack', label: 'Stack', heading: 'Power-ups' },
  { id: 'fit', label: 'Role match', heading: 'Hiring? Paste your job description' },
  { id: 'playground', label: 'Lab', heading: 'Fight the Timeout Monster' },
  { id: 'contact', label: 'Contact', heading: 'Let’s build something' },
] as const;
