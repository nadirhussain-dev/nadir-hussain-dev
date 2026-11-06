import { describe, expect, it } from 'vitest';
import { collectedCount, roadPosition, stationAt, stationX } from './world';

describe('roadPosition', () => {
  it('stays at the start before the game and at the end after it', () => {
    expect(roadPosition(-50, 0, 1000, 5)).toBe(0);
    expect(roadPosition(5000, 0, 1000, 5)).toBe(stationX(4));
  });

  it('is proportional to scroll inside the game', () => {
    expect(roadPosition(500, 0, 1000, 5)).toBe(stationX(4) / 2);
  });

  it('does not divide by zero on an unmeasured page', () => {
    expect(roadPosition(100, 0, 0, 5)).toBe(0);
  });
});

describe('stationAt', () => {
  it('reaches a stop slightly before arriving', () => {
    expect(stationAt(600, 5)).toBe(0);
    expect(stationAt(750, 5)).toBe(1);
  });

  it('never passes the last stop', () => {
    expect(stationAt(99999, 5)).toBe(4);
  });
});

describe('collectedCount', () => {
  const stations = [{}, { slug: 'a' }, {}, { slug: 'b' }];

  it('counts only chests already reached', () => {
    expect(collectedCount(stations, 0)).toBe(0);
    expect(collectedCount(stations, 1)).toBe(1);
    expect(collectedCount(stations, 3)).toBe(2);
  });
});
