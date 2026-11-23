import React, { useEffect, useState } from 'react';
import { User, Equipment, Laboratory, EquipmentBooking } from '../../types';
import { SplineBlob } from '../SplineBlob';
import { ShieldAlert, Users, Building2, Cpu, Calendar, LogOut } from 'lucide-react';
import { motion } from 'motion/react';

interface SuperAdminDashboardProps {
  user: User;
  onLogout: () => void;
}

export const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({ user, onLogout }) => {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [labs, setLabs] = useState<Laboratory[]>([]);
  const [bookings, setBookings] = useState<EquipmentBooking[]>([]);

  useEffect(() => {
    Promise.all([
      fetch('/api/equipment').then(res => res.json()),
      fetch('/api/labs').then(res => res.json()),
      fetch('/api/bookings').then(res => res.json())
    ]).then(([eqData, labData, bkData]) => {
      setEquipment(eqData);
      setLabs(labData);
      setBookings(bkData);
    });
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col selection:bg-white selection:text-black">
      {/* Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-8 py-6 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center bg-white/5 overflow-hidden relative">
            <div className="absolute inset-0">
              <SplineBlob isMini={true} />
            </div>
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white font-mono">SUPER ADMINISTRATOR DIRECTORATE</h1>
            <p className="text-xs text-neutral-400 font-mono">WELCOME, {user.fullName.toUpperCase()} ({user.department})</p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-mono text-neutral-300 hover:text-white transition-all"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>LOGOUT</span>
        </button>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-6 md:p-8 space-y-8">
        {/* Top Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
          <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6">
            <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest">Total Users</span>
            <div className="text-3xl font-black text-white mt-2 font-mono">1,420</div>
            <p className="text-xs text-cyan-400 mt-1 font-mono">Active campus researchers</p>
          </div>

          <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6">
            <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest">Departments</span>
            <div className="text-3xl font-black text-white mt-2 font-mono">18</div>
            <p className="text-xs text-indigo-400 mt-1 font-mono">Participating faculties</p>
          </div>

          <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6">
            <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest">Laboratories</span>
            <div className="text-3xl font-black text-white mt-2 font-mono">{labs.length}</div>
            <p className="text-xs text-emerald-400 mt-1 font-mono">Equipped research spaces</p>
          </div>

          <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6">
            <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest">Equipment</span>
            <div className="text-3xl font-black text-white mt-2 font-mono">{equipment.length}</div>
            <p className="text-xs text-amber-400 mt-1 font-mono">Specialised instruments</p>
          </div>

          <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6">
            <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest">Bookings</span>
            <div className="text-3xl font-black text-white mt-2 font-mono">{bookings.length}</div>
            <p className="text-xs text-purple-400 mt-1 font-mono">Platform reservations</p>
          </div>

          <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6">
            <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest">Utilisation</span>
            <div className="text-3xl font-black text-white mt-2 font-mono">82%</div>
            <p className="text-xs text-emerald-400 mt-1 font-mono">Campus-wide average</p>
          </div>
        </div>

        {/* Platform Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Laboratories Status */}
          <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-6">
            <h3 className="text-base font-bold text-white font-mono mb-6">CAMPUS LABORATORIES DIRECTORY</h3>
            <div className="space-y-4">
              {labs.map(lab => (
                <div key={lab.id} className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-4 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white">{lab.name}</h4>
                    <p className="text-xs font-mono text-neutral-400">{lab.location} • {lab.departmentName}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono text-cyan-400">{lab.utilisation}% UTILISATION</span>
                    <p className="text-xs font-mono text-neutral-500 mt-0.5">{lab.equipmentCount} units</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Platform-wide Bookings */}
          <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-6">
            <h3 className="text-base font-bold text-white font-mono mb-6">PLATFORM-WIDE RESERVATION LOGS</h3>
            <div className="space-y-4 overflow-y-auto max-h-[350px] pr-2 custom-scrollbar">
              {bookings.map(b => (
                <div key={b.id} className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-4 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white">{b.equipmentName}</h4>
                    <p className="text-xs font-mono text-cyan-400">Researcher: {b.userName} ({b.userRole})</p>
                    <p className="text-xs text-neutral-400 mt-1">Project: {b.projectTitle}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-mono ${b.status === 'approved' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'}`}>
                    {b.status.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
