/** The road through Nadir's career, one stop at a time. Facts come from his CV. */
export type StationKind =
  'start' | 'school' | 'office' | 'chest' | 'skills' | 'gate' | 'boss' | 'castle';

export type Sky = 'morning' | 'day' | 'sunset' | 'night';

export interface Station {
  id: string;
  kind: StationKind;
  level: number;
  sky: Sky;
  label: string;
  title: string;
  text?: string;
  /** Project opened from this stop's chest. */
  slug?: string;
  link?: { label: string; href: string };
}

export const LEVELS = [
  'Multan',
  'University',
  'Devnodes',
  'Client quests',
  'My products',
  'Skills',
  'Final boss',
] as const;

const chest = (slug: string, level: number, sky: Sky): Station => ({
  id: slug,
  kind: 'chest',
  level,
  sky,
  label: 'Project unlocked',
  title: slug,
  slug,
});

export const STATIONS: readonly Station[] = [
  {
    id: 'start',
    kind: 'start',
    level: 1,
    sky: 'morning',
    label: 'Start',
    title: 'Nadir’s Quest',
  },
  {
    id: 'bzu',
    kind: 'school',
    level: 2,
    sky: 'morning',
    label: '2019 to 2023',
    title: 'Bahauddin Zakariya University',
    text: 'Earned a BS in Information Technology in Multan: software, networking and databases.',
  },
  {
    id: 'devnodes',
    kind: 'office',
    level: 3,
    sky: 'day',
    label: 'June 2023 to today',
    title: 'Joined Devnodes',
    text: 'Three-plus years shipping web, mobile and Shopify features, including live chat for Venota. Named Employee of the Quarter.',
  },
  chest('payments-platform', 4, 'day'),
  chest('trek-train', 4, 'day'),
  chest('daynora', 5, 'day'),
  chest('skolara', 5, 'sunset'),
  chest('snapfind', 5, 'sunset'),
  chest('tessera', 5, 'sunset'),
  chest('engforge', 5, 'sunset'),
  chest('devsprint', 5, 'sunset'),
  {
    id: 'skills',
    kind: 'skills',
    level: 6,
    sky: 'sunset',
    label: 'Power-ups collected',
    title: 'React, Next.js, React Native, NestJS, PostgreSQL, Stripe',
    link: { label: 'See my full stack', href: '#stack' },
  },
  {
    id: 'gate',
    kind: 'gate',
    level: 6,
    sky: 'night',
    label: 'Hiring?',
    title: 'The role gate',
    text: 'Paste your job description to see what I can prove and what I can’t.',
    link: { label: 'Check my fit', href: '#fit' },
  },
  {
    id: 'boss',
    kind: 'boss',
    level: 7,
    sky: 'night',
    label: 'Final boss',
    title: 'The Timeout Monster',
    text: 'It attacks payment systems. Fight it in a working simulator and watch retries stop double charges.',
    link: { label: 'Fight the boss', href: '#playground' },
  },
  {
    id: 'castle',
    kind: 'castle',
    level: 7,
    sky: 'morning',
    label: 'Quest complete',
    title: 'You reached the castle',
    text: 'Let’s build something together.',
    link: { label: 'Contact me', href: '#contact' },
  },
];
