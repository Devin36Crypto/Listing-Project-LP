import { Menu, X } from "lucide-react";
import { useState } from "react";
import Logo from "./Logo";

export default function Navbar({ onOpenDownload }: { onOpenDownload?: () => void }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.location.reload()}>
            <Logo className="w-10 h-10" />
            <span className="text-xl font-bold tracking-tight font-display">
              Listening <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-sky-400">Project</span>
            </span>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a href="#features" className="hover:text-brand-400 transition-colors px-3 py-2 rounded-md text-sm font-medium">Features</a>
              <a href="#testimonials" className="hover:text-brand-400 transition-colors px-3 py-2 rounded-md text-sm font-medium">Stories</a>
              <a href="#pricing" className="hover:text-brand-400 transition-colors px-3 py-2 rounded-md text-sm font-medium">Pricing</a>
              <a
                href="https://play.google.com/store/apps"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-br from-brand-400 to-brand-600 hover:scale-105 transition-all text-black px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(0,229,255,0.3)]"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                </svg>
                Get on Google Play
              </a>
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div
          className="md:hidden bg-black/95 border-b border-white/10"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a href="#features" className="block px-3 py-2 rounded-md text-base font-medium hover:text-brand-400">Features</a>
            <a href="#testimonials" className="block px-3 py-2 rounded-md text-base font-medium hover:text-brand-400">Stories</a>
            <a href="#demo" className="block px-3 py-2 rounded-md text-base font-medium hover:text-brand-400">AI Demo</a>
            <a href="#pricing" className="block px-3 py-2 rounded-md text-base font-medium hover:text-brand-400">Pricing</a>
            <a
              href="https://play.google.com/store/apps"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium bg-brand-500/20 text-brand-400 flex items-center gap-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
              </svg>
              Get on Google Play
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
