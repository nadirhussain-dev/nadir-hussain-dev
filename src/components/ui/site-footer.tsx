import { site } from '@/data/site';

export function SiteFooter() {
  return (
    <footer className="bg-night px-(--spacing-gutter) pb-8 text-meta text-white">
      <p className="mx-auto w-full max-w-6xl">
        © {new Date().getFullYear()} {site.name}
      </p>
    </footer>
  );
}
