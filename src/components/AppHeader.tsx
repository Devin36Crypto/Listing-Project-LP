import React from 'react';
import { Sparkles } from 'lucide-react';

const AppHeader: React.FC = () => {
  return (
    <header className="flex-none p-4 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
      <div className="max-w-3xl mx-auto flex items-center justify-center">
        <div className="flex items-center gap-2">
            <Sparkles className="text-blue-400" size={20} />
            <h1 className="font-bold text-lg tracking-tight">
                <span className="text-white">ListeningProject</span>
                <span className="text-blue-400">Lp</span>
            </h1>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
