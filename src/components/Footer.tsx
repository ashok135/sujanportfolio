import React from 'react';
import { PORTFOLIO_DATA } from '../data/portfolioData';

interface FooterProps {
  onOpenResume: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenResume }) => {
  const { personal } = PORTFOLIO_DATA;
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/[0.08] bg-[#111111] py-8">
      <div className="w-full px-5 sm:px-8 lg:px-14 xl:px-20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8E8E93]">
        <div>
          © {year} {personal.name} — {personal.location}
        </div>
        <div className="flex items-center gap-6">
          <a href="#works" className="hover:text-white transition-colors">
            Works
          </a>
          <a href="#credits" className="hover:text-white transition-colors">
            Credits
          </a>
          <a href="#skills" className="hover:text-white transition-colors">
            Skills
          </a>
          <button
            onClick={onOpenResume}
            className="font-semibold text-[#FACC15] hover:underline"
          >
            Resume / CV
          </button>
        </div>
      </div>
    </footer>
  );
};
