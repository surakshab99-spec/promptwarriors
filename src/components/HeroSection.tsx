import React from 'react';
import { SplineBlob } from './SplineBlob';
import { ArrowRight, Compass, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface HeroSectionProps {
  onGetStarted: () => void;
  onExploreLabs: () => void;
  splineUrl?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onGetStarted, onExploreLabs, splineUrl }) => {
  return (
    <section className="relative w-full min-h-screen bg-black text-white flex flex-col items-center justify-center pt-24 pb-16 px-6 overflow-hidden">
      {/* Central 3D Blob occupying significant screen area */}
      <div className="absolute inset-0 z-0 flex items-center justify-center opacity-90 pointer-events-auto">
        <div className="w-[90vw] md:w-[700px] h-[700px] max-w-full aspect-square">
          <SplineBlob splineUrl={splineUrl} />
        </div>
      </div>

      {/* Hero Content Overlay */}
      <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center pointer-events-none mt-12 md:mt-0">
        {/* Small uppercase text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/15 backdrop-blur-md mb-6"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-xs font-mono tracking-[0.2em] uppercase text-neutral-300">
            THE FUTURE OF CAMPUS RESOURCE SHARING
          </span>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-8xl font-black tracking-tighter text-white mb-4 drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
        >
          easeLabs
        </motion.h1>

        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-xl md:text-2xl font-light tracking-[0.25em] text-neutral-300 mb-6 uppercase font-mono"
        >
          ONE CAMPUS. INFINITE POSSIBILITIES.
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-2xl text-base md:text-lg text-neutral-400 font-normal leading-relaxed mb-10"
        >
          Discover, share, and access specialised campus laboratory resources through intelligent AI-powered resource management.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center gap-4 pointer-events-auto"
        >
          <button
            onClick={onExploreLabs}
            className="px-8 py-4 rounded-full border border-white/30 text-white bg-transparent hover:bg-white/10 hover:border-white transition-all text-sm font-mono tracking-widest flex items-center gap-3 backdrop-blur-sm group"
          >
            <Compass className="w-4 h-4 text-neutral-300 group-hover:text-white transition-colors" />
            <span>EXPLORE LABS</span>
          </button>

          <button
            onClick={onGetStarted}
            className="px-8 py-4 rounded-full bg-white text-black hover:bg-neutral-200 transition-all text-sm font-mono tracking-widest font-semibold flex items-center gap-3 shadow-[0_0_30px_rgba(255,255,255,0.25)] group"
          >
            <span>GET STARTED</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>

      {/* Bottom Sub-hint */}
      <div className="absolute bottom-6 left-0 right-0 text-center z-10 pointer-events-none">
        <span className="text-xs font-mono text-neutral-500 tracking-widest uppercase">
          Interactive WebGL 3D Environment • Move cursor to interact
        </span>
      </div>
    </section>
  );
};
