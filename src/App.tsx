import React from 'react';
import { BotDashboardProvider, useBotDashboard } from './context/BotDashboardContext';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { AuthScreen } from './components/AuthScreen';
import { UserProfile } from './components/UserProfile';
import { ServerManagement } from './components/ServerManagement';
import { GlobalLeaderboard } from './components/GlobalLeaderboard';
import { FirebaseAndApiSetup } from './components/FirebaseAndApiSetup';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/ToastContainer';

function DashboardContent() {
  const { currentTab, user, isAuthLoading } = useBotDashboard();

  if (isAuthLoading) {
    return <div className="flex min-h-screen items-center justify-center bg-[#171a1c] text-sm text-[#aeb4bb]">Checking Discord session...</div>;
  }
  if (!user) return <AuthScreen />;

  return (
    <div className="min-h-screen flex flex-col bg-[#171a1c] text-[#d9e0e2]">
      {/* Discord Top Navigation */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentTab === 'landing' && (
          <LandingPage />
        )}
        {currentTab === 'dashboard' && <UserProfile />}
        {currentTab === 'servers' && <ServerManagement />}
        {currentTab === 'leaderboard' && <GlobalLeaderboard />}
        {currentTab === 'setup' && <FirebaseAndApiSetup />}
      </main>

      {/* Footer */}
      <Footer />

      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <BotDashboardProvider>
      <DashboardContent />
    </BotDashboardProvider>
  );
}
