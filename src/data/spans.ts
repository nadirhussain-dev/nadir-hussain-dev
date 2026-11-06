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
  { id: 'work', label: 'Work', heading: 'Things I’ve built' },
  { id: 'timeline', label: 'About', heading: 'Three years of shipping' },
  { id: 'stack', label: 'Stack', heading: 'What’s on the shelf' },
  { id: 'fit', label: 'Role match', heading: 'Hiring? Paste your job description' },
  { id: 'playground', label: 'Lab', heading: 'Break my payment system' },
  { id: 'contact', label: 'Contact', heading: 'Let’s build something' },
] as const;
