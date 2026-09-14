/**
 * Lists every content claim still awaiting Nadir's confirmation.
 *
 * This exists so "don't invent facts" is a check that can fail, rather than a
 * convention that quietly erodes. Run it before shipping.
 */
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const DATA_DIR = join(process.cwd(), 'src', 'data');
const PATTERN = /needsConfirmation\(\s*([\s\S]*?)\)\s*(?:satisfies|,|\))/g;

const walk = async (dir: string): Promise<string[]> => {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const path = join(dir, entry.name);
      return entry.isDirectory() ? walk(path) : Promise.resolve([path]);
    }),
  );
  return files.flat().filter((file) => file.endsWith('.ts'));
};

const main = async (): Promise<void> => {
  const files = await walk(DATA_DIR);
  let total = 0;

  for (const file of files) {
    const source = await readFile(file, 'utf8');
    const matches = [...source.matchAll(PATTERN)];
    if (matches.length === 0) continue;

    const relative = file.replace(`${process.cwd()}/`, '');
    console.log(`\n  ${relative}`);
    for (const match of matches) {
      const line = source.slice(0, match.index).split('\n').length;
      const note = match[1]?.match(/'([^']*?)'\s*,?\s*$/s)?.[1] ?? '(no note)';
      console.log(`    ${relative}:${line}  ${note}`);
      total += 1;
    }
  }

  console.log(
    total === 0
      ? '\n  All content claims are marked verified.\n'
      : `\n  ${total} claim(s) awaiting confirmation from Nadir.\n`,
  );
};

await main();
