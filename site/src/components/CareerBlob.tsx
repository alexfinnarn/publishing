import { useEffect, useRef, useState } from 'react';

/** A CMS that outgrew its shape.
 *
 *  Each stage is a blob described by numbers, not a hand-drawn path: how many
 *  lobes, how far they push out, how big the whole thing is. Because every
 *  stage produces the same number of points, any two shapes interpolate
 *  cleanly — no path-morphing library, no matched control points.
 *
 *  Facts come from inventory.md. Nothing here is invented.
 */

type Stage = {
  years: string;
  where: string;
  what: string;
  /** lobes around the circumference — roughly, how many separate things */
  lobes: number;
  /** how irregular, 0–1 — how far it had drifted from a shape you'd design */
  wobble: number;
  /** overall size, 0–1 */
  scale: number;
};

const STAGES: Stage[] = [
  {
    years: '2013–2014', where: 'Sogeti',
    what: 'One Drupal 7 multisite for Ethicon, an offshore team of four. Small, regular, the shape someone actually drew.',
    lobes: 3, wobble: 0.08, scale: 0.44,
  },
  {
    years: '2014–2015', where: 'Coplex',
    what: 'Fifteen to twenty client sites under maintenance. Not one big thing — many small ones, each with its own edge.',
    lobes: 11, wobble: 0.30, scale: 0.60,
  },
  {
    years: '2015–2019', where: 'University of Colorado',
    what: 'A Vue UI deploying to over a thousand sites, CI across fifty repositories. Big, and pulling in every direction at once.',
    lobes: 8, wobble: 0.52, scale: 0.94,
  },
  {
    years: '2019', where: 'Highlights for Children',
    what: 'A Drupal 7 family of sites, and the beginning of the D8 platform. A shape mid-way through becoming another shape.',
    lobes: 5, wobble: 0.38, scale: 0.70,
  },
  {
    years: '2020–2022', where: 'University of Colorado',
    what: 'The giving platform — $5.4M a year through one system. One heavy lobe that could not be allowed to fail.',
    lobes: 4, wobble: 0.44, scale: 0.78,
  },
  {
    years: '2022–2024', where: 'CivicActions',
    what: 'Federal publishing across roughly fifteen Drupal sites. Large, lobed, and every lobe answerable to someone.',
    lobes: 7, wobble: 0.34, scale: 1.0,
  },
];

const POINTS = 64;
const SIZE = 260;

/** Radii for one stage, sampled at POINTS around the circle. */
function radii(s: Stage): number[] {
  const base = 34 + s.scale * 56;
  return Array.from({ length: POINTS }, (_, i) => {
    const a = (i / POINTS) * Math.PI * 2;
    const lobe = Math.sin(a * s.lobes);
    const detail = Math.sin(a * (s.lobes * 2 + 1) + 1.7) * 0.35;
    return base * (1 + s.wobble * (lobe + detail) * 0.55);
  });
}

/** Closed Catmull-Rom-ish path through the sampled radii. */
function toPath(r: number[]): string {
  const pt = (i: number) => {
    const a = (i / POINTS) * Math.PI * 2 - Math.PI / 2;
    const k = r[(i + POINTS) % POINTS];
    return [SIZE / 2 + Math.cos(a) * k, SIZE / 2 + Math.sin(a) * k] as const;
  };
  let d = '';
  for (let i = 0; i < POINTS; i++) {
    const [x0, y0] = pt(i - 1), [x1, y1] = pt(i), [x2, y2] = pt(i + 1), [x3, y3] = pt(i + 2);
    if (i === 0) d += `M ${x1.toFixed(2)} ${y1.toFixed(2)}`;
    d += ` C ${(x1 + (x2 - x0) / 6).toFixed(2)} ${(y1 + (y2 - y0) / 6).toFixed(2)},` +
         ` ${(x2 - (x3 - x1) / 6).toFixed(2)} ${(y2 - (y3 - y1) / 6).toFixed(2)},` +
         ` ${x2.toFixed(2)} ${y2.toFixed(2)}`;
  }
  return d + ' Z';
}

const ease = (t: number) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2);

export default function CareerBlob() {
  const [active, setActive] = useState(0);
  const [path, setPath] = useState(() => toPath(radii(STAGES[0])));
  const from = useRef(radii(STAGES[0]));
  const raf = useRef<number | undefined>(undefined);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const to = radii(STAGES[active]);
    const start = from.current;

    // Snap instead of animating when motion is unwanted, or when the tab is
    // hidden — requestAnimationFrame is suspended in a background tab, so an
    // animation-only path would leave the shape stale until the tab is seen
    // again.
    if (reduce || document.hidden) {
      from.current = to;
      setPath(toPath(to));
      return;
    }

    const t0 = performance.now();
    const DUR = 620;
    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / DUR);
      const e = ease(t);
      const mixed = to.map((v, i) => start[i] + (v - start[i]) * e);
      setPath(toPath(mixed));
      if (t < 1) raf.current = requestAnimationFrame(tick);
      else from.current = to;
    };
    raf.current = requestAnimationFrame(tick);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [active]);

  const s = STAGES[active];

  return (
    <div className="blob">
      <div className="blob-figure">
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} role="img"
             aria-label={`An abstract shape representing ${s.where}, ${s.years}`}>
          <path d={path} />
        </svg>
      </div>

      <div className="blob-body">
        <p className="blob-hint">
          The same platform, six times. Step through it &mdash; the shape is
          generated from how many things were in play and how far each had
          drifted from anything anyone designed.
        </p>

        <div className="blob-controls" role="group" aria-label="Career stage">
          {STAGES.map((st, i) => (
            <button key={st.years + st.where} type="button"
                    onClick={() => setActive(i)}
                    aria-pressed={i === active}>
              {st.years}
            </button>
          ))}
        </div>

        <p className="blob-where"><strong>{s.where}</strong> &middot; {s.years}</p>
        <p className="blob-what" aria-live="polite">{s.what}</p>
      </div>
    </div>
  );
}
