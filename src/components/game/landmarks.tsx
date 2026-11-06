import type { StationKind } from '@/data/quest';

const INK = '#16233f';
const line = {
  stroke: INK,
  strokeWidth: 6,
  strokeLinejoin: 'round',
  strokeLinecap: 'round',
} as const;

function StartSign() {
  return (
    <svg viewBox="0 0 320 300" aria-hidden="true" className="start-sign">
      <path d="M145 120h30v175h-30z" fill="#b5692a" {...line} />
      <path d="M20 30h230l50 55-50 55H20z" fill="#fff8e8" {...line} />
      <text
        x="140"
        y="104"
        textAnchor="middle"
        fontSize="60"
        fontFamily="var(--font-display)"
        fill={INK}
      >
        Scroll
      </text>
    </svg>
  );
}

function School() {
  return (
    <svg viewBox="0 0 420 340" aria-hidden="true">
      <path d="M70 150h280v180H70z" fill="#ffe6c2" {...line} />
      <path d="M40 150 210 50l170 100z" fill="#e4574b" {...line} />
      <path d="M210 50V8l50 16-50 16" fill="#ffc83d" {...line} />
      <path d="M180 240h60v90h-60z" fill="#8a4a12" {...line} />
      {[105, 270].map((x) => (
        <path key={x} d={`M${x} 200h46v50h-46z`} fill="#8fdcf5" {...line} />
      ))}
    </svg>
  );
}

function Office() {
  const windows = [];
  for (let row = 0; row < 6; row += 1) {
    for (let column = 0; column < 4; column += 1) {
      windows.push(
        <rect
          key={`${row}-${column}`}
          x={110 + column * 52}
          y={46 + row * 50}
          width="32"
          height="30"
          rx="4"
          fill={(row + column) % 3 === 0 ? '#ffc83d' : '#8fdcf5'}
          stroke={INK}
          strokeWidth="4"
        />,
      );
    }
  }
  return (
    <svg viewBox="0 0 420 380" aria-hidden="true">
      <path d="M86 20h248v352H86z" fill="#4f67c9" {...line} />
      {windows}
      <path d="M180 340h60v32h-60z" fill="#ffe6c2" {...line} />
    </svg>
  );
}

function Chest({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 300 280" aria-hidden="true" className="chest" data-open={open}>
      <g className="chest-glow">
        <path
          d="M150 120 90 10M150 120 150 0M150 120l60-110"
          stroke="#ffc83d"
          strokeWidth="14"
          strokeLinecap="round"
        />
      </g>
      <path d="M40 150h220v120H40z" fill="#b5692a" {...line} />
      <g className="chest-lid">
        <path d="M40 150c0-70 220-70 220 0z" fill="#d99155" {...line} />
      </g>
      <path d="M130 140h40v50h-40z" fill="#ffc83d" {...line} />
    </svg>
  );
}

function Skills() {
  const coins = [
    ['R', 30, 170],
    ['N', 110, 90],
    ['TS', 200, 150],
    ['PG', 290, 70],
  ] as const;
  return (
    <svg viewBox="0 0 400 300" aria-hidden="true">
      {coins.map(([letter, x, y]) => (
        <g key={letter} className="coin">
          <circle cx={x + 40} cy={y + 40} r="42" fill="#ffc83d" {...line} />
          <text
            x={x + 40}
            y={y + 53}
            textAnchor="middle"
            fontSize="36"
            fontFamily="var(--font-display)"
            fill={INK}
          >
            {letter}
          </text>
        </g>
      ))}
    </svg>
  );
}

function Gate() {
  return (
    <svg viewBox="0 0 400 360" aria-hidden="true">
      <path d="M40 60h80v290H40zM280 60h80v290h-80z" fill="#8d97ad" {...line} />
      <path d="M120 120c0-90 160-90 160 0v230H120z" fill="#3a2a22" {...line} />
      <path
        d="M160 110v240M200 80v270M240 110v240M124 190h152M120 260h160"
        stroke="#ffc83d"
        strokeWidth="7"
      />
      <path
        d="M40 60V30h22v18h26V30h32v30M280 60V30h22v18h26V30h32v30"
        fill="#8d97ad"
        {...line}
      />
    </svg>
  );
}

function Boss() {
  return (
    <svg viewBox="0 0 400 380" aria-hidden="true" className="boss">
      <path
        d="M50 370c-30-200 60-330 150-330s180 130 150 330l-50-34-50 34-50-34-50 34-50-34z"
        fill="#7a3bd1"
        {...line}
      />
      <path d="M110 70 70 10l80 30M290 70l40-60-80 30" fill="#ffc83d" {...line} />
      <circle cx="150" cy="160" r="34" fill="#fff" {...line} />
      <circle cx="250" cy="160" r="34" fill="#fff" {...line} />
      <circle cx="158" cy="166" r="12" fill={INK} />
      <circle cx="242" cy="166" r="12" fill={INK} />
      <path
        d="M130 240q70 60 140 0l-25 8-20-8-25 12-25-12-20 8z"
        fill="#fff"
        {...line}
      />
      <text
        x="200"
        y="330"
        textAnchor="middle"
        fontSize="44"
        fontFamily="var(--font-display)"
        fill="#ffc83d"
      >
        504
      </text>
    </svg>
  );
}

function Castle() {
  return (
    <svg viewBox="0 0 520 460" aria-hidden="true">
      <path d="M260 120V30l70 22-70 22" fill="#e4574b" {...line} />
      <path
        d="M90 200v250h340V200h-42v36h-46v-36h-44v36h-76v-36h-44v36h-46v-36z"
        fill="#c8cede"
        {...line}
      />
      <path
        d="M180 120v110h160V120h-34v30h-26v-30h-40v30h-26v-30z"
        fill="#dfe3ee"
        {...line}
      />
      <path d="M210 450V350c0-70 100-70 100 0v100z" fill="#8a4a12" {...line} />
    </svg>
  );
}

export function Landmark({ kind, open }: { kind: StationKind; open: boolean }) {
  switch (kind) {
    case 'start':
      return <StartSign />;
    case 'school':
      return <School />;
    case 'office':
      return <Office />;
    case 'chest':
      return <Chest open={open} />;
    case 'skills':
      return <Skills />;
    case 'gate':
      return <Gate />;
    case 'boss':
      return <Boss />;
    case 'castle':
      return <Castle />;
  }
}
