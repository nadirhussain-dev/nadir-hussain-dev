'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { BREAKER_EVENT } from '@/components/character/companion';
import { SPANS } from '@/data/spans';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { useTraceProgress } from '@/hooks/use-trace-progress';
import { STATIONS } from '@/lib/scene/stations';
import type { Stop } from '@/lib/scene/path';
import type { Studio } from './build-studio';

const subscribeToNothing = (): (() => void) => () => undefined;

const supportsWebGL = (): boolean => {
  try {
    return document.createElement('canvas').getContext('webgl2') !== null;
  } catch {
    return false;
  }
};

/** Below this width the page stacks, so the camera uses its portrait framings. */
const NARROW = 1024;

const measureStops = (): Stop[] => {
  const narrow = window.innerWidth < NARROW;
  const centre = window.innerHeight / 2;
  const stops: Stop[] = [];
  for (const span of SPANS) {
    const element = document.getElementById(span.id);
    if (!element) continue;
    const box = element.getBoundingClientRect();
    const top = box.top + window.scrollY;
    const station = STATIONS[span.id];
    stops.push({
      at:
        span.id === 'identity'
          ? 0
          : Math.max(top + Math.min(box.height / 2, centre) - centre, 1),
      pose: narrow ? station.narrow : station.wide,
    });
  }
  return stops.sort((a, b) => a.at - b.at);
};

/**
 * The room behind the page.
 *
 * The poster is real markup, present before any script runs, so the first
 * paint never waits for WebGL. three.js loads in its own chunk afterwards and
 * the canvas fades in over the poster. With reduced motion or no WebGL, the
 * poster simply stays: the picture is still complete without 3D.
 */
export function StudioCanvas() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const studio = useRef<Studio | null>(null);
  const [ready, setReady] = useState(false);
  const reducedMotion = useReducedMotion();
  const { activeId } = useTraceProgress();
  const webgl = useSyncExternalStore(subscribeToNothing, supportsWebGL, () => false);
  const enabled = webgl && !reducedMotion;

  useEffect(() => {
    if (!enabled || !canvas.current) return;
    const element = canvas.current;
    let cancelled = false;
    let instance: Studio | null = null;
    let frame = 0;

    const sync = (): void => {
      frame = 0;
      instance?.setStops(measureStops());
      instance?.resize();
    };
    const queueSync = (): void => {
      if (frame === 0) frame = requestAnimationFrame(sync);
    };
    const onScroll = (): void => instance?.setScroll(window.scrollY);
    const onPointer = (event: PointerEvent): void => {
      instance?.setPointer(
        (event.clientX / window.innerWidth) * 2 - 1,
        -((event.clientY / window.innerHeight) * 2 - 1),
      );
    };
    const onBreaker = (event: Event): void => {
      instance?.setAlarm((event as CustomEvent<string>).detail === 'open');
    };

    const observer = new ResizeObserver(queueSync);

    void import('./build-studio')
      .then(({ createStudio }) =>
        createStudio({
          canvas: element,
          lowPower: window.innerWidth < NARROW || navigator.hardwareConcurrency <= 4,
          onReady: () => {
            if (!cancelled) setReady(true);
          },
        }),
      )
      .then((created) => {
        if (cancelled) {
          created.dispose();
          return;
        }
        instance = created;
        studio.current = created;
        created.setStops(measureStops());
        created.setScroll(window.scrollY);
        observer.observe(document.body);
      })
      .catch(() => {
        // A lost context or blocked chunk leaves the poster in place.
      });

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pointermove', onPointer, { passive: true });
    window.addEventListener(BREAKER_EVENT, onBreaker);

    return () => {
      cancelled = true;
      if (frame !== 0) cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener(BREAKER_EVENT, onBreaker);
      instance?.dispose();
      studio.current = null;
    };
  }, [enabled]);

  useEffect(() => {
    if (activeId) studio.current?.setMonitor(STATIONS[activeId].monitor);
  }, [activeId]);

  return (
    <div aria-hidden="true" className="studio-stage">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/character/nadir-scene.webp" alt="" className="studio-poster" />
      {enabled && <canvas ref={canvas} className="studio-canvas" data-ready={ready} />}
      <div className="studio-veil" />
    </div>
  );
}
