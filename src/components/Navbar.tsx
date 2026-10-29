import React, { useState } from 'react';
import { useBotDashboard, DashboardTab } from '../context/BotDashboardContext';
import { BOT_AVATAR_PATH, BOT_NAME, GITHUB_REPO_URL } from '../data/mockData';
import {
  Shield,
  Layers,
  Trophy,
  Database,
  User,
  LogOut,
  ChevronDown,
  Sparkles,
  Server,
  KeyRound,
  Github,
} from 'lucide-react';

interface NavbarProps {
  onOpenAuthModal: () => void;
  onOpenInviteModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuthModal, onOpenInviteModal }) => {
  const { currentTab, setCurrentTab, user, isLoggedIn, logout, isFirebaseConnected } = useBotDashboard();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const navItems: { tab: DashboardTab; label: string; icon: React.ReactNode }[] = [
    { tab: 'landing', label: 'Overview', icon: <Layers className="w-4 h-4" /> },
    { tab: 'dashboard', label: 'User Profile & Zoo', icon: <User className="w-4 h-4" /> },
    { tab: 'servers', label: 'Server Panel', icon: <Server className="w-4 h-4" /> },
    { tab: 'leaderboard', label: 'Leaderboard', icon: <Trophy className="w-4 h-4" /> },
    { tab: 'setup', label: 'Firebase & API Setup', icon: <Database className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#1e1f22]/95 backdrop-blur-md border-b border-[#2b2d31]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setCurrentTab('landing')}
            className="flex items-center gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5865F2]"
          >
            <div className="relative w-9 h-9 rounded-xl overflow-hidden bg-[#2b2d31] border border-[#EB459E]/40 flex items-center justify-center shadow-inner">
              <img
                src={BOT_AVATAR_PATH}
                alt="uwu-bot Mascot"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <Sparkles className="w-4 h-4 text-[#EB459E] absolute" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-extrabold text-white tracking-tight whitespace-nowrap">
                  {BOT_NAME}
                </span>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-[#EB459E]/20 text-[#EB459E] border border-[#EB459E]/30">
                  Bot
                </span>
              </div>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-2">
          {navItems.map((item) => {
            const isActive = currentTab === item.tab;
            return (
              <button
                key={item.tab}
                onClick={() => {
                  setCurrentTab(item.tab);
                }}
                className={`flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'text-white bg-[#2b2d31] shadow-sm'
                    : 'text-[#949BA4] hover:text-[#DBDEE1] hover:bg-[#2b2d31]/50'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.tab === 'setup' && isFirebaseConnected && (
                  <span className="w-2 h-2 rounded-full bg-[#57F287]" title="Firebase Realtime DB Connected" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Action */}
        <div className="flex items-center gap-2.5 shrink-0">
          <a
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#DBDEE1] bg-[#2b2d31] hover:bg-[#313338] border border-[#3f4147] rounded-lg transition-colors whitespace-nowrap shrink-0"
            title="GitHub: kyledsllrc/uwu-bot"
          >
            <Github className="w-3.5 h-3.5 text-white" />
            <span>GitHub</span>
          </a>

          <button
            onClick={onOpenInviteModal}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#DBDEE1] bg-[#2b2d31] hover:bg-[#313338] border border-[#3f4147] rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            <Shield className="w-3.5 h-3.5 text-[#EB459E]" />
            <span>Invite Bot</span>
          </button>

          {isLoggedIn && user ? (
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 pl-2.5 rounded-lg bg-[#2b2d31] hover:bg-[#313338] border border-[#3f4147] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5865F2]"
              >
                <div className="relative">
                  <img
                    src={user.avatar}
                    alt={user.username}
                    referrerPolicy="no-referrer"
                    className="w-7 h-7 rounded-full bg-[#111214] object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://cdn.discordapp.com/embed/avatars/0.png';
                    }}
                  />
                  <span
                    className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#1e1f22] ${
                      user.status === 'online'
                        ? 'bg-[#57F287]'
                        : user.status === 'idle'
                        ? 'bg-[#FEE75C]'
                        : 'bg-[#ED4245]'
                    }`}
                  />
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-semibold text-white leading-tight">
                    {user.globalName || user.username}
                  </div>
                  <div className="text-[10px] text-[#949BA4]">@{user.username}</div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-[#949BA4]" />
              </button>

              {profileDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setProfileDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#2b2d31] border border-[#3f4147] shadow-2xl py-1.5 z-40 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-2 border-b border-[#3f4147]">
                      <div className="text-xs font-semibold text-white">
                        {user.globalName || user.username}
                      </div>
                      <div className="text-[11px] text-[#949BA4] truncate">
                        ID: {user.id}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setCurrentTab('dashboard');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-[#DBDEE1] hover:text-white hover:bg-[#313338] transition-colors"
                    >
                      <User className="w-3.5 h-3.5 text-[#5865F2]" />
                      <span>View My Stats & Bank</span>
                    </button>
                    <button
                      onClick={() => {
                        setCurrentTab('servers');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-[#DBDEE1] hover:text-white hover:bg-[#313338] transition-colors"
                    >
                      <Server className="w-3.5 h-3.5 text-[#57F287]" />
                      <span>Admin Servers (4)</span>
                    </button>
                    <button
                      onClick={() => {
                        onOpenAuthModal();
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-[#DBDEE1] hover:text-white hover:bg-[#313338] transition-colors"
                    >
                      <KeyRound className="w-3.5 h-3.5 text-[#FEE75C]" />
                      <span>Switch Discord User</span>
                    </button>
                    <div className="my-1 border-t border-[#3f4147]" />
                    <button
                      onClick={() => {
                        logout();
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-[#ED4245] hover:bg-[#ED4245]/10 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Disconnect Session</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuthModal}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#5865F2] hover:bg-[#4752C4] active:scale-95 rounded-lg shadow-sm transition-all whitespace-nowrap shrink-0"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
              <span>Login with Discord</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
