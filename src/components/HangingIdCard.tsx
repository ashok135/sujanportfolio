import React, { useEffect, useRef, useState } from 'react';
import { Film, MapPin, Sparkles } from 'lucide-react';
import { PORTFOLIO_DATA } from '../data/portfolioData';

/**
 * Interactive hanging Crew ID Pass with 2D spring-damper elastic lanyard physics.
 * Supports mouse and touch dragging with realistic stretch, tilt, and bounce-back.
 */
export const HangingIdCard: React.FC = () => {
  const { personal } = PORTFOLIO_DATA;
  const stageRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const strapPathRef = useRef<SVGPathElement>(null);
  const strapStripeRef = useRef<SVGPathElement>(null);
  const sheenRef = useRef<HTMLDivElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

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
  });

  useEffect(() => {
    let rafId = 0;

    // Anchor and resting card-top coordinates inside the 320x420 SVG coordinate space
    const anchorX = 160;
    const anchorY = 0;
    const restCardTopY = 86;

    const tick = () => {
      const s = stateRef.current;

      if (!s.dragging) {
        // Spring-damper elastic return toward resting hang point (0, 0)
        const stiffness = 0.085;
        const damping = 0.86;
        s.vx = (s.vx + -s.x * stiffness) * damping;
        s.vy = (s.vy + -s.y * stiffness) * damping;
        s.x += s.vx;
        s.y += s.vy;
      }

      // Couple rotation to horizontal offset and velocity for natural pendulum swing
      const targetRot = Math.max(-28, Math.min(28, s.x * 0.14 + s.vx * 0.45));
      s.rot += (targetRot - s.rot) * 0.28;

      if (cardRef.current) {
        cardRef.current.style.transform = `translate3d(${s.x.toFixed(2)}px, ${s.y.toFixed(2)}px, 0) rotate(${s.rot.toFixed(2)}deg)`;
      }

      if (sheenRef.current) {
        const sx = 50 + s.x * 0.25;
        const sy = 25 + s.y * 0.2;
        sheenRef.current.style.background = `radial-gradient(circle at ${sx}% ${sy}%, rgba(250, 204, 21, 0.16), rgba(255, 255, 255, 0.05) 35%, transparent 70%)`;
      }

      // Update elastic lanyard SVG curve from top anchor to the card's top clip
      const endX = anchorX + s.x;
      const endY = Math.max(24, restCardTopY + s.y);
      const ctrlX = anchorX + s.x * 0.45;
      const ctrlY = endY * 0.52;
      const d = `M ${anchorX} ${anchorY} Q ${ctrlX.toFixed(1)} ${ctrlY.toFixed(1)} ${endX.toFixed(1)} ${endY.toFixed(1)}`;

      if (strapPathRef.current) strapPathRef.current.setAttribute('d', d);
      if (strapStripeRef.current) strapStripeRef.current.setAttribute('d', d);

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

      // Elastic resistance beyond comfortable pull radius
      const nextX = Math.max(-135, Math.min(135, s.startCardX + dx));
      const nextY = Math.max(-45, Math.min(130, s.startCardY + dy));

      s.vx = (nextX - s.x) * 0.35;
      s.vy = (nextY - s.y) * 0.35;
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
    setHasInteracted(true);
  };

  const handleHoverNudge = () => {
    const s = stateRef.current;
    if (s.dragging) return;
    // Gentle elastic sway impulse on hover
    if (Math.abs(s.vx) < 2) {
      s.vx += s.x >= 0 ? -4.5 : 4.5;
      s.vy += 2.2;
    }
  };

  return (
    <div
      ref={stageRef}
      className="relative w-full max-w-[320px] h-[420px] mx-auto select-none flex flex-col items-center"
    >
      {/* Top Mounting Eyelet */}
      <div className="w-10 h-1.5 rounded-full bg-white/15 border border-white/10 z-10" />

      {/* Elastic Lanyard SVG */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
        viewBox="0 0 320 420"
        fill="none"
        aria-hidden="true"
      >
        <path
          ref={strapPathRef}
          d="M 160 0 Q 160 44 160 86"
          stroke="#27272A"
          strokeWidth="16"
          strokeLinecap="round"
        />
        <path
          ref={strapStripeRef}
          d="M 160 0 Q 160 44 160 86"
          stroke="#FACC15"
          strokeOpacity="0.45"
          strokeWidth="2"
          strokeDasharray="6 6"
          strokeLinecap="round"
        />
      </svg>

      {/* Draggable Hanging ID Card */}
      <div
        ref={cardRef}
        onPointerDown={handlePointerDown}
        onMouseEnter={handleHoverNudge}
        style={{ transformOrigin: 'top center' }}
        className={`relative mt-[72px] w-[252px] rounded-[24px] touch-none will-change-transform ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
      >
        {/* Brushed Metal Clip */}
        <div className="mx-auto w-10 h-5 -mb-2.5 relative z-20 rounded-t-lg bg-gradient-to-b from-zinc-300 to-zinc-500 border border-white/40 shadow-md flex items-center justify-center">
          <div className="w-5 h-1.5 rounded-full bg-[#111111]/80" />
        </div>

        {/* Badge Body */}
        <div className="relative rounded-[24px] bg-[#18181B] border border-white/15 p-5 pt-6 shadow-[0_28px_60px_-15px_rgba(0,0,0,0.85)] overflow-hidden">
          {/* Dynamic Gloss Sheen */}
          <div
            ref={sheenRef}
            className="absolute inset-0 pointer-events-none transition-opacity duration-200"
          />

          {/* Punched Lanyard Slot */}
          <div className="mx-auto w-12 h-2 rounded-full bg-[#09090B] border border-white/10 mb-4" />

          {/* Header Row */}
          <div className="relative flex items-center justify-between text-[10px] font-semibold tracking-widest uppercase text-[#8E8E93]">
            <span className="inline-flex items-center gap-1.5 text-white/90">
              <Film size={12} className="text-[#FACC15]" />
              Crew Pass
            </span>
            <span className="inline-flex items-center gap-1.5 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Available
            </span>
          </div>

          {/* Identity Block */}
          <div className="relative mt-5 pb-4 border-b border-white/[0.08]">
            <div className="w-11 h-11 rounded-2xl bg-[#FACC15] text-[#111111] font-bold text-lg flex items-center justify-center shadow-inner mb-3">
              SK
            </div>
            <div className="text-lg font-semibold text-white leading-tight">
              {personal.name}
            </div>
            <div className="text-xs text-[#FACC15] font-medium mt-1">
              Video Editor • VFX &amp; CGI
            </div>
          </div>

          {/* Credits & Location */}
          <div className="relative pt-4 space-y-2 text-[11px] text-[#A1A1AA]">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5">
                <Sparkles size={11} className="text-[#FACC15]" />
                Studio Credits
              </span>
              <span className="text-white font-medium">Chingari • Redefine</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5">
                <MapPin size={11} className="text-[#FACC15]" />
                Location
              </span>
              <span className="text-white font-medium">Bangalore, IN</span>
            </div>
          </div>

          {/* Bottom Barcode Accent */}
          <div className="relative mt-5 pt-3 border-t border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-[2px] opacity-60" aria-hidden="true">
              {[3, 1, 2, 1, 3, 2, 1, 1, 2, 3, 1, 2, 1, 2].map((w, i) => (
                <span
                  key={i}
                  style={{ width: `${w * 2}px` }}
                  className="h-4 bg-white/80 rounded-[1px]"
                />
              ))}
            </div>
            <span className="text-[10px] font-mono text-[#8E8E93] tabular-nums">
              EXP 6+ YRS
            </span>
          </div>
        </div>
      </div>

      {/* Subtle Drag Prompt */}
      <div
        className={`mt-auto pb-1 text-[11px] text-[#8E8E93] transition-opacity duration-300 pointer-events-none ${
          hasInteracted ? 'opacity-0' : 'opacity-80'
        }`}
      >
        Grab &amp; pull the pass
      </div>
    </div>
  );
};
