import { describe, expect, it } from 'vitest';
import { poseAt, smoothstep, type Pose } from './path';

const pose = (x: number): Pose => ({
  position: [x, 0, 0],
  target: [0, x, 0],
  shift: [x, 0],
});

const stops = [
  { at: 100, pose: pose(0) },
  { at: 200, pose: pose(10) },
  { at: 400, pose: pose(20) },
];

describe('poseAt', () => {
  it('clamps before the first stop and after the last', () => {
    expect(poseAt(stops, 0)).toEqual(pose(0));
    expect(poseAt(stops, 999)).toEqual(pose(20));
  });

  it('lands exactly on a stop', () => {
    expect(poseAt(stops, 200)).toEqual(pose(10));
  });

  it('is halfway at the midpoint of a segment', () => {
    expect(poseAt(stops, 300).position[0]).toBeCloseTo(15);
  });

  it('copes with two stops at the same scroll position', () => {
    const same = [
      { at: 100, pose: pose(1) },
      { at: 100, pose: pose(2) },
    ];
    expect(poseAt(same, 100).position[0]).toBe(1);
  });

  it('throws without stops', () => {
    expect(() => poseAt([], 0)).toThrow();
  });
});

describe('smoothstep', () => {
  it('is flat at both ends', () => {
    expect(smoothstep(-1)).toBe(0);
    expect(smoothstep(2)).toBe(1);
    expect(smoothstep(0.5)).toBe(0.5);
  });
});
