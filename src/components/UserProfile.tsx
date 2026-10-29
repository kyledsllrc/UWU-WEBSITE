import React, { useState } from 'react';
import { useBotDashboard } from '../context/BotDashboardContext';
import {
  Wallet,
  Building,
  Heart,
  Award,
  Sparkles,
  ArrowUpRight,
  ArrowDownLeft,
  Flame,
  Clock,
  MessageSquare,
  Mic,
  TrendingUp,
  ShieldAlert,
  ChevronRight,
  DollarSign,
  Gem,
} from 'lucide-react';

export const UserProfile: React.FC = () => {
  const {
    user,
    economy,
    marriage,
    levelRank,
    transactions,
    claimDailyReward,
    depositToBank,
    withdrawFromBank,
    depositToJointVault,
  } = useBotDashboard();

  const [bankModalType, setBankModalType] = useState<'deposit' | 'withdraw' | 'vault' | null>(null);
  const [bankAmountInput, setBankAmountInput] = useState<string>('');

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <p className="text-sm text-[#949BA4]">Please login with Discord to view your profile and economy stats.</p>
      </div>
    );
  }

  const netWorth = economy.wallet + economy.bank;
  const bankFillPercent = Math.min(100, Math.round((economy.bank / economy.bankLimit) * 100));
  const xpPercent = Math.min(100, Math.round((levelRank.currentXp / levelRank.requiredXp) * 100));
  const gambleWinRate = economy.totalGambled > 0
    ? Math.round((economy.gambleWins / economy.totalGambled) * 100)
    : 0;

  const handleBankSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseInt(bankAmountInput, 10);
    if (isNaN(amount) || amount <= 0) return;

    if (bankModalType === 'deposit') {
      depositToBank(amount);
    } else if (bankModalType === 'withdraw') {
      withdrawFromBank(amount);
    } else if (bankModalType === 'vault') {
      depositToJointVault(amount);
    }
    setBankModalType(null);
    setBankAmountInput('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Discord User Profile Header Banner */}
      <div className="relative rounded-2xl overflow-hidden bg-[#1e1f22] border border-[#2b2d31] shadow-xl">
        {/* Banner */}
        <div className="h-36 sm:h-44 bg-gradient-to-r from-[#5865F2]/40 via-[#EB459E]/30 to-[#111214] relative">
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#111214]/80 backdrop-blur-md text-xs font-semibold text-white border border-[#3f4147]">
              <Gem className="w-3.5 h-3.5 text-[#EB459E]" />
              Nitro Server Booster
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#111214]/80 backdrop-blur-md text-xs font-semibold text-[#57F287] border border-[#3f4147]">
              <span className="w-2 h-2 rounded-full bg-[#57F287]" />
              Online
            </span>
          </div>
        </div>

        {/* User Info Bar */}
        <div className="px-6 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-14 sm:-mt-16">
            <div className="flex items-end gap-4">
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-[#1e1f22] bg-[#111214] overflow-hidden shadow-2xl">
                <img
                  src={user.avatar}
                  alt={user.username}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://cdn.discordapp.com/embed/avatars/0.png';
                  }}
                />
              </div>
              <div className="mb-2 space-y-0.5">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    {user.globalName || user.username}
                  </h1>
                  <span className="text-xs text-[#949BA4] font-mono">@{user.username}</span>
                </div>
                <p className="text-xs text-[#DBDEE1] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#5865F2]" />
                  <span>{user.customStatus || 'Level 42 Server Adventurer'}</span>
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => claimDailyReward()}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] text-white text-xs font-bold shadow-md shadow-[#5865F2]/20 active:scale-95 transition-all whitespace-nowrap"
              >
                <Flame className="w-4 h-4 text-[#FEE75C]" />
                <span>Claim Daily (Streak: {economy.dailyStreak}d)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Economy & Banking Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Wallet Balance */}
        <div className="bg-[#1e1f22] rounded-2xl border border-[#2b2d31] p-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-[#949BA4] font-semibold">
            <span>Wallet Balance</span>
            <Wallet className="w-4 h-4 text-[#57F287]" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white font-mono tabular-nums">
              {economy.wallet.toLocaleString()} <span className="text-sm font-sans text-[#FEE75C]">🪙</span>
            </div>
            <div className="text-xs text-[#949BA4] mt-1">Liquid currency ready for use</div>
          </div>
          <div className="pt-2 flex items-center gap-2">
            <button
              onClick={() => {
                setBankModalType('deposit');
                setBankAmountInput('5000');
              }}
              className="flex-1 py-1.5 px-3 rounded-lg bg-[#2b2d31] hover:bg-[#313338] text-xs font-semibold text-white border border-[#3f4147] transition-colors"
            >
              Deposit
            </button>
            <button
              onClick={() => depositToBank(economy.wallet)}
              className="py-1.5 px-3 rounded-lg bg-[#2b2d31] hover:bg-[#313338] text-xs font-semibold text-[#5865F2] border border-[#3f4147] transition-colors"
            >
              Deposit All
            </button>
          </div>
        </div>

        {/* High-Yield Bank Vault */}
        <div className="bg-[#1e1f22] rounded-2xl border border-[#2b2d31] p-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-[#949BA4] font-semibold">
            <span>Bank Vault</span>
            <Building className="w-4 h-4 text-[#5865F2]" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white font-mono tabular-nums">
              {economy.bank.toLocaleString()} <span className="text-sm font-sans text-[#949BA4]">/ {economy.bankLimit.toLocaleString()}</span>
            </div>
            {/* Capacity Progress Bar */}
            <div className="w-full bg-[#111214] h-2 rounded-full overflow-hidden mt-2">
              <div
                className="bg-[#5865F2] h-full rounded-full transition-all duration-300"
                style={{ width: `${bankFillPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-[#949BA4] mt-1">
              <span>{bankFillPercent}% capacity</span>
              <span className="text-[#57F287]">+1.5% weekly</span>
            </div>
          </div>
          <div className="pt-1 flex items-center gap-2">
            <button
              onClick={() => {
                setBankModalType('withdraw');
                setBankAmountInput('10000');
              }}
              className="flex-1 py-1.5 px-3 rounded-lg bg-[#2b2d31] hover:bg-[#313338] text-xs font-semibold text-white border border-[#3f4147] transition-colors"
            >
              Withdraw
            </button>
          </div>
        </div>

        {/* Net Worth */}
        <div className="bg-[#1e1f22] rounded-2xl border border-[#2b2d31] p-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-[#949BA4] font-semibold">
            <span>Total Net Worth</span>
            <TrendingUp className="w-4 h-4 text-[#FEE75C]" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-[#FEE75C] font-mono tabular-nums">
              {netWorth.toLocaleString()} <span className="text-sm font-sans text-white">coins</span>
            </div>
            <div className="text-xs text-[#949BA4] mt-1">Global Wealth Rank #4</div>
          </div>
          <div className="pt-2 text-xs text-[#DBDEE1] flex justify-between items-center border-t border-[#2b2d31]">
            <span className="text-[#949BA4]">Robbery Immunity:</span>
            <span className="text-[#57F287] font-semibold">Bank Protected</span>
          </div>
        </div>

        {/* Daily Streak & Activity */}
        <div className="bg-[#1e1f22] rounded-2xl border border-[#2b2d31] p-5 space-y-3">
          <div className="flex items-center justify-between text-xs text-[#949BA4] font-semibold">
            <span>Streak Multiplier</span>
            <Flame className="w-4 h-4 text-[#FEE75C]" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-white font-mono tabular-nums">
              {economy.dailyStreak} <span className="text-sm font-sans text-[#FEE75C]">Days</span>
            </div>
            <div className="text-xs text-[#57F287] font-medium mt-1">
              +{(economy.dailyStreak * 7.5).toFixed(0)}% Bonus Earnings Active
            </div>
          </div>
          <div className="pt-2 text-xs text-[#949BA4] flex justify-between items-center border-t border-[#2b2d31]">
            <span>Next milestone:</span>
            <span className="text-white font-semibold">Day 20 (2x Drop)</span>
          </div>
        </div>
      </div>

      {/* 3. Marriage & Level Progression Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Social & Marriage Card */}
        <div className="bg-[#1e1f22] rounded-2xl border border-[#2b2d31] p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-[#EB459E]" />
              <h2 className="text-base font-bold text-white">Discord Marriage Status</h2>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#EB459E]/10 text-[#EB459E] border border-[#EB459E]/20">
              Happily Married
            </span>
          </div>

          {marriage.isMarried ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4 bg-[#2b2d31]/50 p-4 rounded-xl border border-[#3f4147]">
                <div className="relative w-14 h-14 rounded-full overflow-hidden bg-[#111214] border-2 border-[#EB459E]">
                  <img
                    src={marriage.partnerAvatar}
                    alt={marriage.partnerName}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://cdn.discordapp.com/embed/avatars/2.png';
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold text-white truncate">
                    {marriage.partnerName}
                  </div>
                  <div className="text-xs text-[#949BA4] font-mono">{marriage.partnerHandle}</div>
                  <div className="text-[11px] text-[#EB459E] font-medium mt-0.5">
                    💍 {marriage.ringType}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-[#949BA4]">Love Affinity</div>
                  <div className="text-lg font-bold text-[#EB459E] font-mono tabular-nums">
                    {marriage.loveAffinity}%
                  </div>
                </div>
              </div>

              {/* Shared Couple Vault */}
              <div className="bg-[#2b2d31] p-4 rounded-xl border border-[#3f4147] flex items-center justify-between">
                <div>
                  <div className="text-xs text-[#949BA4]">Joint Marriage Vault</div>
                  <div className="text-xl font-extrabold text-white font-mono tabular-nums mt-0.5">
                    {marriage.sharedVaultBalance.toLocaleString()} <span className="text-xs text-[#FEE75C]">🪙</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setBankModalType('vault');
                    setBankAmountInput('2500');
                  }}
                  className="px-3.5 py-2 rounded-lg bg-[#EB459E] hover:bg-[#d6338b] text-white text-xs font-bold transition-colors whitespace-nowrap"
                >
                  Contribute Coins
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 text-xs text-[#949BA4]">
              You are currently single. Propose to a server member using <code className="text-[#5865F2]">/marry @user</code>!
            </div>
          )}
        </div>

        {/* Level & Rank Card */}
        <div className="bg-[#1e1f22] rounded-2xl border border-[#2b2d31] p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-[#5865F2]" />
              <h2 className="text-base font-bold text-white">Experience & Rank Tier</h2>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#5865F2]/10 text-[#5865F2] border border-[#5865F2]/20">
              {levelRank.tierTitle}
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-white">Level {levelRank.level}</span>
                <span className="text-[#949BA4] font-mono tabular-nums">
                  {levelRank.currentXp.toLocaleString()} / {levelRank.requiredXp.toLocaleString()} XP
                </span>
              </div>
              <div className="w-full bg-[#111214] h-3 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#5865F2] to-[#57F287] h-full rounded-full transition-all duration-300"
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
              <div className="text-[11px] text-[#949BA4] mt-1.5">
                {levelRank.requiredXp - levelRank.currentXp} XP remaining to Level {levelRank.level + 1}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="bg-[#2b2d31] p-3 rounded-xl border border-[#3f4147] text-center">
                <div className="text-[10px] text-[#949BA4] uppercase font-bold">Global Rank</div>
                <div className="text-base font-extrabold text-[#5865F2] font-mono tabular-nums mt-0.5">
                  #{levelRank.rankPosition}
                </div>
              </div>
              <div className="bg-[#2b2d31] p-3 rounded-xl border border-[#3f4147] text-center">
                <div className="text-[10px] text-[#949BA4] uppercase font-bold">Messages</div>
                <div className="text-base font-extrabold text-white font-mono tabular-nums mt-0.5">
                  {levelRank.messageCount.toLocaleString()}
                </div>
              </div>
              <div className="bg-[#2b2d31] p-3 rounded-xl border border-[#3f4147] text-center">
                <div className="text-[10px] text-[#949BA4] uppercase font-bold">Voice Time</div>
                <div className="text-base font-extrabold text-[#57F287] font-mono tabular-nums mt-0.5">
                  {levelRank.voiceHours}h
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3.5 Zoo & Animal Hunting Collection */}
      <div className="bg-[#1e1f22] rounded-2xl border border-[#2b2d31] p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#2b2d31]">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">🦊</span>
            <div>
              <h3 className="text-base font-bold text-white">uwu Zoo & Hunting Sanctuary</h3>
              <p className="text-xs text-[#949BA4]">Captured species via <code className="text-[#EB459E]">uwu hunt</code> with battle power attributes</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs text-[#DBDEE1]">
            <span>Total Captured: <strong className="text-white font-mono">102</strong></span>
            <span aria-hidden="true" className="text-[#3f4147]">·</span>
            <span>Battle Power: <strong className="text-[#57F287] font-mono">2,780 ATK</strong></span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-[#2b2d31] p-3.5 rounded-xl border border-[#EB459E]/40 text-center space-y-1">
            <div className="text-2xl">🦊</div>
            <div className="text-xs font-bold text-white truncate">Mythic Kitsune</div>
            <div className="text-[10px] text-[#EB459E] font-semibold uppercase">Mythic (2)</div>
            <div className="text-[11px] font-mono text-[#949BA4]">850 ATK</div>
          </div>

          <div className="bg-[#2b2d31] p-3.5 rounded-xl border border-[#FEE75C]/40 text-center space-y-1">
            <div className="text-2xl">🐉</div>
            <div className="text-xs font-bold text-white truncate">Cyber Dragon</div>
            <div className="text-[10px] text-[#FEE75C] font-semibold uppercase">Legendary (1)</div>
            <div className="text-[11px] font-mono text-[#949BA4]">1,200 ATK</div>
          </div>

          <div className="bg-[#2b2d31] p-3.5 rounded-xl border border-[#5865F2]/40 text-center space-y-1">
            <div className="text-2xl">🐕</div>
            <div className="text-xs font-bold text-white truncate">Sakura Shiba</div>
            <div className="text-[10px] text-[#5865F2] font-semibold uppercase">Epic (5)</div>
            <div className="text-[11px] font-mono text-[#949BA4]">420 ATK</div>
          </div>

          <div className="bg-[#2b2d31] p-3.5 rounded-xl border border-[#57F287]/40 text-center space-y-1">
            <div className="text-2xl">🐇</div>
            <div className="text-xs font-bold text-white truncate">Starlight Bunny</div>
            <div className="text-[10px] text-[#57F287] font-semibold uppercase">Rare (14)</div>
            <div className="text-[11px] font-mono text-[#949BA4]">180 ATK</div>
          </div>

          <div className="bg-[#2b2d31] p-3.5 rounded-xl border border-[#3f4147] text-center space-y-1">
            <div className="text-2xl">🐱</div>
            <div className="text-xs font-bold text-white truncate">Lucky Cat</div>
            <div className="text-[10px] text-[#949BA4] font-semibold uppercase">Uncommon (28)</div>
            <div className="text-[11px] font-mono text-[#949BA4]">95 ATK</div>
          </div>

          <div className="bg-[#2b2d31] p-3.5 rounded-xl border border-[#3f4147] text-center space-y-1">
            <div className="text-2xl">🐹</div>
            <div className="text-xs font-bold text-white truncate">Fluffy Hamster</div>
            <div className="text-[10px] text-[#949BA4] font-semibold uppercase">Common (52)</div>
            <div className="text-[11px] font-mono text-[#949BA4]">35 ATK</div>
          </div>
        </div>
      </div>

      {/* 4. Recent Transactions & Activity Ledger */}
      <div className="bg-[#1e1f22] rounded-2xl border border-[#2b2d31] overflow-hidden">
        <div className="p-5 border-b border-[#2b2d31] flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Recent Transactions & Economy Ledger</h3>
            <p className="text-xs text-[#949BA4]">Real-time records synced with Firebase Realtime Database</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#111214] text-[#949BA4] uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-5">Type</th>
                <th className="py-3 px-5">Description</th>
                <th className="py-3 px-5 text-right">Amount</th>
                <th className="py-3 px-5 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2b2d31]">
              {transactions.map((tx) => {
                const isPositive = tx.amount > 0;
                return (
                  <tr key={tx.id} className="hover:bg-[#2b2d31]/50 transition-colors">
                    <td className="py-3.5 px-5">
                      <span className="font-semibold capitalize text-white">
                        {tx.type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-[#DBDEE1]">
                      {tx.description}
                    </td>
                    <td className="py-3.5 px-5 text-right font-mono font-bold tabular-nums">
                      <span className={isPositive ? 'text-[#57F287]' : 'text-[#ED4245]'}>
                        {isPositive ? `+${tx.amount.toLocaleString()}` : tx.amount.toLocaleString()} 🪙
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right text-[#949BA4] whitespace-nowrap">
                      {tx.timestamp}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bank Action Modal */}
      {bankModalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#1e1f22] border border-[#3f4147] rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white capitalize">
                {bankModalType === 'deposit' && 'Deposit into Bank Vault'}
                {bankModalType === 'withdraw' && 'Withdraw from Bank Vault'}
                {bankModalType === 'vault' && 'Contribute to Joint Couple Vault'}
              </h3>
              <button
                onClick={() => setBankModalType(null)}
                className="text-[#949BA4] hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-[#949BA4]">
              {bankModalType === 'deposit' && `Current wallet balance: ${economy.wallet.toLocaleString()} coins. Max capacity: ${economy.bankLimit.toLocaleString()} coins.`}
              {bankModalType === 'withdraw' && `Current bank vault balance: ${economy.bank.toLocaleString()} coins.`}
              {bankModalType === 'vault' && `Contribute to shared marriage vault with @${marriage.partnerName}.`}
            </p>

            <form onSubmit={handleBankSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#DBDEE1] mb-1.5">
                  Amount (Coins)
                </label>
                <input
                  type="number"
                  min="1"
                  value={bankAmountInput}
                  onChange={(e) => setBankAmountInput(e.target.value)}
                  placeholder="Enter coin amount"
                  className="w-full px-3.5 py-2.5 bg-[#111214] border border-[#3f4147] rounded-xl text-white font-mono text-sm focus:outline-none focus:border-[#5865F2]"
                  autoFocus
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setBankModalType(null)}
                  className="flex-1 py-2 px-4 rounded-xl bg-[#2b2d31] hover:bg-[#313338] text-xs font-semibold text-[#DBDEE1] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] text-xs font-bold text-white transition-colors"
                >
                  Confirm Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
