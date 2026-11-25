import React, { useState, useEffect, useRef } from 'react';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  onOpenContact: () => void;
  onOpenResume: () => void;
}

const NAV_LINKS = [
  { label: 'Home', href: '#hero' },
  { label: 'Works', href: '#works' },
  { label: 'Credits', href: '#credits' },
  { label: 'Skills', href: '#skills' },
];

export const Navbar: React.FC<NavbarProps> = ({ onOpenContact, onOpenResume }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;

      // Smart header hide/show: hide when scrolling down, show when scrolling up
      if (currentY < 60) {
        setIsVisible(true);
      } else if (currentY > lastScrollY.current + 6) {
        setIsVisible(false);
        setMobileMenuOpen(false);
      } else if (currentY < lastScrollY.current - 6) {
        setIsVisible(true);
      }
      lastScrollY.current = currentY;

      // Active section tracking
      const sections = ['hero', 'works', 'credits', 'skills', 'experience', 'contact'];
      const scrollPos = currentY + 140;
      for (const sec of sections) {
        const el = document.getElementById(sec);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sec);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      style={{
        transform: isVisible ? 'translate3d(0, 0, 0)' : 'translate3d(0, -100%, 0)',
        transition: 'transform 320ms cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      className="fixed top-0 left-0 right-0 z-40 bg-[#111111]/80 backdrop-blur-md will-change-transform"
    >
      <div className="w-full px-5 sm:px-8 lg:px-14 xl:px-20 h-20 flex items-center justify-between gap-4">
        {/* Left: Asterisk Brand Mark */}
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('#hero');
          }}
          className="flex items-center gap-2.5 text-white hover:opacity-80 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-md"
          aria-label="Sujan Kumar M.V Home"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white shrink-0">
            <path
              d="M12 2V22M3.34 7L20.66 17M20.66 7L3.34 17"
              stroke="currentColor"
              strokeWidth="2.8"
              strokeLinecap="round"
            />
          </svg>
          <span className="font-semibold text-sm tracking-tight sm:hidden">Sujan</span>
        </a>

        {/* Center: Pill Navigation */}
        <nav
          className="hidden md:flex items-center gap-1 bg-[#1A1A1D] border border-white/[0.08] rounded-full px-2 py-1.5"
          aria-label="Primary Navigation"
        >
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.href.replace('#', '');
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  isActive
                    ? 'text-white bg-white/[0.08]'
                    : 'text-[#8E8E93] hover:text-white'
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </nav>

        {/* Right: Resume / CV text link + White Contact Pill */}
        <div className="hidden md:flex items-center gap-5">
          <button
            onClick={onOpenResume}
            className="text-xs font-medium text-[#D4D4D8] hover:text-white transition-colors"
          >
            Resume / CV
          </button>
          <button
            onClick={onOpenContact}
            className="text-xs font-semibold px-5 py-2.5 rounded-full bg-white text-[#111111] hover:bg-[#E4E4E7] transition-colors"
          >
            Contact
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileMenuOpen}
          className="md:hidden min-w-[44px] min-h-[44px] flex items-center justify-center text-white bg-[#1A1A1D] border border-white/[0.1] rounded-full"
        >
          {mobileMenuOpen ? <X size={18} strokeWidth={1.75} /> : <Menu size={18} strokeWidth={1.75} />}
        </button>
      </div>

      {/* Mobile Dropdown Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#18181B] border-b border-white/[0.08] px-4 py-4 space-y-1.5">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(link.href);
              }}
              className="flex items-center justify-between min-h-[44px] px-3 text-sm font-medium text-white hover:bg-white/[0.05] rounded-lg"
            >
              <span>{link.label}</span>
              <span className="text-xs text-[#8E8E93]">→</span>
            </a>
          ))}
          <div className="pt-3 mt-2 border-t border-white/[0.08] grid grid-cols-2 gap-2.5">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenResume();
              }}
              className="min-h-[44px] flex items-center justify-center text-xs font-medium text-white border border-white/[0.15] rounded-full"
            >
              Resume / CV
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenContact();
              }}
              className="min-h-[44px] flex items-center justify-center text-xs font-semibold bg-white text-[#111111] rounded-full"
            >
              Contact
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
