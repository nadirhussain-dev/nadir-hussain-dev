'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/hooks/use-reduced-motion';

const SIZES = '(min-width: 1280px) 100vh, (min-width: 768px) 100vw, 150vw';

/**
 * The character art, split into a back, middle and front layer that move at
 * different speeds with the pointer and the scroll. The depth comes from the
 * picture itself. Without motion it is simply the finished image.
 */
export function HeroStage() {
  const stage = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;
    let frame = 0;
    let pointerX = 0;
    let pointerY = 0;

    const apply = (): void => {
      frame = 0;
      const element = stage.current;
      if (!element) return;
      element.style.setProperty('--px', String(pointerX));
      element.style.setProperty('--py', String(pointerY));
      element.style.setProperty('--sy', String(Math.min(window.scrollY, 1200)));
    };
    const queue = (): void => {
      if (frame === 0) frame = requestAnimationFrame(apply);
    };
    const onPointer = (event: PointerEvent): void => {
      pointerX = -((event.clientX / window.innerWidth) * 2 - 1);
      pointerY = -((event.clientY / window.innerHeight) * 2 - 1);
      queue();
    };

    window.addEventListener('pointermove', onPointer, { passive: true });
    window.addEventListener('scroll', queue, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('scroll', queue);
      if (frame !== 0) cancelAnimationFrame(frame);
    };
  }, [reducedMotion]);

  return (
    <div ref={stage} className="hero-stage">
      <Image
        src="/art/scene-plate.webp"
        alt=""
        fill
        sizes={SIZES}
        priority
        className="hero-layer hero-plate"
      />
      <Image
        src="/art/scene-person.webp"
        alt="Illustration of Nadir Hussain at his desk in a black hoodie, arms folded, smiling"
        fill
        sizes={SIZES}
        priority
        className="hero-layer hero-person"
      />
      <Image
        src="/art/scene-front.webp"
        alt=""
        fill
        sizes={SIZES}
        priority
        className="hero-layer hero-front"
      />
    </div>
  );
}
