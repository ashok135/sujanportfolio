import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Film, Play } from 'lucide-react';
import { PORTFOLIO_DATA } from '../data/portfolioData';

interface HeroProps {
  onPlayReel: (youtubeId: string, title: string) => void;
  onOpenContact: () => void;
  onOpenResume: () => void;
  ready?: boolean;
}

const DECK_CARDS = [
  {
    id: 'movie-trailer-cut',
    youtubeId: 'HVY9huLHs9I',
    title: 'Trailer Cut',
    subtitle: 'Theatrical Pacing',
    bgClass: 'bg-gradient-to-b from-[#917AE8] via-[#765ED4] to-[#5640AE]',
    textClass: 'text-white',
    entryX: -320,
    entryY: 140,
    entryRotate: -32,
    baseRotate: -14,
    baseY: 46,
    baseX: 16,
    scrollX: -480,
    scrollY: 20,
    scrollRotate: -20,
    zIndex: 10,
  },
  {
    id: 'color-grading-showcase',
    youtubeId: 'GfAGpq4RkXk',
    title: 'Color Grade',
    subtitle: 'Lumetri & LUTs',
    bgClass: 'bg-gradient-to-b from-[#F2A3A3] via-[#E48383] to-[#C96060]',
    textClass: 'text-white',
    entryX: -160,
    entryY: -100,
    entryRotate: -18,
    baseRotate: -7,
    baseY: 14,
    baseX: 6,
    scrollX: -280,
    scrollY: 10,
    scrollRotate: -12,
    zIndex: 20,
  },
  {
    id: 'gaming-demo-reel-2025',
    youtubeId: 'MnftYQO8yHA',
    title: '2025 Reel',
    subtitle: 'Gaming & 3D CGI',
    bgClass: 'bg-gradient-to-b from-[#14C4D8] via-[#0B9EB0] to-[#067482]',
    textClass: 'text-white',
    entryX: 0,
    entryY: 180,
    entryRotate: 0,
    baseRotate: 0,
    baseY: 0,
    baseX: 0,
    scrollX: 0,
    scrollY: -35,
    scrollRotate: 0,
    zIndex: 30,
    isCenter: true,
  },
  {
    id: 'commercial-video-editing-reel',
    youtubeId: 'WwTgk8z5F5Y',
    title: 'Master Reel',
    subtitle: 'Commercial Cuts',
    bgClass: 'bg-gradient-to-b from-[#6AF498] via-[#41D873] to-[#24AE52]',
    textClass: 'text-[#082612]',
    entryX: 160,
    entryY: -100,
    entryRotate: 18,
    baseRotate: 7,
    baseY: 14,
    baseX: -6,
    scrollX: 280,
    scrollY: 10,
    scrollRotate: 12,
    zIndex: 20,
  },
  {
    id: 'housing-ad-commercial',
    youtubeId: '6yaMnkZ7_GI',
    title: 'Housing Ad',
    subtitle: 'Real Estate Film',
    bgClass: 'bg-gradient-to-b from-[#5B72EA] via-[#4157D0] to-[#293B9E]',
    textClass: 'text-white',
    entryX: 320,
    entryY: 140,
    entryRotate: 32,
    baseRotate: 14,
    baseY: 46,
    baseX: -16,
    scrollX: 480,
    scrollY: 20,
    scrollRotate: 20,
    zIndex: 10,
  },
];

export const Hero: React.FC<HeroProps> = ({ onPlayReel, onOpenResume, ready = true }) => {
  const { personal } = PORTFOLIO_DATA;
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [entered, setEntered] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  useEffect(() => {
    if (!ready) return;
    const timer = requestAnimationFrame(() => {
      setEntered(true);
    });
    return () => cancelAnimationFrame(timer);
  }, [ready]);

  // Scroll-driven parting timed so cards clear right as Selected Works enters (zero blank gap)
  useEffect(() => {
    if (!entered) return;
    let rafId = 0;

    const updateScrollCards = () => {
      const progress = Math.min(Math.max(window.scrollY / 420, 0), 1);

      DECK_CARDS.forEach((card, idx) => {
        const el = cardRefs.current[idx];
        if (!el) return;

        if (window.scrollY > 4) {
          el.style.transitionDuration = '0ms';
          el.style.transitionDelay = '0ms';
        }

        const tx = card.baseX + card.scrollX * progress;
        const ty = card.baseY + card.scrollY * progress;
        const rot = card.baseRotate + card.scrollRotate * progress;
        const scale = card.isCenter ? 1.05 - progress * 0.12 : 1 - progress * 0.1;
        const opacity = Math.max(1 - Math.max(progress - 0.15, 0) * 1.2, 0);

        el.style.transform = `translate3d(${tx}px, ${ty}px, 0) rotate(${rot}deg) scale(${scale})`;
        el.style.opacity = String(opacity);
        el.style.pointerEvents = opacity <= 0.05 ? 'none' : 'auto';
      });
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateScrollCards);
    };

    const settleTimer = setTimeout(() => {
      if (window.scrollY > 4) updateScrollCards();
      window.addEventListener('scroll', onScroll, { passive: true });
    }, 900);

    return () => {
      clearTimeout(settleTimer);
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId);
    };
  }, [entered]);

  return (
    <section id="hero" className="relative min-h-[100dvh] md:min-h-0 flex flex-col justify-center md:justify-start pt-20 pb-8 sm:pt-28 sm:pb-12 overflow-hidden">
      <div className="w-full px-5 sm:px-8 lg:px-14 xl:px-20 relative">
        {/* Left Floating Cursor Badge */}
        <div className="hidden lg:flex items-center gap-1 absolute left-6 top-20 pointer-events-none select-none">
          <span className="px-3.5 py-1 rounded-full bg-[#4DB6AC] text-[#0A2220] text-xs font-semibold shadow-sm">
            Premiere Pro
          </span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="-mt-4 -ml-1 text-[#4DB6AC]">
            <path d="M2 2L14 7L8 9L6 14L2 2Z" fill="currentColor" />
          </svg>
        </div>

        {/* Right Floating Cursor Badge */}
        <div className="hidden lg:flex items-center gap-1 absolute right-6 top-36 pointer-events-none select-none">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="-mt-4 -mr-1 text-[#F08080]">
            <path d="M14 2L2 7L8 9L10 14L14 2Z" fill="currentColor" />
          </svg>
          <span className="px-3.5 py-1 rounded-full bg-[#F08080] text-[#2A0B0B] text-xs font-semibold shadow-sm">
            Maya &amp; VFX
          </span>
        </div>

        {/* Centered Editorial Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3.5 sm:space-y-4">
          <div className="inline-flex items-center gap-2 text-xs text-[#A1A1AA]">
            <Film size={13} className="text-[#FACC15]" strokeWidth={1.75} />
            <span>{personal.location}</span>
            <span className="text-white/25">—</span>
            <span>6+ Years in VFX &amp; Editing</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-[3.5rem] font-semibold text-white leading-[1.12] tracking-tight">
            Sujan Kumar M.V <br />
            <span className="font-editorial-italic text-[1.12em] pr-0.5">C</span>rafting Cinema &amp; VFX
          </h1>

          <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed max-w-xl mx-auto">
            Video Editor, Graphic Designer &amp; CGI Animator with credits on Bollywood blockbusters (<em>Brahmāstra</em>, <em>Kalki 2898 AD</em>, <em>Fighter</em>), Disney Junior &amp; Netflix series, and commercial reels.
          </p>

          {/* Mobile Quick Actions */}
          <div className="flex sm:hidden items-center justify-center gap-2.5 pt-1">
            <button
              onClick={() => onPlayReel('MnftYQO8yHA', 'Gaming 3D Demo Reel 2025')}
              className="min-h-[42px] inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#FACC15] text-[#111111] text-xs font-semibold"
            >
              <Play size={13} className="fill-[#111111]" />
              <span>Watch 2025 Reel</span>
            </button>
            <button
              onClick={onOpenResume}
              className="min-h-[42px] inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-white/15 bg-[#1A1A1D] text-white text-xs font-medium"
            >
              <span>Resume / CV</span>
            </button>
          </div>
        </div>

        {/* Desktop Vibrant Colorful Curved 5-Card Deck (Compact Spacing) */}
        <div className="hidden md:flex items-end justify-center mt-10 lg:mt-12 pt-4 pb-8">
          <div className="flex items-end justify-center -space-x-5 lg:-space-x-3 max-w-5xl w-full">
            {DECK_CARDS.map((card, idx) => {
              const initialTransform = `translate3d(${card.entryX}px, ${card.entryY}px, 0) rotate(${card.entryRotate}deg) scale(0.85)`;
              const restingTransform = `translate3d(${card.baseX}px, ${card.baseY}px, 0) rotate(${card.baseRotate}deg) scale(${card.isCenter ? 1.05 : 1})`;

              const isHovered = hoveredIdx === idx;
              const showBadge = isHovered || (hoveredIdx === null && card.isCenter);

              return (
                <div
                  key={card.id}
                  ref={(el) => {
                    cardRefs.current[idx] = el;
                  }}
                  style={{
                    zIndex: isHovered ? 50 : card.zIndex,
                    transformOrigin: 'bottom center',
                    opacity: entered ? 1 : 0,
                    transform: entered ? restingTransform : initialTransform,
                    transitionProperty: 'transform, opacity',
                    transitionDuration: '850ms',
                    transitionDelay: `${idx * 65}ms`,
                    transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  onClick={() => onPlayReel(card.youtubeId, card.title)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onPlayReel(card.youtubeId, card.title);
                    }
                  }}
                  className="group relative w-44 lg:w-52 h-64 lg:h-72 cursor-pointer will-change-transform"
                >
                  <div
                    style={{
                      boxShadow: isHovered
                        ? '0 32px 64px -12px rgba(0, 0, 0, 0.9), inset 0 1px 0 rgba(255, 255, 255, 0.45)'
                        : '0 24px 48px -12px rgba(0, 0, 0, 0.75), inset 0 1px 0 rgba(255, 255, 255, 0.35)',
                    }}
                    className={`w-full h-full rounded-[24px] p-4 flex flex-col justify-between border border-white/20 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      isHovered ? '-translate-y-7 scale-[1.07] brightness-110' : ''
                    } ${card.bgClass}`}
                  >
                    <div className="pt-1">
                      <div className={`text-base lg:text-lg font-semibold leading-tight ${card.textClass}`}>
                        {card.title}
                      </div>
                      <div className={`text-[11px] opacity-85 mt-0.5 ${card.textClass}`}>
                        {card.subtitle}
                      </div>
                    </div>

                    {showBadge && (
                      <div className="absolute -top-4 right-3 z-40 inline-flex items-center gap-2 bg-white text-[#111111] pl-3.5 pr-1.5 py-1.5 rounded-full shadow-xl text-xs font-semibold transition-transform duration-200 scale-100">
                        <span>Watch Reel</span>
                        <span className="w-6 h-6 rounded-full bg-[#FACC15] flex items-center justify-center text-[#111111]">
                          <ArrowUpRight size={13} strokeWidth={2.2} />
                        </span>
                      </div>
                    )}

                    <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black/30 border border-white/25 shadow-inner mt-auto">
                      <img
                        src={`https://img.youtube.com/vi/${card.youtubeId}/mqdefault.jpg`}
                        alt={card.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/15 flex items-center justify-center">
                        <div className="w-9 h-9 rounded-full bg-white/95 text-[#111111] shadow-md flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Play size={14} className="fill-[#111111] translate-x-0.5" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile Curved Fanned 5-Card Deck (Matches Desktop Curve, Zero Text Clipping) */}
        <div className="md:hidden mt-6 pt-4 pb-8 flex items-end justify-center overflow-hidden">
          <div className="flex items-end justify-center -space-x-4 px-1">
            {DECK_CARDS.map((card, idx) => {
              const mobileRot = card.baseRotate * 0.8;
              const mobileY = card.baseY * 0.5;
              return (
                <div
                  key={card.id}
                  onClick={() => onPlayReel(card.youtubeId, card.title)}
                  role="button"
                  tabIndex={0}
                  style={{
                    zIndex: card.zIndex,
                    transformOrigin: 'bottom center',
                    transform: entered
                      ? `translate3d(0, ${mobileY}px, 0) rotate(${mobileRot}deg) scale(${card.isCenter ? 1.08 : 0.95})`
                      : `translate3d(${card.entryX * 0.35}px, ${card.entryY * 0.4}px, 0) rotate(${card.entryRotate}deg) scale(0.75)`,
                    opacity: entered ? 1 : 0,
                    transitionProperty: 'transform, opacity',
                    transitionDuration: '800ms',
                    transitionDelay: `${idx * 55}ms`,
                    transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                    boxShadow: '0 14px 28px -8px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.35)',
                  }}
                  className={`relative w-[84px] h-36 rounded-2xl p-2 flex flex-col justify-between border border-white/25 ${card.bgClass}`}
                >
                  <div>
                    <div className={`text-[9.5px] font-semibold leading-tight ${card.textClass}`}>
                      {card.title}
                    </div>
                  </div>

                  <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black/30 border border-white/25">
                    <img
                      src={`https://img.youtube.com/vi/${card.youtubeId}/mqdefault.jpg`}
                      alt={card.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/15 flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-white/95 text-[#111111] flex items-center justify-center">
                        <Play size={10} className="fill-[#111111] translate-x-0.5" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile Bottom Factual Production Strip (Fills Mobile Hero Cleanly) */}
        <div className="md:hidden mt-2 pt-4 border-t border-white/[0.08] grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-sm font-semibold text-white tabular-nums">6+ yrs</div>
            <div className="text-[10px] text-[#8E8E93]">Experience</div>
          </div>
          <div>
            <div className="text-sm font-semibold text-white tabular-nums">5 Films</div>
            <div className="text-[10px] text-[#8E8E93]">Bollywood VFX</div>
          </div>
          <div>
            <div className="text-sm font-semibold text-white tabular-nums">4 Series</div>
            <div className="text-[10px] text-[#8E8E93]">Disney &amp; Netflix</div>
          </div>
        </div>
      </div>
    </section>
  );
};
