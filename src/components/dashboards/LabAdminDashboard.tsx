import React, { useEffect, useState } from 'react';
import { User, Equipment, EquipmentBooking, Laboratory, MaintenanceRecord } from '../../types';
import { SplineBlob } from '../SplineBlob';
import { Wrench, CheckCircle2, XCircle, AlertTriangle, Plus, LogOut, Cpu, Building2, Shield } from 'lucide-react';
import { motion } from 'motion/react';

interface LabAdminDashboardProps {
  user: User;
  onLogout: () => void;
}

export const LabAdminDashboard: React.FC<LabAdminDashboardProps> = ({ user, onLogout }) => {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [bookings, setBookings] = useState<EquipmentBooking[]>([]);
  const [labs, setLabs] = useState<Laboratory[]>([]);
  const [maintenance, setMaintenance] = useState<MaintenanceRecord[]>([]);

  const [showAddEqModal, setShowAddEqModal] = useState(false);
  const [showAddLabModal, setShowAddLabModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'equipment' | 'bookings' | 'labs' | 'maintenance'>('equipment');

  // New Equipment state
  const [eqName, setEqName] = useState('');
  const [eqCategory, setEqCategory] = useState('Computing');
  const [eqLabId, setEqLabId] = useState('lab-1');
  const [eqTotalQty, setEqTotalQty] = useState(10);
  const [eqSpecs, setEqSpecs] = useState('');
  const [eqLocation, setEqLocation] = useState('Lab 1, Bench 1');

  // New Lab state
  const [labName, setLabName] = useState('');
  const [labDeptId, setLabDeptId] = useState('dept-cse');
  const [labDesc, setLabDesc] = useState('');
  const [labLocation, setLabLocation] = useState('Block A, Floor 1');

  const loadData = () => {
    Promise.all([
      fetch('/api/equipment').then(res => res.json()),
      fetch('/api/bookings').then(res => res.json()),
      fetch('/api/labs').then(res => res.json()),
      fetch('/api/maintenance').then(res => res.json())
    ]).then(([eqData, bkData, labData, mntData]) => {
      setEquipment(eqData);
      setBookings(bkData);
      setLabs(labData);
      setMaintenance(mntData);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleBookingAction = async (id: string, status: 'approved' | 'rejected') => {
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

  const handleAddEquipment = async (e: React.FormEvent) => {
    e.preventDefault();
    const lab = labs.find(l => l.id === eqLabId);
    try {
      const res = await fetch('/api/equipment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: eqName,
          category: eqCategory,
          labId: eqLabId,
          labName: lab ? lab.name : 'General Lab',
          totalQuantity: eqTotalQty,
          availableQuantity: eqTotalQty,
          status: 'available',
          specs: eqSpecs,
          location: eqLocation
        })
      });
      const data = await res.json();
      if (data.success) {
        setShowAddEqModal(false);
        setEqName('');
        setEqSpecs('');
        loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddLab = async (e: React.FormEvent) => {
    e.preventDefault();
    const deptMap: Record<string, string> = {
      'dept-cse': 'Computer Science and Engineering (CSE)',
      'dept-ece': 'Electronics and Communication (ECE)',
      'dept-mech': 'Mechanical and Manufacturing Engineering'
    };
    try {
      const res = await fetch('/api/labs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: labName,
          departmentId: labDeptId,
          departmentName: deptMap[labDeptId] || 'General Department',
          description: labDesc,
          status: 'operational',
          location: labLocation
        })
      });
      const data = await res.json();
      if (data.success) {
        setShowAddLabModal(false);
        setLabName('');
        setLabDesc('');
        loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleReportMaintenance = async (eqId: string) => {
    const issue = prompt('Describe the maintenance issue or calibration required:');
    if (!issue) return;
    try {
      await fetch('/api/maintenance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ equipmentId: eqId, issue })
      });
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const totalEquipment = equipment.length;
  const availableEquipment = equipment.filter(e => e.status === 'available').length;
  const pendingReservations = bookings.filter(b => b.status === 'pending');

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
            <h1 className="text-lg font-bold tracking-tight text-white font-mono">LAB ADMINISTRATOR CONSOLE</h1>
            <p className="text-xs text-neutral-400 font-mono">WELCOME, {user.fullName.toUpperCase()} ({user.department})</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowAddEqModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-black font-semibold text-xs font-mono hover:bg-neutral-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
          >
            <Plus className="w-4 h-4" />
            <span>ADD EQUIPMENT</span>
          </button>
          <button
            onClick={() => setShowAddLabModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-mono text-neutral-300 hover:text-white transition-all"
          >
            <Building2 className="w-4 h-4" />
            <span>ADD LAB</span>
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
            <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest">Total Equipment Items</span>
            <div className="text-3xl font-black text-white mt-2 font-mono">{totalEquipment}</div>
            <p className="text-xs text-cyan-400 mt-1 font-mono">Across 13 laboratories</p>
          </div>

          <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6">
            <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest">Available Items</span>
            <div className="text-3xl font-black text-white mt-2 font-mono">{availableEquipment}</div>
            <p className="text-xs text-emerald-400 mt-1 font-mono">Ready for reservation</p>
          </div>

          <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6">
            <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest">Pending Requests</span>
            <div className="text-3xl font-black text-white mt-2 font-mono">{pendingReservations.length}</div>
            <p className="text-xs text-amber-400 mt-1 font-mono">Requires admin sign-off</p>
          </div>

          <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6">
            <span className="text-xs font-mono text-neutral-400 uppercase tracking-widest">Laboratories</span>
            <div className="text-3xl font-black text-white mt-2 font-mono">{labs.length}</div>
            <p className="text-xs text-indigo-400 mt-1 font-mono">Managed research labs</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 p-1 bg-neutral-950 border border-neutral-800 rounded-2xl w-fit">
          <button
            onClick={() => setActiveTab('equipment')}
            className={`px-6 py-2.5 rounded-xl text-xs font-mono tracking-wider transition-colors ${activeTab === 'equipment' ? 'bg-white text-black font-semibold' : 'text-neutral-400 hover:text-white'}`}
          >
            EQUIPMENT INVENTORY ({equipment.length})
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-6 py-2.5 rounded-xl text-xs font-mono tracking-wider transition-colors ${activeTab === 'bookings' ? 'bg-white text-black font-semibold' : 'text-neutral-400 hover:text-white'}`}
          >
            BOOKING REQUESTS ({bookings.length})
          </button>
          <button
            onClick={() => setActiveTab('labs')}
            className={`px-6 py-2.5 rounded-xl text-xs font-mono tracking-wider transition-colors ${activeTab === 'labs' ? 'bg-white text-black font-semibold' : 'text-neutral-400 hover:text-white'}`}
          >
            LABORATORIES ({labs.length})
          </button>
          <button
            onClick={() => setActiveTab('maintenance')}
            className={`px-6 py-2.5 rounded-xl text-xs font-mono tracking-wider transition-colors ${activeTab === 'maintenance' ? 'bg-white text-black font-semibold' : 'text-neutral-400 hover:text-white'}`}
          >
            MAINTENANCE ({maintenance.length})
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'equipment' && (
          <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-6">
            <h3 className="text-base font-bold text-white font-mono mb-6">EQUIPMENT CATALOGUE & QUANTITY MANAGEMENT</h3>
            <div className="space-y-4 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
              {equipment.map(eq => (
                <div key={eq.id} className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-5 flex items-center justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-white">{eq.name}</h4>
                    <p className="text-xs font-mono text-cyan-400">{eq.labName} • {eq.category}</p>
                    <p className="text-xs text-neutral-400 mt-1">{eq.specs} (Location: {eq.location})</p>
                  </div>
                  <div className="flex items-center gap-6 shrink-0">
                    <div className="text-right font-mono text-xs">
                      <span className="text-neutral-400">Available: </span>
                      <strong className="text-white">{eq.availableQuantity}</strong> / {eq.totalQuantity}
                    </div>
                    <button
                      onClick={() => handleReportMaintenance(eq.id)}
                      className="px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-amber-400 text-xs font-mono hover:bg-neutral-800 transition-colors"
                    >
                      Report Maintenance
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-6">
            <h3 className="text-base font-bold text-white font-mono mb-6">STUDENT & RESEARCHER BOOKING REQUESTS</h3>
            {bookings.length === 0 ? (
              <div className="text-center py-12 text-neutral-500 font-mono text-xs">NO BOOKING REQUESTS FOUND.</div>
            ) : (
              <div className="space-y-4">
                {bookings.map(b => (
                  <div key={b.id} className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 text-xs font-mono">
                          {b.userName} ({b.userRole})
                        </span>
                        <span className="text-xs font-mono text-neutral-400">{b.startDate} to {b.endDate} ({b.timeSlot})</span>
                      </div>
                      <h4 className="text-base font-bold text-white mb-1">{b.equipmentName} ({b.quantity} units)</h4>
                      <p className="text-sm font-semibold text-neutral-200 mb-1">Project: {b.projectTitle}</p>
                      <p className="text-xs text-neutral-400 font-light">{b.purpose}</p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {b.status === 'pending' ? (
                        <>
                          <button
                            onClick={() => handleBookingAction(b.id, 'rejected')}
                            className="px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-rose-400 hover:bg-rose-950/40 text-xs font-mono transition-colors flex items-center gap-2"
                          >
                            <XCircle className="w-4 h-4" />
                            <span>REJECT</span>
                          </button>
                          <button
                            onClick={() => handleBookingAction(b.id, 'approved')}
                            className="px-5 py-2.5 rounded-xl bg-white text-black hover:bg-neutral-200 text-xs font-mono font-semibold transition-colors flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>APPROVE</span>
                          </button>
                        </>
                      ) : (
                        <span className={`px-3 py-1 rounded-full text-xs font-mono ${b.status === 'approved' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-rose-950 text-rose-400 border border-rose-800'}`}>
                          {b.status.toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'labs' && (
          <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-6">
            <h3 className="text-base font-bold text-white font-mono mb-6">CAMPUS LABORATORIES (13 FACILITIES)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {labs.map(lab => (
                <div key={lab.id} className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-5">
                  <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">{lab.departmentName}</span>
                  <h4 className="text-base font-bold text-white mb-1">{lab.name}</h4>
                  <p className="text-xs text-neutral-400 mb-3 font-light">{lab.description}</p>
                  <div className="flex items-center justify-between text-xs font-mono text-neutral-500 pt-3 border-t border-neutral-800">
                    <span>Location: {lab.location}</span>
                    <span className="text-white">{lab.equipmentCount} items</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'maintenance' && (
          <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-6">
            <h3 className="text-base font-bold text-white font-mono mb-6">EQUIPMENT MAINTENANCE & CALIBRATION LOGS</h3>
            {maintenance.length === 0 ? (
              <div className="text-center py-12 text-neutral-500 font-mono text-xs">NO MAINTENANCE LOGS RECORDED.</div>
            ) : (
              <div className="space-y-4">
                {maintenance.map(m => (
                  <div key={m.id} className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-5 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white">{m.equipmentName}</h4>
                      <p className="text-xs text-neutral-300 mt-1">{m.issue}</p>
                      <p className="text-xs font-mono text-neutral-500 mt-2">Logged: {m.loggedDate}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-amber-950 text-amber-400 border border-amber-800 text-xs font-mono">
                      {m.status.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Add Equipment Modal */}
      {showAddEqModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-8 max-w-lg w-full">
            <h3 className="text-lg font-bold text-white mb-4">ADD EQUIPMENT TO CATALOGUE</h3>
            <form onSubmit={handleAddEquipment} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1 uppercase">Equipment Name</label>
                <input
                  type="text"
                  required
                  value={eqName}
                  onChange={(e) => setEqName(e.target.value)}
                  placeholder="e.g., Oscilloscope 100MHz"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white text-xs font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-neutral-400 mb-1 uppercase">Category</label>
                  <select
                    value={eqCategory}
                    onChange={(e) => setEqCategory(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white text-xs font-mono"
                  >
                    <option value="Computing">Computing</option>
                    <option value="Hardware">Hardware</option>
                    <option value="Components">Components</option>
                    <option value="Instruments">Instruments</option>
                    <option value="Networking">Networking</option>
                    <option value="Tools">Tools</option>
                    <option value="Microcontrollers">Microcontrollers</option>
                    <option value="IoT">IoT</option>
                    <option value="Robotics">Robotics</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono text-neutral-400 mb-1 uppercase">Laboratory</label>
                  <select
                    value={eqLabId}
                    onChange={(e) => setEqLabId(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white text-xs font-mono"
                  >
                    {labs.map(l => (
                      <option key={l.id} value={l.id}>{l.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-neutral-400 mb-1 uppercase">Total Quantity</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={eqTotalQty}
                    onChange={(e) => setEqTotalQty(parseInt(e.target.value) || 1)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-neutral-400 mb-1 uppercase">Location</label>
                  <input
                    type="text"
                    required
                    value={eqLocation}
                    onChange={(e) => setEqLocation(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1 uppercase">Specifications</label>
                <input
                  type="text"
                  required
                  value={eqSpecs}
                  onChange={(e) => setEqSpecs(e.target.value)}
                  placeholder="2-channel, 1GS/s sampling rate"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white text-xs font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-900">
                <button
                  type="button"
                  onClick={() => setShowAddEqModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-neutral-900 text-neutral-300 text-xs font-mono hover:bg-neutral-800"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-white text-black font-semibold text-xs font-mono hover:bg-neutral-200"
                >
                  ADD EQUIPMENT
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Laboratory Modal */}
      {showAddLabModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-8 max-w-lg w-full">
            <h3 className="text-lg font-bold text-white mb-4">ADD NEW CAMPUS LABORATORY</h3>
            <form onSubmit={handleAddLab} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1 uppercase">Laboratory Name</label>
                <input
                  type="text"
                  required
                  value={labName}
                  onChange={(e) => setLabName(e.target.value)}
                  placeholder="e.g., Advanced AI Research Lab"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1 uppercase">Department</label>
                <select
                  value={labDeptId}
                  onChange={(e) => setLabDeptId(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white text-xs font-mono"
                >
                  <option value="dept-cse">Computer Science and Engineering (CSE)</option>
                  <option value="dept-ece">Electronics and Communication (ECE)</option>
                  <option value="dept-mech">Mechanical and Manufacturing Engineering</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1 uppercase">Location</label>
                <input
                  type="text"
                  required
                  value={labLocation}
                  onChange={(e) => setLabLocation(e.target.value)}
                  placeholder="Block E, Floor 3"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1 uppercase">Description</label>
                <textarea
                  required
                  rows={3}
                  value={labDesc}
                  onChange={(e) => setLabDesc(e.target.value)}
                  placeholder="Describe facility research focus..."
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-4 text-white text-xs font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-900">
                <button
                  type="button"
                  onClick={() => setShowAddLabModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-neutral-900 text-neutral-300 text-xs font-mono hover:bg-neutral-800"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-white text-black font-semibold text-xs font-mono hover:bg-neutral-200"
                >
                  SAVE LABORATORY
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
