import { describe, expect, it } from 'vitest';
import { matchRole } from './match';

const ids = (text: string) => matchRole(text).matched.map((skill) => skill.id);

describe('matchRole', () => {
  it('finds skills through their aliases', () => {
    expect(ids('We use ReactJS, NestJS and Stripe webhooks')).toEqual(
      expect.arrayContaining(['react', 'node', 'payments']),
    );
  });

  it('does not match terms inside other words', () => {
    const result = matchRole('You will maintain good relations and build trust');
    expect(result.matched).toEqual([]);
    expect(result.gaps).toEqual([]);
  });

  it('reports gaps instead of hiding them', () => {
    const result = matchRole('Senior engineer: React, Kubernetes and AWS');
    expect(result.gaps).toEqual(['Kubernetes', 'AWS']);
    expect(result.coverage).toBe(33);
  });

  it('treats lowercase go as English and capitalised Go as the language', () => {
    expect(matchRole('ready to go').gaps).toEqual([]);
    expect(matchRole('Experience with Go services').gaps).toEqual(['Go']);
  });

  it('has no score when nothing is recognised', () => {
    expect(matchRole('Friendly team and free snacks').coverage).toBeNull();
  });
});
