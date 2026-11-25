import React, { useEffect, useRef, useState } from 'react';
import { PORTFOLIO_DATA } from '../data/portfolioData';

/**
 * Minimal, photo-first hanging Crew ID Pass with proper elastic spring-pendulum physics.
 */
export const HangingIdCard: React.FC = () => {
  const { personal } = PORTFOLIO_DATA;
  const cardRef = useRef<HTMLDivElement>(null);
  const strapOuterRef = useRef<SVGPathElement>(null);
  const strapInnerRef = useRef<SVGPathElement>(null);

  const [isDragging, setIsDragging] = useState(false);

  const stateRef = useRef({
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    rot: 0,
    dragging: false,
    startPointerX: 0,
    startPointerY: 0,
    startCardX: 0,
    startCardY: 0,
    idleTime: 0,
  });

  useEffect(() => {
    let rafId = 0;

    // SVG coordinate space: 320 x 410; card top-center sits at (160, 82)
    const anchorX = 160;
    const anchorY = 0;
    const restClipY = 82;

    const tick = () => {
      const s = stateRef.current;
      s.idleTime += 0.025;

      if (!s.dragging) {
        // Snappy elastic spring-damper physics
        const stiffness = 0.13;
        const damping = 0.86;
        s.vx = (s.vx + -s.x * stiffness) * damping;
        s.vy = (s.vy + -s.y * stiffness) * damping;
        s.x += s.vx;
        s.y += s.vy;
      }

      // Natural pendulum tilt + subtle breathing sway when idle
      const idleSway = !s.dragging && Math.abs(s.x) < 0.8 && Math.abs(s.vx) < 0.2
        ? Math.sin(s.idleTime) * 1.4
        : 0;
      const targetRot = Math.max(-32, Math.min(32, s.x * 0.18 + s.vx * 0.55 + idleSway));
      s.rot += (targetRot - s.rot) * 0.26;

      if (cardRef.current) {
        cardRef.current.style.transform = `translate3d(${s.x.toFixed(2)}px, ${s.y.toFixed(2)}px, 0) rotate(${s.rot.toFixed(2)}deg)`;
      }

      // Keep lanyard connected right to the metal clip center
      const endX = anchorX + s.x;
      const endY = Math.max(18, restClipY + s.y);
      const ctrlX = anchorX + s.x * 0.38;
      const ctrlY = endY * 0.54;
      const d = `M ${anchorX} ${anchorY} Q ${ctrlX.toFixed(1)} ${ctrlY.toFixed(1)} ${endX.toFixed(1)} ${endY.toFixed(1)}`;

      if (strapOuterRef.current) strapOuterRef.current.setAttribute('d', d);
      if (strapInnerRef.current) strapInnerRef.current.setAttribute('d', d);

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      const s = stateRef.current;
      if (!s.dragging) return;

      const dx = e.clientX - s.startPointerX;
      const dy = e.clientY - s.startPointerY;

      // Soft elastic resistance when pulling far
      const nextX = Math.max(-140, Math.min(140, s.startCardX + dx));
      const nextY = Math.max(-45, Math.min(130, s.startCardY + dy));

      s.vx = (nextX - s.x) * 0.4;
      s.vy = (nextY - s.y) * 0.4;
      s.x = nextX;
      s.y = nextY;
    };

    const onPointerUp = () => {
      const s = stateRef.current;
      if (!s.dragging) return;
      s.dragging = false;
      setIsDragging(false);
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);
    };
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    const s = stateRef.current;
    s.dragging = true;
    s.startPointerX = e.clientX;
    s.startPointerY = e.clientY;
    s.startCardX = s.x;
    s.startCardY = s.y;
    setIsDragging(true);
  };

  const handleMouseEnter = () => {
    const s = stateRef.current;
    if (s.dragging) return;
    if (Math.abs(s.vx) < 2) {
      s.vx += s.x >= 0 ? -5.5 : 5.5;
      s.vy += 2.5;
    }
  };

  return (
    <div className="relative w-full max-w-[320px] h-[410px] mx-auto select-none flex flex-col items-center">
      {/* Top Anchor Pin */}
      <div className="w-8 h-1.5 rounded-full bg-white/20 z-10" />

      {/* Elastic Lanyard Cord */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
        viewBox="0 0 320 410"
        fill="none"
        aria-hidden="true"
      >
        <path
          ref={strapOuterRef}
          d="M 160 0 Q 160 44 160 82"
          stroke="#27272A"
          strokeWidth="12"
          strokeLinecap="round"
        />
        <path
          ref={strapInnerRef}
          d="M 160 0 Q 160 44 160 82"
          stroke="#FACC15"
          strokeOpacity="0.6"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>

      {/* Draggable Minimal ID Card */}
      <div
        ref={cardRef}
        onPointerDown={handlePointerDown}
        onMouseEnter={handleMouseEnter}
        style={{ transformOrigin: 'top center' }}
        className={`relative mt-[72px] w-[228px] touch-none will-change-transform ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
      >
        {/* Metal Lanyard Clip */}
        <div className="mx-auto w-9 h-4 -mb-2 relative z-20 rounded-t-md bg-gradient-to-b from-zinc-200 to-zinc-500 border border-white/40 shadow flex items-center justify-center">
          <div className="w-4 h-1 rounded-full bg-[#111111]" />
        </div>

        {/* Clean Card Body */}
        <div className="rounded-[22px] bg-[#18181B] border border-white/15 p-3.5 pt-4 shadow-[0_26px_55px_-12px_rgba(0,0,0,0.85)]">
          {/* Punched Slot */}
          <div className="mx-auto w-10 h-1.5 rounded-full bg-[#09090B] border border-white/10 mb-3" />

          {/* Sujan Photo */}
          <div className="relative w-full aspect-[4/4.2] rounded-2xl overflow-hidden bg-[#111111] border border-white/10">
            <img
              src="/images/sujan-profile.jpg"
              alt={personal.name}
              draggable={false}
              className="w-full h-full object-cover object-top pointer-events-none"
            />
            <span className="absolute top-2.5 right-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/65 backdrop-blur-md text-[10px] font-medium text-emerald-400 border border-white/10">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Available
            </span>
          </div>

          {/* Minimal Name & Role */}
          <div className="pt-3 pb-1 text-center">
            <div className="text-base font-semibold text-white leading-tight">
              {personal.name}
            </div>
            <div className="text-[11px] text-[#FACC15] font-medium mt-0.5">
              Video Editor • VFX &amp; CGI
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
