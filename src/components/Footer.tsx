import { Github, Twitter, Linkedin, Mail, Headphones } from "lucide-react";
import Logo from "./Logo";

interface FooterProps {
  onOpenPrivacy?: () => void;
  onOpenTerms?: () => void;
  onOpenFeatures?: () => void;
  onOpenAbout?: () => void;
  onOpenDownload?: () => void;
  onOpenChangelog?: () => void;
  onOpenHelp?: () => void;
  onOpenContact?: () => void;
}

export default function Footer({ 
  onOpenPrivacy, 
  onOpenTerms, 
  onOpenFeatures, 
  onOpenAbout, 
  onOpenDownload, 
  onOpenChangelog,
  onOpenHelp,
  onOpenContact
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
            <p className="text-gray-400 max-w-sm">
              Empowering better communication through AI-driven insights and active listening tools.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-gray-200">Product</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <button 
                  onClick={onOpenAbout}
                  className="hover:text-indigo-400 transition-colors text-left"
                >
                  About Us
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenFeatures}
                  className="hover:text-indigo-400 transition-colors text-left"
                >
                  Features
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenDownload}
                  className="hover:text-indigo-400 transition-colors text-left"
                >
                  Download
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenChangelog}
                  className="hover:text-indigo-400 transition-colors text-left"
                >
                  Changelog
                </button>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-gray-200">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <button 
                  onClick={onOpenHelp}
                  className="hover:text-indigo-400 transition-colors text-left"
                >
                  Help Center
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenContact}
                  className="hover:text-indigo-400 transition-colors text-left"
                >
                  Contact Us
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenPrivacy}
                  className="hover:text-indigo-400 transition-colors text-left"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button 
                  onClick={onOpenTerms}
                  className="hover:text-indigo-400 transition-colors text-left"
                >
                  Terms of Service
                </button>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <Headphones className="w-4 h-4" />
            <p>
              © {new Date().getFullYear()} Listening Project. All rights reserved.
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <a href="#" className="text-gray-400 hover:text-white transition-colors"><Twitter className="w-5 h-5" /></a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors"><Github className="w-5 h-5" /></a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors"><Linkedin className="w-5 h-5" /></a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors"><Mail className="w-5 h-5" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
