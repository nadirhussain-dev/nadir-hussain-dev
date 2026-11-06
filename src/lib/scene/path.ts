export type Vec3 = readonly [number, number, number];

/** One camera framing. `shift` moves the picture on screen, as viewport fractions. */
export interface Pose {
  position: Vec3;
  target: Vec3;
  shift: readonly [number, number];
}

export interface Stop {
  /** Scroll position, in pixels, at which this framing is exact. */
  at: number;
  pose: Pose;
}

const mix = (a: number, b: number, t: number): number => a + (b - a) * t;

const mixVec = (a: Vec3, b: Vec3, t: number): Vec3 => [
  mix(a[0], b[0], t),
  mix(a[1], b[1], t),
  mix(a[2], b[2], t),
];

/** Eases in and out, so the camera settles at each stop rather than sliding past. */
export const smoothstep = (t: number): number => {
  const clamped = Math.min(Math.max(t, 0), 1);
  return clamped * clamped * (3 - 2 * clamped);
};

/**
 * The camera framing for a scroll position. Pure, so the whole flight path is
 * testable without a GPU. Stops must be sorted by `at`.
 */
export function poseAt(stops: readonly Stop[], at: number): Pose {
  const first = stops[0];
  const last = stops[stops.length - 1];
  if (!first || !last) throw new Error('poseAt needs at least one stop');
  if (at <= first.at) return first.pose;
  if (at >= last.at) return last.pose;

  const nextIndex = stops.findIndex((stop) => stop.at > at);
  const from = stops[nextIndex - 1] ?? first;
  const to = stops[nextIndex] ?? last;
  const t = smoothstep((at - from.at) / (to.at - from.at || 1));

  return {
    position: mixVec(from.pose.position, to.pose.position, t),
    target: mixVec(from.pose.target, to.pose.target, t),
    shift: [
      mix(from.pose.shift[0], to.pose.shift[0], t),
      mix(from.pose.shift[1], to.pose.shift[1], t),
    ],
  };
}
