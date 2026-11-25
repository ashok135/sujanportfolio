import React, { useEffect, useRef, useState } from 'react';

interface PreloaderProps {
  onComplete: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [step, setStep] = useState<'enter' | 'exit' | 'done'>('enter');
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    let rafId = 0;

    // Start SVG curved curtain morph after greeting + Sujan bounce finishes (~1150ms)
    const exitTimer = setTimeout(() => {
      setStep('exit');
      onComplete();

      const duration = 680;
      const start = performance.now();

      const animateCurtain = (now: number) => {
        const t = Math.min((now - start) / duration, 1);
        // Smooth easeInOutCubic
        const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

        // Morphs: M 0 0 V 100 Q 50 100 100 100 V 0 z  ->  M 0 0 V 50 Q 50 0 100 50 V 0 z  ->  M 0 0 V 0 Q 50 0 100 0 V 0 z
        const sideY = 100 * (1 - ease);
        // Peak curve bow in the middle of the wipe
        const bow = Math.sin(ease * Math.PI) * 34;
        const controlY = Math.max(sideY - bow, 0);

        if (pathRef.current) {
          pathRef.current.setAttribute(
            'd',
            `M 0 0 V ${sideY.toFixed(2)} Q 50 ${controlY.toFixed(2)} 100 ${sideY.toFixed(2)} V 0 z`
          );
        }

        if (t < 1) {
          rafId = requestAnimationFrame(animateCurtain);
        } else {
          setStep('done');
        }
      };

      rafId = requestAnimationFrame(animateCurtain);
    }, 1150);

    return () => {
      clearTimeout(exitTimer);
      cancelAnimationFrame(rafId);
    };
  }, [onComplete]);

  if (step === 'done') return null;

  const isExiting = step === 'exit';

  return (
    <div
      className="fixed inset-0 z-[1000] h-[100dvh] pointer-events-none select-none overflow-hidden"
      aria-hidden="true"
    >
      {/* Curved Morphing SVG Curtain (mandelo.agency pattern) */}
      <svg
        className="w-full h-full block"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path
          ref={pathRef}
          fill="#0B0B0C"
          d="M 0 0 V 100 Q 50 100 100 100 V 0 z"
        />
      </svg>

      {/* Center Clip-Masked Greeting */}
      <div
        style={{
          opacity: isExiting ? 0 : 1,
          transform: isExiting ? 'translate3d(0, -24px, 0)' : 'translate3d(0, 0, 0)',
          transition: 'opacity 320ms ease-out, transform 380ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className="absolute inset-0 flex items-center justify-center px-4"
      >
        <div
          style={{
            clipPath: 'polygon(-10% 0, 110% 0, 110% 100%, -10% 100%)',
          }}
          className="flex items-center gap-2.5 sm:gap-3.5 py-2 overflow-hidden"
        >
          <span
            style={{
              animation: 'mandeloSlideUp 580ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
            }}
            className="inline-block text-2xl sm:text-4xl lg:text-5xl font-medium text-white tracking-tight"
          >
            Hey, I&apos;m
          </span>

          <span className="inline-flex items-baseline text-2xl sm:text-4xl lg:text-5xl font-semibold text-[#FACC15] tracking-tight">
            {'Sujan.'.split('').map((char, idx) => (
              <span
                key={idx}
                style={{
                  opacity: 0,
                  animation: `sujanJumpBounce 620ms cubic-bezier(0.34, 1.56, 0.64, 1) ${220 + idx * 45}ms forwards`,
                }}
                className="inline-block will-change-transform"
              >
                {char}
              </span>
            ))}
          </span>
        </div>
      </div>

      <style>{`
        @keyframes mandeloSlideUp {
          0% {
            opacity: 0;
            transform: translate3d(0, 110%, 0);
          }
          100% {
            opacity: 1;
            transform: translate3d(0, 0%, 0);
          }
        }

        @keyframes sujanJumpBounce {
          0% {
            opacity: 0;
            transform: translate3d(0, 115%, 0) scale(0.8);
          }
          55% {
            opacity: 1;
            transform: translate3d(0, -22%, 0) scale(1.08);
          }
          78% {
            opacity: 1;
            transform: translate3d(0, 6%, 0) scale(0.97);
          }
          100% {
            opacity: 1;
            transform: translate3d(0, 0%, 0) scale(1);
          }
        }
      `}</style>
    </div>
  );
};
