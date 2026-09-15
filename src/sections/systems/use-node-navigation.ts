'use client';

import { useCallback, useRef, useState } from 'react';
import { SYSTEM_NODES, type NodeId } from '@/data/systems';

/**
 * Roving-tabindex navigation across a two-dimensional diagram.
 *
 * The diagram is laid out in tiers, so the keyboard model follows the picture:
 * up/down move between tiers, left/right move within one. Home and End jump to
 * the entry and exit points. Selection follows focus, which is the expected
 * behaviour for a tablist whose panels are plain content — it means a keyboard
 * user reads the same thing a mouse user sees on hover, with no extra keypress.
 *
 * Without this the diagram would be an interactive element that only a mouse
 * can reach, which is the usual way "accessible" architecture diagrams fail.
 */
export function useNodeNavigation(initial: NodeId) {
  const [selected, setSelected] = useState<NodeId>(initial);
  const nodeRefs = useRef(new Map<NodeId, HTMLButtonElement>());

  const registerNode = useCallback(
    (id: NodeId) => (element: HTMLButtonElement | null) => {
      if (element) nodeRefs.current.set(id, element);
      else nodeRefs.current.delete(id);
    },
    [],
  );

  const focusNode = useCallback((id: NodeId) => {
    setSelected(id);
    nodeRefs.current.get(id)?.focus();
  }, []);

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent, current: NodeId) => {
      const node = SYSTEM_NODES.find((entry) => entry.id === current);
      if (!node) return;

      const tiers = [...new Set(SYSTEM_NODES.map((entry) => entry.tier))].sort(
        (a, b) => a - b,
      );
      const sameTier = SYSTEM_NODES.filter((entry) => entry.tier === node.tier);
      const indexInTier = sameTier.findIndex((entry) => entry.id === current);
      const tierIndex = tiers.indexOf(node.tier);

      /** Moves to a neighbouring tier, keeping horizontal position where possible. */
      const moveTier = (delta: number): NodeId | undefined => {
        const targetTier = tiers[tierIndex + delta];
        if (targetTier === undefined) return undefined;
        const candidates = SYSTEM_NODES.filter((entry) => entry.tier === targetTier);
        return (
          candidates[Math.min(indexInTier, candidates.length - 1)] ?? candidates[0]
        )?.id;
      };

      const target = ((): NodeId | undefined => {
        switch (event.key) {
          case 'ArrowDown':
            return moveTier(1);
          case 'ArrowUp':
            return moveTier(-1);
          case 'ArrowRight':
            return sameTier[indexInTier + 1]?.id ?? moveTier(1);
          case 'ArrowLeft':
            return sameTier[indexInTier - 1]?.id ?? moveTier(-1);
          case 'Home':
            return SYSTEM_NODES[0]?.id;
          case 'End':
            return SYSTEM_NODES[SYSTEM_NODES.length - 1]?.id;
          default:
            return undefined;
        }
      })();

      if (target === undefined) return;
      // Only prevent default once a key is definitely handled, so unrelated
      // keys and browser shortcuts still behave normally.
      event.preventDefault();
      focusNode(target);
    },
    [focusNode],
  );

  return { selected, setSelected, registerNode, onKeyDown } as const;
}
