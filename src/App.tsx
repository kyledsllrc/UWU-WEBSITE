import React, { useState } from 'react';
import { BotDashboardProvider, useBotDashboard } from './context/BotDashboardContext';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { UserProfile } from './components/UserProfile';
import { ServerManagement } from './components/ServerManagement';
import { GlobalLeaderboard } from './components/GlobalLeaderboard';
import { FirebaseAndApiSetup } from './components/FirebaseAndApiSetup';
import { DiscordAuthModal } from './components/DiscordAuthModal';
import { BotInviteModal } from './components/BotInviteModal';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/ToastContainer';

function DashboardContent() {
  const { currentTab } = useBotDashboard();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#111214] text-[#DBDEE1]">
      {/* Discord Top Navigation */}
      <Navbar
        onOpenAuthModal={() => setAuthModalOpen(true)}
        onOpenInviteModal={() => setInviteModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentTab === 'landing' && (
          <LandingPage
            onOpenAuthModal={() => setAuthModalOpen(true)}
            onOpenInviteModal={() => setInviteModalOpen(true)}
          />
        )}
        {currentTab === 'dashboard' && <UserProfile />}
        {currentTab === 'servers' && <ServerManagement />}
        {currentTab === 'leaderboard' && <GlobalLeaderboard />}
        {currentTab === 'setup' && <FirebaseAndApiSetup />}
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals & Toasts */}
      <DiscordAuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
      <BotInviteModal
        isOpen={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
      />
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
