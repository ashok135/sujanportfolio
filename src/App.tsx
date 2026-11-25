import { useCallback, useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { SelectedWorks } from './components/SelectedWorks';
import { ProductionCredits } from './components/ProductionCredits';
import { SkillsMatrix } from './components/SkillsMatrix';
import { ExperienceTimeline } from './components/ExperienceTimeline';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { VideoModal } from './components/VideoModal';
import { ResumeModal } from './components/ResumeModal';
import { Preloader } from './components/Preloader';

export function App() {
  const [introDone, setIntroDone] = useState(false);
  const [videoModal, setVideoModal] = useState<{
    isOpen: boolean;
    youtubeId: string | null;
    title: string | null;
  }>({
    isOpen: false,
    youtubeId: null,
    title: null,
  });

  const [resumeModalOpen, setResumeModalOpen] = useState(false);

  const handleIntroComplete = useCallback(() => {
    setIntroDone(true);
  }, []);

  const handlePlayVideo = (youtubeId: string, title: string) => {
    setVideoModal({
      isOpen: true,
      youtubeId,
      title,
    });
  };

  const handleCloseModal = () => {
    setVideoModal({
      isOpen: false,
      youtubeId: null,
      title: null,
    });
  };

  const handleOpenContact = () => {
    const contactEl = document.getElementById('contact');
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#111111] text-[#F4F4F5] flex flex-col overflow-x-clip">
      <Preloader onComplete={handleIntroComplete} />

      <Navbar
        onOpenContact={handleOpenContact}
        onOpenResume={() => setResumeModalOpen(true)}
      />

      <main className="flex-1">
        <Hero
          onPlayReel={handlePlayVideo}
          onOpenContact={handleOpenContact}
          onOpenResume={() => setResumeModalOpen(true)}
          ready={introDone}
        />
        <SelectedWorks onPlayVideo={handlePlayVideo} />
        <ProductionCredits />
        <SkillsMatrix />
        <ExperienceTimeline />
        <ContactSection onOpenResume={() => setResumeModalOpen(true)} />
      </main>

      <Footer onOpenResume={() => setResumeModalOpen(true)} />

      <VideoModal
        isOpen={videoModal.isOpen}
        youtubeId={videoModal.youtubeId}
        title={videoModal.title}
        onClose={handleCloseModal}
      />

      <ResumeModal
        isOpen={resumeModalOpen}
        onClose={() => setResumeModalOpen(false)}
      />
    </div>
  );
}

export default App;
