

import React, { useState, useCallback } from 'react';
import Sidebar from './Sidebar';
import TestPostbackScreen from './TestPostbackScreen';
import LoginScreen from './LoginScreen';
import AdminAuthModal from './AdminAuthModal';

interface LoginContainerProps {
  onLoginSuccess: (playerId: string, predictionsLeft: number) => void;
  affiliateLink: string | null;
  isAdminFeatureEnabled: boolean;
}

const LoginContainer: React.FC<LoginContainerProps> = ({ onLoginSuccess, affiliateLink, isAdminFeatureEnabled }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState('login'); // 'login' or 'testPostback'
  const [showAdminModal, setShowAdminModal] = useState(false);

  const handleNavigate = useCallback((view: string) => {
    setCurrentView(view);
    setIsSidebarOpen(false);
  }, []);

  const handleOpenSidebar = useCallback(() => setIsSidebarOpen(true), []);
  const handleCloseSidebar = useCallback(() => setIsSidebarOpen(false), []);

  const handleTestPostbackClick = useCallback(() => {
    setIsSidebarOpen(false);
    setShowAdminModal(true);
  }, []);

  const handleAdminSuccess = useCallback(() => {
    setShowAdminModal(false);
    setCurrentView('testPostback');
  }, []);

  const handleAdminClose = useCallback(() => setShowAdminModal(false), []);
  const handleBackToLogin = useCallback(() => setCurrentView('login'), []);

  const containerClasses = currentView === 'login'
    ? "w-full h-full"
    : "w-full max-w-md h-[90vh] max-h-[700px] flex flex-col p-6 card-bg rounded-2xl relative";

  return (
    <div className={containerClasses}>
      {showAdminModal && <AdminAuthModal onSuccess={handleAdminSuccess} onClose={handleAdminClose} />}
      <Sidebar 
        isOpen={isSidebarOpen}
        onClose={handleCloseSidebar}
        onNavigate={handleNavigate}
        onLogout={() => {}} // No-op when not logged in
        isLoggedIn={false}
        isAdminFeatureEnabled={isAdminFeatureEnabled}
        onTestPostbackClick={handleTestPostbackClick}
      />
      {currentView === 'testPostback' ? (
        <TestPostbackScreen onBack={handleBackToLogin} />
      ) : (
        <LoginScreen 
            onLoginSuccess={onLoginSuccess}
            affiliateLink={affiliateLink}
        />
      )}
    </div>
  );
};

export default React.memo(LoginContainer);