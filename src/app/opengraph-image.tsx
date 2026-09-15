import { ImageResponse } from 'next/og';
import { site } from '@/data/site';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = `${site.name} — ${site.role}`;

/**
 * Open Graph card, generated in the site's own visual language.
 *
 * A share card is usually the first thing anyone sees, so it uses the same
 * warm ground, the same span waterfall and the same two accents as the page
 * rather than a stock gradient with text on it.
 */
export default function OpenGraphImage() {
  const spans = [
    { width: 520, color: '#e8a33d' },
    { width: 380, color: '#4fb3a8' },
    { width: 300, color: '#4fb3a8' },
    { width: 190, color: '#2a5f5a' },
  ];

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: '#121010',
        padding: 80,
        fontFamily: 'sans-serif',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {spans.map((span) => (
          <div
            key={span.width}
            style={{
              width: span.width,
              height: 6,
              background: span.color,
              borderRadius: 3,
            }}
          />
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            fontSize: 84,
            fontWeight: 600,
            color: '#f4f1ec',
            letterSpacing: -3,
            lineHeight: 1,
          }}
        >
          {site.name}
        </div>
        <div
          style={{
            marginTop: 20,
            fontSize: 34,
            color: '#a89f97',
            letterSpacing: -0.5,
          }}
        >
          {site.role}
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          fontSize: 22,
          color: '#7d746e',
        }}
      >
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            background: '#e8a33d',
          }}
        />
        Scalable systems · architecture · payments
      </div>
    </div>,
    size,
  );
}
