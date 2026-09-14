'use client';

import { motion } from 'motion/react';
import { revealVariants, revealViewport } from '@/lib/motion/config';
import { cn } from '@/lib/utils';

/**
 * Scroll reveal.
 *
 * Deliberately the only reveal primitive on the site. Motion respects
 * `prefers-reduced-motion` internally, so the reduced-motion path resolves to
 * the visible end state rather than leaving content hidden — a failure mode
 * that is easy to ship and impossible to notice without testing for it.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  as = 'div',
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: 'div' | 'section' | 'li' | 'article';
}) {
  const Component = motion[as];

  return (
    <Component
      className={cn(className)}
      variants={revealVariants}
      initial="hidden"
      whileInView="visible"
      viewport={revealViewport}
      transition={{ delay }}
    >
      {children}
    </Component>
  );
}
