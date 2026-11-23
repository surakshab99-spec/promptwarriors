import React from 'react';
import { Layers, ArrowRight } from 'lucide-react';

interface NavigationProps {
  onNavigate: (view: 'landing' | 'role_select' | 'login' | 'dashboard') => void;
  onOpenExploreLabs: () => void;
  onOpenAbout: () => void;
  onOpenLabShare: () => void;
  currentView: string;
}

export const Navigation: React.FC<NavigationProps> = ({ onNavigate, onOpenExploreLabs, onOpenAbout, onOpenLabShare, currentView }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between gap-8 px-8 py-6 bg-black/60 backdrop-blur-md border-b border-white/10">
      {/* Zone 1: Brand wordmark */}
      <button 
        onClick={() => onNavigate('landing')}
        className="flex items-center gap-3 text-white text-left font-bold tracking-wider text-lg hover:opacity-80 transition-opacity whitespace-nowrap shrink-0 group"
      >
        <div className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center bg-white/5 group-hover:border-white transition-colors">
          <Layers className="w-4 h-4 text-white" />
        </div>
        <span className="font-mono tracking-widest text-sm">easeLabs</span>
      </button>

      {/* Zone 2: 4-5 clean single-line text navigation links */}
      <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-400">
        <button 
          onClick={() => onNavigate('landing')} 
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${currentView === 'landing' ? 'text-white' : ''}`}
        >
          Home
        </button>
        <button 
          onClick={onOpenExploreLabs} 
          className="hover:text-white transition-colors whitespace-nowrap shrink-0"
        >
          Explore Labs
        </button>
        <button 
          onClick={onOpenLabShare} 
          className="hover:text-white transition-colors whitespace-nowrap shrink-0 text-cyan-400"
        >
          LabShare
        </button>
        <button 
          onClick={onOpenAbout} 
          className="hover:text-white transition-colors whitespace-nowrap shrink-0"
        >
          About
        </button>
        <button 
          onClick={() => onNavigate('role_select')} 
          className="hover:text-white transition-colors whitespace-nowrap shrink-0"
        >
          Roles
        </button>
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-4 shrink-0">
        <button
          onClick={() => onNavigate('role_select')}
          className="px-5 py-2.5 text-xs font-mono uppercase tracking-widest text-black bg-white rounded-full hover:bg-neutral-200 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)] whitespace-nowrap shrink-0"
        >
          <span>Get Started</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};
