import React, { useEffect, useState } from 'react';
import { User, EquipmentBooking, Laboratory } from '../../types';
import { SplineBlob } from '../SplineBlob';
import { CheckCircle2, XCircle, Clock, Building2, LogOut, Award } from 'lucide-react';
import { motion } from 'motion/react';

interface FacultyDashboardProps {
  user: User;
  onLogout: () => void;
}

export const FacultyDashboard: React.FC<FacultyDashboardProps> = ({ user, onLogout }) => {
  const [bookings, setBookings] = useState<EquipmentBooking[]>([]);
  const [labs, setLabs] = useState<Laboratory[]>([]);

  const loadData = () => {
    Promise.all([
      fetch('/api/bookings').then(res => res.json()),
      fetch('/api/labs').then(res => res.json())
    ]).then(([bkData, labData]) => {
      setBookings(bkData);
      setLabs(labData);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await fetch(`/api/bookings/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const approvedBookings = bookings.filter(b => b.status === 'approved');

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
            <h1 className="text-lg font-bold tracking-tight text-white font-mono">FACULTY REVIEW PORTAL</h1>
            <p className="text-xs text-neutral-400 font-mono">WELCOME, {user.fullName.toUpperCase()} ({user.department})</p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-mono text-neutral-300 hover:text-white hover:border-neutral-700 transition-all"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>LOGOUT</span>
        </button>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-6 md:p-8 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6">
            <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest">Pending Approvals</span>
            <div className="text-3xl font-black text-white mt-2 font-mono">{pendingBookings.length}</div>
            <p className="text-xs text-amber-400 mt-1 font-mono">Requires faculty sign-off</p>
          </div>

          <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6">
            <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest">Approved Requests</span>
            <div className="text-3xl font-black text-white mt-2 font-mono">{approvedBookings.length}</div>
            <p className="text-xs text-emerald-400 mt-1 font-mono">Active lab access granted</p>
          </div>

          <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6">
            <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest">Monitored Facilities</span>
            <div className="text-3xl font-black text-white mt-2 font-mono">{labs.length}</div>
            <p className="text-xs text-cyan-400 mt-1 font-mono">Department labs operational</p>
          </div>
        </div>

        {/* Pending Approvals Section */}
        <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-6">
          <h3 className="text-base font-bold text-white font-mono mb-6 flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>PENDING STUDENT PROJECT REQUESTS</span>
          </h3>

          {pendingBookings.length === 0 ? (
            <div className="text-center py-12 text-neutral-500 font-mono text-xs">
              NO PENDING STUDENT REQUESTS AT THIS TIME.
            </div>
          ) : (
            <div className="space-y-4">
              {pendingBookings.map(b => (
                <div key={b.id} className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 text-xs font-mono">
                        {b.userName} ({b.userRole})
                      </span>
                      <span className="text-xs font-mono text-neutral-500">{b.startDate} to {b.endDate}</span>
                    </div>
                    <h4 className="text-base font-bold text-white mb-1">{b.equipmentName}</h4>
                    <p className="text-sm font-semibold text-neutral-200 mb-1">Project: {b.projectTitle}</p>
                    <p className="text-xs text-neutral-400 font-light">{b.purpose}</p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      onClick={() => handleUpdateStatus(b.id, 'rejected')}
                      className="px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-rose-400 hover:bg-rose-950/40 text-xs font-mono transition-colors flex items-center gap-2"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>REJECT</span>
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(b.id, 'approved')}
                      className="px-5 py-2.5 rounded-xl bg-white text-black hover:bg-neutral-200 text-xs font-mono font-semibold transition-colors flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>APPROVE ACCESS</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Laboratory Utilisation */}
        <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-6">
          <h3 className="text-base font-bold text-white font-mono mb-6">LABORATORY UTILISATION & METRICS</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {labs.map(lab => (
              <div key={lab.id} className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-white">{lab.name}</span>
                  <span className="text-xs font-mono text-cyan-400">{lab.utilisation}% UTILISATION</span>
                </div>
                <div className="w-full bg-neutral-950 h-2 rounded-full overflow-hidden border border-neutral-800">
                  <div className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-full rounded-full" style={{ width: `${lab.utilisation}%` }} />
                </div>
                <div className="flex items-center justify-between mt-3 text-xs font-mono text-neutral-500">
                  <span>{lab.departmentName}</span>
                  <span>{lab.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};
