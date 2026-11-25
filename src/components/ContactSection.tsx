import React from 'react';
import { ArrowUpRight, FileDown, Mail, Phone } from 'lucide-react';
import { PORTFOLIO_DATA } from '../data/portfolioData';

interface ContactSectionProps {
  onOpenResume: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onOpenResume }) => {
  const { personal } = PORTFOLIO_DATA;

  return (
    <section id="contact" className="py-16 sm:py-24 border-t border-white/[0.08] bg-[#111111]">
      <div className="w-full px-5 sm:px-8 lg:px-14 xl:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-7 space-y-5">
            <h2 className="text-2xl sm:text-4xl font-semibold text-white leading-[1.15]">
              Let&apos;s work on your next film, trailer, or campaign.
            </h2>
            <p className="text-sm sm:text-base text-[#8E8E93] max-w-lg leading-relaxed">
              Based in {personal.location}. Open to studio roles, freelance editing contracts, trailers, and AI-assisted visual production.
            </p>

            <div className="pt-1 flex flex-col sm:flex-row gap-3">
              <a
                href={personal.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[46px] inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-[#E4E4E7] text-[#111111] font-semibold text-sm transition-colors"
              >
                <span>Message on WhatsApp</span>
                <span className="w-5 h-5 rounded-full bg-[#FACC15] flex items-center justify-center text-[#111111]">
                  <ArrowUpRight size={13} strokeWidth={2} />
                </span>
              </a>

              <button
                onClick={onOpenResume}
                className="min-h-[46px] inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full border border-white/[0.15] bg-[#18181B] hover:border-white/35 text-white font-medium text-sm transition-colors"
              >
                <FileDown size={15} strokeWidth={1.75} />
                <span>Download Resume / CV</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-[#18181B] border border-white/[0.08] rounded-2xl divide-y divide-white/[0.08]">
              <a
                href={`mailto:${personal.email}`}
                className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-white/[0.03] transition-colors group min-h-[60px]"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Mail size={16} strokeWidth={1.75} className="text-[#FACC15] shrink-0" />
                  <div className="min-w-0">
                    <div className="text-[11px] uppercase tracking-wider text-[#8E8E93]">
                      Email
                    </div>
                    <div className="text-sm font-medium text-white truncate">
                      {personal.email}
                    </div>
                  </div>
                </div>
                <ArrowUpRight size={15} className="text-[#8E8E93] group-hover:text-white shrink-0" />
              </a>

              <a
                href={`tel:${personal.phoneRaw}`}
                className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-white/[0.03] transition-colors group min-h-[60px]"
              >
                <div className="flex items-center gap-3">
                  <Phone size={16} strokeWidth={1.75} className="text-[#FACC15] shrink-0" />
                  <div>
                    <div className="text-[11px] uppercase tracking-wider text-[#8E8E93]">
                      Phone
                    </div>
                    <div className="text-sm font-medium text-white tabular-nums">
                      {personal.phone}
                    </div>
                  </div>
                </div>
                <ArrowUpRight size={15} className="text-[#8E8E93] group-hover:text-white shrink-0" />
              </a>

              <a
                href={personal.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-white/[0.03] transition-colors group min-h-[60px]"
              >
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-[#8E8E93]">
                    LinkedIn
                  </div>
                  <div className="text-sm font-medium text-white">Sujan Kumar M.V</div>
                </div>
                <ArrowUpRight size={15} className="text-[#8E8E93] group-hover:text-white shrink-0" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
