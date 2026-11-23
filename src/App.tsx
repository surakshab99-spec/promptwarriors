import React, { useState } from 'react';
import { UserRole, User } from './types';
import { Navigation } from './components/Navigation';
import { HeroSection } from './components/HeroSection';
import { RoleSelection } from './components/RoleSelection';
import { AuthModal } from './components/AuthModal';
import { ExploreLabsModal } from './components/ExploreLabsModal';
import { AboutModal } from './components/AboutModal';
import { LabShareModal } from './components/LabShareModal';
import { StudentDashboard } from './components/dashboards/StudentDashboard';
import { FacultyDashboard } from './components/dashboards/FacultyDashboard';
import { LabAdminDashboard } from './components/dashboards/LabAdminDashboard';
import { SuperAdminDashboard } from './components/dashboards/SuperAdminDashboard';

export default function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'role_select' | 'login' | 'dashboard'>('landing');
  const [selectedRole, setSelectedRole] = useState<UserRole>('student');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isExploreLabsOpen, setIsExploreLabsOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isLabShareOpen, setIsLabShareOpen] = useState(false);

  // Configurable Spline scene URL. If empty or not provided, SplineBlob automatically falls back
  // to an exquisite interactive Three.js WebGL metallic liquid blob with electric-blue reflections & cursor deformation.
  const splineSceneUrl = ''; 

  const handleSelectRole = (role: UserRole) => {
    setSelectedRole(role);
    setCurrentView('login');
  };

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setSelectedRole(user.role);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('landing');
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans antialiased selection:bg-white selection:text-black">
      {/* Top Navigation on Landing & Role Select */}
      {currentView !== 'dashboard' && currentView !== 'login' && (
        <Navigation
          onNavigate={(v) => setCurrentView(v)}
          onOpenExploreLabs={() => setIsExploreLabsOpen(true)}
          onOpenAbout={() => setIsAboutOpen(true)}
          onOpenLabShare={() => setIsLabShareOpen(true)}
          currentView={currentView}
        />
      )}

      {/* View Switcher */}
      {currentView === 'landing' && (
        <HeroSection
          onGetStarted={() => setCurrentView('role_select')}
          onExploreLabs={() => setIsExploreLabsOpen(true)}
          splineUrl={splineSceneUrl}
        />
      )}

      {currentView === 'role_select' && (
        <RoleSelection
          onSelectRole={handleSelectRole}
          onBack={() => setCurrentView('landing')}
        />
      )}

      {currentView === 'login' && (
        <AuthModal
          selectedRole={selectedRole}
          onLoginSuccess={handleLoginSuccess}
          onBackToRoles={() => setCurrentView('role_select')}
        />
      )}

      {currentView === 'dashboard' && currentUser && (
        <>
          {currentUser.role === 'student' && (
            <StudentDashboard 
              user={currentUser} 
              onLogout={handleLogout} 
              onOpenLabShare={() => setIsLabShareOpen(true)} 
            />
          )}
          {currentUser.role === 'faculty' && <FacultyDashboard user={currentUser} onLogout={handleLogout} />}
          {currentUser.role === 'lab_admin' && <LabAdminDashboard user={currentUser} onLogout={handleLogout} />}
          {currentUser.role === 'super_admin' && <SuperAdminDashboard user={currentUser} onLogout={handleLogout} />}
        </>
      )}

      {/* Explore Labs Modal */}
      {isExploreLabsOpen && (
        <ExploreLabsModal
          user={currentUser}
          onClose={() => setIsExploreLabsOpen(false)}
          onRequireLogin={() => {
            setIsExploreLabsOpen(false);
            setCurrentView('role_select');
          }}
        />
      )}

      {/* LabShare Modal */}
      {isLabShareOpen && (
        <LabShareModal
          user={currentUser}
          onClose={() => setIsLabShareOpen(false)}
          onRequireLogin={() => {
            setIsLabShareOpen(false);
            setCurrentView('role_select');
          }}
        />
      )}

      {/* About Modal */}
      {isAboutOpen && (
        <AboutModal onClose={() => setIsAboutOpen(false)} />
      )}
    </div>
  );
}
