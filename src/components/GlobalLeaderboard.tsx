import React, { useState } from 'react';
import { useBotDashboard } from '../context/BotDashboardContext';
import { LeaderboardEntry } from '../types/discord';
import {
  Trophy,
  Coins,
  Award,
  Dice5,
  Search,
  Gem,
  ArrowUp,
  Flame,
  Crown,
  Sparkles,
} from 'lucide-react';

export const GlobalLeaderboard: React.FC = () => {
  const { leaderboard, user, refreshFromFirebase } = useBotDashboard();
  const [activeCategory, setActiveCategory] = useState<'wealth' | 'activity' | 'casino'>('wealth');
  const [timeframe, setTimeframe] = useState<'all' | 'monthly' | 'weekly'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Sort and filter leaderboard
  let sortedEntries = [...leaderboard];
  if (activeCategory === 'wealth') {
    sortedEntries.sort((a, b) => b.totalWealth - a.totalWealth);
  } else if (activeCategory === 'activity') {
    sortedEntries.sort((a, b) => b.level * 10000 + b.xp - (a.level * 10000 + a.xp));
  } else if (activeCategory === 'casino') {
    sortedEntries.sort((a, b) => ((b as any).totalWon || b.wallet) - ((a as any).totalWon || a.wallet));
  }

  // Update dynamic ranks
  sortedEntries = sortedEntries.map((item, index) => ({
    ...item,
    rank: index + 1,
  }));

  const filteredEntries = sortedEntries.filter((entry) =>
    entry.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.handle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const top3 = sortedEntries.slice(0, 3);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshFromFirebase();
    setIsRefreshing(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Leaderboard Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#5865F2]">
            <Trophy className="w-4 h-4" />
            <span>Competitive Discord Standings</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Global Server Leaderboards
          </h1>
          <p className="text-xs text-[#949BA4] mt-1">
            Track top earners, highest server activity, and high-stakes casino champions across all interconnected guilds.
          </p>
        </div>

        {/* Timeframe & Category Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Tabs */}
          <div className="flex items-center gap-1 p-1 bg-[#1e1f22] rounded-xl border border-[#2b2d31]">
            <button
              onClick={() => setActiveCategory('wealth')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                activeCategory === 'wealth'
                  ? 'bg-[#5865F2] text-white shadow-sm'
                  : 'text-[#949BA4] hover:text-[#DBDEE1]'
              }`}
            >
              <Coins className="w-3.5 h-3.5" />
              <span>Net Worth</span>
            </button>
            <button
              onClick={() => setActiveCategory('activity')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                activeCategory === 'activity'
                  ? 'bg-[#5865F2] text-white shadow-sm'
                  : 'text-[#949BA4] hover:text-[#DBDEE1]'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Activity & Level</span>
            </button>
            <button
              onClick={() => setActiveCategory('casino')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                activeCategory === 'casino'
                  ? 'bg-[#5865F2] text-white shadow-sm'
                  : 'text-[#949BA4] hover:text-[#DBDEE1]'
              }`}
            >
              <Dice5 className="w-3.5 h-3.5" />
              <span>Casino Wins</span>
            </button>
          </div>

          {/* Timeframe selector */}
          <div className="flex items-center gap-1 p-1 bg-[#1e1f22] rounded-xl border border-[#2b2d31]">
            {(['all', 'monthly', 'weekly'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg capitalize transition-colors ${
                  timeframe === tf
                    ? 'bg-[#2b2d31] text-white'
                    : 'text-[#949BA4] hover:text-[#DBDEE1]'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Sync / Refresh from Firebase */}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#2b2d31] hover:bg-[#313338] text-xs font-semibold text-[#DBDEE1] border border-[#3f4147] transition-colors"
            title="Refresh leaderboard directly from Firebase Realtime Database"
          >
            <Sparkles className={`w-3.5 h-3.5 text-[#FEE75C] ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Syncing...' : 'Sync Live'}</span>
          </button>
        </div>
      </div>

      {/* 2. Top 3 Podium Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4">
        {/* Rank 2 (Silver) */}
        {top3[1] && (
          <div className="order-2 md:order-1 bg-[#1e1f22] rounded-2xl border border-[#3f4147] p-5 text-center relative flex flex-col items-center justify-between shadow-lg">
            <div className="w-8 h-8 rounded-full bg-slate-300/20 text-slate-300 font-extrabold text-sm flex items-center justify-center border border-slate-300/40 mb-3">
              2
            </div>
            <div className="relative w-20 h-20 rounded-full border-2 border-slate-300 overflow-hidden shadow-xl mb-3">
              <img
                src={top3[1].avatar}
                alt={top3[1].username}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://cdn.discordapp.com/embed/avatars/1.png';
                }}
              />
            </div>
            <div className="space-y-1">
              <div className="text-sm font-bold text-white flex items-center justify-center gap-1.5">
                <span>{top3[1].username}</span>
                {top3[1].isBooster && <Gem className="w-3.5 h-3.5 text-[#EB459E]" />}
              </div>
              <div className="text-xs text-[#949BA4] font-mono">{top3[1].handle}</div>
              <div className="text-xs text-[#DBDEE1] font-semibold">{top3[1].tierBadge}</div>
            </div>
            <div className="mt-4 pt-3 border-t border-[#2b2d31] w-full">
              <div className="text-lg font-extrabold text-slate-200 font-mono tabular-nums">
                {activeCategory === 'wealth' && `${top3[1].totalWealth.toLocaleString()} 🪙`}
                {activeCategory === 'activity' && `Level ${top3[1].level} (${top3[1].xp.toLocaleString()} XP)`}
                {activeCategory === 'casino' && `${top3[1].wallet.toLocaleString()} 🪙`}
              </div>
            </div>
          </div>
        )}

        {/* Rank 1 (Gold) - Elevated */}
        {top3[0] && (
          <div className="order-1 md:order-2 bg-gradient-to-b from-[#1e1f22] to-[#2b2d31] rounded-2xl border-2 border-[#FEE75C]/60 p-6 text-center relative flex flex-col items-center justify-between shadow-2xl scale-100 md:-translate-y-2">
            <div className="w-9 h-9 rounded-full bg-[#FEE75C]/20 text-[#FEE75C] font-extrabold text-base flex items-center justify-center border border-[#FEE75C] mb-3">
              <Crown className="w-5 h-5 text-[#FEE75C]" />
            </div>
            <div className="relative w-24 h-24 rounded-full border-4 border-[#FEE75C] overflow-hidden shadow-2xl mb-3">
              <img
                src={top3[0].avatar}
                alt={top3[0].username}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://cdn.discordapp.com/embed/avatars/4.png';
                }}
              />
            </div>
            <div className="space-y-1">
              <div className="text-base font-extrabold text-white flex items-center justify-center gap-1.5">
                <span>{top3[0].username}</span>
                {top3[0].isBooster && <Gem className="w-4 h-4 text-[#EB459E]" />}
              </div>
              <div className="text-xs text-[#949BA4] font-mono">{top3[0].handle}</div>
              <div className="text-xs text-[#FEE75C] font-semibold">{top3[0].tierBadge}</div>
            </div>
            <div className="mt-4 pt-3 border-t border-[#3f4147] w-full">
              <div className="text-xl font-extrabold text-[#FEE75C] font-mono tabular-nums">
                {activeCategory === 'wealth' && `${top3[0].totalWealth.toLocaleString()} 🪙`}
                {activeCategory === 'activity' && `Level ${top3[0].level} (${top3[0].xp.toLocaleString()} XP)`}
                {activeCategory === 'casino' && `${top3[0].wallet.toLocaleString()} 🪙`}
              </div>
            </div>
          </div>
        )}

        {/* Rank 3 (Bronze) */}
        {top3[2] && (
          <div className="order-3 bg-[#1e1f22] rounded-2xl border border-[#3f4147] p-5 text-center relative flex flex-col items-center justify-between shadow-lg">
            <div className="w-8 h-8 rounded-full bg-amber-700/20 text-amber-500 font-extrabold text-sm flex items-center justify-center border border-amber-600/40 mb-3">
              3
            </div>
            <div className="relative w-20 h-20 rounded-full border-2 border-amber-600 overflow-hidden shadow-xl mb-3">
              <img
                src={top3[2].avatar}
                alt={top3[2].username}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://cdn.discordapp.com/embed/avatars/3.png';
                }}
              />
            </div>
            <div className="space-y-1">
              <div className="text-sm font-bold text-white flex items-center justify-center gap-1.5">
                <span>{top3[2].username}</span>
                {top3[2].isBooster && <Gem className="w-3.5 h-3.5 text-[#EB459E]" />}
              </div>
              <div className="text-xs text-[#949BA4] font-mono">{top3[2].handle}</div>
              <div className="text-xs text-[#DBDEE1] font-semibold">{top3[2].tierBadge}</div>
            </div>
            <div className="mt-4 pt-3 border-t border-[#2b2d31] w-full">
              <div className="text-lg font-extrabold text-amber-500 font-mono tabular-nums">
                {activeCategory === 'wealth' && `${top3[2].totalWealth.toLocaleString()} 🪙`}
                {activeCategory === 'activity' && `Level ${top3[2].level} (${top3[2].xp.toLocaleString()} XP)`}
                {activeCategory === 'casino' && `${top3[2].wallet.toLocaleString()} 🪙`}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. Search and High-Density Standings Table */}
      <div className="bg-[#1e1f22] rounded-2xl border border-[#2b2d31] overflow-hidden shadow-xl space-y-4">
        {/* Table Search Bar */}
        <div className="p-4 sm:p-5 border-b border-[#2b2d31] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-[#949BA4] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search user by name or handle..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#111214] border border-[#3f4147] rounded-xl text-xs text-white placeholder-[#949BA4] focus:outline-none focus:border-[#5865F2]"
            />
          </div>
          <div className="text-xs text-[#949BA4] whitespace-nowrap">
            Showing {filteredEntries.length} of {sortedEntries.length} members
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#111214] text-[#949BA4] uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-5 text-center w-16">Rank</th>
                <th className="py-3 px-5">User</th>
                <th className="py-3 px-5">Tier Badge</th>
                <th className="py-3 px-5 text-right">Wallet</th>
                <th className="py-3 px-5 text-right">Bank Vault</th>
                <th className="py-3 px-5 text-right">Total Net Worth</th>
                <th className="py-3 px-5 text-right">Level</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2b2d31]">
              {filteredEntries.map((entry) => {
                const isCurrentUser = entry.id === user?.id || entry.username.includes('(You)');
                return (
                  <tr
                    key={entry.id}
                    className={`transition-colors ${
                      isCurrentUser
                        ? 'bg-[#5865F2]/10 hover:bg-[#5865F2]/20 font-semibold'
                        : 'hover:bg-[#2b2d31]/50'
                    }`}
                  >
                    <td className="py-3 px-5 text-center font-mono font-bold">
                      <span
                        className={`inline-flex items-center justify-center w-6 h-6 rounded-md ${
                          entry.rank === 1
                            ? 'bg-[#FEE75C] text-black font-extrabold'
                            : entry.rank === 2
                            ? 'bg-slate-300 text-black font-extrabold'
                            : entry.rank === 3
                            ? 'bg-amber-600 text-white font-extrabold'
                            : 'text-[#949BA4]'
                        }`}
                      >
                        #{entry.rank}
                      </span>
                    </td>

                    <td className="py-3 px-5">
                      <div className="flex items-center gap-3">
                        <img
                          src={entry.avatar}
                          alt={entry.username}
                          referrerPolicy="no-referrer"
                          className="w-8 h-8 rounded-full bg-[#111214] object-cover"
                          onError={(e) => {
                            e.currentTarget.src = 'https://cdn.discordapp.com/embed/avatars/0.png';
                          }}
                        />
                        <div>
                          <div className="font-bold text-white flex items-center gap-1.5">
                            <span>{entry.username}</span>
                            {entry.isBooster && <Gem className="w-3 h-3 text-[#EB459E]" />}
                          </div>
                          <div className="text-[11px] text-[#949BA4] font-mono">{entry.handle}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-5">
                      <span className="text-xs text-[#DBDEE1] px-2 py-0.5 rounded bg-[#111214] border border-[#3f4147]">
                        {entry.tierBadge}
                      </span>
                    </td>

                    <td className="py-3 px-5 text-right font-mono font-semibold tabular-nums text-white">
                      {entry.wallet.toLocaleString()} 🪙
                    </td>

                    <td className="py-3 px-5 text-right font-mono font-semibold tabular-nums text-[#949BA4]">
                      {entry.bank.toLocaleString()} 🏦
                    </td>

                    <td className="py-3 px-5 text-right font-mono font-extrabold tabular-nums text-[#FEE75C]">
                      {entry.totalWealth.toLocaleString()} 🪙
                    </td>

                    <td className="py-3 px-5 text-right font-mono font-bold tabular-nums text-[#5865F2]">
                      Lvl {entry.level}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
