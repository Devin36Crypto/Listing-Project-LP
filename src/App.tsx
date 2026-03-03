import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Footer from "./components/Footer";
import DeviceCheck from "./components/DeviceCheck";
import { useState, lazy, Suspense, useEffect } from "react";

// Lazy load heavy components and modals
const Testimonials = lazy(() => import("./components/Testimonials"));
const Pricing = lazy(() => import("./components/Pricing"));
const ChatWidget = lazy(() => import("./components/ChatWidget"));
const TTSDemo = lazy(() => import("./components/TTSDemo"));
const PrivacyPolicy = lazy(() => import("./components/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./components/TermsOfService"));
const FeaturesModal = lazy(() => import("./components/FeaturesModal"));
const AboutModal = lazy(() => import("./components/AboutModal"));
const DownloadModal = lazy(() => import("./components/DownloadModal"));
const ChangelogModal = lazy(() => import("./components/ChangelogModal"));
const HelpCenterModal = lazy(() => import("./components/HelpCenterModal"));
const ContactModal = lazy(() => import("./components/ContactModal"));

export default function App() {
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isFeaturesOpen, setIsFeaturesOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const [isChangelogOpen, setIsChangelogOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [downloadVariant, setDownloadVariant] = useState<"auto" | "mobile" | "desktop" | "tablet" | "all">("auto");
  const [initialPlanId, setInitialPlanId] = useState<string | undefined>(undefined);
  
  const handleOpenDownload = (variant: "auto" | "mobile" | "desktop" | "tablet" | "all" = "auto") => {
    setDownloadVariant(variant);
    setInitialPlanId(undefined); // Reset initial plan when opening via generic download buttons
    setIsDownloadOpen(true);
  };

  const handlePlanSelect = (variant: "auto" | "mobile" | "desktop" | "tablet", planId: string) => {
    setDownloadVariant(variant);
    setInitialPlanId(planId);
    setIsDownloadOpen(true);
  };
  
  // PWA Install State
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  // Listen for PWA install prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt as any);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt as any);
  }, []);

  const handleInstallApp = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await (deferredPrompt as any).userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setIsDownloadOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-indigo-500/30">
      <Navbar onOpenDownload={() => handleOpenDownload("auto")} />
      <main>
        <Hero onOpenDownload={handleOpenDownload} />
        <Features />
        <Suspense fallback={<div className="py-24 text-center">Loading...</div>}>
          <Testimonials />
          <TTSDemo />
          <Pricing onPlanSelect={handlePlanSelect} />
          <ChatWidget />
        </Suspense>
        <DeviceCheck />
      </main>
      <Footer 
        onOpenPrivacy={() => setIsPrivacyOpen(true)} 
        onOpenTerms={() => setIsTermsOpen(true)}
        onOpenFeatures={() => setIsFeaturesOpen(true)}
        onOpenAbout={() => setIsAboutOpen(true)}
        onOpenDownload={() => handleOpenDownload("all")}
        onOpenChangelog={() => setIsChangelogOpen(true)}
        onOpenHelp={() => setIsHelpOpen(true)}
        onOpenContact={() => setIsContactOpen(true)}
      />
      
      <Suspense fallback={null}>
        {isPrivacyOpen && <PrivacyPolicy isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} />}
        {isTermsOpen && <TermsOfService isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />}
        {isFeaturesOpen && <FeaturesModal isOpen={isFeaturesOpen} onClose={() => setIsFeaturesOpen(false)} />}
        {isAboutOpen && <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />}
        {isChangelogOpen && <ChangelogModal isOpen={isChangelogOpen} onClose={() => setIsChangelogOpen(false)} />}
        {isHelpOpen && (
          <HelpCenterModal 
            isOpen={isHelpOpen} 
            onClose={() => setIsHelpOpen(false)} 
            onContactSupport={() => {
              setIsHelpOpen(false);
              setIsContactOpen(true);
            }} 
          />
        )}
        {isContactOpen && <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />}
        {isDownloadOpen && (
          <DownloadModal 
            isOpen={isDownloadOpen} 
            onClose={() => setIsDownloadOpen(false)} 
            deferredPrompt={deferredPrompt}
            handleInstallApp={handleInstallApp}
            variant={downloadVariant}
            initialPlanId={initialPlanId}
          />
        )}
      </Suspense>
    </div>
  );
}
