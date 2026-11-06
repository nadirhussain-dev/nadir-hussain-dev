'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { MonoLabel } from '@/components/ui/mono-label';
import { CharacterArt } from './character-art';

/** How far the pupils may travel, in SVG units, before they leave the eye. */
const MAX_LOOK = 5;

/**
 * The side image.
 *
 * The photo arrives as `children` from a Server Component, so "meet the real
 * one" swaps between two things already in the document instead of fetching.
 */
export function HeroCharacter({
  imageSrc,
  children,
}: {
  imageSrc: string | null;
  children: React.ReactNode;
}) {
  const [showPhoto, setShowPhoto] = useState(false);
  const [happy, setHappy] = useState(false);
  const stage = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || imageSrc !== null) return;
    let frame = 0;

    const onMove = (event: PointerEvent): void => {
      if (frame !== 0) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const element = stage.current;
        if (!element) return;
        const box = element.getBoundingClientRect();
        const dx = event.clientX - (box.left + box.width / 2);
        const dy = event.clientY - (box.top + box.height * 0.33);
        const distance = Math.hypot(dx, dy) || 1;
        const reach = Math.min(distance / 180, 1) * MAX_LOOK;
        element.style.setProperty('--look-x', `${(dx / distance) * reach}px`);
        element.style.setProperty('--look-y', `${(dy / distance) * reach * 0.5}px`);
      });
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      if (frame !== 0) cancelAnimationFrame(frame);
    };
  }, [reducedMotion, imageSrc]);

  return (
    <div className="w-full max-w-md">
      <div
        ref={stage}
        onPointerEnter={() => setHappy(true)}
        onPointerLeave={() => setHappy(false)}
        hidden={showPhoto}
      >
        {imageSrc === null ? (
          <CharacterArt
            mood={happy ? 'happy' : 'idle'}
            title="Illustration of Nadir Hussain working on a laptop"
          />
        ) : (
          // Decorative size is unknown until the file exists, so a plain img
          // keeps the slot usable without a configured width and height.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageSrc}
            alt="Illustration of Nadir Hussain"
            className="h-auto w-full"
          />
        )}
      </div>

      <div hidden={!showPhoto}>{children}</div>

      <div className="mt-3 flex justify-center">
        <button
          type="button"
          onClick={() => setShowPhoto((value) => !value)}
          className="min-h-9 rounded-sm px-2 transition-colors duration-(--duration-quick) hover:text-paper-100"
        >
          <MonoLabel tone="flow">
            {showPhoto ? 'back to the drawing' : 'meet the real one'}
          </MonoLabel>
        </button>
      </div>
    </div>
  );
}
