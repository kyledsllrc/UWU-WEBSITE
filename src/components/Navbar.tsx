import React from 'react';
import { useBotDashboard, DashboardTab } from '../context/BotDashboardContext';
import { BOT_AVATAR_PATH, BOT_NAME, GITHUB_REPO_URL } from '../data/siteConfig';
import { Database, Layers, LogOut, Server, Trophy } from 'lucide-react';

const navigation: { tab: DashboardTab; label: string; icon: React.ReactNode }[] = [
  { tab: 'landing', label: 'Overview', icon: <Layers className="h-4 w-4" /> },
  { tab: 'dashboard', label: 'Users', icon: <Database className="h-4 w-4" /> },
  { tab: 'servers', label: 'Guilds', icon: <Server className="h-4 w-4" /> },
  { tab: 'leaderboard', label: 'Leaderboard', icon: <Trophy className="h-4 w-4" /> },
  { tab: 'setup', label: 'Database', icon: <Database className="h-4 w-4" /> },
];

export const Navbar: React.FC = () => {
  const { currentTab, setCurrentTab, isFirebaseConnected, user, logout } = useBotDashboard();

  return (
    <header className="sticky top-0 z-40 border-b border-[#35383d] bg-[#171a1c]/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
        <button onClick={() => setCurrentTab('landing')} className="flex shrink-0 items-center gap-2.5 text-left">
          <img src={BOT_AVATAR_PATH} alt="" className="h-8 w-8 rounded-md object-cover" />
          <span className="text-sm font-semibold text-white">{BOT_NAME}</span>
        </button>
        <nav aria-label="Main navigation" className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto">
          {navigation.map((item) => (
            <button
              key={item.tab}
              onClick={() => setCurrentTab(item.tab)}
              aria-current={currentTab === item.tab ? 'page' : undefined}
              className={`inline-flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${currentTab === item.tab ? 'bg-[#292d31] text-white' : 'text-[#aeb4bb] hover:bg-[#202326] hover:text-white'}`}
            >
              {item.icon}<span>{item.label}</span>
              {item.tab === 'setup' && <span className={`h-1.5 w-1.5 rounded-full ${isFirebaseConnected ? 'bg-[#73c8ad]' : 'bg-[#e2a36d]'}`} />}
            </button>
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-3">
          <a href={GITHUB_REPO_URL} target="_blank" rel="noreferrer" className="hidden text-xs font-medium text-[#aeb4bb] hover:text-white lg:inline">GitHub</a>
          {user && (
            <>
              <span className="hidden max-w-32 truncate text-xs text-[#aeb4bb] sm:inline">{user.globalName || user.username}</span>
              <button onClick={() => void logout()} title="Sign out of Discord" className="rounded-md p-2 text-[#aeb4bb] hover:bg-[#292d31] hover:text-white">
                <LogOut className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};