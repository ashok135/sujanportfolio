import React, { useEffect, useRef } from 'react';
import { PORTFOLIO_DATA } from '../data/portfolioData';

const SoftwareLogo: React.FC<{ id: string; size?: number }> = ({ id, size = 44 }) => {
  switch (id) {
    case 'premiere':
      return (
        <svg width={size} height={size} viewBox="0 0 36 36" fill="none" aria-label="Adobe Premiere Pro">
          <rect width="36" height="36" rx="9" fill="#00005B" />
          <text x="18" y="23.5" textAnchor="middle" fill="#9999FF" fontFamily="Poppins, sans-serif" fontWeight="700" fontSize="14">
            Pr
          </text>
        </svg>
      );
    case 'aftereffects':
      return (
        <svg width={size} height={size} viewBox="0 0 36 36" fill="none" aria-label="Adobe After Effects">
          <rect width="36" height="36" rx="9" fill="#00005B" />
          <text x="18" y="23.5" textAnchor="middle" fill="#9999FF" fontFamily="Poppins, sans-serif" fontWeight="700" fontSize="14">
            Ae
          </text>
        </svg>
      );
    case 'photoshop':
      return (
        <svg width={size} height={size} viewBox="0 0 36 36" fill="none" aria-label="Adobe Photoshop">
          <rect width="36" height="36" rx="9" fill="#001E36" />
          <text x="18" y="23.5" textAnchor="middle" fill="#31A8FF" fontFamily="Poppins, sans-serif" fontWeight="700" fontSize="14">
            Ps
          </text>
        </svg>
      );
    case 'maya':
      return (
        <svg width={size} height={size} viewBox="0 0 36 36" fill="none" aria-label="Autodesk Maya">
          <rect width="36" height="36" rx="9" fill="#092C3A" />
          <path d="M8 26L13 10L18 19L23 10L28 26H23.5L21 17.5L18 23L15 17.5L12.5 26H8Z" fill="#38BDF8" />
        </svg>
      );
    case 'blender':
      return (
        <svg width={size} height={size} viewBox="0 0 36 36" fill="none" aria-label="Blender">
          <rect width="36" height="36" rx="9" fill="#271C12" />
          <circle cx="19.5" cy="19.5" r="7.5" fill="#EA7600" />
          <circle cx="19.5" cy="19.5" r="4" fill="#FFFFFF" />
          <circle cx="19.5" cy="19.5" r="2.2" fill="#265787" />
          <path d="M10 15L17.5 12.5M8 20.5L13.5 18.5M14.5 10.5L19 14" stroke="#EA7600" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
      );
    case 'canva':
      return (
        <svg width={size} height={size} viewBox="0 0 36 36" fill="none" aria-label="Canva">
          <defs>
            <linearGradient id="canvaGradTwo26" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
              <stop stopColor="#00C4CC" />
              <stop offset="1" stopColor="#7D2AE8" />
            </linearGradient>
          </defs>
          <rect width="36" height="36" rx="18" fill="url(#canvaGradTwo26)" />
          <path
            d="M22.8 21.8C21.6 23.2 20 24 18.2 24C14.7 24 12.5 21.4 12.5 18C12.5 14.6 14.8 12 18.3 12C20.1 12 21.6 12.8 22.6 14.1"
            stroke="#FFFFFF"
            strokeWidth="2.8"
            strokeLinecap="round"
          />
        </svg>
      );
    case 'ai':
    default:
      return (
        <svg width={size} height={size} viewBox="0 0 36 36" fill="none" aria-label="AI Tools">
          <rect width="36" height="36" rx="9" fill="#FACC15" />
          <path
            d="M18 8L20.3 14.7L27 17L20.3 19.3L18 26L15.7 19.3L9 17L15.7 14.7L18 8Z"
            fill="#111111"
          />
        </svg>
      );
  }
};

const SKILL_LAYERS = [
  {
    wordLeft: 'Video',
    wordRight: 'Editing',
    toolId: 'premiere',
    accentColor: '#A5B4FC',
    desc: 'Commercials, movie-trailer cuts, music albums, astrology, travel & cooking narratives in Adobe Premiere Pro.',
    align: 'left' as const,
  },
  {
    wordLeft: 'CG & VFX',
    wordRight: 'Animation',
    toolId: 'maya',
    accentColor: '#38BDF8',
    desc: 'Bollywood blockbuster VFX sequences and broadcast 3D character animation in Autodesk Maya.',
    align: 'right' as const,
  },
  {
    wordLeft: 'Motion',
    wordRight: 'Graphics',
    toolId: 'aftereffects',
    accentColor: '#C084FC',
    desc: 'Kinetic typography, rotoscopy, green-screen keying, and seamless compositing in After Effects.',
    align: 'center' as const,
  },
  {
    wordLeft: '3D',
    wordRight: 'Modeling',
    toolId: 'blender',
    accentColor: '#FB923C',
    desc: '3D scene staging, shading, lighting passes, and procedural visual effects in Blender.',
    align: 'left' as const,
  },
  {
    wordLeft: 'Poster &',
    wordRight: 'Color',
    toolId: 'photoshop',
    accentColor: '#60A5FA',
    desc: 'High-impact key art, thumbnails, and cinematic color grading in Photoshop & Canva.',
    align: 'right' as const,
  },
  {
    wordLeft: 'Generative',
    wordRight: 'AI',
    toolId: 'ai',
    accentColor: '#FACC15',
    desc: 'AI video generation, synthetic voiceovers, and rapid visual prototyping across campaigns.',
    align: 'center' as const,
  },
];

export const SkillsMatrix: React.FC = () => {
  const { personal } = PORTFOLIO_DATA;
  const containerRef = useRef<HTMLDivElement>(null);
  const desktopPathRef = useRef<SVGPathElement>(null);
  const desktopGlowRef = useRef<SVGPathElement>(null);
  const mobilePathRef = useRef<SVGPathElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const iconRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rightWordRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const paraRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    let rafId = 0;
    let currentProgress = 0;
    let targetProgress = 0;

    const measureTarget = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const windowH = window.innerHeight;
      const triggerY = windowH * 0.62;
      const rawProgress = (triggerY - rect.top) / Math.max(rect.height, 1);
      targetProgress = Math.min(Math.max(rawProgress, 0), 1);

      // Trigger each row cleanly when that row's actual position reaches the viewport sweet spot
      SKILL_LAYERS.forEach((layer, idx) => {
        const rowEl = rowRefs.current[idx];
        const rightWord = rightWordRefs.current[idx];
        const iconEl = iconRefs.current[idx];
        const paraEl = paraRefs.current[idx];
        if (!rowEl) return;

        const rowRect = rowEl.getBoundingClientRect();
        // Trigger ONLY AFTER the line tip (at 64% viewport height) has reached/passed the row (52% viewport height)
        const isReached = rowRect.top <= windowH * 0.52;

        rowEl.style.transform = isReached ? 'translate3d(0, 0, 0)' : 'translate3d(0, 6px, 0)';

        if (rightWord) {
          rightWord.style.color = isReached ? layer.accentColor : '#D4D4D8';
        }

        if (iconEl) {
          const targetW = window.innerWidth >= 640 ? 52 : 36;
          const marginX = window.innerWidth >= 640 ? 16 : 8;
          iconEl.style.width = isReached ? `${targetW}px` : '0px';
          iconEl.style.marginLeft = isReached ? `${marginX}px` : '0px';
          iconEl.style.marginRight = isReached ? `${marginX}px` : '0px';
          iconEl.style.transform = isReached ? 'scale(1)' : 'scale(0)';
          iconEl.style.opacity = isReached ? '1' : '0';
        }

        if (paraEl) {
          paraEl.style.opacity = isReached ? '1' : '0.45';
          paraEl.style.transform = isReached ? 'translate3d(0, 0, 0)' : 'translate3d(0, 6px, 0)';
        }
      });
    };

    // Smooth water-like lerp loop for SVG path drawing
    const tick = () => {
      currentProgress += (targetProgress - currentProgress) * 0.12;
      if (Math.abs(targetProgress - currentProgress) < 0.0005) {
        currentProgress = targetProgress;
      }

      [desktopPathRef.current, desktopGlowRef.current, mobilePathRef.current].forEach((path) => {
        if (!path) return;
        const len = path.getTotalLength();
        path.style.strokeDasharray = `${len}`;
        path.style.strokeDashoffset = `${len * (1 - currentProgress)}`;
      });

      rafId = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      measureTarget();
    };

    measureTarget();
    currentProgress = targetProgress;
    rafId = requestAnimationFrame(tick);

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section
      id="skills"
      className="py-20 sm:py-32 border-t border-white/[0.08] bg-[#111111] overflow-hidden"
    >
      <div className="w-full max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-14 xl:px-20">
        <div className="mb-16 sm:mb-24">
          <span className="text-xs font-medium uppercase tracking-widest text-[#FACC15]">
            Skills &amp; Software
          </span>
          <h2 className="text-2xl sm:text-5xl font-semibold text-white mt-2">
            This Is My Craft
          </h2>
          <p className="text-sm text-[#8E8E93] mt-3 max-w-xl leading-relaxed">
            {personal.fullBio}
          </p>
        </div>

        {/* Bigger Winding Pipeline + Spring Bounce Text Color Reveal */}
        <div ref={containerRef} className="relative py-6">
          {/* Desktop Smooth S-Curve SVG Pipeline */}
          <svg
            className="hidden md:block absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 900 1180"
            preserveAspectRatio="none"
            fill="none"
            aria-hidden="true"
          >
            {/* Soft background track */}
            <path
              d="M 180 40 C 180 185, 720 115, 720 260 C 720 405, 450 335, 450 475 C 450 615, 180 545, 180 690 C 180 835, 720 765, 720 910 C 720 1040, 450 1000, 450 1130"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Soft Light Glow */}
            <path
              ref={desktopGlowRef}
              d="M 180 40 C 180 185, 720 115, 720 260 C 720 405, 450 335, 450 475 C 450 615, 180 545, 180 690 C 180 835, 720 765, 720 910 C 720 1040, 450 1000, 450 1130"
              stroke="rgba(253, 224, 71, 0.24)"
              strokeWidth="18"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Main Smooth Curve */}
            <path
              ref={desktopPathRef}
              d="M 180 40 C 180 185, 720 115, 720 260 C 720 405, 450 335, 450 475 C 450 615, 180 545, 180 690 C 180 835, 720 765, 720 910 C 720 1040, 450 1000, 450 1130"
              stroke="#FDE047"
              strokeWidth="7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          {/* Mobile Smooth Curved Vertical Pipeline */}
          <svg
            className="md:hidden absolute left-1.5 top-0 bottom-0 w-9 h-full pointer-events-none"
            viewBox="0 0 36 900"
            preserveAspectRatio="none"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M 18 10 Q 30 150, 18 300 T 18 600 T 18 890"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <path
              ref={mobilePathRef}
              d="M 18 10 Q 30 150, 18 300 T 18 600 T 18 890"
              stroke="#FDE047"
              strokeWidth="5"
              strokeLinecap="round"
            />
          </svg>

          {/* Skill Layers */}
          <div className="space-y-12 sm:space-y-24 relative z-10 pl-11 md:pl-0">
            {SKILL_LAYERS.map((layer, idx) => {
              const alignClass =
                layer.align === 'right'
                  ? 'md:items-end md:text-right'
                  : layer.align === 'center'
                    ? 'md:items-center md:text-center'
                    : 'md:items-start md:text-left';

              return (
                <div
                  key={layer.wordLeft + layer.wordRight}
                  className={`flex flex-col ${alignClass}`}
                >
                  {/* Kinetic Typographic Row with Spring Bounce */}
                  <div
                    ref={(el) => {
                      rowRefs.current[idx] = el;
                    }}
                    style={{
                      transition: 'transform 520ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 380ms ease-out',
                    }}
                    className="inline-flex flex-wrap items-center gap-y-1.5 bg-[#111111]/90 px-2.5 sm:px-3 py-1.5 rounded-2xl will-change-transform max-w-full"
                  >
                    <span className="text-xl sm:text-4xl lg:text-5xl font-semibold text-white tracking-tight">
                      {layer.wordLeft}
                    </span>

                    {/* Spring-Bounce Tool Logo */}
                    <div
                      ref={(el) => {
                        iconRefs.current[idx] = el;
                      }}
                      style={{
                        width: 0,
                        opacity: 0,
                        overflow: 'hidden',
                        transformOrigin: 'center center',
                        transition:
                          'width 480ms cubic-bezier(0.34, 1.56, 0.64, 1), margin 480ms cubic-bezier(0.34, 1.56, 0.64, 1), transform 520ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 300ms ease-out',
                      }}
                      className="inline-flex items-center justify-center shrink-0 will-change-transform"
                    >
                      <SoftwareLogo id={layer.toolId} size={40} />
                    </div>

                    {/* Color-Shifting Accent Word */}
                    <span
                      ref={(el) => {
                        rightWordRefs.current[idx] = el;
                      }}
                      style={{
                        color: '#D4D4D8',
                        transition: 'color 450ms ease-out',
                      }}
                      className="text-xl sm:text-4xl lg:text-5xl font-semibold tracking-tight"
                    >
                      {layer.wordRight}
                    </span>
                  </div>

                  {/* Description Reveal */}
                  <div
                    ref={(el) => {
                      paraRefs.current[idx] = el;
                    }}
                    style={{
                      opacity: 0,
                      transition: 'transform 450ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 350ms ease-out',
                    }}
                    className="mt-3 max-w-md will-change-transform"
                  >
                    <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed bg-[#111111]/90 px-3 py-1 rounded-lg">
                      {layer.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Software Badges + Languages Footer */}
        <div className="mt-20 pt-8 border-t border-white/[0.08] flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-wrap items-center gap-2.5">
            {['premiere', 'aftereffects', 'photoshop', 'maya', 'blender', 'canva', 'ai'].map((id) => (
              <div
                key={id}
                className="p-1.5 rounded-xl bg-[#18181B] border border-white/[0.08]"
              >
                <SoftwareLogo id={id} size={28} />
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-[#8E8E93] mr-1">Languages:</span>
            {personal.languages.map((lang) => (
              <span
                key={lang}
                className="text-xs font-medium text-white px-3 py-1 bg-[#18181B] border border-white/[0.08] rounded-full"
              >
                {lang}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
