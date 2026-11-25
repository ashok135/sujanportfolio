import React from 'react';
import { PORTFOLIO_DATA } from '../data/portfolioData';

export const ProductionCredits: React.FC = () => {
  const { blockbusters, cartoonShows } = PORTFOLIO_DATA;

  return (
    <section id="credits" className="py-16 sm:py-24 border-t border-white/[0.08] bg-[#141416]">
      <div className="w-full px-5 sm:px-8 lg:px-14 xl:px-20">
        <div className="mb-10">
          <h2 className="text-2xl sm:text-4xl font-semibold text-white">
            Film &amp; Broadcast Credits
          </h2>
          <p className="text-sm text-[#8E8E93] mt-2 max-w-xl leading-relaxed">
            Theatrical VFX and 3D character animation delivered during full-time studio tenure at Redefine (2019–2024).
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-7">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#8E8E93] pb-3 border-b border-white/[0.08]">
              Feature Film VFX
            </h3>
            <div className="divide-y divide-white/[0.08]">
              {blockbusters.map((film) => (
                <div
                  key={film.title}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div>
                    <div className="text-base font-semibold text-white">{film.title}</div>
                    <div className="text-xs text-[#8E8E93] mt-0.5">
                      {film.studio} — {film.role}
                    </div>
                  </div>
                  <span className="self-start sm:self-auto text-[11px] font-medium px-3 py-1 rounded-full bg-white/[0.06] text-[#FACC15] shrink-0">
                    {film.tag}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#8E8E93] pb-3 border-b border-white/[0.08]">
              Broadcast &amp; Streaming CGI
            </h3>
            <div className="divide-y divide-white/[0.08]">
              {cartoonShows.map((show) => (
                <div key={show.title} className="py-4">
                  <div className="flex items-baseline justify-between gap-2">
                    <div className="text-base font-semibold text-white">{show.title}</div>
                    <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-white/[0.06] text-[#4DB6AC] shrink-0">
                      {show.network}
                    </span>
                  </div>
                  <div className="text-xs text-[#8E8E93] mt-0.5">{show.role}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
