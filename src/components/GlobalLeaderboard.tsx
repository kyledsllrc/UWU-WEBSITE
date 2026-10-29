import React, { useState } from 'react';
import { useBotDashboard } from '../context/BotDashboardContext';
import { RefreshCw, Search, Users } from 'lucide-react';

export const GlobalLeaderboard: React.FC = () => {
  const { leaderboard, refreshFromFirebase } = useBotDashboard();
  const [query, setQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const entries = leaderboard.filter((entry) =>
    `${entry.displayName} ${entry.username} ${entry.id}`.toLowerCase().includes(query.trim().toLowerCase())
  );

  const refresh = async () => {
    setRefreshing(true);
    await refreshFromFirebase();
    setRefreshing(false);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-5 border-b border-[#35383d] pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#73c8ad]"><Users className="h-4 w-4" /> Firebase user records</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Bot users</h1>
        </div>
        <div className="flex w-full gap-2 sm:w-auto">
          <label className="relative min-w-0 flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#858c93]" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name or Discord ID" className="w-full rounded-md border border-[#45494f] bg-[#202326] py-2.5 pl-9 pr-3 text-sm text-white placeholder:text-[#858c93] focus:border-[#73c8ad] focus:outline-none" />
          </label>
          <button onClick={refresh} disabled={refreshing} title="Refresh user records" className="rounded-md border border-[#45494f] p-2.5 text-white hover:bg-[#202326] disabled:opacity-50">
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </header>

      <p className="text-sm text-[#aeb4bb]">Showing {entries.length} of {leaderboard.length} loaded records</p>
      <div className="overflow-x-auto border-y border-[#35383d]">
        {entries.length === 0 ? (
          <p className="py-16 text-center text-sm text-[#aeb4bb]">{leaderboard.length ? 'No users match this search.' : 'No user records were returned from Firebase.'}</p>
        ) : (
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="border-b border-[#35383d] text-xs uppercase tracking-wide text-[#858c93]">
              <tr><th className="px-4 py-3 font-medium">Rank</th><th className="px-4 py-3 font-medium">User</th><th className="px-4 py-3 text-right font-medium">Wallet</th><th className="px-4 py-3 text-right font-medium">Bank</th><th className="px-4 py-3 text-right font-medium">Net worth</th><th className="px-4 py-3 text-right font-medium">Streak</th><th className="px-4 py-3 text-right font-medium">Booster</th></tr>
            </thead>
            <tbody className="divide-y divide-[#35383d]">
              {entries.map((entry, index) => (
                <tr key={entry.id} className="hover:bg-[#202326]">
                  <td className="px-4 py-3 font-mono tabular-nums text-[#aeb4bb]">{index + 1}</td>
                  <td className="px-4 py-3"><p className="font-medium text-white">{entry.displayName || entry.username}</p><p className="mt-1 font-mono text-xs text-[#858c93]">{entry.id}</p></td>
                  <td className="px-4 py-3 text-right font-mono tabular-nums text-white">{entry.wallet.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right font-mono tabular-nums text-white">{entry.bank.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right font-mono font-semibold tabular-nums text-[#73c8ad]">{entry.netWorth.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right font-mono tabular-nums text-white">{entry.streak.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right text-[#aeb4bb]">{entry.isBooster ? `Yes${entry.boostCount ? ` · ${entry.boostCount}` : ''}` : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};