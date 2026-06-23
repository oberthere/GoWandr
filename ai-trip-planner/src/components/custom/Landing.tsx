import { useNavigate } from 'react-router-dom';
import { MarqueeRow } from './MarqueeRow';
import { MARQUEE_ROW_1, MARQUEE_ROW_2 } from './destinations';

function Arrow() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

const STEPS = [
  {
    num: '01',
    title: 'Tell us your trip',
    body: "Destination, days, budget, and who's coming along. Four taps and a search box.",
  },
  {
    num: '02',
    title: 'We draft the day',
    body: 'A costed, hour-by-hour plan with places to stay, eat, and explore, paced to fit.',
  },
  {
    num: '03',
    title: 'Make it yours',
    body: 'Save it to your trips, swap out any stop, and take the whole plan with you.',
  },
];

export function Landing() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-[min(1600px,92vw)] px-6 pb-24">
      {/* Hero */}
      <section className="mx-auto max-w-230 pt-22 pb-7.5 text-center">
        <span className="eyebrow">AI trip planner</span>
        <h1 className="mt-4.5 font-display text-[clamp(2.8rem,6.6vw,5.6rem)] font-medium leading-[1.01] tracking-[-0.04em]">
          Anywhere you're headed,{' '}
          <span className="whitespace-nowrap border-b-[3px] border-ink pb-0.5">
            planned in a minute.
          </span>
        </h1>
        <p className="mx-auto mt-5.5 max-w-[56ch] text-[clamp(1.05rem,2vw,1.22rem)] text-graphite">
          Tell us where you're going, how long, your budget, and who's coming. We'll draft a
          day-by-day itinerary: where to stay, eat, and explore, each stop timed and costed. A
          beach, a megacity, or a town no one's heard of.
        </p>
        <div className="mt-7.5 flex flex-wrap items-center justify-center gap-3.5">
          <button
            type="button"
            onClick={() => navigate('/create-trip')}
            className="inline-flex items-center gap-2.5 rounded-full bg-ink px-7.5 py-3.75 font-semibold text-white transition hover:-translate-y-px hover:bg-black"
          >
            Start free
            <Arrow />
          </button>
          <span className="font-mono text-[0.76rem] text-muted2">
            No account needed to try your first trip.
          </span>
        </div>
      </section>

      {/* Destination marquee */}
      <div className="marquees mt-13.5 flex flex-col gap-3.5">
        <MarqueeRow items={MARQUEE_ROW_1} />
        <MarqueeRow items={MARQUEE_ROW_2} offset={138} />
      </div>

      {/* How it works */}
      <div className="mt-24">
        <span className="eyebrow block text-center">How it works</span>
        <h2 className="mx-auto mt-3 mb-11 text-center font-display text-[clamp(1.9rem,3.6vw,2.6rem)] font-medium tracking-[-0.03em]">
          Three steps to a full itinerary.
        </h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.num} className="rounded-2xl border border-line bg-surface p-6.5">
              <div className="font-mono text-[0.8rem] font-bold tracking-[0.1em] text-muted2">
                {s.num}
              </div>
              <h3 className="mt-5 mb-2 font-display text-xl font-semibold tracking-[-0.02em]">
                {s.title}
              </h3>
              <p className="text-[0.95rem] leading-relaxed text-graphite">{s.body}</p>
              <div className="mt-4.5 h-px bg-line" />
            </div>
          ))}
        </div>
      </div>

      {/* CTA band */}
      <div className="mt-22.5 rounded-[22px] bg-ink p-[clamp(40px,6vw,68px)] text-center text-white">
        <h2 className="mb-2 font-display text-[clamp(2rem,4.4vw,3.1rem)] font-medium leading-[1.04] tracking-[-0.035em]">
          Where to first?
        </h2>
        <p className="mx-auto mb-6.5 max-w-[46ch] text-[1.05rem] text-white/70">
          Your first itinerary takes about thirty seconds, and costs nothing.
        </p>
        <button
          type="button"
          onClick={() => navigate('/create-trip')}
          className="inline-flex items-center gap-2.5 rounded-full bg-white px-7.5 py-3.75 font-semibold text-ink transition hover:-translate-y-px"
        >
          Start free
          <Arrow />
        </button>
        <div className="mt-5.5 font-mono text-[0.72rem] tracking-[0.06em] text-white/55">
          BUILT WITH GEMINI + GOOGLE MAPS
        </div>
      </div>
    </div>
  );
}
