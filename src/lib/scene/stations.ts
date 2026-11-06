import type { SpanId } from '@/data/spans';
import type { Pose } from './path';

export interface Station {
  wide: Pose;
  /** Phones are portrait, so framing moves the subject above the text. */
  narrow: Pose;
  /** Shown on the 3D monitor while this section is on screen. */
  monitor: readonly string[];
}

/** Where the camera goes for each section of the page. */
export const STATIONS: Readonly<Record<SpanId, Station>> = {
  identity: {
    wide: { position: [0.3, 2, 8.6], target: [0, 1.85, 0], shift: [0.21, 0.02] },
    narrow: { position: [0, 2, 5.4], target: [0, 1.65, 0], shift: [0, 0.2] },
    // Empty here: the monitor sits behind the headline on wide screens.
    monitor: [],
  },
  systems: {
    wide: { position: [-2.5, 3.5, 3.2], target: [-3.1, 3.7, -3.4], shift: [0, 0.2] },
    narrow: { position: [-3, 3.6, 3.8], target: [-3.1, 3.8, -3.4], shift: [0, 0.2] },
    monitor: ['Systems', 'that hold', 'under load'],
  },
  work: {
    wide: { position: [-1.9, 2.1, 2.9], target: [-3.2, 1.8, -1.6], shift: [0, 0.2] },
    narrow: { position: [-2.6, 2, 2.2], target: [-3.2, 1.8, -1.5], shift: [0, 0.18] },
    monitor: ['Selected', 'work'],
  },
  fit: {
    wide: { position: [2.6, 2.7, 2.2], target: [4, 2.5, -2.9], shift: [0, 0.2] },
    narrow: { position: [3, 2.8, 2.8], target: [4, 2.5, -2.9], shift: [0, 0.18] },
    monitor: ['Match', 'your', 'role'],
  },
  timeline: {
    wide: { position: [3.3, 3.9, 2.6], target: [4.4, 3.8, -3], shift: [0, 0.2] },
    narrow: { position: [3.2, 3.7, 1.9], target: [4.2, 3.6, -3], shift: [0, 0.18] },
    monitor: ['Devnodes', 'since', '2023'],
  },
  stack: {
    wide: { position: [1.1, 1.6, 5], target: [2.3, 0.65, 1.4], shift: [0, 0.2] },
    narrow: { position: [1.8, 1.3, 4.8], target: [2.25, 0.5, 1.3], shift: [0, 0.18] },
    monitor: ['React', 'Next.js', 'Node.js'],
  },
  playground: {
    wide: { position: [2.6, 2.1, 1.7], target: [3.9, 1.8, -2.9], shift: [0, 0.2] },
    narrow: { position: [2.8, 2.2, 2.4], target: [3.9, 1.8, -2.9], shift: [0, 0.18] },
    monitor: ['Break', 'something', 'on purpose'],
  },
  contact: {
    wide: { position: [0, 2.6, 8.6], target: [0, 2, 0], shift: [0, 0.2] },
    narrow: { position: [0, 2.8, 10.5], target: [0, 1.8, 0], shift: [0, 0.2] },
    monitor: ['Let’s', 'build', 'together'],
  },
};
