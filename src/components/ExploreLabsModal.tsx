import React, { useEffect, useState } from 'react';
import { Laboratory, Department, User, Equipment } from '../types';
import { LaboratoryDetailsModal } from './LaboratoryDetailsModal';
import { X, Building2, Cpu, Search, Filter, ArrowRight, Shield } from 'lucide-react';
import { motion } from 'motion/react';

interface ExploreLabsModalProps {
  user?: User | null;
  onClose: () => void;
  onRequireLogin: () => void;
}

export const ExploreLabsModal: React.FC<ExploreLabsModalProps> = ({ user, onClose, onRequireLogin }) => {
  const [labs, setLabs] = useState<Laboratory[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'utilisation'>('name');
  const [selectedLab, setSelectedLab] = useState<Laboratory | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/labs').then(res => res.json()),
      fetch('/api/departments').then(res => res.json())
    ]).then(([labsData, deptData]) => {
      setLabs(labsData);
      setDepartments(deptData);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const filteredLabs = labs.filter(lab => {
    const matchesSearch = lab.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          lab.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          lab.departmentName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDept === 'all' || lab.departmentId === selectedDept;
    const matchesStatus = selectedStatus === 'all' || lab.status === selectedStatus;
    return matchesSearch && matchesDept && matchesStatus;
  }).sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return b.utilisation - a.utilisation;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/85 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-6xl h-[90vh] bg-neutral-950 border border-neutral-800 rounded-3xl p-6 md:p-8 flex flex-col overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.9)]"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-neutral-900">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white">EXPLORE CAMPUS LABORATORIES</h2>
            <p className="text-neutral-400 text-xs font-mono tracking-wider mt-1">
              DISCOVER 13 SPECIALISED RESEARCH FACILITIES ACROSS ENGINEERING DEPARTMENTS
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 my-6">
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            {/* Department Filter */}
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 text-white text-xs font-mono focus:outline-none focus:border-white transition-colors"
            >
              <option value="all">ALL DEPARTMENTS</option>
              {departments.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 text-white text-xs font-mono focus:outline-none focus:border-white transition-colors"
            >
              <option value="all">ALL STATUS</option>
              <option value="operational">Operational</option>
              <option value="maintenance">Maintenance</option>
              <option value="restricted">Restricted</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 text-white text-xs font-mono focus:outline-none focus:border-white transition-colors"
            >
              <option value="name">Sort by Name</option>
              <option value="utilisation">Sort by Utilisation</option>
            </select>
          </div>

          <div className="relative w-full lg:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search laboratories..."
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 pl-10 text-white placeholder:text-neutral-600 text-sm focus:outline-none focus:border-white transition-colors font-mono"
            />
          </div>
        </div>

        {/* Labs Grid */}
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          {loading ? (
            <div className="flex items-center justify-center h-64 text-neutral-500 font-mono text-sm">
              LOADING LABORATORIES...
            </div>
          ) : filteredLabs.length === 0 ? (
            <div className="flex items-center justify-center h-64 text-neutral-500 font-mono text-xs">
              NO LABORATORIES FOUND MATCHING YOUR CRITERIA.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLabs.map(lab => (
                <div
                  key={lab.id}
                  className="group bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6 hover:border-white/40 hover:bg-neutral-900 transition-all flex flex-col justify-between shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
                >
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-cyan-400 group-hover:border-cyan-500/50 transition-colors">
                        <Building2 className="w-5 h-5" />
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-mono ${lab.status === 'operational' ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800' : 'bg-amber-950/60 text-amber-400 border border-amber-800'}`}>
                        {lab.status.toUpperCase()}
                      </span>
                    </div>

                    <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">{lab.departmentName}</span>
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-200 transition-colors">{lab.name}</h3>
                    <p className="text-xs text-neutral-400 mb-6 font-light leading-relaxed">{lab.description}</p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs text-neutral-400 pt-4 border-t border-neutral-800/80 mb-4 font-mono">
                      <span>Equipments: <strong className="text-white">{lab.equipmentCount} items</strong></span>
                      <span>Utilisation: <strong className="text-white">{lab.utilisation}%</strong></span>
                    </div>

                    <button
                      onClick={() => setSelectedLab(lab)}
                      className="w-full py-3 rounded-xl bg-white text-black font-semibold text-xs font-mono uppercase tracking-wider hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(255,255,255,0.15)] group-hover:bg-cyan-50 group-hover:text-black"
                    >
                      <span>VIEW LABORATORY</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Laboratory Details Modal */}
        {selectedLab && (
          <LaboratoryDetailsModal
            laboratory={selectedLab}
            user={user}
            onClose={() => setSelectedLab(null)}
            onRequireLogin={onRequireLogin}
          />
        )}
      </motion.div>
    </div>
  );
};
