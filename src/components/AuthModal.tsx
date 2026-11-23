import React, { useState } from 'react';
import { UserRole, User } from '../types';
import { Eye, EyeOff, ArrowLeft, Lock, Mail, User as UserIcon, Building, ShieldCheck, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface AuthModalProps {
  selectedRole: UserRole;
  onLoginSuccess: (user: User) => void;
  onBackToRoles: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ selectedRole, onLoginSuccess, onBackToRoles }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [department, setDepartment] = useState('Computer Science & Robotics');
  const [studentOrStaffId, setStudentOrStaffId] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const roleTitles: Record<UserRole, string> = {
    student: 'STUDENT PORTAL',
    faculty: 'FACULTY PORTAL',
    lab_admin: 'LAB ADMINISTRATOR PORTAL',
    super_admin: 'SUPER ADMINISTRATOR PORTAL'
  };

  const handleQuickDemoLogin = () => {
    let demoEmail = 'student@easelabs.edu';
    if (selectedRole === 'faculty') demoEmail = 'faculty@easelabs.edu';
    if (selectedRole === 'lab_admin') demoEmail = 'admin@easelabs.edu';
    if (selectedRole === 'super_admin') demoEmail = 'super@easelabs.edu';
    
    setEmail(demoEmail);
    setPassword('nexus2026');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegistering) {
        if (password !== confirmPassword) {
          setError('Passwords do not match.');
          setLoading(false);
          return;
        }

        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fullName, email, password, department, role: selectedRole, studentOrStaffId })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Registration failed');
        onLoginSuccess(data.user);
      } else {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, role: selectedRole })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Login failed');
        onLoginSuccess(data.user);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-between px-6 py-12 relative overflow-hidden">
      {/* Background radial gradient */}
      <div className="absolute inset-0 bg-radial from-neutral-900/50 via-black to-black pointer-events-none" />

      {/* Top Header */}
      <div className="relative z-10 max-w-7xl mx-auto w-full flex items-center justify-between mb-8">
        <button
          onClick={onBackToRoles}
          className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors text-sm font-mono"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>CHANGE ROLE</span>
        </button>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-cyan-400">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>ROLE: {selectedRole.toUpperCase()}</span>
        </div>
      </div>

      {/* Auth Card Container */}
      <div className="relative z-10 max-w-md mx-auto w-full my-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-neutral-950/90 border border-neutral-800 rounded-3xl p-8 shadow-[0_10px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold tracking-tight text-white mb-2">
              {roleTitles[selectedRole]}
            </h2>
            <p className="text-neutral-400 text-xs font-mono tracking-wider">
              {isRegistering ? 'CREATE NEW INSTITUTIONAL CREDENTIALS' : 'ENTER YOUR CREDENTIALS TO ACCESS'}
            </p>
          </div>

          {/* Demo Login Helper */}
          {!isRegistering && (
            <div className="mb-6 p-3 rounded-xl bg-cyan-950/30 border border-cyan-800/40 text-xs text-cyan-300 flex items-center justify-between">
              <span>Testing as {selectedRole}?</span>
              <button 
                type="button" 
                onClick={handleQuickDemoLogin}
                className="underline hover:text-white font-mono"
              >
                Autfill Demo Creds
              </button>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-950/40 border border-rose-800/60 text-xs text-rose-300 flex items-center gap-3">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegistering && (
              <div>
                <label className="block text-xs font-mono text-neutral-400 mb-1 uppercase tracking-wider">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Dr. Alex Rivera"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 pl-10 text-white placeholder:text-neutral-600 text-sm focus:outline-none focus:border-white transition-colors"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-mono text-neutral-400 mb-1 uppercase tracking-wider">
                Institutional Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@easelabs.edu"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 pl-10 text-white placeholder:text-neutral-600 text-sm focus:outline-none focus:border-white transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-mono text-neutral-400 uppercase tracking-wider">
                  Password
                </label>
                {!isRegistering && (
                  <button type="button" onClick={() => alert('Password reset link sent to institutional email.')} className="text-xs text-cyan-400 hover:underline">
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 pl-10 pr-10 text-white placeholder:text-neutral-600 text-sm focus:outline-none focus:border-white transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {isRegistering && (
              <>
                <div>
                  <label className="block text-xs font-mono text-neutral-400 mb-1 uppercase tracking-wider">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 pl-10 text-white placeholder:text-neutral-600 text-sm focus:outline-none focus:border-white transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-neutral-400 mb-1 uppercase tracking-wider">
                    Department
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 pl-10 text-white text-sm focus:outline-none focus:border-white transition-colors"
                    >
                      <option value="Computer Science & Robotics">Computer Science & Robotics</option>
                      <option value="Quantum Physics Department">Quantum Physics Department</option>
                      <option value="Nanomaterials Advanced Facility">Nanomaterials Advanced Facility</option>
                      <option value="Bio-Imaging Core">Bio-Imaging Core</option>
                      <option value="Photonics & Quantum Lab">Photonics & Quantum Lab</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-neutral-400 mb-1 uppercase tracking-wider">
                    Student or Staff ID
                  </label>
                  <input
                    type="text"
                    required
                    value={studentOrStaffId}
                    onChange={(e) => setStudentOrStaffId(e.target.value)}
                    placeholder="ID-2026-991"
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white placeholder:text-neutral-600 text-sm focus:outline-none focus:border-white transition-colors"
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-3.5 px-4 bg-white text-black font-semibold rounded-xl hover:bg-neutral-200 transition-all text-xs font-mono tracking-widest uppercase flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.2)] disabled:opacity-50"
            >
              {loading ? 'AUTHENTICATING...' : (isRegistering ? 'COMPLETE REGISTRATION' : 'LOGIN TO easeLabs')}
            </button>
          </form>

          <div className="mt-8 text-center pt-6 border-t border-neutral-900">
            <button
              type="button"
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-xs text-neutral-400 hover:text-white transition-colors"
            >
              {isRegistering ? 'Already have an account? Login here' : "Don't have an account? Register new ID"}
            </button>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="relative z-10 max-w-7xl mx-auto w-full text-center text-xs font-mono text-neutral-600">
        SECURE GATEWAY // ENCRYPTED SESSION
      </div>
    </div>
  );
};
