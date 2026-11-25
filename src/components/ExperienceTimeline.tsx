import React from 'react';
import { PORTFOLIO_DATA } from '../data/portfolioData';

export const ExperienceTimeline: React.FC = () => {
  const { experiences, education } = PORTFOLIO_DATA;

  return (
    <section id="experience" className="py-16 sm:py-24 border-t border-white/[0.08] bg-[#141416]">
      <div className="w-full px-5 sm:px-8 lg:px-14 xl:px-20">
        <div className="mb-10">
          <h2 className="text-2xl sm:text-4xl font-semibold text-white">
            Work Experience
          </h2>
        </div>

        <div className="divide-y divide-white/[0.08] border-t border-b border-white/[0.08]">
          {experiences.map((exp) => (
            <div
              key={exp.company + exp.period}
              className="py-7 grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-8"
            >
              <div className="md:col-span-4 space-y-1">
                <div className="text-xs font-semibold text-[#FACC15] tabular-nums">
                  {exp.period}
                </div>
                <div className="text-xs text-[#8E8E93]">
                  {exp.company} — {exp.type}
                </div>
              </div>

              <div className="md:col-span-8 space-y-2.5">
                <h3 className="text-lg sm:text-xl font-semibold text-white">
                  {exp.role}
                </h3>
                <p className="text-xs sm:text-sm text-[#A1A1AA] leading-relaxed max-w-2xl">
                  {exp.description}
                </p>
                <ul className="space-y-1.5 pt-1">
                  {exp.highlights.map((h) => (
                    <li key={h} className="text-xs sm:text-sm text-[#D4D4D8] flex items-start gap-2">
                      <span className="text-[#FACC15] mt-0.5 shrink-0">—</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#8E8E93] mb-5">
            Education
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {education.map((edu) => (
              <div key={edu.degree} className="p-5 bg-[#18181B] border border-white/[0.08] rounded-2xl">
                <div className="text-xs font-medium text-[#FACC15] tabular-nums">{edu.year}</div>
                <div className="text-base font-semibold text-white mt-1">{edu.degree}</div>
                <div className="text-xs text-[#8E8E93] mt-1">
                  {edu.institution} — {edu.location}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
