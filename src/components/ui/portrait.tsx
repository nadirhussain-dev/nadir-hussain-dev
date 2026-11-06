import Image from 'next/image';
import { getPortraitStatus } from '@/lib/portrait';
import { site } from '@/data/site';
import { cn } from '@/lib/utils';

/** Nadir's photograph, shown as shot in a simple print frame. */
export function Portrait({
  className,
  lazy = false,
}: {
  className?: string;
  lazy?: boolean;
}) {
  const portrait = getPortraitStatus();

  if (!portrait.available) {
    return null;
  }

  return (
    <figure className={cn('m-0 rounded-sm bg-white p-3 pb-4 shadow-xl', className)}>
      <div className="relative aspect-4/5 w-full overflow-hidden">
        <Image
          src={portrait.src}
          alt={`${site.name}, ${site.role}`}
          fill
          sizes="18rem"
          priority={!lazy}
          className="object-cover"
        />
      </div>
    </figure>
  );
}
