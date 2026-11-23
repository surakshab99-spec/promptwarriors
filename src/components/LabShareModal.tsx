import React, { useEffect, useState } from 'react';
import { User, LabShareItem } from '../types';
import { X, Share2, Search, Filter, Plus, Phone, Trash2, Edit2, CheckCircle2, AlertCircle, Package, User as UserIcon } from 'lucide-react';
import { motion } from 'motion/react';

interface LabShareModalProps {
  user?: User | null;
  onClose: () => void;
  onRequireLogin: () => void;
}

export const LabShareModal: React.FC<LabShareModalProps> = ({ user, onClose, onRequireLogin }) => {
  const [items, setItems] = useState<LabShareItem[]>([]);
  const [activeTab, setActiveTab] = useState<'browse' | 'share' | 'my_listings'>('browse');
  const [loading, setLoading] = useState(true);

  // Search and Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [branchFilter, setBranchFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('all');
  const [sharingTypeFilter, setSharingTypeFilter] = useState('all');

  // Share Item Form State
  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState<any>('Lab Equipment');
  const [description, setDescription] = useState('');
  const [condition, setCondition] = useState<any>('Good');
  const [sharingType, setSharingType] = useState<any>('Available for Lending');
  const [imageUrl, setImageUrl] = useState('');
  const [studentName, setStudentName] = useState(user ? user.fullName : '');
  const [academicYear, setAcademicYear] = useState<any>('3rd Year');
  const [branch, setBranch] = useState(user ? user.department : 'Computer Science and Engineering');
  const [section, setSection] = useState('A');
  const [contactNumber, setContactNumber] = useState('');
  const [editingItemId, setEditingItemId] = useState<string | null>(null);

  // Contact / Request modal state
  const [contactModalItem, setContactModalItem] = useState<LabShareItem | null>(null);
  const [successMsg, setSuccessMsg] = useState('');

  const loadItems = () => {
    fetch('/api/labshare/items')
      .then(res => res.json())
      .then(data => {
        setItems(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      onRequireLogin();
      return;
    }

    const payload = {
      userId: user.id,
      studentName,
      academicYear,
      branch,
      section,
      contactNumber,
      itemName,
      category,
      description,
      condition,
      sharingType,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80'
    };

    try {
      if (editingItemId) {
        const res = await fetch(`/api/labshare/items/${editingItemId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
          setSuccessMsg('Listing updated successfully!');
          setEditingItemId(null);
          setActiveTab('browse');
          loadItems();
        }
      } else {
        const res = await fetch('/api/labshare/items', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
          setSuccessMsg('Item shared successfully with LabShare community!');
          setActiveTab('browse');
          loadItems();
          // reset form
          setItemName('');
          setDescription('');
          setImageUrl('');
          setContactNumber('');
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (item: LabShareItem) => {
    if (!user || user.id !== item.userId) return;
    setEditingItemId(item.id);
    setItemName(item.itemName);
    setCategory(item.category);
    setDescription(item.description);
    setCondition(item.condition);
    setSharingType(item.sharingType);
    setImageUrl(item.imageUrl || '');
    setStudentName(item.studentName);
    setAcademicYear(item.academicYear);
    setBranch(item.branch);
    setSection(item.section);
    setContactNumber(item.contactNumber);
    setActiveTab('share');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;
    try {
      await fetch(`/api/labshare/items/${id}`, { method: 'DELETE' });
      loadItems();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleStatus = async (item: LabShareItem) => {
    const nextStatus = item.status === 'available' ? 'unavailable' : 'available';
    try {
      await fetch(`/api/labshare/items/${item.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      });
      loadItems();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.studentName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesBranch = branchFilter === 'all' || item.branch === branchFilter;
    const matchesYear = yearFilter === 'all' || item.academicYear === yearFilter;
    const matchesSharing = sharingTypeFilter === 'all' || item.sharingType === sharingTypeFilter;
    return matchesSearch && matchesCat && matchesBranch && matchesYear && matchesSharing;
  });

  const myItems = items.filter(i => user && i.userId === user.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/85 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-6xl h-[90vh] bg-neutral-950 border border-neutral-800 rounded-3xl p-6 md:p-8 flex flex-col overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.9)]"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-neutral-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center bg-white/5">
              <Share2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-white font-mono">LABSHARE // STUDENT EQUIPMENT SHARING</h2>
              <p className="text-neutral-400 text-xs font-mono tracking-wider">LEND, GIVE AWAY, OR EXCHANGE LABORATORY RESOURCES</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {successMsg && (
          <div className="my-4 p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-xs text-emerald-300 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{successMsg}</span>
            </div>
            <button onClick={() => setSuccessMsg('')} className="text-xs underline">Dismiss</button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center justify-between gap-4 my-6 flex-wrap">
          <div className="flex items-center gap-2 p-1 bg-neutral-900 rounded-2xl border border-neutral-800">
            <button
              onClick={() => { setActiveTab('browse'); setEditingItemId(null); }}
              className={`px-6 py-2.5 rounded-xl text-xs font-mono tracking-wider transition-colors ${activeTab === 'browse' ? 'bg-white text-black font-semibold' : 'text-neutral-400 hover:text-white'}`}
            >
              BROWSE ITEMS ({items.length})
            </button>
            <button
              onClick={() => {
                if (!user) { onRequireLogin(); return; }
                setActiveTab('share');
              }}
              className={`px-6 py-2.5 rounded-xl text-xs font-mono tracking-wider transition-colors ${activeTab === 'share' ? 'bg-white text-black font-semibold' : 'text-neutral-400 hover:text-white'}`}
            >
              SHARE AN ITEM
            </button>
            {user && (
              <button
                onClick={() => setActiveTab('my_listings')}
                className={`px-6 py-2.5 rounded-xl text-xs font-mono tracking-wider transition-colors ${activeTab === 'my_listings' ? 'bg-white text-black font-semibold' : 'text-neutral-400 hover:text-white'}`}
              >
                MY LISTINGS ({myItems.length})
              </button>
            )}
          </div>

          {activeTab === 'browse' && (
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search shared items..."
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 pl-10 text-white placeholder:text-neutral-600 text-xs focus:outline-none focus:border-white transition-colors font-mono"
              />
            </div>
          )}
        </div>

        {/* Filters Bar for Browse */}
        {activeTab === 'browse' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 p-4 rounded-2xl bg-neutral-900/40 border border-neutral-800">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-white text-xs font-mono"
            >
              <option value="all">All Categories</option>
              <option value="Lab Coats">Lab Coats</option>
              <option value="Lab Equipment">Lab Equipment</option>
              <option value="Electronics Components">Electronics Components</option>
              <option value="Safety Equipment">Safety Equipment</option>
              <option value="Lab Accessories">Lab Accessories</option>
              <option value="Other">Other</option>
            </select>

            <select
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              className="bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-white text-xs font-mono"
            >
              <option value="all">All Branches</option>
              <option value="Computer Science and Engineering">Computer Science & Eng</option>
              <option value="Electronics and Communication">Electronics & Comm</option>
              <option value="Mechanical Engineering">Mechanical Engineering</option>
            </select>

            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-white text-xs font-mono"
            >
              <option value="all">All Academic Years</option>
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
            </select>

            <select
              value={sharingTypeFilter}
              onChange={(e) => setSharingTypeFilter(e.target.value)}
              className="bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-white text-xs font-mono"
            >
              <option value="all">All Sharing Types</option>
              <option value="Free Giveaway">Free Giveaway</option>
              <option value="Available for Lending">Available for Lending</option>
              <option value="Exchange">Exchange</option>
            </select>
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          {loading ? (
            <div className="flex items-center justify-center h-64 text-neutral-500 font-mono text-xs">
              LOADING LABSHARE ITEMS...
            </div>
          ) : activeTab === 'browse' ? (
            filteredItems.length === 0 ? (
              <div className="text-center py-20 text-neutral-500 font-mono text-xs">
                NO SHARED ITEMS FOUND MATCHING YOUR FILTERS.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map(item => (
                  <div key={item.id} className="bg-neutral-900/60 border border-neutral-800 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-neutral-700 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
                    <div>
                      <div className="relative h-48 bg-neutral-900 overflow-hidden">
                        <img
                          src={item.imageUrl || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80'}
                          alt={item.itemName}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute top-3 right-3 flex gap-2">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold ${item.sharingType === 'Free Giveaway' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : item.sharingType === 'Available for Lending' ? 'bg-cyan-950 text-cyan-400 border border-cyan-800' : 'bg-purple-950 text-purple-400 border border-purple-800'}`}>
                            {item.sharingType.toUpperCase()}
                          </span>
                        </div>
                        <div className="absolute top-3 left-3">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono ${item.status === 'available' ? 'bg-neutral-950/80 text-white border border-neutral-800' : 'bg-rose-950/80 text-rose-400 border border-rose-800'}`}>
                            {item.status.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      <div className="p-5">
                        <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest">{item.category} • {item.condition} Condition</span>
                        <h3 className="text-base font-bold text-white mt-1 mb-2">{item.itemName}</h3>
                        <p className="text-xs text-neutral-400 font-light mb-4 line-clamp-2">{item.description}</p>

                        <div className="pt-3 border-t border-neutral-800/80 space-y-1 text-xs font-mono text-neutral-400">
                          <div className="flex items-center gap-2">
                            <UserIcon className="w-3.5 h-3.5 text-cyan-400" />
                            <span>{item.studentName} ({item.academicYear})</span>
                          </div>
                          <div>Branch: <strong className="text-white">{item.branch} - Sec {item.section}</strong></div>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 pt-0">
                      <button
                        onClick={() => {
                          if (!user) { onRequireLogin(); return; }
                          setContactModalItem(item);
                        }}
                        disabled={item.status !== 'available'}
                        className="w-full py-2.5 rounded-xl bg-white text-black font-semibold text-xs font-mono uppercase tracking-wider hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-40"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>CONTACT OWNER / REQUEST</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : activeTab === 'share' ? (
            <div className="max-w-2xl mx-auto bg-neutral-900/50 border border-neutral-800 rounded-3xl p-8">
              <h3 className="text-xl font-bold text-white mb-2">{editingItemId ? 'EDIT LISTING' : 'SHARE AN ITEM'}</h3>
              <p className="text-xs text-neutral-400 font-mono mb-6">LIST LABORATORY ITEMS TO LEND, GIVE AWAY, OR EXCHANGE WITH FELLOW STUDENTS</p>

              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="space-y-4">
                  <h4 className="text-xs font-mono text-cyan-400 uppercase tracking-widest border-b border-neutral-800 pb-2">Student Details</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-neutral-400 mb-1 uppercase">Full Name</label>
                      <input
                        type="text"
                        required
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        placeholder="Alex Rivera"
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-neutral-400 mb-1 uppercase">Academic Year</label>
                      <select
                        value={academicYear}
                        onChange={(e) => setAcademicYear(e.target.value as any)}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-xs font-mono"
                      >
                        <option value="1st Year">1st Year</option>
                        <option value="2nd Year">2nd Year</option>
                        <option value="3rd Year">3rd Year</option>
                        <option value="4th Year">4th Year</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-neutral-400 mb-1 uppercase">Branch</label>
                      <input
                        type="text"
                        required
                        value={branch}
                        onChange={(e) => setBranch(e.target.value)}
                        placeholder="Computer Science & Eng"
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-neutral-400 mb-1 uppercase">Section</label>
                      <input
                        type="text"
                        required
                        value={section}
                        onChange={(e) => setSection(e.target.value)}
                        placeholder="A"
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-neutral-400 mb-1 uppercase">Contact Number</label>
                      <input
                        type="text"
                        required
                        value={contactNumber}
                        onChange={(e) => setContactNumber(e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <h4 className="text-xs font-mono text-cyan-400 uppercase tracking-widest border-b border-neutral-800 pb-2">Item Details</h4>

                  <div>
                    <label className="block text-xs font-mono text-neutral-400 mb-1 uppercase">Item Name</label>
                    <input
                      type="text"
                      required
                      value={itemName}
                      onChange={(e) => setItemName(e.target.value)}
                      placeholder="e.g., Scientific Calculator / Lab Coat"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-xs font-mono"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-neutral-400 mb-1 uppercase">Category</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as any)}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-xs font-mono"
                      >
                        <option value="Lab Coats">Lab Coats</option>
                        <option value="Lab Equipment">Lab Equipment</option>
                        <option value="Electronics Components">Electronics Components</option>
                        <option value="Safety Equipment">Safety Equipment</option>
                        <option value="Lab Accessories">Lab Accessories</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-neutral-400 mb-1 uppercase">Condition</label>
                      <select
                        value={condition}
                        onChange={(e) => setCondition(e.target.value as any)}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-xs font-mono"
                      >
                        <option value="New">New</option>
                        <option value="Good">Good</option>
                        <option value="Used">Used</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-neutral-400 mb-1 uppercase">Sharing Type</label>
                      <select
                        value={sharingType}
                        onChange={(e) => setSharingType(e.target.value as any)}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-xs font-mono"
                      >
                        <option value="Free Giveaway">Free Giveaway</option>
                        <option value="Available for Lending">Available for Lending</option>
                        <option value="Exchange">Exchange</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-neutral-400 mb-1 uppercase">Description</label>
                    <textarea
                      required
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Provide details about the item condition, specifications, or pickup instructions..."
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-4 text-white text-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-neutral-400 mb-1 uppercase">Item Photograph URL (Optional)</label>
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-6 border-t border-neutral-800">
                  <button
                    type="button"
                    onClick={() => setActiveTab('browse')}
                    className="px-6 py-3 rounded-xl bg-neutral-900 text-neutral-300 text-xs font-mono hover:bg-neutral-800"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-3 rounded-xl bg-white text-black font-semibold text-xs font-mono hover:bg-neutral-200 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                  >
                    {editingItemId ? 'UPDATE LISTING' : 'SUBMIT LISTING'}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="space-y-6">
              <h3 className="text-base font-bold text-white font-mono">MY SHARED LISTINGS</h3>
              {myItems.length === 0 ? (
                <div className="text-center py-20 text-neutral-500 font-mono text-xs">
                  YOU HAVE NOT SHARED ANY ITEMS YET.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myItems.map(item => (
                    <div key={item.id} className="bg-neutral-900/60 border border-neutral-800 rounded-2xl overflow-hidden flex flex-col justify-between">
                      <div>
                        <div className="relative h-40 bg-neutral-900 overflow-hidden">
                          <img
                            src={item.imageUrl || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80'}
                            alt={item.itemName}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-3 left-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${item.status === 'available' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-rose-950 text-rose-400 border border-rose-800'}`}>
                              {item.status.toUpperCase()}
                            </span>
                          </div>
                        </div>

                        <div className="p-4">
                          <h4 className="text-sm font-bold text-white mb-1">{item.itemName}</h4>
                          <p className="text-xs font-mono text-cyan-400 mb-2">{item.sharingType}</p>
                          <p className="text-xs text-neutral-400 line-clamp-2">{item.description}</p>
                        </div>
                      </div>

                      <div className="p-4 pt-0 flex items-center justify-between gap-2 border-t border-neutral-800 mt-4">
                        <button
                          onClick={() => handleToggleStatus(item)}
                          className="px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-xs font-mono text-neutral-300 hover:text-white"
                        >
                          {item.status === 'available' ? 'Mark Unavailable' : 'Mark Available'}
                        </button>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-cyan-400 hover:bg-neutral-800"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-rose-400 hover:bg-neutral-800"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Contact Owner Modal (Secure: only for authenticated students) */}
        {contactModalItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-8 max-w-md w-full">
              <h3 className="text-lg font-bold text-white mb-2">CONTACT ITEM OWNER</h3>
              <p className="text-xs font-mono text-cyan-400 mb-6">{contactModalItem.itemName}</p>

              <div className="space-y-4 text-xs font-mono bg-neutral-900/60 p-5 rounded-2xl border border-neutral-800 text-neutral-300">
                <div>Owner Name: <strong className="text-white">{contactModalItem.studentName}</strong></div>
                <div>Academic Year: <strong className="text-white">{contactModalItem.academicYear}</strong></div>
                <div>Branch & Sec: <strong className="text-white">{contactModalItem.branch} - Sec {contactModalItem.section}</strong></div>
                <div className="pt-3 border-t border-neutral-800 flex items-center gap-3">
                  <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <span className="text-neutral-500 block text-[10px]">VERIFIED STUDENT CONTACT NUMBER</span>
                    <strong className="text-white text-sm">{contactModalItem.contactNumber}</strong>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setContactModalItem(null)}
                  className="px-6 py-2.5 rounded-xl bg-white text-black font-semibold text-xs font-mono hover:bg-neutral-200"
                >
                  CLOSE
                </button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};
