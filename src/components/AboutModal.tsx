import React from 'react';
import { X, Layers, Shield, Cpu, Zap } from 'lucide-react';
import { motion } from 'motion/react';

interface AboutModalProps {
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-3xl bg-neutral-950 border border-neutral-800 rounded-3xl p-8 flex flex-col overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.9)]"
      >
        <div className="flex items-center justify-between pb-6 border-b border-neutral-900">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center bg-white/5">
              <Layers className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white font-mono">easeLabs ARCHITECTURE</h2>
              <p className="text-neutral-400 text-xs font-mono tracking-wider">ONE CAMPUS. INFINITE POSSIBILITIES.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-6 space-y-6 text-neutral-300 text-sm leading-relaxed overflow-y-auto max-h-[60vh] pr-2">
          <p>
            easeLabs is an intelligent AI-powered campus resource sharing and laboratory management ecosystem designed to democratize and optimize access to high-end scientific equipment across universities and research institutions.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800">
              <Cpu className="w-5 h-5 text-cyan-400 mb-3" />
              <h3 className="text-white font-bold mb-1">AI-Powered Allocation</h3>
              <p className="text-xs text-neutral-400 font-light">
                Intelligent scheduling algorithms prevent equipment conflicts and match researchers with optimal instrumentation.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800">
              <Shield className="w-5 h-5 text-indigo-400 mb-3" />
              <h3 className="text-white font-bold mb-1">Role-Based Security</h3>
              <p className="text-xs text-neutral-400 font-light">
                Strict multi-tier verification ensuring safety compliance and hierarchical faculty oversight.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-neutral-900 text-xs font-mono text-neutral-500 flex items-center justify-between">
            <span>VERSION 4.8-PRODUCTION</span>
            <span>SECURE CAMPUS MESH</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
