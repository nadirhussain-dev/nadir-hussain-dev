/** Distance between stops on the road, in world pixels. */
export const STATION_GAP = 1000;

export const stationX = (index: number): number => index * STATION_GAP;

export const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

/**
 * Converts page scroll into distance along the road. Pure, so the whole
 * journey can be tested without a browser.
 */
export function roadPosition(
  scrollY: number,
  start: number,
  scrollLength: number,
  stationCount: number,
): number {
  if (scrollLength <= 0) return 0;
  const progress = clamp((scrollY - start) / scrollLength, 0, 1);
  return progress * stationX(stationCount - 1);
}

/** The stop the character has reached. A stop triggers just before arrival. */
export function stationAt(position: number, stationCount: number): number {
  const index = Math.floor((position + STATION_GAP * 0.3) / STATION_GAP);
  return clamp(index, 0, stationCount - 1);
}

/** Chests are collected for good, so reversing never loses progress. */
export function collectedCount(
  stations: readonly { slug?: string }[],
  furthestReached: number,
): number {
  return stations.slice(0, furthestReached + 1).filter((station) => station.slug)
    .length;
}
