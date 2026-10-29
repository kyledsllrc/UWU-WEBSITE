import React, { useState } from 'react';
import { useBotDashboard } from '../context/BotDashboardContext';
import { Activity, Coins, Database, RefreshCw, Server, Users } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setCurrentTab, botStats, servers, isFirebaseConnected, refreshFromFirebase } = useBotDashboard();
  const [syncing, setSyncing] = useState(false);

  const sync = async () => {
    setSyncing(true);
    await refreshFromFirebase();
    setSyncing(false);
  };

  const stats = [
    { label: 'Bot connection', value: botStats?.connected ? 'Online' : 'Unavailable', icon: <Activity />, detail: botStats?.username || 'Discord bot status' },
    { label: 'Bot users', value: botStats ? botStats.totalUsers.toLocaleString() : '—', icon: <Users />, detail: 'Firebase user records' },
    { label: 'Managed servers', value: servers.filter((server) => server.botInstalled).length.toLocaleString(), icon: <Server />, detail: 'Bot verified in Discord' },
    { label: 'Currency in circulation', value: botStats ? botStats.totalCirculation.toLocaleString() : '—', icon: <Coins />, detail: 'Wallet and bank balances' },
  ];

  return (
    <main className="mx-auto min-h-[calc(100vh-9rem)] max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-5 border-b border-[#35383d] pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#73c8ad]">uwu-bot · Operations</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Admin overview</h1>
        </div>
        <div className="flex items-center gap-3">
          <span className={`inline-flex items-center gap-2 text-xs ${isFirebaseConnected ? 'text-[#9cddc7]' : 'text-[#efd18b]'}`}>
            <span className={`h-2 w-2 rounded-full ${isFirebaseConnected ? 'bg-[#73c8ad]' : 'bg-[#e2a36d]'}`} />
            {isFirebaseConnected ? 'Firebase connected' : 'Firebase unavailable'}
          </span>
          <button onClick={sync} disabled={syncing} title="Refresh live data" className="rounded-md border border-[#45494f] p-2 text-[#d9e0e2] hover:bg-[#202326] disabled:opacity-50">
            <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </header>

      <section className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="border-b border-[#35383d] py-5">
            <div className="flex items-center gap-2 text-xs text-[#858c93]">{React.cloneElement(stat.icon, { className: 'h-4 w-4 text-[#73c8ad]' })}{stat.label}</div>
            <p className="mt-4 truncate text-2xl font-semibold tabular-nums text-white">{stat.value}</p>
            <p className="mt-1 truncate text-xs text-[#858c93]">{stat.detail}</p>
          </div>
        ))}
      </section>

      <section className="mt-9 grid gap-8 md:grid-cols-2">
        <div>
          <div className="flex items-center gap-2 text-[#73c8ad]"><Database className="h-4 w-4" /><h2 className="text-sm font-semibold text-white">Bot services</h2></div>
          <dl className="mt-3 divide-y divide-[#35383d] border-y border-[#35383d]">
            <DataRow label="Firebase Realtime Database" value={isFirebaseConnected ? 'Connected' : 'Unavailable'} />
            <DataRow label="Discord bot" value={botStats?.connected ? 'Connected' : 'Unavailable'} />
            <DataRow label="Global jackpot" value={botStats?.jackpot === null || botStats?.jackpot === undefined ? 'Not configured' : botStats.jackpot.toLocaleString()} />
          </dl>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-white">Administration</h2>
          <div className="mt-3 divide-y divide-[#35383d] border-y border-[#35383d]">
            <NavRow label="Users" detail="Firebase user records" onClick={() => setCurrentTab('dashboard')} />
            <NavRow label="Servers" detail="Discord servers you administer" onClick={() => setCurrentTab('servers')} />
            <NavRow label="Leaderboard" detail="Live wallet and bank totals" onClick={() => setCurrentTab('leaderboard')} />
            <NavRow label="Database" detail="Bot settings and connection status" onClick={() => setCurrentTab('setup')} />
          </div>
        </div>
      </section>
    </main>
  );
};

const DataRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex justify-between gap-4 py-3 text-sm"><dt className="text-[#aeb4bb]">{label}</dt><dd className="text-right text-white">{value}</dd></div>
);

const NavRow: React.FC<{ label: string; detail: string; onClick: () => void }> = ({ label, detail, onClick }) => (
  <button onClick={onClick} className="flex w-full items-center justify-between gap-4 py-3 text-left hover:text-[#73c8ad]">
    <span className="text-sm font-medium text-white">{label}</span><span className="truncate text-xs text-[#858c93]">{detail}</span>
  </button>
);