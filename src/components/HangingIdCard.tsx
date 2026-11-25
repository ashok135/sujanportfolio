import React, { useEffect, useRef, useState } from 'react';
import { PORTFOLIO_DATA } from '../data/portfolioData';

/**
 * BadgeFolio-style 3D hanging ID card with true elastic spring-pendulum physics.
 * Features underdamped bounce-back, throw momentum, elastic strap thinning on stretch,
 * 3D perspective tilt, and a frosted slate-blue polycarbonate badge.
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
    lastPX: 0,
    lastPY: 0,
    t: 0,
  });

  useEffect(() => {
    let rafId = 0;
    const anchorX = 160;
    const anchorY = 0;
    const restClipY = 168;

    const step = () => {
      const p = phys.current;
      p.t += 0.024;

      if (!p.dragging) {
        // Underdamped elastic spring physics for snappy multi-bounce return
        const stiffness = 0.15;
        const damping = 0.895;
        p.vx = (p.vx - p.x * stiffness) * damping;
        p.vy = (p.vy - p.y * stiffness) * damping;
        p.x += p.vx;
        p.y += p.vy;

        // Coupled pendulum swing with slight idle breathing sway
        const idleSway = Math.abs(p.x) < 1 && Math.abs(p.vx) < 0.25 ? Math.sin(p.t) * 1.15 : 0;
        const targetZ = Math.max(-38, Math.min(38, p.x * 0.18 + p.vx * 0.85 + idleSway));
        p.vRotZ = (p.vRotZ + (targetZ - p.rotZ) * 0.18) * 0.85;
        p.rotZ += p.vRotZ;
      } else {
        const targetZ = Math.max(-38, Math.min(38, p.x * 0.2 + p.vx * 0.7));
        p.rotZ += (targetZ - p.rotZ) * 0.28;
      }

      // 3D perspective tilt
      const targetRotY = Math.max(-26, Math.min(26, p.x * 0.18 + p.vx * 0.55));
      const targetRotX = Math.max(-20, Math.min(20, -p.y * 0.14 - p.vy * 0.4));
      p.rotY += (targetRotY - p.rotY) * 0.22;
      p.rotX += (targetRotX - p.rotX) * 0.22;

      if (cardRef.current) {
        cardRef.current.style.transform = `perspective(950px) translate3d(${p.x.toFixed(2)}px, ${p.y.toFixed(2)}px, 0) rotateX(${p.rotX.toFixed(2)}deg) rotateY(${p.rotY.toFixed(2)}deg) rotateZ(${p.rotZ.toFixed(2)}deg)`;
      }

      if (sheenRef.current) {
        const gx = 50 + p.rotY * 1.9;
        const gy = 30 - p.rotX * 1.9;
        sheenRef.current.style.background = `radial-gradient(circle at ${gx.toFixed(1)}% ${gy.toFixed(1)}%, rgba(255,255,255,0.22) 0%, transparent 65%)`;
      }

      // Dynamic elastic lanyard curve + subtle width thinning when stretched
      const endX = anchorX + p.x;
      const endY = Math.max(42, restClipY + p.y);
      const ctrlX = anchorX + p.x * 0.28 - p.vx * 1.4;
      const ctrlY = endY * 0.52;
      const pathD = `M ${anchorX} ${anchorY} Q ${ctrlX.toFixed(1)} ${ctrlY.toFixed(1)} ${endX.toFixed(1)} ${endY.toFixed(1)}`;

      const stretch = Math.hypot(p.x, Math.max(0, p.y));
      const ribbonWidth = Math.max(15, 22 - stretch * 0.032);

      if (ribbonRef.current) {
        ribbonRef.current.setAttribute('d', pathD);
        ribbonRef.current.setAttribute('stroke-width', ribbonWidth.toFixed(2));
      }
      if (ribbonTextPathRef.current) {
        ribbonTextPathRef.current.setAttribute('href', '#lanyardSpine');
      }

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

      // Soft non-linear rubber-band resistance at large pull distances
      const rawX = p.startX + dx;
      const rawY = p.startY + dy;
      const nextX = Math.max(-190, Math.min(190, rawX * 0.9));
      const nextY = Math.max(-70, Math.min(150, rawY * 0.85));

      // Capture true flick velocity for elastic release
      p.vx = Math.max(-35, Math.min(35, (e.clientX - p.lastPX) * 0.85));
      p.vy = Math.max(-35, Math.min(35, (e.clientY - p.lastPY) * 0.85));
      p.lastPX = e.clientX;
      p.lastPY = e.clientY;
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
    p.lastPX = e.clientX;
    p.lastPY = e.clientY;
    p.startX = p.x;
    p.startY = p.y;
    setIsDragging(true);
  };

  const handleMouseEnter = () => {
    const p = phys.current;
    if (p.dragging) return;
    if (Math.abs(p.vx) < 3) {
      p.vx += p.x >= 0 ? -7.5 : 7.5;
      p.vy += 3.0;
    }
  };

  return (
    <div className="relative w-full max-w-[320px] h-[465px] mx-auto select-none flex flex-col items-center">
      {/* Printed Lanyard Strap Flush from Top Border */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
        viewBox="0 0 320 465"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="darkRibbon" gradientUnits="userSpaceOnUse" x1="149" y1="0" x2="171" y2="0">
            <stop offset="0%" stopColor="#1A1A1F" />
            <stop offset="45%" stopColor="#222228" />
            <stop offset="100%" stopColor="#1A1A1F" />
          </linearGradient>
        </defs>
        <path
          id="lanyardSpine"
          ref={ribbonRef}
          d="M 160 0 Q 160 84 160 168"
          stroke="url(#darkRibbon)"
          strokeWidth="22"
          strokeLinecap="butt"
        />
        {/* Yellow centre stripe on lanyard */}
        <path
          d="M 160 0 Q 160 84 160 168"
          stroke="#FACC15"
          strokeWidth="3.5"
          strokeOpacity="0.75"
          strokeLinecap="butt"
        />
        <text
          fill="#FACC15"
          fillOpacity="0.55"
          fontSize="7"
          fontWeight="800"
          letterSpacing="1.8"
          dominantBaseline="central"
        >
          <textPath ref={ribbonTextPathRef} href="#lanyardSpine" startOffset="4%">
            SUJAN KUMAR • SUJAN KUMAR • SUJAN
          </textPath>
        </text>
      </svg>

      {/* 3D Draggable Badge */}
      <div
        ref={cardRef}
        onPointerDown={handlePointerDown}
        onMouseEnter={handleMouseEnter}
        style={{ transformOrigin: 'top center', transformStyle: 'preserve-3d' }}
        className={`relative mt-[154px] w-[212px] sm:w-[224px] touch-none will-change-transform ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
      >
        {/* Silver Ring & Swivel Clasp */}
        <div className="mx-auto flex flex-col items-center -mb-2.5 relative z-20 pointer-events-none">
          <div className="w-5 h-5 rounded-full border-[2.5px] border-zinc-300 bg-transparent shadow-sm" />
          <div className="w-3 h-3 -mt-1 rounded-sm bg-gradient-to-b from-zinc-200 to-zinc-500 border border-white/50 shadow" />
          <div className="w-4 h-4 -mt-0.5 rounded-b-md bg-gradient-to-b from-zinc-300 to-zinc-600 border border-white/40 shadow-md" />
        </div>

        {/* Dark Polycarbonate Card — site theme */}
        <div className="relative rounded-[18px] bg-gradient-to-b from-[#1E1E24] to-[#131318] backdrop-blur-md border border-white/[0.18] p-3.5 pt-3 shadow-[0_28px_60px_-14px_rgba(0,0,0,0.92),inset_0_1px_0_rgba(255,255,255,0.12)] overflow-hidden">
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
          <div className="mx-auto w-9 h-1.5 rounded-full bg-[#09090B] border border-white/15 mb-2.5" />

          {/* Stacked Bold Name */}
          <div className="relative leading-[0.95] tracking-tight mb-2">
            <div className="text-[19px] font-extrabold text-[#FACC15] uppercase">
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
              <div className="text-[8px] font-mono text-white/50 font-semibold mb-1">
                ID: 0006
              </div>
              <div className="flex items-end gap-[1.5px]" aria-hidden="true">
                {[3, 1, 2, 1, 3, 1, 2, 2, 1, 3, 1, 2, 1, 2, 3].map((w, i) => (
                  <span
                    key={i}
                    style={{ width: `${w * 1.8}px` }}
                    className="h-4 bg-white/75"
                  />
                ))}
              </div>
            </div>
            <div className="text-right leading-tight">
              <div className="text-[8px] font-bold uppercase tracking-wider text-[#FACC15]/80">
                VFX / EDIT
              </div>
              <div className="text-[7px] font-semibold uppercase tracking-wider text-[#FACC15]/50">
                DEPT
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
