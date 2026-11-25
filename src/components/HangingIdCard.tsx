import React, { useEffect, useRef, useState } from 'react';
import { PORTFOLIO_DATA } from '../data/portfolioData';

/**
 * BadgeFolio-inspired 3D interactive hanging ID card with elastic lanyard physics.
 * Features 3D perspective tilt (rotateX/Y/Z), throwable spring-pendulum physics,
 * dynamic specular sheen, and a minimal photo-first layout.
 */
export const HangingIdCard: React.FC = () => {
  const { personal } = PORTFOLIO_DATA;
  const cardRef = useRef<HTMLDivElement>(null);
  const ribbonRef = useRef<SVGPathElement>(null);
  const ribbonHighlightRef = useRef<SVGPathElement>(null);
  const sheenRef = useRef<HTMLDivElement>(null);

  const [isDragging, setIsDragging] = useState(false);

  const phys = useRef({
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    rotZ: 0,
    vRotZ: 0,
    rotX: 0,
    rotY: 0,
    dragging: false,
    startPX: 0,
    startPY: 0,
    startX: 0,
    startY: 0,
    t: 0,
  });

  useEffect(() => {
    let rafId = 0;
    const anchorX = 170;
    const anchorY = 0;
    const restClipY = 92;

    const step = () => {
      const p = phys.current;
      p.t += 0.022;

      if (!p.dragging) {
        // Elastic spring return for X/Y translation
        const k = 0.11;
        const damp = 0.87;
        p.vx = (p.vx - p.x * k) * damp;
        p.vy = (p.vy - p.y * k) * damp;
        p.x += p.vx;
        p.y += p.vy;

        // Pendulum angular spring coupled to horizontal acceleration
        const targetZ = Math.max(-34, Math.min(34, p.x * 0.16 + p.vx * 0.7 + Math.sin(p.t) * 1.1));
        p.vRotZ = (p.vRotZ + (targetZ - p.rotZ) * 0.14) * 0.84;
        p.rotZ += p.vRotZ;
      } else {
        const targetZ = Math.max(-36, Math.min(36, p.x * 0.18 + p.vx * 0.65));
        p.rotZ += (targetZ - p.rotZ) * 0.25;
      }

      // 3D perspective tilt based on drag offset and velocity
      const targetRotY = Math.max(-24, Math.min(24, p.x * 0.16 + p.vx * 0.5));
      const targetRotX = Math.max(-18, Math.min(18, -p.y * 0.12 - p.vy * 0.35));
      p.rotY += (targetRotY - p.rotY) * 0.2;
      p.rotX += (targetRotX - p.rotX) * 0.2;

      if (cardRef.current) {
        cardRef.current.style.transform = `perspective(950px) translate3d(${p.x.toFixed(2)}px, ${p.y.toFixed(2)}px, 0) rotateX(${p.rotX.toFixed(2)}deg) rotateY(${p.rotY.toFixed(2)}deg) rotateZ(${p.rotZ.toFixed(2)}deg)`;
      }

      if (sheenRef.current) {
        const gx = 50 + p.rotY * 1.8;
        const gy = 30 - p.rotX * 1.8;
        sheenRef.current.style.background = `radial-gradient(circle at ${gx.toFixed(1)}% ${gy.toFixed(1)}%, rgba(255,255,255,0.18) 0%, rgba(250,204,21,0.06) 30%, transparent 68%)`;
      }

      // Attach ribbon seamlessly to the top clip center
      const endX = anchorX + p.x;
      const endY = Math.max(20, restClipY + p.y);
      const ctrlX = anchorX + p.x * 0.32;
      const ctrlY = endY * 0.55;
      const pathD = `M ${anchorX} ${anchorY} Q ${ctrlX.toFixed(1)} ${ctrlY.toFixed(1)} ${endX.toFixed(1)} ${endY.toFixed(1)}`;

      if (ribbonRef.current) ribbonRef.current.setAttribute('d', pathD);
      if (ribbonHighlightRef.current) ribbonHighlightRef.current.setAttribute('d', pathD);

      rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, []);

  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      const p = phys.current;
      if (!p.dragging) return;

      const dx = e.clientX - p.startPX;
      const dy = e.clientY - p.startPY;

      // Rubber-band resistance when pulled far
      const rawX = p.startX + dx;
      const rawY = p.startY + dy;
      const nextX = Math.max(-150, Math.min(150, rawX * 0.92));
      const nextY = Math.max(-45, Math.min(135, rawY * 0.9));

      p.vx = (nextX - p.x) * 0.55;
      p.vy = (nextY - p.y) * 0.55;
      p.x = nextX;
      p.y = nextY;
    };

    const onPointerUp = () => {
      const p = phys.current;
      if (!p.dragging) return;
      p.dragging = false;
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
    const p = phys.current;
    p.dragging = true;
    p.startPX = e.clientX;
    p.startPY = e.clientY;
    p.startX = p.x;
    p.startY = p.y;
    setIsDragging(true);
  };

  const handleMouseEnter = () => {
    const p = phys.current;
    if (p.dragging) return;
    if (Math.abs(p.vx) < 2) {
      p.vx += p.x >= 0 ? -5.2 : 5.2;
      p.vy += 2.2;
    }
  };

  return (
    <div className="relative w-full max-w-[340px] h-[430px] mx-auto select-none flex flex-col items-center">
      {/* Top Anchor Grommet */}
      <div className="w-10 h-1.5 rounded-full bg-white/20 z-10" />

      {/* Printed Fabric Lanyard Ribbon */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
        viewBox="0 0 340 430"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="lanyardGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#1C1C21" />
            <stop offset="50%" stopColor="#2E2E36" />
            <stop offset="100%" stopColor="#18181B" />
          </linearGradient>
        </defs>
        <path
          ref={ribbonRef}
          d="M 170 0 Q 170 50 170 92"
          stroke="url(#lanyardGrad)"
          strokeWidth="22"
          strokeLinecap="round"
        />
        <path
          ref={ribbonHighlightRef}
          d="M 170 0 Q 170 50 170 92"
          stroke="#FACC15"
          strokeOpacity="0.45"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>

      {/* 3D Draggable ID Card */}
      <div
        ref={cardRef}
        onPointerDown={handlePointerDown}
        onMouseEnter={handleMouseEnter}
        style={{ transformOrigin: 'top center', transformStyle: 'preserve-3d' }}
        className={`relative mt-[78px] w-[236px] touch-none will-change-transform ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
      >
        {/* Realistic Metal Swivel Clasp */}
        <div className="mx-auto flex flex-col items-center -mb-2 relative z-20 pointer-events-none">
          <div className="w-6 h-3 rounded-t-md bg-gradient-to-b from-zinc-200 to-zinc-500 border border-white/50 shadow" />
          <div className="w-3.5 h-3.5 -mt-0.5 rounded-full border-[2.5px] border-zinc-300 bg-[#111111] shadow-sm" />
          <div className="w-8 h-3 -mt-1 rounded-sm bg-gradient-to-b from-zinc-300 to-zinc-600 border border-white/40 shadow-md" />
        </div>

        {/* Polycarbonate Badge Shell */}
        <div className="relative rounded-[22px] bg-gradient-to-b from-[#1E1E22] to-[#131316] border border-white/20 p-3.5 pt-4 shadow-[0_30px_60px_-14px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.2)] overflow-hidden">
          {/* Dynamic 3D Specular Sheen */}
          <div ref={sheenRef} className="absolute inset-0 pointer-events-none z-10" />

          {/* Punched Slot */}
          <div className="mx-auto w-11 h-1.5 rounded-full bg-[#09090B] border border-white/15 mb-3" />

          {/* Sujan Photo */}
          <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-[#0E0E10] border border-white/10">
            <img
              src="/images/sujan-profile.jpg"
              alt={personal.name}
              draggable={false}
              className="w-full h-full object-cover object-top pointer-events-none"
            />
          </div>

          {/* Minimal Footer */}
          <div className="relative pt-3.5 pb-0.5 flex items-center justify-between gap-2">
            <div className="min-w-0">
              <div className="text-[15px] font-semibold text-white leading-tight truncate">
                {personal.name}
              </div>
              <div className="text-[11px] text-[#FACC15] font-medium mt-0.5 truncate">
                Video Editor &amp; VFX
              </div>
            </div>
            <span
              title="Available for work"
              className="shrink-0 w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
