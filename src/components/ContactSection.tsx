import React from 'react';
import { ArrowUpRight, FileDown, Linkedin, Mail, MessageCircle, Phone } from 'lucide-react';
import { PORTFOLIO_DATA } from '../data/portfolioData';
import { HangingIdCard } from './HangingIdCard';

interface ContactSectionProps {
  onOpenResume: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ onOpenResume }) => {
  const { personal } = PORTFOLIO_DATA;

  const menuLinks = [
    { label: 'HOME', href: '#hero' },
    { label: 'WORKS', href: '#works' },
    { label: 'CREDITS', href: '#credits' },
    { label: 'SKILLS', href: '#skills' },
  ];

  const socialButtons = [
    {
      label: 'WhatsApp',
      href: personal.whatsappUrl,
      icon: MessageCircle,
      external: true,
    },
    {
      label: 'LinkedIn',
      href: personal.linkedinUrl,
      icon: Linkedin,
      external: true,
    },
    {
      label: 'Email',
      href: `mailto:${personal.email}`,
      icon: Mail,
      external: false,
    },
    {
      label: 'Phone',
      href: `tel:${personal.phoneRaw}`,
      icon: Phone,
      external: false,
    },
  ];

  return (
    <section
      id="contact"
      className="relative pt-10 pb-14 sm:pt-12 sm:pb-20 border-t border-white/[0.08] bg-[#111111] overflow-x-clip"
    >
      <div className="w-full max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-14 xl:px-20">
        {/* Top Bar: Menu Left & Social Icon Buttons Right */}
        <div className="flex items-start justify-between gap-6">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-widest text-[#8E8E93] mb-2.5">
              Menu
            </div>
            <nav className="flex flex-col gap-1.5" aria-label="Footer navigation">
              {menuLinks.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-xs font-semibold uppercase tracking-wider text-white/85 hover:text-[#FACC15] transition-colors w-fit"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2">
            {socialButtons.map((btn) => {
              const Icon = btn.icon;
              return (
                <a
                  key={btn.label}
                  href={btn.href}
                  target={btn.external ? '_blank' : undefined}
                  rel={btn.external ? 'noopener noreferrer' : undefined}
                  aria-label={btn.label}
                  title={btn.label}
                  className="w-10 h-10 rounded-lg bg-[#4A6B7C]/80 hover:bg-[#5E8498] border border-white/15 text-white flex items-center justify-center transition-colors"
                >
                  <Icon size={17} strokeWidth={1.75} />
                </a>
              );
            })}
            <button
              type="button"
              onClick={onOpenResume}
              aria-label="Download Resume / CV"
              title="Download Resume / CV"
              className="h-10 px-3.5 rounded-lg bg-[#4A6B7C]/80 hover:bg-[#5E8498] border border-white/15 text-white text-xs font-medium inline-flex items-center gap-1.5 transition-colors"
            >
              <FileDown size={15} strokeWidth={1.75} />
              <span className="hidden sm:inline">CV</span>
            </button>
          </div>
        </div>

        {/* Centerpiece: Giant "Let's talk." Split Behind Centered Hanging ID Card */}
        <div className="relative -mt-10 sm:-mt-20 flex flex-col items-center justify-center">
          <div
            aria-hidden="true"
            className="w-full flex items-center justify-center gap-[110px] sm:gap-[180px] lg:gap-[230px] pointer-events-none select-none absolute top-[195px] sm:top-[175px] left-1/2 -translate-x-1/2 z-0"
          >
            <span className="text-[3.4rem] sm:text-[6.5rem] lg:text-[9.5rem] font-extrabold tracking-tight text-white leading-none whitespace-nowrap">
              Let&apos;s
            </span>
            <span className="text-[3.4rem] sm:text-[6.5rem] lg:text-[9.5rem] font-extrabold tracking-tight text-white leading-none whitespace-nowrap">
              talk.
            </span>
          </div>

          <div className="relative z-10 w-full flex justify-center">
            <HangingIdCard />
          </div>
        </div>

        {/* Bottom Row: Get In Touch Left & Quick Actions Right */}
        <div className="mt-6 sm:mt-8 pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-widest text-[#8E8E93] mb-1.5">
              Get In Touch
            </div>
            <a
              href={`mailto:${personal.email}`}
              className="text-base sm:text-xl font-semibold text-white hover:text-[#FACC15] transition-colors block"
            >
              {personal.email}
            </a>
            <a
              href={`tel:${personal.phoneRaw}`}
              className="text-xs sm:text-sm text-[#A1A1AA] hover:text-white transition-colors mt-1 inline-block tabular-nums"
            >
              {personal.phone} · {personal.location}
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={personal.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[44px] inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-[#E4E4E7] text-[#111111] font-semibold text-xs sm:text-sm transition-colors"
            >
              <span>Message on WhatsApp</span>
              <span className="w-5 h-5 rounded-full bg-[#FACC15] flex items-center justify-center text-[#111111]">
                <ArrowUpRight size={13} strokeWidth={2} />
              </span>
            </a>

            <button
              type="button"
              onClick={onOpenResume}
              className="min-h-[44px] inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-white/[0.15] bg-[#18181B] hover:border-white/35 text-white font-medium text-xs sm:text-sm transition-colors"
            >
              <FileDown size={15} strokeWidth={1.75} />
              <span>Resume / CV</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
