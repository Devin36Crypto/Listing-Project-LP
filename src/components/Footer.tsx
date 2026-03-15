import Logo from "./Logo";
import { Headphones } from "lucide-react";

interface FooterProps {
  onOpenPrivacy?: () => void;
  onOpenTerms?: () => void;
  onOpenFeatures?: () => void;
  onOpenAbout?: () => void;
  onOpenDownload?: () => void;
  onOpenChangelog?: () => void;
  onOpenHelp?: () => void;
  onOpenContact?: () => void;
  onOpenLegal?: () => void;
  onOpenStatus?: () => void;
}

export default function Footer({
  onOpenPrivacy,
  onOpenTerms,
  onOpenFeatures,
  onOpenAbout,
  onOpenDownload,
  onOpenChangelog,
  onOpenHelp,
  onOpenContact,
  onOpenLegal,
  onOpenStatus
}: FooterProps) {
  return (
    <footer className="bg-black border-t border-white/10 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Logo className="w-8 h-8" />
              <h3 className="text-xl font-bold font-display">Listening Project</h3>
            </div>
            <p className="text-gray-300 max-w-sm">
              Empowering better communication through AI-driven insights and active listening tools.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-white">Product</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <button
                  onClick={onOpenAbout}
                  className="hover:text-brand-400 transition-colors text-left"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenFeatures}
                  className="hover:text-brand-400 transition-colors text-left"
                >
                  Features
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenDownload}
                  className="hover:text-brand-400 transition-colors text-left"
                >
                  Download
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenChangelog}
                  className="hover:text-brand-400 transition-colors text-left"
                >
                  Changelog
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-white">Support</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <button
                  onClick={onOpenHelp}
                  className="hover:text-brand-400 transition-colors text-left"
                >
                  Help Center
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenContact}
                  className="hover:text-brand-400 transition-colors text-left"
                >
                  Contact Us
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenPrivacy}
                  className="hover:text-brand-400 transition-colors text-left"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenTerms}
                  className="hover:text-brand-400 transition-colors text-left"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenLegal}
                  className="hover:text-brand-400 transition-colors text-left"
                >
                  Legal Disclaimer
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-brand-500/60 text-sm">
            <Headphones className="w-4 h-4 text-brand-400" />
            <p>
              © {new Date().getFullYear()} Listening Project. All rights reserved.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onOpenStatus}
              className="flex items-center gap-2 text-xs text-gray-500 hover:text-brand-600 transition-colors"
            >
              <div className="w-2 h-2 bg-brand-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(0,229,255,0.5)]" />
              System Status
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
