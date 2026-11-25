import React, { useEffect, useRef, useState } from 'react';
import { PORTFOLIO_DATA } from '../data/portfolioData';

/**
 * BadgeFolio-style hanging ID badge with printed lanyard strap, silver swivel clasp,
 * frosted polycarbonate card, 3D perspective tilt, and elastic spring-pendulum physics.
 */
export const HangingIdCard: React.FC = () => {
  const { personal } = PORTFOLIO_DATA;
  const cardRef = useRef<HTMLDivElement>(null);
  const ribbonRef = useRef<SVGPathElement>(null);
  const ribbonTextPathRef = useRef<SVGTextPathElement>(null);
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
    const anchorX = 160;
    const anchorY = 0;
    const restClipY = 176;

    const step = () => {
      const p = phys.current;
      p.t += 0.022;

      if (!p.dragging) {
        const k = 0.11;
        const damp = 0.87;
        p.vx = (p.vx - p.x * k) * damp;
        p.vy = (p.vy - p.y * k) * damp;
        p.x += p.vx;
        p.y += p.vy;

        const targetZ = Math.max(-32, Math.min(32, p.x * 0.16 + p.vx * 0.65 + Math.sin(p.t) * 1.1));
        p.vRotZ = (p.vRotZ + (targetZ - p.rotZ) * 0.14) * 0.84;
        p.rotZ += p.vRotZ;
      } else {
        const targetZ = Math.max(-34, Math.min(34, p.x * 0.18 + p.vx * 0.6));
        p.rotZ += (targetZ - p.rotZ) * 0.25;
      }

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
        sheenRef.current.style.background = `radial-gradient(circle at ${gx.toFixed(1)}% ${gy.toFixed(1)}%, rgba(255,255,255,0.22) 0%, transparent 65%)`;
      }

      const endX = anchorX + p.x;
      const endY = Math.max(40, restClipY + p.y);
      const ctrlX = anchorX + p.x * 0.35;
      const ctrlY = endY * 0.55;
      const pathD = `M ${anchorX} ${anchorY} Q ${ctrlX.toFixed(1)} ${ctrlY.toFixed(1)} ${endX.toFixed(1)} ${endY.toFixed(1)}`;

      if (ribbonRef.current) ribbonRef.current.setAttribute('d', pathD);
      if (ribbonTextPathRef.current) ribbonTextPathRef.current.setAttribute('href', '#lanyardSpine');

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

      const nextX = Math.max(-150, Math.min(150, (p.startX + dx) * 0.92));
      const nextY = Math.max(-55, Math.min(125, (p.startY + dy) * 0.9));

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
    <div className="relative w-full max-w-[320px] h-[470px] mx-auto select-none flex flex-col items-center">
      {/* Printed Lanyard Strap from Top Edge */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
        viewBox="0 0 320 470"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="slateRibbon" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#4F7084" />
            <stop offset="50%" stopColor="#6B8FA4" />
            <stop offset="100%" stopColor="#456375" />
          </linearGradient>
        </defs>
        <path
          id="lanyardSpine"
          ref={ribbonRef}
          d="M 160 0 Q 160 88 160 176"
          stroke="url(#slateRibbon)"
          strokeWidth="20"
          strokeLinecap="butt"
        />
        <text
          fill="#0F172A"
          fontSize="7.5"
          fontWeight="700"
          letterSpacing="1.6"
          dominantBaseline="central"
        >
          <textPath ref={ribbonTextPathRef} href="#lanyardSpine" startOffset="14%">
            SUJAN KUMAR • SUJAN KUMAR •
          </textPath>
        </text>
      </svg>

      {/* 3D Draggable Badge */}
      <div
        ref={cardRef}
        onPointerDown={handlePointerDown}
        onMouseEnter={handleMouseEnter}
        style={{ transformOrigin: 'top center', transformStyle: 'preserve-3d' }}
        className={`relative mt-[162px] w-[212px] sm:w-[224px] touch-none will-change-transform ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
      >
        {/* Silver Ring & Swivel Clasp */}
        <div className="mx-auto flex flex-col items-center -mb-2.5 relative z-20 pointer-events-none">
          <div className="w-5 h-5 rounded-full border-[2.5px] border-zinc-300 bg-transparent shadow-sm" />
          <div className="w-3 h-3 -mt-1 rounded-sm bg-gradient-to-b from-zinc-200 to-zinc-500 border border-white/50 shadow" />
          <div className="w-4 h-4 -mt-0.5 rounded-b-md bg-gradient-to-b from-zinc-300 to-zinc-600 border border-white/40 shadow-md" />
        </div>

        {/* Frosted Slate-Blue Polycarbonate Card */}
        <div className="relative rounded-[18px] bg-gradient-to-br from-[#7B9BAE]/90 via-[#5D7E93]/85 to-[#446173]/90 backdrop-blur-md border border-white/25 p-3.5 pt-3 shadow-[0_28px_60px_-14px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.3)] overflow-hidden">
          {/* Dynamic Specular Sheen */}
          <div ref={sheenRef} className="absolute inset-0 pointer-events-none z-10" />

          {/* Subtle Topographic Curves */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none opacity-20"
            viewBox="0 0 220 290"
            fill="none"
            aria-hidden="true"
          >
            <path d="M-20 220 C 60 180, 140 260, 240 200" stroke="white" strokeWidth="1" />
            <path d="M-20 245 C 70 205, 150 280, 240 225" stroke="white" strokeWidth="1" />
          </svg>

          {/* Top Punched Slot */}
          <div className="mx-auto w-9 h-1.5 rounded-full bg-[#111111]/70 border border-white/20 mb-2.5" />

          {/* Stacked Bold Name */}
          <div className="relative leading-[0.95] tracking-tight mb-2">
            <div className="text-[19px] font-extrabold text-[#111111] uppercase">
              SUJAN
            </div>
            <div className="text-[19px] font-extrabold text-white uppercase">
              KUMAR
            </div>
          </div>

          {/* Portrait Photo */}
          <div className="relative w-full aspect-[4/4.1] rounded-lg overflow-hidden bg-[#111111] border border-white/20 shadow-inner">
            <img
              src="/images/sujan-profile.jpg"
              alt={personal.name}
              draggable={false}
              className="w-full h-full object-cover object-top grayscale contrast-110 pointer-events-none"
            />
          </div>

          {/* Bottom ID & Barcode Strip */}
          <div className="relative mt-2.5 pt-1 flex items-end justify-between gap-2">
            <div>
              <div className="text-[8px] font-mono text-[#111111]/80 font-semibold mb-1">
                ID: 0006
              </div>
              <div className="flex items-end gap-[1.5px]" aria-hidden="true">
                {[3, 1, 2, 1, 3, 1, 2, 2, 1, 3, 1, 2, 1, 2, 3].map((w, i) => (
                  <span
                    key={i}
                    style={{ width: `${w * 1.8}px` }}
                    className="h-4 bg-[#111111]/90"
                  />
                ))}
              </div>
            </div>
            <div className="text-right leading-tight">
              <div className="text-[8px] font-bold uppercase tracking-wider text-[#111111]/85">
                VFX / EDIT
              </div>
              <div className="text-[7px] font-semibold uppercase tracking-wider text-[#111111]/65">
                DEPT
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
