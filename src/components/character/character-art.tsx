import { cn } from '@/lib/utils';

export type CharacterMood = 'idle' | 'happy' | 'alarm';

/**
 * Nadir, drawn.
 *
 * Plain inline SVG rather than an image or a Lottie file: it costs a few
 * kilobytes, stays sharp at any size, and every part can be animated from CSS.
 * Blink, breathing and typing all run on the compositor. The only script
 * involved writes --look-x and --look-y, which move the pupils.
 *
 * Reduced motion stops all of it (see globals.css). The drawing still reads as
 * complete, because no animation is needed to finish the picture.
 */
export function CharacterArt({
  mood = 'idle',
  crop = 'full',
  className,
  title,
}: {
  mood?: CharacterMood;
  /** `bust` frames the head and shoulders, for the small companion. */
  crop?: 'full' | 'bust';
  className?: string;
  /** Omit when a neighbouring element already names the picture. */
  title?: string;
}) {
  return (
    <svg
      viewBox={crop === 'full' ? '0 0 440 540' : '110 40 220 220'}
      data-mood={mood}
      role={title === undefined ? undefined : 'img'}
      aria-hidden={title === undefined ? true : undefined}
      aria-label={title}
      className={cn('nadir block h-auto w-full', className)}
    >
      <defs>
        <linearGradient id="n-suit" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#35406b" />
          <stop offset="1" stopColor="#1c2340" />
        </linearGradient>
        <linearGradient id="n-skin" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#e2ae88" />
          <stop offset="1" stopColor="#c58a64" />
        </linearGradient>
        <linearGradient id="n-hair" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#5a3524" />
          <stop offset="0.55" stopColor="#2c1b15" />
          <stop offset="1" stopColor="#1b1210" />
        </linearGradient>
        <linearGradient id="n-lid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a3331" />
          <stop offset="1" stopColor="#1e1a19" />
        </linearGradient>
        <radialGradient id="n-halo">
          <stop offset="0" stopColor="#4fb3a8" stopOpacity="0.28" />
          <stop offset="1" stopColor="#4fb3a8" stopOpacity="0" />
        </radialGradient>
      </defs>

      {crop === 'full' && <circle cx="220" cy="250" r="215" fill="url(#n-halo)" />}

      {crop === 'full' && (
        <g
          className="nadir-orbit"
          fontFamily="var(--font-jetbrains-mono), monospace"
          fontSize="13"
        >
          <g className="nadir-chip nadir-chip-a">
            <rect
              x="8"
              y="118"
              width="104"
              height="30"
              rx="6"
              fill="#171413"
              stroke="#4fb3a8"
              strokeOpacity=".5"
            />
            <text x="60" y="138" textAnchor="middle" fill="#4fb3a8">
              {'POST /charge'}
            </text>
          </g>
          <g className="nadir-chip nadir-chip-b">
            <rect
              x="336"
              y="84"
              width="92"
              height="30"
              rx="6"
              fill="#171413"
              stroke="#e8a33d"
              strokeOpacity=".55"
            />
            <text x="382" y="104" textAnchor="middle" fill="#e8a33d">
              webhook ✓
            </text>
          </g>
          <g className="nadir-chip nadir-chip-c">
            <rect
              x="344"
              y="282"
              width="88"
              height="30"
              rx="6"
              fill="#171413"
              stroke="#4fb3a8"
              strokeOpacity=".5"
            />
            <text x="388" y="302" textAnchor="middle" fill="#4fb3a8">
              {'sync()'}
            </text>
          </g>
          <g className="nadir-chip nadir-chip-d">
            <rect
              x="4"
              y="306"
              width="62"
              height="30"
              rx="6"
              fill="#171413"
              stroke="#c6bdb2"
              strokeOpacity=".35"
            />
            <text x="35" y="326" textAnchor="middle" fill="#c6bdb2">
              {'</>'}
            </text>
          </g>
        </g>
      )}

      <g className="nadir-body">
        {/* Torso */}
        <path
          d="M66 470 C70 372 112 330 172 312 L268 312 C328 330 370 372 374 470 Z"
          fill="url(#n-suit)"
        />
        {/* Shirt */}
        <path d="M186 304 L254 304 L262 470 L178 470 Z" fill="#f1ede6" />
        {/* Tie */}
        <path
          d="M209 330 L231 330 L226 350 L238 452 L220 470 L202 452 L214 350 Z"
          fill="#46546a"
        />
        <path d="M208 322 L232 322 L226 350 L214 350 Z" fill="#55657e" />
        {/* Collar */}
        <path d="M188 296 L220 332 L204 356 L176 314 Z" fill="#fff" />
        <path d="M252 296 L220 332 L236 356 L264 314 Z" fill="#fff" />
        {/* Lapels */}
        <path
          d="M172 310 L150 372 L176 386 L164 400 L212 470 L150 470 L140 350 Z"
          fill="#2a3358"
        />
        <path
          d="M268 310 L290 372 L264 386 L276 400 L228 470 L290 470 L300 350 Z"
          fill="#2a3358"
        />
        <path
          d="M176 386 L150 372 M264 386 L290 372"
          stroke="#1a2038"
          strokeWidth="2"
        />
      </g>

      <g className="nadir-head">
        {/* Neck */}
        <path
          d="M188 258 L188 304 C198 330 242 330 252 304 L252 258 Z"
          fill="#b97d5a"
        />
        {/* Ears */}
        <ellipse cx="139" cy="192" rx="13" ry="23" fill="#d29c76" />
        <ellipse cx="301" cy="192" rx="13" ry="23" fill="#c58a64" />
        <path
          d="M134 182 q6 10 2 22 M306 182 q-6 10 -2 22"
          stroke="#a66f4e"
          strokeWidth="2.5"
          fill="none"
        />
        {/* Face */}
        <path
          d="M146 150 C146 92 294 92 294 150 L294 200 C294 262 250 296 220 296 C190 296 146 262 146 200 Z"
          fill="url(#n-skin)"
        />

        {/* Beard: a soft jawline, with the moustache joining the chin. */}
        <path
          d="M147 196 C150 226 158 240 176 246 C186 250 196 238 220 238 C244 238 254 250 264 246 C282 240 290 226 293 196 C296 262 252 298 220 298 C188 298 144 262 147 196 Z"
          fill="#2c1b15"
          fillOpacity=".66"
        />
        <path
          d="M188 240 C200 229 212 228 220 232 C228 228 240 229 252 240 C240 238 230 240 220 240 C210 240 200 238 188 240 Z"
          fill="#20140f"
        />
        <path
          className="nadir-mouth"
          d="M200 250 Q220 256 240 250 Q220 270 200 250 Z"
          fill="#b5705f"
        />

        {/* Nose */}
        <path
          d="M222 182 L213 212 Q221 219 231 212"
          stroke="#a66f4e"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />

        {/* Eyes */}
        <g className="nadir-eyes">
          <ellipse cx="182" cy="176" rx="16" ry="10" fill="#fbf6ef" />
          <ellipse cx="258" cy="176" rx="16" ry="10" fill="#fbf6ef" />
          <g className="nadir-pupils">
            <circle cx="182" cy="176" r="8" fill="#2b1a12" />
            <circle cx="258" cy="176" r="8" fill="#2b1a12" />
            <circle cx="185" cy="173" r="2.4" fill="#fff" />
            <circle cx="261" cy="173" r="2.4" fill="#fff" />
          </g>
          <path
            d="M164 174 Q182 160 200 174"
            stroke="#2b1a12"
            strokeWidth="3.5"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M240 174 Q258 160 276 174"
            stroke="#2b1a12"
            strokeWidth="3.5"
            fill="none"
            strokeLinecap="round"
          />
        </g>

        {/* Brows */}
        <g className="nadir-brows" fill="#20140f">
          <path d="M158 156 C170 144 190 144 204 154 L202 162 C188 155 172 155 160 164 Z" />
          <path d="M282 156 C270 144 250 144 236 154 L238 162 C252 155 268 155 280 164 Z" />
        </g>

        {/* Hair: swept up and across, tighter at the sides. */}
        <path
          d="M144 196 C122 124 146 52 228 44 C286 40 322 84 300 196 C298 160 292 136 280 120 C248 132 196 134 164 122 C152 136 148 160 144 196 Z"
          fill="url(#n-hair)"
        />
        <path
          d="M160 96 C190 66 244 62 282 84"
          stroke="#8a5536"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
          opacity=".55"
        />
        <path
          d="M152 118 C188 94 238 88 280 104"
          stroke="#6b402b"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          opacity=".6"
        />

        {/* Alarm: only drawn when the simulator trips the breaker. */}
        <path
          className="nadir-sweat"
          d="M316 128 q12 18 0 26 q-12 -8 0 -26 Z"
          fill="#7cc7e8"
        />
      </g>

      {crop === 'full' && (
        <g className="nadir-desk">
          <g className="nadir-hands">
            <ellipse cx="146" cy="470" rx="26" ry="15" fill="#d29c76" />
            <ellipse cx="294" cy="470" rx="26" ry="15" fill="#d29c76" />
          </g>
          {/* Laptop, from behind. */}
          <path
            d="M112 386 L328 386 Q338 386 340 396 L354 486 L86 486 L100 396 Q102 386 112 386 Z"
            fill="url(#n-lid)"
            stroke="#544b48"
          />
          <text
            x="220"
            y="444"
            textAnchor="middle"
            fontFamily="var(--font-jetbrains-mono), monospace"
            fontSize="26"
            fontWeight="700"
            fill="#e8a33d"
          >
            NH
          </text>
          <circle className="nadir-led" cx="220" cy="462" r="3" fill="#4fb3a8" />
          <path
            d="M58 486 L382 486 Q392 486 392 494 L388 502 L52 502 L48 494 Q48 486 58 486 Z"
            fill="#544b48"
          />
          <path
            d="M24 512 L416 512"
            stroke="#a89f97"
            strokeOpacity=".35"
            strokeWidth="2"
          />
        </g>
      )}
    </svg>
  );
}
