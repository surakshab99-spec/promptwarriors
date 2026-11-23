import React, { useEffect, useState } from 'react';
import { Laboratory, Equipment, User } from '../types';
import { EquipmentBookingModal } from './EquipmentBookingModal';
import { X, Building2, Cpu, CheckCircle2, AlertTriangle, ArrowLeft, Calendar, Shield } from 'lucide-react';
import { motion } from 'motion/react';

interface LaboratoryDetailsModalProps {
  laboratory: Laboratory;
  user?: User | null;
  onClose: () => void;
  onRequireLogin: () => void;
}

export const LaboratoryDetailsModal: React.FC<LaboratoryDetailsModalProps> = ({ laboratory, user, onClose, onRequireLogin }) => {
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEqForBooking, setSelectedEqForBooking] = useState<Equipment | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetch('/api/equipment')
      .then(res => res.json())
      .then(data => {
        setEquipmentList(data.filter((e: Equipment) => e.labId === laboratory.id || e.labName.toLowerCase() === laboratory.name.toLowerCase()));
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [laboratory.id, laboratory.name]);

  const handleReserveClick = (eq: Equipment) => {
    if (!user) {
      onRequireLogin();
      return;
    }
    setSelectedEqForBooking(eq);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/85 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-5xl h-[88vh] bg-neutral-950 border border-neutral-800 rounded-3xl p-6 md:p-8 flex flex-col overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.9)]"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-neutral-900">
          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">{laboratory.departmentName}</span>
              <h2 className="text-2xl font-bold tracking-tight text-white">{laboratory.name}</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {successMessage && (
          <div className="my-4 p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-xs text-emerald-300 flex items-center gap-3">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Laboratory Info Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6 p-6 rounded-2xl bg-neutral-900/50 border border-neutral-800/80">
          <div>
            <span className="text-xs font-mono text-neutral-500 uppercase">Description</span>
            <p className="text-sm text-neutral-300 mt-1 font-light">{laboratory.description}</p>
          </div>
          <div>
            <span className="text-xs font-mono text-neutral-500 uppercase">Location & Status</span>
            <p className="text-sm text-white font-mono mt-1">{laboratory.location}</p>
            <span className={`inline-block mt-2 px-2.5 py-0.5 rounded-full text-xs font-mono ${laboratory.status === 'operational' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'}`}>
              {laboratory.status.toUpperCase()}
            </span>
          </div>
          <div>
            <span className="text-xs font-mono text-neutral-500 uppercase">Utilisation & Inventory</span>
            <p className="text-sm text-white font-mono mt-1">{laboratory.utilisation}% Utilization</p>
            <p className="text-xs font-mono text-cyan-400 mt-1">{equipmentList.length} Catalog Items</p>
          </div>
        </div>

        {/* Equipment List Section */}
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          <h3 className="text-base font-bold text-white font-mono mb-4">LABORATORY EQUIPMENT CATALOGUE</h3>

          {loading ? (
            <div className="flex items-center justify-center h-48 text-neutral-500 font-mono text-xs">
              LOADING EQUIPMENT CATALOGUE...
            </div>
          ) : equipmentList.length === 0 ? (
            <div className="text-center py-12 text-neutral-500 font-mono text-xs">
              NO EQUIPMENT RECORDED IN THIS LABORATORY YET.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {equipmentList.map(eq => (
                <div key={eq.id} className="bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6 flex flex-col justify-between hover:border-neutral-700 transition-colors">
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <div className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-cyan-400">
                        <Cpu className="w-5 h-5" />
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-mono ${eq.availableQuantity > 0 ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800' : 'bg-rose-950/60 text-rose-400 border border-rose-800'}`}>
                        {eq.availableQuantity > 0 ? `${eq.availableQuantity} AVAILABLE` : 'FULLY BOOKED'}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-white mb-1">{eq.name}</h4>
                    <p className="text-xs font-mono text-neutral-400 mb-2">{eq.category} • Total Units: {eq.totalQuantity}</p>
                    <p className="text-xs text-neutral-300 mb-4 font-light">{eq.specs}</p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-neutral-800/80">
                    <span className="text-xs font-mono text-neutral-500">LOC: {eq.location}</span>
                    <button
                      onClick={() => handleReserveClick(eq)}
                      disabled={eq.availableQuantity <= 0}
                      className="px-5 py-2.5 rounded-xl bg-white text-black font-semibold text-xs font-mono hover:bg-neutral-200 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.15)] disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {eq.availableQuantity > 0 ? 'RESERVE EQUIPMENT' : 'UNAVAILABLE'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Equipment Booking Modal */}
        {selectedEqForBooking && user && (
          <EquipmentBookingModal
            equipment={selectedEqForBooking}
            user={user}
            onClose={() => setSelectedEqForBooking(null)}
            onSuccess={() => {
              setSelectedEqForBooking(null);
              setSuccessMessage('Equipment reservation request submitted successfully!');
              // reload equipment
              fetch('/api/equipment')
                .then(res => res.json())
                .then(data => {
                  setEquipmentList(data.filter((e: Equipment) => e.labId === laboratory.id || e.labName.toLowerCase() === laboratory.name.toLowerCase()));
                });
            }}
          />
        )}
      </motion.div>
    </div>
  );
};
