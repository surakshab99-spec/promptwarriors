import React, { useEffect, useState } from 'react';
import { User, Equipment, EquipmentBooking } from '../../types';
import { SplineBlob } from '../SplineBlob';
import { ExploreLabsModal } from '../ExploreLabsModal';
import { Cpu, Calendar, Clock, Sparkles, Send, CheckCircle2, AlertCircle, Plus, LogOut, Compass, Layers, Share2 } from 'lucide-react';
import { motion } from 'motion/react';

interface StudentDashboardProps {
  user: User;
  onLogout: () => void;
  onOpenLabShare: () => void;
  onRequireLogin?: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ user, onLogout, onOpenLabShare }) => {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [bookings, setBookings] = useState<EquipmentBooking[]>([]);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('easeLabs AI Assistant online. Ask me about equipment availability, safety protocols, or booking guidance.');
  const [aiLoading, setAiLoading] = useState(false);
  const [isExploreLabsOpen, setIsExploreLabsOpen] = useState(false);

  const loadData = () => {
    Promise.all([
      fetch('/api/equipment').then(res => res.json()),
      fetch('/api/bookings').then(res => res.json())
    ]).then(([eqData, bkData]) => {
      setEquipment(eqData);
      setBookings(bkData.filter((b: EquipmentBooking) => b.userId === user.id));
    });
  };

  useEffect(() => {
    loadData();
  }, [user.id]);

  const handleAskAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;
    setAiLoading(true);
    try {
      const res = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt })
      });
      const data = await res.json();
      setAiResponse(data.response);
    } catch (err) {
      setAiResponse('AI service temporarily busy.');
    } finally {
      setAiLoading(false);
      setAiPrompt('');
    }
  };

  const availableEquipment = equipment.filter(e => e.status === 'available');
  const pendingRequests = bookings.filter(b => b.status === 'pending');
  const upcomingReservations = bookings.filter(b => b.status === 'approved');

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
            <h1 className="text-lg font-bold tracking-tight text-white font-mono">STUDENT DASHBOARD</h1>
            <p className="text-xs text-neutral-400 font-mono">WELCOME, {user.fullName.toUpperCase()} ({user.department})</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsExploreLabsOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black font-semibold text-xs font-mono hover:bg-neutral-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
          >
            <Compass className="w-4 h-4" />
            <span>EXPLORE LABORATORIES</span>
          </button>
          <button
            onClick={onOpenLabShare}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-white font-semibold text-xs font-mono hover:bg-neutral-800 transition-all"
          >
            <Share2 className="w-4 h-4 text-cyan-400" />
            <span>LabShare</span>
          </button>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-mono text-neutral-300 hover:text-white transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>LOGOUT</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-6 md:p-8 space-y-8">
        {/* Top Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6">
            <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest">Available Equipment</span>
            <div className="text-3xl font-black text-white mt-2 font-mono">{availableEquipment.length}</div>
            <p className="text-xs text-emerald-400 mt-1 font-mono">Ready across 13 labs</p>
          </div>

          <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6">
            <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest">My Bookings</span>
            <div className="text-3xl font-black text-white mt-2 font-mono">{bookings.length}</div>
            <p className="text-xs text-cyan-400 mt-1 font-mono">Total requested & active</p>
          </div>

          <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6">
            <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest">Pending Requests</span>
            <div className="text-3xl font-black text-white mt-2 font-mono">{pendingRequests.length}</div>
            <p className="text-xs text-amber-400 mt-1 font-mono">Awaiting review</p>
          </div>

          <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6">
            <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest">Upcoming Reservations</span>
            <div className="text-3xl font-black text-white mt-2 font-mono">{upcomingReservations.length}</div>
            <p className="text-xs text-indigo-400 mt-1 font-mono">Approved access</p>
          </div>
        </div>

        {/* AI Laboratory Assistant & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* AI Laboratory Assistant Card */}
          <div className="lg:col-span-1 bg-neutral-950 border border-neutral-800 rounded-3xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white font-mono">AI LABORATORY ASSISTANT</h3>
              </div>
              <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-4 text-sm text-neutral-300 font-light mb-6 min-h-[140px] leading-relaxed">
                {aiResponse}
              </div>
            </div>

            <form onSubmit={handleAskAI} className="relative">
              <input
                type="text"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Ask about lab protocols, equipment..."
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 pr-12 text-white placeholder:text-neutral-600 text-xs focus:outline-none focus:border-white transition-colors font-mono"
              />
              <button
                type="submit"
                disabled={aiLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-white text-black flex items-center justify-center hover:bg-neutral-200 transition-colors disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* Recently Viewed & Featured Labs Banner */}
          <div className="lg:col-span-2 bg-neutral-950 border border-neutral-800 rounded-3xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold text-white font-mono">CAMPUS RESEARCH DEPARTMENTS</h3>
                <button
                  onClick={() => setIsExploreLabsOpen(true)}
                  className="text-xs font-mono text-cyan-400 hover:underline"
                >
                  View All 13 Labs →
                </button>
              </div>
              <p className="text-xs text-neutral-400 mb-6 font-light">
                Access specialised laboratories across Computer Science and Engineering, Electronics and Communication, and Mechanical Engineering.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-4">
                <h4 className="text-xs font-bold text-white mb-1">CSE Facilities</h4>
                <p className="text-[11px] text-neutral-400">Programming, Python, Logic Design, Databases, Networks</p>
              </div>
              <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-4">
                <h4 className="text-xs font-bold text-white mb-1">ECE Facilities</h4>
                <p className="text-[11px] text-neutral-400">Basic Electronics, Microcontrollers, IoT, Projects</p>
              </div>
              <div className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-4">
                <h4 className="text-xs font-bold text-white mb-1">Mechanical Engineering</h4>
                <p className="text-[11px] text-neutral-400">CAD/CAM, Material Testing, Robotics Arenas</p>
              </div>
            </div>
          </div>
        </div>

        {/* My Bookings Table */}
        <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-6">
          <h3 className="text-base font-bold text-white font-mono mb-6">MY EQUIPMENT BOOKINGS & REQUESTS</h3>
          {bookings.length === 0 ? (
            <div className="text-center py-12 text-neutral-500 font-mono text-xs">
              NO EQUIPMENT BOOKINGS SUBMITTED YET. EXPLORE LABORATORIES TO RESERVE EQUIPMENT.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-neutral-800 text-xs font-mono text-neutral-400 uppercase">
                    <th className="pb-3 font-medium">Equipment</th>
                    <th className="pb-3 font-medium">Project</th>
                    <th className="pb-3 font-medium">Dates & Time Slot</th>
                    <th className="pb-3 font-medium">Qty</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-900 font-mono text-xs">
                  {bookings.map(b => (
                    <tr key={b.id} className="hover:bg-neutral-900/30">
                      <td className="py-4 text-white font-sans font-bold">{b.equipmentName}</td>
                      <td className="py-4 text-neutral-300">{b.projectTitle}</td>
                      <td className="py-4 text-neutral-400">{b.startDate} to {b.endDate} <span className="text-cyan-400">({b.timeSlot})</span></td>
                      <td className="py-4 text-white">{b.quantity} units</td>
                      <td className="py-4">
                        <span className={`px-2.5 py-1 rounded-full ${b.status === 'approved' ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800' : b.status === 'pending' ? 'bg-amber-950/60 text-amber-400 border border-amber-800' : 'bg-rose-950/60 text-rose-400 border border-rose-800'}`}>
                          {b.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Explore Labs Modal */}
      {isExploreLabsOpen && (
        <ExploreLabsModal
          user={user}
          onClose={() => {
            setIsExploreLabsOpen(false);
            loadData();
          }}
          onRequireLogin={() => {}}
        />
      )}
    </div>
  );
};
