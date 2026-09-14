import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

/**
 * Favicon: a span bar on the warm ground.
 *
 * Generated rather than authored so it stays tied to the palette tokens, and
 * so the mark is the site's own idea — a trace span — rather than a monogram.
 */
export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 4,
        padding: 6,
        background: '#121010',
      }}
    >
      <div style={{ height: 4, width: '100%', background: '#e8a33d' }} />
      <div style={{ height: 4, width: '65%', background: '#4fb3a8' }} />
      <div style={{ height: 4, width: '40%', background: '#2a5f5a' }} />
    </div>,
    size,
  );
}
