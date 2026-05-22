/** Zodiac wheel — sign labels + constellation pattern per segment (reference hero) */

const SIGNS = [
  'ARIES', 'TAURUS', 'GEMINI', 'CANCER', 'LEO', 'VIRGO',
  'LIBRA', 'SCORPIO', 'SAGITTARIUS', 'CAPRICORN', 'AQUARIUS', 'PISCES',
] as const;

/** Local coords: x = tangential, y = radial (outward positive). Scale ~1 = segment width. */
type Star = [number, number];
type Constellation = { stars: Star[]; links: [number, number][] };

const CONSTELLATIONS: Constellation[] = [
  // Aries — bent horn / small triangle
  {
    stars: [[0, 0.35], [-0.22, 0.05], [0.22, 0.05], [-0.12, -0.28], [0.14, -0.22]],
    links: [[0, 1], [0, 2], [1, 3], [2, 4], [3, 4]],
  },
  // Taurus — V head + Hyades cluster
  {
    stars: [[0, 0.38], [-0.28, 0.08], [0.28, 0.08], [-0.08, -0.12], [0.1, -0.1], [0, -0.32]],
    links: [[0, 1], [0, 2], [1, 3], [2, 4], [3, 5], [4, 5], [3, 4]],
  },
  // Gemini — twin verticals
  {
    stars: [[-0.2, 0.35], [-0.2, -0.3], [0.2, 0.35], [0.2, -0.3], [-0.2, 0], [0.2, 0]],
    links: [[0, 1], [2, 3], [0, 4], [4, 1], [2, 5], [5, 3]],
  },
  // Cancer — inverted Y
  {
    stars: [[0, 0.32], [-0.24, -0.05], [0.24, -0.05], [-0.14, -0.32], [0.16, -0.28]],
    links: [[0, 1], [0, 2], [1, 3], [2, 4], [3, 4]],
  },
  // Leo — sickle
  {
    stars: [[0.2, 0.35], [0.05, 0.15], [-0.15, 0.2], [-0.22, 0], [-0.1, -0.2], [0.12, -0.32]],
    links: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5]],
  },
  // Virgo — Y with stem
  {
    stars: [[0, 0.38], [-0.22, 0.05], [0.22, 0.05], [0, -0.1], [0, -0.35]],
    links: [[0, 1], [0, 2], [1, 3], [2, 3], [3, 4]],
  },
  // Libra — scales triangle
  {
    stars: [[0, 0.35], [-0.26, -0.05], [0.26, -0.05], [-0.14, -0.32], [0.14, -0.32]],
    links: [[0, 1], [0, 2], [1, 3], [2, 4], [1, 2], [3, 4]],
  },
  // Scorpio — curved tail
  {
    stars: [[-0.18, 0.32], [0, 0.22], [0.18, 0.1], [0.22, -0.08], [0.08, -0.22], [-0.12, -0.32]],
    links: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5]],
  },
  // Sagittarius — teapot
  {
    stars: [[0, 0.35], [-0.2, 0.1], [0.2, 0.1], [-0.22, -0.12], [0.22, -0.12], [0, -0.32], [0.28, 0]],
    links: [[0, 1], [0, 2], [1, 3], [2, 4], [3, 4], [4, 5], [2, 6]],
  },
  // Capricorn — triangle / loop
  {
    stars: [[0, 0.35], [-0.24, -0.08], [0.24, -0.08], [0.1, -0.32], [-0.16, -0.28]],
    links: [[0, 1], [0, 2], [1, 2], [2, 3], [3, 4], [4, 1]],
  },
  // Aquarius — zigzag pour
  {
    stars: [[-0.22, 0.32], [0, 0.18], [0.22, 0.32], [-0.12, 0], [0.12, 0], [0, -0.32]],
    links: [[0, 1], [1, 2], [1, 3], [1, 4], [3, 5], [4, 5]],
  },
  // Pisces — two fish arcs
  {
    stars: [[-0.22, 0.28], [-0.08, 0], [-0.2, -0.28], [0.22, 0.28], [0.08, 0], [0.2, -0.28]],
    links: [[0, 1], [1, 2], [3, 4], [4, 5], [1, 4]],
  },
];

const CX = 260;
const CY = 260;
const PATTERN_RADIUS = 172;
const PATTERN_SCALE = 52;

/** Stable SVG numbers — avoids server/client float formatting hydration mismatches */
function r(n: number): number {
  return Math.round(n * 100) / 100;
}

function segmentToXY(segmentIndex: number, localX: number, localY: number): [number, number] {
  const midDeg = segmentIndex * 30 + 15 - 90;
  const midRad = (midDeg * Math.PI) / 180;
  const rDist = PATTERN_RADIUS + localY * PATTERN_SCALE;
  const x = CX + rDist * Math.cos(midRad) - localX * PATTERN_SCALE * Math.sin(midRad);
  const y = CY + rDist * Math.sin(midRad) + localX * PATTERN_SCALE * Math.cos(midRad);
  return [r(x), r(y)];
}

type WheelMetrics = {
  rings: [number, number, number, number];
  ringOpacity: [number, number, number, number];
  tickMajor: number;
  tickMinor: number;
  spoke: number;
  link: number;
  starMain: number;
  starDot: number;
  labelSize: number;
};

const WHEEL_DEFAULT: WheelMetrics = {
  rings: [1.85, 1.5, 1.25, 1.1],
  ringOpacity: [0.78, 0.74, 0.7, 0.68],
  tickMajor: 1,
  tickMinor: 0.7,
  spoke: 1.05,
  link: 1.05,
  starMain: 3,
  starDot: 2.4,
  labelSize: 10.5,
};

const WHEEL_COSMIC: WheelMetrics = {
  rings: [1.65, 1.35, 1.1, 0.95],
  ringOpacity: [0.92, 0.9, 0.88, 0.86],
  tickMajor: 1.05,
  tickMinor: 0.75,
  spoke: 1.05,
  link: 1.05,
  starMain: 3.2,
  starDot: 2.5,
  labelSize: 10.5,
};

function wheelMetrics(className: string): WheelMetrics {
  return className.includes('zodiac-wheel--cosmic') ? WHEEL_COSMIC : WHEEL_DEFAULT;
}

function ConstellationPattern({
  segmentIndex,
  metrics,
}: {
  segmentIndex: number;
  metrics: WheelMetrics;
}) {
  const { stars, links } = CONSTELLATIONS[segmentIndex];
  const points = stars.map(([lx, ly]) => segmentToXY(segmentIndex, lx, ly));

  return (
    <g className="zodiac-constellation" opacity="0.88">
      {links.map(([a, b], i) => {
        const [x1, y1] = points[a];
        const [x2, y2] = points[b];
        return (
          <line
            key={`link-${segmentIndex}-${i}`}
            x1={r(x1)}
            y1={r(y1)}
            x2={r(x2)}
            y2={r(y2)}
            stroke="currentColor"
            strokeWidth={metrics.link}
            strokeLinecap="round"
          />
        );
      })}
      {points.map(([x, y], i) => (
        <circle
          key={`star-${segmentIndex}-${i}`}
          cx={x}
          cy={y}
          r={i === 0 ? metrics.starMain : metrics.starDot}
          fill="currentColor"
        />
      ))}
    </g>
  );
}

export default function ZodiacWheel({ className = '' }: { className?: string }) {
  const m = wheelMetrics(className);
  const ringRadii: [number, number, number, number] = [248, 200, 155, 108];

  return (
    <svg
      className={className}
      viewBox="0 0 520 520"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {ringRadii.map((r, i) => (
        <circle
          key={`ring-${r}`}
          cx={CX}
          cy={CY}
          r={r}
          stroke="currentColor"
          strokeWidth={m.rings[i]}
          opacity={m.ringOpacity[i]}
        />
      ))}

      {/* Outer tick marks + sunburst dots (reference) */}
      {[...Array(72)].map((_, i) => {
        const deg = i * 5 - 90;
        const rad = (deg * Math.PI) / 180;
        const rDot = 252;
        const rInner = i % 6 === 0 ? 238 : 242;
        const xOuter = r(CX + rDot * Math.cos(rad));
        const yOuter = r(CY + rDot * Math.sin(rad));
        const xInner = r(CX + rInner * Math.cos(rad));
        const yInner = r(CY + rInner * Math.sin(rad));
        return (
          <g key={`tick-${i}`} opacity="0.78">
            <line
              x1={xOuter}
              y1={yOuter}
              x2={xInner}
              y2={yInner}
              stroke="currentColor"
              strokeWidth={i % 6 === 0 ? m.tickMajor : m.tickMinor}
            />
            {i % 6 === 0 && (
              <circle cx={xOuter} cy={yOuter} r={2.4} fill="currentColor" />
            )}
          </g>
        );
      })}

      {/* Segment spokes */}
      {[...Array(12)].map((_, i) => {
        const deg = i * 30 - 90;
        const rad = (deg * Math.PI) / 180;
        const x1 = r(CX + 108 * Math.cos(rad));
        const y1 = r(CY + 108 * Math.sin(rad));
        const x2 = r(CX + 248 * Math.cos(rad));
        const y2 = r(CY + 248 * Math.sin(rad));
        return (
          <line
            key={`spoke-${i}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="currentColor"
            strokeWidth={m.spoke}
            opacity="0.75"
          />
        );
      })}

      {/* Constellation pattern per sign */}
      {SIGNS.map((_, i) => (
        <ConstellationPattern key={`constellation-${i}`} segmentIndex={i} metrics={m} />
      ))}

      {/* Sign labels — radial on text ring (reference) */}
      {SIGNS.map((name, i) => {
        const labelDeg = i * 30 + 15;
        const rad = ((labelDeg - 90) * Math.PI) / 180;
        const x = r(CX + 222 * Math.cos(rad));
        const y = r(CY + 222 * Math.sin(rad));
        let rot = labelDeg;
        if (rot > 90 && rot < 270) rot += 180;
        return (
          <text
            key={name}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="currentColor"
            opacity="0.85"
            fontSize={m.labelSize}
            fontWeight="700"
            fontFamily="'Playfair Display', 'Cormorant Garamond', Georgia, serif"
            letterSpacing="0.12em"
            transform={`rotate(${r(rot)}, ${x}, ${y})`}
          >
            {name}
          </text>
        );
      })}
    </svg>
  );
}
