import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { PORTFOLIO_DATA, type ProjectItem } from '../data/portfolioData';
import { fetchProjectsFromGoogleSheet } from '../utils/googleSheetProjects';

interface SelectedWorksProps {
  onPlayVideo: (youtubeId: string, title: string) => void;
}

function getCategoryGroup(category: string): string {
  if (category === 'CGI & Gaming' || category === 'Bollywood') return 'VFX & CGI';
  if (category === 'Reels' || category === 'Commercials') return 'Video Editing';
  return category.trim() || 'Video Editing';
}

export const SelectedWorks: React.FC<SelectedWorksProps> = ({ onPlayVideo }) => {
  const [projects, setProjects] = useState<ProjectItem[]>(PORTFOLIO_DATA.projects);
  const [activeChip, setActiveChip] = useState<string>('All');
  const [activeIndex, setActiveIndex] = useState<number>(0);

  useEffect(() => {
    if (!PORTFOLIO_DATA.googleSheetUrl) return;
    const controller = new AbortController();
    fetchProjectsFromGoogleSheet(PORTFOLIO_DATA.googleSheetUrl, controller.signal)
      .then((sheetProjects) => {
        if (sheetProjects && sheetProjects.length > 0) {
          setProjects(sheetProjects);
          setActiveChip('All');
          setActiveIndex(0);
        }
      })
      .catch(() => {
        // Keep fallback PORTFOLIO_DATA.projects silently if offline or sheet unavailable
      });
    return () => controller.abort();
  }, []);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const maskGroupRef = useRef<SVGGElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const bgVideoRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const stripContainerRef = useRef<HTMLDivElement>(null);
  const stripCardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const categoryGroups = Array.from(new Set(projects.map((p) => getCategoryGroup(p.category))));

  const currentGallery =
    activeChip === 'All'
      ? projects
      : projects.filter((p) => getCategoryGroup(p.category) === activeChip);

  const activeProject = currentGallery[activeIndex] || currentGallery[0];

  const handleSelectChip = (chip: string) => {
    setActiveChip(chip);
    setActiveIndex(0);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : currentGallery.length - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev < currentGallery.length - 1 ? prev + 1 : 0));
  };

  // Smoothly align the active card cleanly to the front-left of the horizontal strip
  useEffect(() => {
    const container = stripContainerRef.current;
    const card = stripCardRefs.current[activeIndex];
    if (!container || !card) return;

    const containerRect = container.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();
    const targetLeft = container.scrollLeft + (cardRect.left - containerRect.left);

    container.scrollTo({
      left: Math.max(0, targetLeft),
      behavior: 'smooth',
    });
  }, [activeIndex, activeChip]);

  // Seamless Sticky Reveal:
  // 1. "WORK" mask zooms open over live background video
  // 2. As "WORK" & video fade out, the Cinematic Spotlight + Portrait Cards are ALREADY underneath in center (zero black screen!)
  useEffect(() => {
    let rafId = 0;

    const tick = () => {
      const wrapper = wrapperRef.current;
      const maskGroup = maskGroupRef.current;
      const overlay = overlayRef.current;
      const bgVideo = bgVideoRef.current;
      const spotlight = spotlightRef.current;

      if (wrapper && maskGroup && overlay && bgVideo && spotlight) {
        const rect = wrapper.getBoundingClientRect();
        const scrollable = Math.max(wrapper.offsetHeight - window.innerHeight, 1);
        const rawProgress = -rect.top / scrollable;
        const p = Math.min(Math.max(rawProgress, 0), 1);

        // 1. Zoom "WORK" cutout 1x -> 34x
        const zoom = 1 + Math.pow(p, 2.0) * 33;
        maskGroup.setAttribute(
          'transform',
          `translate(720 450) scale(${zoom.toFixed(3)}) translate(-720 -450)`
        );

        // 2. Fade mask & ambient video out cleanly between p=0.45 and p=0.78
        const maskOpacity = p < 0.50 ? 1 : Math.max(1 - (p - 0.50) / 0.25, 0);
        overlay.style.opacity = String(maskOpacity);
        overlay.style.display = maskOpacity <= 0.01 ? 'none' : 'block';

        const videoOpacity = p < 0.42 ? 1 : Math.max(1 - (p - 0.42) / 0.28, 0);
        bgVideo.style.opacity = String(videoOpacity);
        bgVideo.style.display = videoOpacity <= 0.01 ? 'none' : 'block';

        // 3. Crossfade & scale Spotlight + Portrait Cards directly into center as WORK opens
        const cardReveal = Math.min(Math.max((p - 0.38) / 0.35, 0), 1);
        const cardScale = 0.96 + cardReveal * 0.04;
        spotlight.style.opacity = String(cardReveal);
        spotlight.style.transform = `scale(${cardScale.toFixed(4)})`;
        spotlight.style.pointerEvents = cardReveal > 0.5 ? 'auto' : 'none';
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const progressPct = ((activeIndex + 1) / Math.max(currentGallery.length, 1)) * 100;

  return (
    <section id="works" className="border-t border-white/[0.08] bg-[#0E0E10]">
      {/* Unified Sticky Reveal Stage: Zero Black Gap Between WORK and Spotlight Cards */}
      <div ref={wrapperRef} className="relative h-[165vh]">
        <div className="sticky top-0 h-[100dvh] w-full overflow-hidden bg-[#0E0E10]">
          {/* LAYER 1 (Bottom): Full-Width Cinematic Spotlight + Horizontal Portrait Cards */}
          <div
            ref={spotlightRef}
            style={{ opacity: 0 }}
            className="absolute inset-0 z-10 flex flex-col justify-between pt-20 sm:pt-24 pb-8 sm:pb-12 will-change-transform"
          >
            {/* Dynamic Blurred Backdrop of Active Project */}
            {activeProject?.youtubeId && (
              <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                <img
                  key={activeProject.youtubeId}
                  src={`https://img.youtube.com/vi/${activeProject.youtubeId}/maxresdefault.jpg`}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${activeProject.youtubeId}/mqdefault.jpg`;
                  }}
                  alt=""
                  className="w-full h-full object-cover opacity-30 scale-105 blur-[2px] transition-opacity duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0C] via-[#0B0B0C]/75 to-[#0B0B0C]/40" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-[#111111]/80" />
              </div>
            )}

            {/* Top Gallery Chips */}
            <div className="relative z-10 w-full max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-14 xl:px-20">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5" role="group" aria-label="Work galleries">
                <button
                  type="button"
                  onClick={() => handleSelectChip('All')}
                  aria-pressed={activeChip === 'All'}
                  className={`px-5 py-2 rounded-full text-xs font-medium transition-colors min-h-[38px] ${
                    activeChip === 'All'
                      ? 'bg-white text-[#111111]'
                      : 'bg-white/10 backdrop-blur-md text-white/80 hover:text-white border border-white/15'
                  }`}
                >
                  All ({projects.length})
                </button>
                {categoryGroups.map((group) => {
                  const count = projects.filter((p) => getCategoryGroup(p.category) === group).length;
                  const isActive = activeChip === group;
                  return (
                    <button
                      key={group}
                      type="button"
                      onClick={() => handleSelectChip(group)}
                      aria-pressed={isActive}
                      className={`px-5 py-2 rounded-full text-xs font-medium transition-colors min-h-[38px] ${
                        isActive
                          ? 'bg-white text-[#111111]'
                          : 'bg-white/10 backdrop-blur-md text-white/80 hover:text-white border border-white/15'
                      }`}
                    >
                      {group} ({count})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Main Split: Left Active Spotlight + Right Horizontal Portrait Card Strip */}
            <div className="relative z-10 w-full max-w-[1440px] mx-auto pl-5 sm:pl-8 lg:pl-14 xl:pl-20 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-auto">
              {activeProject && (
                <div className="lg:col-span-5 pr-5 sm:pr-8 lg:pr-4 space-y-3.5 sm:space-y-4">
                  <div className="space-y-1.5">
                    <div className="w-6 h-[2px] bg-[#FACC15]" />
                    <div className="text-xs sm:text-sm font-medium text-white/80">
                      {activeProject.categoryLabel} · {activeProject.year}
                    </div>
                  </div>

                  <h3 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white uppercase leading-[1.06] tracking-tight">
                    {activeProject.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-white/75 leading-relaxed max-w-md line-clamp-3">
                    {activeProject.description}
                  </p>

                  <div className="pt-1 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => activeProject.youtubeId && onPlayVideo(activeProject.youtubeId, activeProject.title)}
                      aria-label="Play Reel"
                      className="w-10 h-10 rounded-full bg-[#FACC15] text-[#111111] flex items-center justify-center hover:scale-105 transition-transform shadow-lg"
                    >
                      <Play size={15} className="fill-[#111111] translate-x-0.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => activeProject.youtubeId && onPlayVideo(activeProject.youtubeId, activeProject.title)}
                      className="px-6 py-2.5 rounded-full border border-white/30 bg-white/5 hover:bg-white hover:text-[#111111] text-white text-xs font-semibold uppercase tracking-wider transition-colors"
                    >
                      Watch Reel
                    </button>
                  </div>
                </div>
              )}

              {/* Right Horizontal Portrait Card Strip */}
              <div
                ref={stripContainerRef}
                className="lg:col-span-7 flex gap-4 sm:gap-5 overflow-x-auto scrollbar-none pr-[45%] pb-2"
              >
                {currentGallery.map((project, idx) => {
                  const isActive = idx === activeIndex;
                  return (
                    <div
                      key={project.id}
                      ref={(el) => {
                        stripCardRefs.current[idx] = el;
                      }}
                      onClick={() => {
                        if (isActive && project.youtubeId) {
                          onPlayVideo(project.youtubeId, project.title);
                        } else {
                          setActiveIndex(idx);
                        }
                      }}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          if (isActive && project.youtubeId) {
                            onPlayVideo(project.youtubeId, project.title);
                          } else {
                            setActiveIndex(idx);
                          }
                        }
                      }}
                      className={`group relative snap-start shrink-0 w-40 sm:w-48 lg:w-56 h-56 sm:h-72 lg:h-80 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 shadow-2xl border ${
                        isActive
                          ? 'border-[#FACC15] scale-100 opacity-100'
                          : 'border-white/15 opacity-75 hover:opacity-100 hover:border-white/40'
                      }`}
                    >
                      {project.youtubeId && (
                        <img
                          src={`https://img.youtube.com/vi/${project.youtubeId}/mqdefault.jpg`}
                          alt={project.title}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />

                      {isActive && (
                        <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#FACC15] text-[#111111] flex items-center justify-center shadow-md">
                          <Play size={13} className="fill-[#111111] translate-x-0.5" />
                        </div>
                      )}

                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="w-4 h-[2px] bg-white/80 mb-2" />
                        <div className="text-[11px] text-white/75 truncate">
                          {project.categoryLabel}
                        </div>
                        <div className="text-sm sm:text-base font-bold text-white uppercase leading-tight mt-0.5 line-clamp-2">
                          {project.title}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Controls Bar */}
            <div className="relative z-10 w-full max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-14 xl:px-20 flex items-center justify-between gap-6">
              <div className="flex items-center gap-3 flex-1 max-w-xl">
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Previous project"
                  className="w-10 h-10 rounded-full border border-white/25 hover:bg-white hover:text-[#111111] text-white flex items-center justify-center transition-colors shrink-0"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Next project"
                  className="w-10 h-10 rounded-full border border-white/25 hover:bg-white hover:text-[#111111] text-white flex items-center justify-center transition-colors shrink-0"
                >
                  <ChevronRight size={16} />
                </button>

                <div className="flex-1 h-[2px] bg-white/20 ml-3 overflow-hidden rounded-full">
                  <div
                    style={{ width: `${progressPct}%` }}
                    className="h-full bg-[#FACC15] transition-all duration-300"
                  />
                </div>
              </div>

              <div className="text-3xl sm:text-5xl font-bold text-white tabular-nums tracking-tight">
                {String(activeIndex + 1).padStart(2, '0')}
              </div>
            </div>
          </div>

          {/* LAYER 2 (Middle): Live Background Video Visible Through "WORK" Cutout */}
          <div
            ref={bgVideoRef}
            className="absolute inset-0 z-20 pointer-events-none overflow-hidden"
            aria-hidden="true"
          >
            <iframe
              className="w-[140vw] h-[140vh] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              src="https://www.youtube.com/embed/MnftYQO8yHA?autoplay=1&mute=1&loop=1&playlist=MnftYQO8yHA&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1"
              title="Background Showreel"
              allow="autoplay; encrypted-media"
            />
          </div>

          {/* LAYER 3 (Top): SVG "WORK" Cutout Mask Overlay */}
          <div
            ref={overlayRef}
            className="absolute inset-0 z-30 pointer-events-none"
            aria-hidden="true"
          >
            <svg
              viewBox="0 0 1440 900"
              preserveAspectRatio="xMidYMid slice"
              className="w-full h-full block"
            >
              <defs>
                <mask id="sujan-work-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="1440" height="900">
                  <rect width="1440" height="900" fill="#ffffff" />
                  <g ref={maskGroupRef}>
                    <text
                      x="720"
                      y="450"
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="#000000"
                      className="text-[105px] sm:text-[180px] lg:text-[260px] font-bold tracking-[-0.03em]"
                      style={{
                        fontFamily: 'Poppins, sans-serif',
                      }}
                    >
                      WORK
                    </text>
                  </g>
                </mask>
              </defs>
              <rect width="1440" height="900" fill="#0B0B0C" mask="url(#sujan-work-mask)" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};
