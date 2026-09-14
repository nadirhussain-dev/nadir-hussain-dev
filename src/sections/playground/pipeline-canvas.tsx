'use client';

import { useCallback, useEffect, useRef } from 'react';
import type { SimState, Stage } from '@/lib/sim/types';

/**
 * Draws every in-flight request as a dot at its real position in the pipeline.
 *
 * These are not decorative particles. Each dot is one request, placed by the
 * stage it is actually in and how far through that stage it has travelled, and
 * coloured by whether it is on its first attempt, retrying, or parked behind an
 * open breaker. Watching the processor lane clog and the parked column grow is
 * the entire explanation of what a circuit breaker does.
 *
 * Canvas rather than DOM because this is hundreds of elements at 60fps, which
 * is exactly the threshold where DOM nodes stop being viable.
 */

const LANES: readonly { stage: Stage; label: string }[] = [
  { stage: 'service', label: 'service' },
  { stage: 'database', label: 'database' },
  { stage: 'psp', label: 'processor' },
  { stage: 'settling', label: 'settle' },
];

const COLORS = {
  normal: '#4fb3a8',
  retry: '#e8a33d',
  parked: '#d4553f',
  rule: 'rgba(244, 241, 236, 0.10)',
  label: 'rgba(244, 241, 236, 0.45)',
} as const;

/** Approximate full-stage durations, used only to place a dot within its lane. */
const STAGE_SCALE: Record<Stage, number> = {
  service: 8,
  database: 60,
  psp: 400,
  settling: 120,
  backoff: 300,
};

export function PipelineCanvas({
  onFrame,
  reducedMotion,
}: {
  onFrame: (callback: (state: SimState) => void) => void;
  reducedMotion: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const draw = useCallback((state: SimState): void => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;

    const { width, height } = canvas.getBoundingClientRect();
    if (width === 0 || height === 0) return;

    // Match the backing store to the device pixel ratio, or the dots render
    // soft on every retina display.
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    if (canvas.width !== Math.round(width * dpr)) {
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
    }
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    context.clearRect(0, 0, width, height);

    const padTop = 18;
    const padBottom = 8;
    const parkedWidth = Math.min(84, width * 0.22);
    const laneWidth = width - parkedWidth - 12;
    const laneHeight = (height - padTop - padBottom) / LANES.length;

    context.font =
      '10px var(--font-jetbrains-mono), ui-monospace, SFMono-Regular, monospace';
    context.textBaseline = 'middle';

    LANES.forEach((lane, index) => {
      const y = padTop + laneHeight * index + laneHeight / 2;

      context.strokeStyle = COLORS.rule;
      context.lineWidth = 1;
      context.beginPath();
      context.moveTo(0, Math.round(y) + 0.5);
      context.lineTo(laneWidth, Math.round(y) + 0.5);
      context.stroke();

      context.fillStyle = COLORS.label;
      context.fillText(lane.label, 0, y - laneHeight / 2 + 6);
    });

    // Parked column: work held behind an open breaker.
    context.strokeStyle = COLORS.rule;
    context.strokeRect(
      Math.round(laneWidth + 12) + 0.5,
      padTop - 12.5,
      Math.round(parkedWidth) - 1,
      height - padTop - padBottom + 4,
    );
    context.fillStyle = COLORS.label;
    context.fillText('parked', laneWidth + 18, padTop - 4);

    for (const request of state.active) {
      const laneIndex = LANES.findIndex((lane) => lane.stage === request.stage);
      // Backoff has no lane of its own; show it waiting at the processor.
      const index = laneIndex === -1 ? 2 : laneIndex;
      const y = padTop + laneHeight * index + laneHeight / 2;

      const scale = STAGE_SCALE[request.stage];
      const progress = Math.min(Math.max(1 - request.remaining / scale, 0), 1);

      context.fillStyle =
        request.stage === 'backoff' || request.attempts > 1
          ? COLORS.retry
          : COLORS.normal;
      context.beginPath();
      context.arc(progress * laneWidth, y, 1.9, 0, Math.PI * 2);
      context.fill();
    }

    // Parked requests, stacked so the column reads as depth.
    const columns = Math.max(Math.floor(parkedWidth / 7), 1);
    const parked = Math.min(state.queue.length, columns * 40);
    context.fillStyle = COLORS.parked;
    for (let index = 0; index < parked; index += 1) {
      const column = index % columns;
      const row = Math.floor(index / columns);
      const x = laneWidth + 18 + column * 7;
      const y = height - padBottom - 6 - row * 6;
      if (y < padTop) break;
      context.beginPath();
      context.arc(x, y, 1.9, 0, Math.PI * 2);
      context.fill();
    }
  }, []);

  useEffect(() => {
    onFrame(draw);
  }, [onFrame, draw]);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={
        reducedMotion
          ? 'Pipeline diagram. Each dot is one in-flight request. The figures below report the same state as text.'
          : 'Live pipeline diagram. Each dot is one in-flight request, positioned by the stage it is in. The figures below report the same state as text.'
      }
      className="block h-56 w-full sm:h-64"
    />
  );
}
