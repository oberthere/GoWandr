import { useEffect, useRef } from 'react';
import { PlacePhoto } from '@/components/custom/PlacePhoto';
import type { Destination } from './destinations';

interface Props {
  items: Destination[];
  offset?: number;
}

/**
 * A horizontally drifting, drag-to-scroll row of destination cards.
 * The drift position is kept in a float accumulator written to scrollLeft each
 * frame (never read back) so sub-pixel steps accumulate instead of stalling.
 */
export function MarqueeRow({ items, offset = 0 }: Props) {
  const rowRef = useRef<HTMLDivElement>(null);
  // Duplicate the set so the wrap-around is seamless.
  const cards = [...items, ...items];

  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const SPEED = 0.6;
    const dir = 1;

    let down = false;
    let startX = 0;
    let startScroll = 0;
    let moved = false;
    let inited = false;
    let pos = 0;
    let auto = !reduce;
    let raf = 0;
    let resumeT: ReturnType<typeof setTimeout>;

    const half = () => row.scrollWidth / 2;
    const wrap = () => {
      const w = half();
      if (w > 0) {
        if (pos >= w) pos -= w;
        else if (pos < 0) pos += w;
      }
    };

    const tick = () => {
      if (!inited && row.scrollWidth > 0) {
        pos = half() / 2 + offset;
        row.scrollLeft = pos;
        inited = true;
      }
      if (inited && !down) {
        if (auto) pos += dir * SPEED;
        wrap();
        row.scrollLeft = pos;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onDown = (e: PointerEvent) => {
      down = true;
      auto = false;
      moved = false;
      startX = e.clientX;
      startScroll = row.scrollLeft;
      row.classList.add('dragging');
      clearTimeout(resumeT);
      try {
        row.setPointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
    };
    const onMove = (e: PointerEvent) => {
      if (!down) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 3) moved = true;
      row.scrollLeft = startScroll - dx;
    };
    const onEnd = (e: PointerEvent) => {
      if (!down) return;
      down = false;
      pos = row.scrollLeft;
      wrap();
      row.classList.remove('dragging');
      try {
        row.releasePointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
      resumeT = setTimeout(() => {
        if (!reduce) auto = true;
      }, 1400);
    };
    const onClick = (e: MouseEvent) => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    row.addEventListener('pointerdown', onDown);
    row.addEventListener('pointermove', onMove);
    row.addEventListener('pointerup', onEnd);
    row.addEventListener('pointercancel', onEnd);
    row.addEventListener('click', onClick, true);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(resumeT);
      row.removeEventListener('pointerdown', onDown);
      row.removeEventListener('pointermove', onMove);
      row.removeEventListener('pointerup', onEnd);
      row.removeEventListener('pointercancel', onEnd);
      row.removeEventListener('click', onClick, true);
    };
  }, [offset]);

  return (
    <div ref={rowRef} className="drag-row" aria-hidden="true">
      {cards.map((d, i) => (
        <div className="dcard" key={`${d.name}-${i}`}>
          <PlacePhoto query={d.query} fallback="🌍" className="absolute inset-0 h-full w-full" />
          <div className="g" />
          <div className="lab">
            {d.name}
            <small>{d.coord}</small>
          </div>
        </div>
      ))}
    </div>
  );
}
