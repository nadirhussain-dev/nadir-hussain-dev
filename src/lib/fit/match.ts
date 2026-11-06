import { KNOWN_GAPS, SKILLS, type Skill } from '@/data/skills';

export interface FitResult {
  matched: readonly Skill[];
  gaps: readonly string[];
  /** Matched share of everything recognised, 0–100. Null when nothing was. */
  coverage: number | null;
}

const escape = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Whole-term matching. Plain `includes` would find "go" inside "good" and "ai"
 * inside "maintain", and a tool built to be honest cannot make that mistake.
 */
const contains = (text: string, term: string): boolean =>
  new RegExp(`(?<![\\p{L}\\p{N}+#.])${escape(term)}(?![\\p{L}\\p{N}+#])`, 'iu').test(
    text,
  );

/** Pure and deterministic: no network, nothing stored, nothing sent anywhere. */
export function matchRole(text: string): FitResult {
  const matched = SKILLS.filter((skill) =>
    skill.aliases.some((alias) => contains(text, alias)),
  );
  const gaps = KNOWN_GAPS.filter((gap) => {
    // "Go" is an ordinary English word; only its capitalised form counts.
    if (gap === 'Go') return /(?<![\p{L}.])Go(?![\p{L}])/u.test(text);
    return contains(text, gap);
  });

  const total = matched.length + gaps.length;
  return {
    matched,
    gaps,
    coverage: total === 0 ? null : Math.round((matched.length / total) * 100),
  };
}
