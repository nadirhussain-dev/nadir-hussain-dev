/**
 * Skip link. Visually hidden until focused, then it lands in the top-left as a
 * real, legible control. The rail is a long list of in-page anchors, so
 * bypassing it matters more here than on a typical page.
 */
export function SkipLink() {
  return (
    <a
      href="#identity"
      className="sr-only rounded-sm bg-signal px-4 py-2 font-mono text-meta font-medium text-ink-950 focus-visible:not-sr-only focus-visible:fixed focus-visible:top-4 focus-visible:left-4 focus-visible:z-50"
    >
      Skip to content
    </a>
  );
}
