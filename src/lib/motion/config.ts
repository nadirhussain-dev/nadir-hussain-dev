import type { Transition, Variants } from 'motion/react';

/**
 * One motion vocabulary for the whole site.
 *
 * Every animation on this site draws from this file. That is deliberate: the
 * quickest way to make a site feel incoherent is to let each component invent
 * its own timing. A single signature curve — fast departure, long settle —
 * makes unrelated elements feel like parts of one system.
 *
 * These mirror the CSS custom properties in tokens.css. Motion needs JS
 * values; CSS transitions need the properties. They are kept in sync by hand
 * because there are only two curves.
 */
export const EASE_SIGNATURE = [0.16, 1, 0.3, 1] as const;
export const EASE_EXIT = [0.4, 0, 1, 1] as const;

export const DURATION = {
  instant: 0.12,
  quick: 0.22,
  considered: 0.42,
  deliberate: 0.7,
} as const;

export const transition = {
  quick: {
    duration: DURATION.quick,
    ease: EASE_SIGNATURE,
  },
  considered: {
    duration: DURATION.considered,
    ease: EASE_SIGNATURE,
  },
  deliberate: {
    duration: DURATION.deliberate,
    ease: EASE_SIGNATURE,
  },
} as const satisfies Record<string, Transition>;

/**
 * Section reveal. Small offset, no scale, no blur.
 *
 * Large translate distances and scale-ins are the two things that make scroll
 * reveals feel cheap and make the page feel slow to read. 20px of travel is
 * enough to register as arrival without making the reader wait for it.
 */
export const revealVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transition.considered,
  },
};

/** Staggers children along the same curve. */
export const staggerVariants = (stagger = 0.06): Variants => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: stagger, delayChildren: 0.04 },
  },
});

/** Viewport config shared by every scroll reveal, so thresholds never drift. */
export const revealViewport = {
  once: true,
  amount: 0.25,
  margin: '0px 0px -10% 0px',
} as const;
