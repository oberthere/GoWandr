import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

const phases = ['Planning', 'Researching', 'Budgeting', 'Optimizing', 'Finalizing'];

interface Props {
  open: boolean;
}

export function GeneratingOverlay({ open }: Props) {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!open) {
      setPhaseIndex(0);
      return;
    }

    const totalDuration = 15000;
    const start = Date.now();

    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min(elapsed / totalDuration, 1);
      setPhaseIndex(Math.min(Math.floor(pct * phases.length), phases.length - 1));
      if (pct >= 1 && intervalRef.current) {
        // Hold on the final phase until the parent closes the overlay.
        clearInterval(intervalRef.current);
      }
    }, 50);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [open]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@1,9..144,300&family=DM+Sans:wght@300;400&display=swap');

        @keyframes spin-ring {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes rainbow-shift {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .rainbow-text {
          background: linear-gradient(90deg, #ff3cac, #ff9d00, #f9f871, #43e97b, #38f9d7, #4facfe, #b06aff, #ff3cac);
          background-size: 300% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: rainbow-shift 4s ease infinite;
        }
      `}</style>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-8"
            style={{ fontFamily: "'DM Sans', sans-serif", background: '#060609' }}
          >
            {/* Spinning rainbow ring */}
            <div
              style={{
                width: 100,
                height: 100,
                borderRadius: '50%',
                padding: 3,
                background:
                  'conic-gradient(from 0deg, #ff3cac, #ff9d00, #f9f871, #43e97b, #38f9d7, #4facfe, #b06aff, #ff3cac)',
                animation: 'spin-ring 2.5s linear infinite',
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  background: '#060609',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span style={{ color: '#fff', fontSize: '1.5rem', lineHeight: 1 }}>✦</span>
              </div>
            </div>

            {/* Cycling phase text */}
            <div
              style={{
                height: 40,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
              }}
            >
              <AnimatePresence mode="wait">
                <motion.p
                  key={phaseIndex}
                  initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="rainbow-text"
                  style={{
                    fontFamily: "'Fraunces', serif",
                    fontStyle: 'italic',
                    fontWeight: 300,
                    fontSize: '1.35rem',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {phases[phaseIndex]}
                </motion.p>
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
