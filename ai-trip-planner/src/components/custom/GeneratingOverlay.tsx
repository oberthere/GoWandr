import { useEffect, useRef, useState } from 'react';

const STEPS = [
  'Reading preferences...',
  'Finding stays...',
  'Mapping the day...',
  'Pricing stops...',
  'Almost there...',
];

// Once the intro plays through, keep cycling the "still working" tail so the
// overlay never freezes on a single line during a longer request.
const LOOP_START = 1;
const STEP_MS = 1500;

interface Props {
  open: boolean;
}

export function GeneratingOverlay({ open }: Props) {
  const [stepIndex, setStepIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!open) {
      setStepIndex(0);
      return;
    }
    let i = 0;
    setStepIndex(0);
    intervalRef.current = setInterval(() => {
      i = i + 1 >= STEPS.length ? LOOP_START : i + 1;
      setStepIndex(i);
    }, STEP_MS);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-canvas/90 backdrop-blur-md">
      <div className="flex max-w-85 flex-col items-center gap-4 p-6 text-center">
        <div className="h-10.5 w-10.5 animate-spin rounded-full border-2 border-line-strong border-t-ink" />
        <div className="font-display text-[1.3rem] font-semibold tracking-[-0.025em]">
          Drafting your trip
        </div>
        <div
          key={stepIndex}
          className="min-h-[1.2em] animate-[fadein_0.4s_ease] font-mono text-[0.78rem] tracking-[0.02em] text-muted2"
        >
          {STEPS[stepIndex]}
        </div>
        <div className="mt-1 h-0.75 w-50 overflow-hidden rounded-full bg-surface-2">
          <div className="h-full w-2/5 animate-[slide_1.4s_ease-in-out_infinite] rounded-full bg-ink" />
        </div>
      </div>
    </div>
  );
}
