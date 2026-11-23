import React, { useState } from 'react';
import { Equipment, User } from '../types';
import { X, Calendar, Clock, AlertCircle, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

interface EquipmentBookingModalProps {
  equipment: Equipment;
  user: User;
  onClose: () => void;
  onSuccess: () => void;
}

export const EquipmentBookingModal: React.FC<EquipmentBookingModalProps> = ({ equipment, user, onClose, onSuccess }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('09:00 - 13:00');
  const [quantity, setQuantity] = useState(1);
  const [projectTitle, setProjectTitle] = useState('');
  const [purpose, setPurpose] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const timeSlots = [
    '09:00 - 13:00 (Morning Session)',
    '13:30 - 17:30 (Afternoon Session)',
    '18:00 - 21:00 (Evening Session)',
    'Full Day Access'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start < today) {
      setError('Reservation start date cannot be in the past.');
      return;
    }
    if (end < start) {
      setError('End date cannot be earlier than start date.');
      return;
    }

    if (quantity > equipment.availableQuantity) {
      setError(`Requested quantity (${quantity}) exceeds currently available inventory (${equipment.availableQuantity}).`);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          equipmentId: equipment.id,
          userId: user.id,
          userName: user.fullName,
          userRole: user.role,
          startDate,
          endDate,
          timeSlot,
          quantity,
          projectTitle,
          purpose
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit booking request.');

      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Booking submission failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-lg bg-neutral-950 border border-neutral-800 rounded-3xl p-8 max-h-[90vh] overflow-y-auto custom-scrollbar shadow-[0_20px_60px_rgba(0,0,0,0.9)]"
      >
        <div className="flex items-center justify-between pb-6 border-b border-neutral-900 mb-6">
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">EQUIPMENT RESERVATION</h3>
            <p className="text-xs font-mono text-cyan-400 mt-1">{equipment.name}</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Equipment summary info */}
        <div className="mb-6 p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800 text-xs font-mono space-y-2">
          <div className="flex justify-between text-neutral-300">
            <span>Location:</span>
            <span className="text-white">{equipment.location}</span>
          </div>
          <div className="flex justify-between text-neutral-300">
            <span>Available Inventory:</span>
            <span className="text-emerald-400">{equipment.availableQuantity} of {equipment.totalQuantity} units</span>
          </div>
          <div className="flex justify-between text-neutral-300">
            <span>Specifications:</span>
            <span className="text-neutral-400 truncate max-w-[240px]">{equipment.specs}</span>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-950/40 border border-rose-800/60 text-xs text-rose-300 flex items-center gap-3">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-neutral-400 mb-1 uppercase">Project Title</label>
            <input
              type="text"
              required
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              placeholder="e.g., IoT Smart Sensor Array"
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white text-xs font-mono focus:outline-none focus:border-white transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-neutral-400 mb-1 uppercase">Start Date</label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white text-xs font-mono focus:outline-none focus:border-white transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-neutral-400 mb-1 uppercase">End Date</label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white text-xs font-mono focus:outline-none focus:border-white transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-neutral-400 mb-1 uppercase">Time Slot</label>
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white text-xs font-mono focus:outline-none focus:border-white transition-colors"
              >
                {timeSlots.map(slot => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-mono text-neutral-400 mb-1 uppercase">Quantity (Units)</label>
              <input
                type="number"
                min="1"
                max={equipment.availableQuantity}
                required
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white text-xs font-mono focus:outline-none focus:border-white transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-neutral-400 mb-1 uppercase">Purpose of Booking & Safety Protocols</label>
            <textarea
              required
              rows={3}
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="Describe research objectives and confirm adherence to lab safety..."
              className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-4 text-white text-xs font-mono focus:outline-none focus:border-white transition-colors"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-900">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-xl bg-neutral-900 text-neutral-300 text-xs font-mono hover:bg-neutral-800 transition-colors"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-white text-black font-semibold text-xs font-mono hover:bg-neutral-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)] disabled:opacity-50"
            >
              {loading ? 'SUBMITTING...' : 'SUBMIT BOOKING REQUEST'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
