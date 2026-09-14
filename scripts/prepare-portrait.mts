/**
 * Prepares a source photograph for the hero portrait slot.
 *
 * Committed rather than done by hand so it is reproducible: swap the source
 * photo, adjust the crop, re-run. A camera original is 8MB and the wrong
 * aspect; this crops to the 4:5 plate the component expects, downscales to
 * what the layout can actually display, and encodes to WebP and AVIF.
 *
 * Usage:
 *   node scripts/prepare-portrait.mts <source> [--top N] [--left N] [--width N]
 */
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';

const OUT_DIR = join(process.cwd(), 'public', 'portrait');
const BASENAME = 'nadir-hussain';

/** The plate aspect the Portrait component renders. */
const ASPECT_W = 4;
const ASPECT_H = 5;

/** Widest the portrait is ever displayed (18rem at 2x DPR), plus headroom. */
const TARGET_WIDTH = 1200;

const args = process.argv.slice(2);
const source = args[0];

if (source === undefined) {
  console.error('Usage: node scripts/prepare-portrait.mts <source-image>');
  process.exit(1);
}

const flag = (name: string): number | undefined => {
  const index = args.indexOf(`--${name}`);
  if (index === -1) return undefined;
  const value = Number(args[index + 1]);
  return Number.isFinite(value) ? value : undefined;
};

const main = async (): Promise<void> => {
  const image = sharp(source, { failOn: 'none' }).rotate();
  const meta = await image.metadata();

  /**
   * metadata() reports the dimensions BEFORE EXIF rotation, but extract()
   * runs after it. For a photo shot in portrait orientation those are
   * transposed, so the crop window would be clamped against the wrong bounds
   * and silently slide up the frame. Orientations 5-8 are the quarter turns.
   */
  const isQuarterTurned = (meta.orientation ?? 1) >= 5;
  const sourceWidth = (isQuarterTurned ? meta.height : meta.width) ?? 0;
  const sourceHeight = (isQuarterTurned ? meta.width : meta.height) ?? 0;

  if (sourceWidth === 0 || sourceHeight === 0) {
    throw new Error('Could not read image dimensions.');
  }

  // Crop window. Defaults frame a head-and-shoulders portrait from a
  // full-body frame; override per photo from the command line.
  const width = flag('width') ?? Math.round(sourceWidth * 0.565);
  const height = Math.round((width * ASPECT_H) / ASPECT_W);
  const left = flag('left') ?? Math.round((sourceWidth - width) / 2);
  const top = flag('top') ?? Math.round(sourceHeight * 0.31);

  // Clamp so a bad override cannot ask for pixels outside the image.
  const safeWidth = Math.min(width, sourceWidth);
  const safeHeight = Math.min(height, sourceHeight);
  const safeLeft = Math.max(0, Math.min(left, sourceWidth - safeWidth));
  const safeTop = Math.max(0, Math.min(top, sourceHeight - safeHeight));

  await mkdir(OUT_DIR, { recursive: true });

  const base = image
    .extract({
      left: safeLeft,
      top: safeTop,
      width: safeWidth,
      height: safeHeight,
    })
    .resize(TARGET_WIDTH, Math.round((TARGET_WIDTH * ASPECT_H) / ASPECT_W), {
      fit: 'cover',
      kernel: 'lanczos3',
    })
    // A touch of contrast and warmth so the plate already sits close to the
    // palette before CSS grades it further.
    .modulate({ saturation: 0.9 })
    .sharpen({ sigma: 0.6 });

  /**
   * One high-quality source only.
   *
   * next/image re-encodes to WebP or AVIF per the browser's Accept header, so
   * emitting an already-compressed AVIF here would compress lossily twice.
   * Quality is set high because this file is the master, not what ships.
   */
  const webp = await base
    .clone()
    .webp({ quality: 92, effort: 6 })
    .toFile(join(OUT_DIR, `${BASENAME}.webp`));

  console.log(`  source     ${sourceWidth}x${sourceHeight}`);
  console.log(`  crop       ${safeWidth}x${safeHeight} at ${safeLeft},${safeTop}`);
  console.log(`  master     ${(webp.size / 1024).toFixed(0)}KB webp`);
};

await main();
