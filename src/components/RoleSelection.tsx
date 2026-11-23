import React from 'react';
import { UserRole } from '../types';
import { GraduationCap, Award, Wrench, ShieldAlert, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

interface RoleSelectionProps {
  onSelectRole: (role: UserRole) => void;
  onBack: () => void;
}

export const RoleSelection: React.FC<RoleSelectionProps> = ({ onSelectRole, onBack }) => {
  const roles: { id: UserRole; title: string; desc: string; icon: React.ReactNode; buttonText: string }[] = [
    {
      id: 'student',
      title: 'STUDENT',
      desc: 'Discover equipment, find laboratories, submit project requests, and reserve resources.',
      icon: <GraduationCap className="w-6 h-6 text-cyan-400" />,
      buttonText: 'CONTINUE AS STUDENT'
    },
    {
      id: 'faculty',
      title: 'FACULTY',
      desc: 'Review project requests, approve laboratory access, and monitor student requirements.',
      icon: <Award className="w-6 h-6 text-indigo-400" />,
      buttonText: 'CONTINUE AS FACULTY'
    },
    {
      id: 'lab_admin',
      title: 'LAB ADMINISTRATOR',
      desc: 'Manage equipment, laboratory availability, maintenance, and bookings.',
      icon: <Wrench className="w-6 h-6 text-amber-400" />,
      buttonText: 'CONTINUE AS LAB ADMIN'
    },
    {
      id: 'super_admin',
      title: 'SUPER ADMINISTRATOR',
      desc: 'Manage users, departments, permissions, and platform-wide operations.',
      icon: <ShieldAlert className="w-6 h-6 text-rose-400" />,
      buttonText: 'CONTINUE AS SUPER ADMIN'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between px-6 py-12 relative overflow-hidden">
      {/* Background radial gradient */}
      <div className="absolute inset-0 bg-radial from-neutral-900/40 via-black to-black pointer-events-none" />

      {/* Top Header */}
      <div className="relative z-10 max-w-7xl mx-auto w-full flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors text-sm font-mono"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO HOME</span>
        </button>
        <span className="text-xs font-mono tracking-widest text-neutral-500 uppercase">
          SECURE ACCESS PORTAL // STEP 01
        </span>
      </div>

      {/* Main Container */}
      <div className="relative z-10 max-w-5xl mx-auto w-full my-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">
            SELECT YOUR ACCESS ROLE
          </h2>
          <p className="text-neutral-400 max-w-xl mx-auto text-sm md:text-base mb-12 font-light">
            easeLabs authenticates and routes permissions according to institutional credentials and verified campus roles.
          </p>
        </motion.div>

        {/* Role Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          {roles.map((r, index) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              onClick={() => onSelectRole(r.id)}
              className="group relative bg-neutral-950/80 border border-neutral-800 rounded-2xl p-8 hover:border-white/40 hover:bg-neutral-900/60 transition-all cursor-pointer flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:shadow-[0_0_30px_rgba(255,255,255,0.08)]"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 group-hover:border-neutral-700 transition-colors">
                    {r.icon}
                  </div>
                  <span className="text-xs font-mono text-neutral-500 uppercase tracking-widest">
                    ROLE 0{index + 1}
                  </span>
                </div>

                <h3 className="text-xl font-bold tracking-wide text-white mb-3 group-hover:text-cyan-200 transition-colors">
                  {r.title}
                </h3>

                <p className="text-neutral-400 text-sm leading-relaxed mb-8 font-light">
                  {r.desc}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-neutral-900 group-hover:border-neutral-800 transition-colors">
                <span className="text-xs font-mono tracking-widest text-white group-hover:text-cyan-400 transition-colors font-medium">
                  {r.buttonText}
                </span>
                <div className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer info */}
      <div className="relative z-10 max-w-7xl mx-auto w-full text-center mt-12 text-xs font-mono text-neutral-600">
        NEXUS LAB AUTHENTICATION SYSTEM // RBAC ENFORCED
      </div>
    </div>
  );
};
