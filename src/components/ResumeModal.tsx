import React, { useEffect } from 'react';
import { X, FileText, LayoutTemplate, ArrowUpRight } from 'lucide-react';
import { PORTFOLIO_DATA } from '../data/portfolioData';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose }) => {
  const { personal } = PORTFOLIO_DATA;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="resume-modal-title"
    >
      <div
        className="w-full max-w-md bg-[#18181B] border border-white/[0.1] rounded-2xl p-6 sm:p-7"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/[0.08]">
          <div>
            <h3 id="resume-modal-title" className="text-lg font-semibold text-white">
              Select Resume / CV
            </h3>
            <p className="text-xs text-[#8E8E93] mt-1">
              Choose the format you would like to open or download.
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close resume selector"
            className="min-w-[36px] min-h-[36px] flex items-center justify-center rounded-full text-[#8E8E93] hover:text-white hover:bg-white/[0.08] transition-colors"
          >
            <X size={18} strokeWidth={1.75} />
          </button>
        </div>

        <div className="mt-5 space-y-3">
          <a
            href={personal.atsResumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="flex items-center justify-between gap-4 p-4 rounded-xl border border-white/[0.08] bg-[#111111] hover:border-white/25 transition-colors group"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-[#0DB2C4]/20 text-[#2DD4BF] flex items-center justify-center shrink-0">
                <FileText size={18} strokeWidth={1.75} />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-white">Sujan ATS Resume</div>
                <div className="text-xs text-[#8E8E93] mt-0.5">
                  Single-column ATS-friendly PDF for recruiters
                </div>
              </div>
            </div>
            <ArrowUpRight size={16} className="text-[#8E8E93] group-hover:text-white shrink-0" />
          </a>

          <a
            href={personal.visualCvUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="flex items-center justify-between gap-4 p-4 rounded-xl border border-white/[0.08] bg-[#111111] hover:border-white/25 transition-colors group"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-[#FACC15]/20 text-[#FACC15] flex items-center justify-center shrink-0">
                <LayoutTemplate size={18} strokeWidth={1.75} />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-white">Sujan Visual CV</div>
                <div className="text-xs text-[#8E8E93] mt-0.5">
                  Two-column designed creative portfolio CV
                </div>
              </div>
            </div>
            <ArrowUpRight size={16} className="text-[#8E8E93] group-hover:text-white shrink-0" />
          </a>
        </div>
      </div>
    </div>
  );
};
