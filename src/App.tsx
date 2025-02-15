import React, { useState } from 'react';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { LogbookPage } from './components/logbook/LogbookPage';
import { CertificationsPage } from './components/certifications/CertificationsPage';
import { SchedulePage } from './components/schedule/SchedulePage';
import { TrainingPage } from './components/training/TrainingPage';
import { CommunityPage } from './components/community/CommunityPage';
import { AuthProvider } from './components/auth/AuthContext';
import { AuthModal } from './components/auth/AuthModal';
import { useAuth } from './components/auth/AuthContext';

type Page = 'dashboard' | 'logbook' | 'certifications' | 'schedule' | 'training' | 'community';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, signOut } = useAuth();

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'logbook':
        return <LogbookPage />;
      case 'certifications':
        return <CertificationsPage />;
      case 'schedule':
        return <SchedulePage />;
      case 'training':
        return <TrainingPage />;
      case 'community':
        return <CommunityPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation 
        currentPage={currentPage} 
        onPageChange={setCurrentPage}
        user={user}
        onSignInClick={() => setShowAuthModal(true)}
        onSignOutClick={signOut}
      />
      <main>
        {renderPage()}
      </main>
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;