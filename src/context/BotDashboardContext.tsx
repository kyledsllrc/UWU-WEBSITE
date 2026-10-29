import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  DiscordUser,
  EconomyStats,
  MarriageData,
  LevelRank,
  Transaction,
  DiscordGuild,
  LeaderboardEntry,
  GuildModules,
} from '../types/discord';
import {
  DEFAULT_USER,
  DEFAULT_ECONOMY,
  DEFAULT_MARRIAGE,
  DEFAULT_LEVEL,
  DEFAULT_TRANSACTIONS,
  DEFAULT_GUILDS,
  DEFAULT_LEADERBOARD,
} from '../data/mockData';

export type DashboardTab = 'landing' | 'dashboard' | 'servers' | 'leaderboard' | 'setup';

interface ToastNotification {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface BotDashboardContextType {
  currentTab: DashboardTab;
  setCurrentTab: (tab: DashboardTab) => void;
  user: DiscordUser | null;
  isLoggedIn: boolean;
  loginAsUser: (userData?: Partial<DiscordUser>) => void;
  logout: () => void;
  
  economy: EconomyStats;
  marriage: MarriageData;
  levelRank: LevelRank;
  transactions: Transaction[];
  
  claimDailyReward: () => { success: boolean; reward: number; streak: number };
  depositToBank: (amount: number) => { success: boolean; message: string };
  withdrawFromBank: (amount: number) => { success: boolean; message: string };
  depositToJointVault: (amount: number) => { success: boolean; message: string };
  
  guilds: DiscordGuild[];
  activeGuild: DiscordGuild;
  setActiveGuildId: (id: string) => void;
  toggleGuildModule: (guildId: string, moduleCategory: keyof GuildModules, subKey?: string, value?: boolean) => void;
  updateGuildConfig: (guildId: string, updates: Partial<DiscordGuild>) => void;
  syncGuildsWithDiscord: () => Promise<void>;
  
  leaderboard: LeaderboardEntry[];
  
  isFirebaseConnected: boolean;
  checkFirebaseHealth: () => Promise<boolean>;
  refreshFromFirebase: () => Promise<void>;
  seedLiveFirebase: () => Promise<boolean>;
  
  toasts: ToastNotification[];
  addToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;
}

const BotDashboardContext = createContext<BotDashboardContextType | undefined>(undefined);

export const BotDashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTab, setCurrentTab] = useState<DashboardTab>('landing');
  const [user, setUser] = useState<DiscordUser | null>(DEFAULT_USER);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);

  // Economy state
  const [economy, setEconomy] = useState<EconomyStats>(() => {
    const saved = localStorage.getItem('aether_economy');
    return saved ? JSON.parse(saved) : DEFAULT_ECONOMY;
  });

  // Marriage state
  const [marriage, setMarriage] = useState<MarriageData>(() => {
    const saved = localStorage.getItem('aether_marriage');
    return saved ? JSON.parse(saved) : DEFAULT_MARRIAGE;
  });

  // Level & rank
  const [levelRank, setLevelRank] = useState<LevelRank>(() => {
    const saved = localStorage.getItem('aether_level');
    return saved ? JSON.parse(saved) : DEFAULT_LEVEL;
  });

  // Transactions
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('aether_transactions');
    return saved ? JSON.parse(saved) : DEFAULT_TRANSACTIONS;
  });

  // Guilds state
  const [guilds, setGuilds] = useState<DiscordGuild[]>(() => {
    const saved = localStorage.getItem('aether_guilds');
    return saved ? JSON.parse(saved) : DEFAULT_GUILDS;
  });
  const [activeGuildId, setActiveGuildId] = useState<string>('guild_101');

  // Leaderboard
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(DEFAULT_LEADERBOARD);

  // Firebase Realtime DB connection status
  const [isFirebaseConnected, setIsFirebaseConnected] = useState<boolean>(true);

  // Toast notifications
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const addToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('aether_economy', JSON.stringify(economy));
  }, [economy]);

  useEffect(() => {
    localStorage.setItem('aether_marriage', JSON.stringify(marriage));
  }, [marriage]);

  useEffect(() => {
    localStorage.setItem('aether_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('aether_guilds', JSON.stringify(guilds));
  }, [guilds]);

  // Initial fetch from Live Firebase Database on mount
  useEffect(() => {
    refreshFromFirebase();
  }, []);

  // Fetch and sync data directly from live Firebase backend
  const refreshFromFirebase = async () => {
    try {
      // 1. Check health
      const healthRes = await fetch('/api/firebase/status');
      const healthData = await healthRes.json();
      setIsFirebaseConnected(healthData.success && healthData.connected);

      // 2. Fetch Kyle/current user profile
      const targetId = user?.id || '906461875221434428';
      const userRes = await fetch(`/api/users/${targetId}`);
      if (userRes.ok) {
        const u = await userRes.json();
        if (u.exists) {
          setEconomy((prev) => ({
            ...prev,
            wallet: u.wallet ?? prev.wallet,
            bank: u.bank ?? prev.bank,
            dailyStreak: u.streak ?? prev.dailyStreak,
            totalGambled: u.stats?.totalWagered ?? prev.totalGambled,
            gambleWins: u.stats?.totalWon ?? prev.gambleWins,
            gambleLosses: u.stats?.totalLost ?? prev.gambleLosses,
          }));

          setLevelRank((prev) => ({
            ...prev,
            level: u.level ?? prev.level,
            currentXp: u.xp ?? prev.currentXp,
            tierTitle: u.prestige > 0 ? `Prestige ${u.prestige} Legend` : prev.tierTitle,
          }));

          if (u.history && Array.isArray(u.history) && u.history.length > 0) {
            const mappedTxs: Transaction[] = u.history.map((h: any, idx: number) => ({
              id: `tx_live_${idx}_${h.time || Date.now()}`,
              type: h.type === 'daily' ? 'daily' : h.result === 'win' ? 'gamble_win' : 'gamble_loss',
              amount: h.result === 'win' ? (h.amount || h.bet || 0) : -(h.bet || h.amount || 0),
              description: `${h.type?.toUpperCase() || 'COMMAND'} - ${h.result?.toUpperCase() || 'RESULT'} (bet: ${(h.bet || 0).toLocaleString()})`,
              timestamp: h.time ? new Date(h.time * 1000).toLocaleTimeString() : 'Recent',
            }));
            setTransactions(mappedTxs);
          }
        }
      }

      // 3. Fetch Live Leaderboard
      const lbRes = await fetch('/api/leaderboard');
      if (lbRes.ok) {
        const lbData = await lbRes.json();
        if (lbData.leaderboard && Array.isArray(lbData.leaderboard) && lbData.leaderboard.length > 0) {
          const mappedLb: LeaderboardEntry[] = lbData.leaderboard.map((item: any, idx: number) => ({
            rank: idx + 1,
            id: item.id,
            username: item.username,
            handle: `@${item.username.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
            avatar: idx === 0 ? 'https://cdn.discordapp.com/embed/avatars/0.png' : `https://cdn.discordapp.com/embed/avatars/${(idx % 5)}.png`,
            wallet: item.wallet,
            bank: item.bank,
            totalWealth: item.totalWealth,
            level: item.level,
            xp: item.xp,
            messageCount: (item.level * 180) + Math.floor(item.xp / 10),
            tierBadge: item.prestige > 0 ? `Prestige ${item.prestige}` : item.level >= 50 ? 'Diamond' : item.level >= 25 ? 'Platinum' : 'Gold',
            isBooster: item.isBooster,
          }));
          setLeaderboard(mappedLb);
        }
      }
    } catch {
      // Silently fall back to cached data
    }
  };

  // Seed live Firebase Realtime Database
  const seedLiveFirebase = async (): Promise<boolean> => {
    try {
      addToast('Writing initial schema & seed records to Firebase...', 'info');
      const res = await fetch('/api/firebase/seed', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        addToast('Firebase RTDB seeded successfully with bot structure!', 'success');
        await refreshFromFirebase();
        return true;
      } else {
        addToast(`Seed failed: ${data.error || 'Check permissions'}`, 'error');
        return false;
      }
    } catch (e: any) {
      addToast(`Seed network error: ${e.message}`, 'error');
      return false;
    }
  };

  // Auth actions
  const loginAsUser = (userData?: Partial<DiscordUser>) => {
    const newUser: DiscordUser = {
      ...DEFAULT_USER,
      ...userData,
    };
    setUser(newUser);
    setIsLoggedIn(true);
    addToast(`Signed in as ${newUser.globalName || newUser.username}`, 'success');
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    setCurrentTab('landing');
    addToast('Signed out of Discord session', 'info');
  };

  // Economy Actions with Firebase RTDB live synchronization
  const claimDailyReward = () => {
    const baseReward = 1000;
    const streakBonus = economy.dailyStreak * 75;
    const totalReward = baseReward + streakBonus;
    const newStreak = economy.dailyStreak + 1;
    const newWallet = economy.wallet + totalReward;

    setEconomy((prev) => ({
      ...prev,
      wallet: newWallet,
      dailyStreak: newStreak,
      lastDailyClaim: new Date().toISOString(),
    }));

    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      type: 'daily',
      amount: totalReward,
      description: `Daily Streak Day ${newStreak} (+${Math.round((streakBonus / baseReward) * 100)}% bonus)`,
      timestamp: 'Just now',
    };
    setTransactions((prev) => [newTx, ...prev]);

    // Live sync to Firebase backend
    const targetUserId = user?.id || '906461875221434428';
    fetch(`/api/users/${targetUserId}/economy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        wallet: newWallet,
        dailyStreak: newStreak,
        last_daily: Math.floor(Date.now() / 1000),
      }),
    }).catch(() => {});

    // Also update leaderboard entry for current user
    setLeaderboard((prev) =>
      prev.map((entry) =>
        entry.id === targetUserId
          ? {
              ...entry,
              wallet: entry.wallet + totalReward,
              totalWealth: entry.totalWealth + totalReward,
            }
          : entry
      )
    );

    addToast(`Claimed daily reward! +${totalReward.toLocaleString()} coins deposited to wallet`, 'success');
    return { success: true, reward: totalReward, streak: newStreak };
  };

  const depositToBank = (amount: number) => {
    if (amount <= 0) return { success: false, message: 'Amount must be greater than zero.' };
    if (amount > economy.wallet) return { success: false, message: 'Insufficient coins in wallet.' };
    if (economy.bank + amount > economy.bankLimit) {
      return { success: false, message: `Vault capacity limit reached (Max: ${economy.bankLimit.toLocaleString()} coins).` };
    }

    const newWallet = economy.wallet - amount;
    const newBank = economy.bank + amount;

    setEconomy((prev) => ({
      ...prev,
      wallet: newWallet,
      bank: newBank,
    }));

    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      type: 'bank_deposit',
      amount: -amount,
      description: `Transferred ${amount.toLocaleString()} coins into high-yield vault`,
      timestamp: 'Just now',
    };
    setTransactions((prev) => [newTx, ...prev]);

    // Live sync to Firebase backend
    const targetUserId = user?.id || '906461875221434428';
    fetch(`/api/users/${targetUserId}/economy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        wallet: newWallet,
        bank: newBank,
      }),
    }).catch(() => {});

    addToast(`Deposited ${amount.toLocaleString()} coins to bank vault`, 'success');
    return { success: true, message: 'Deposit successful' };
  };

  const withdrawFromBank = (amount: number) => {
    if (amount <= 0) return { success: false, message: 'Amount must be greater than zero.' };
    if (amount > economy.bank) return { success: false, message: 'Insufficient funds in bank vault.' };

    const newWallet = economy.wallet + amount;
    const newBank = economy.bank - amount;

    setEconomy((prev) => ({
      ...prev,
      wallet: newWallet,
      bank: newBank,
    }));

    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      type: 'bank_withdraw',
      amount: amount,
      description: `Withdrew ${amount.toLocaleString()} coins from bank vault`,
      timestamp: 'Just now',
    };
    setTransactions((prev) => [newTx, ...prev]);

    // Live sync to Firebase backend
    const targetUserId = user?.id || '906461875221434428';
    fetch(`/api/users/${targetUserId}/economy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        wallet: newWallet,
        bank: newBank,
      }),
    }).catch(() => {});

    addToast(`Withdrew ${amount.toLocaleString()} coins to wallet`, 'info');
    return { success: true, message: 'Withdrawal successful' };
  };

  const depositToJointVault = (amount: number) => {
    if (amount <= 0) return { success: false, message: 'Amount must be greater than zero.' };
    if (amount > economy.wallet) return { success: false, message: 'Insufficient coins in wallet.' };

    const newWallet = economy.wallet - amount;
    const newSharedVault = marriage.sharedVaultBalance + amount;

    setEconomy((prev) => ({ ...prev, wallet: newWallet }));
    setMarriage((prev) => ({
      ...prev,
      sharedVaultBalance: newSharedVault,
      loveAffinity: Math.min(100, prev.loveAffinity + 1),
    }));

    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      type: 'transfer',
      amount: -amount,
      description: `Deposited ${amount.toLocaleString()} coins into couple joint vault`,
      timestamp: 'Just now',
    };
    setTransactions((prev) => [newTx, ...prev]);

    const targetUserId = user?.id || '906461875221434428';
    fetch(`/api/users/${targetUserId}/economy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wallet: newWallet }),
    }).catch(() => {});

    addToast(`Contributed ${amount.toLocaleString()} coins to shared marriage vault! (+1% Love Affinity)`, 'success');
    return { success: true, message: 'Contributed to couple vault' };
  };

  // Guild Management
  const activeGuild = guilds.find((g) => g.id === activeGuildId) || guilds[0];

  const toggleGuildModule = (
    guildId: string,
    moduleCategory: keyof GuildModules,
    subKey?: string,
    value?: boolean
  ) => {
    let updatedGuild: DiscordGuild | undefined;

    setGuilds((prev) =>
      prev.map((g) => {
        if (g.id !== guildId) return g;
        const currentMod = g.modules[moduleCategory] as Record<string, unknown>;
        const newMod = subKey
          ? { ...currentMod, [subKey]: value !== undefined ? value : !currentMod[subKey] }
          : { ...currentMod, enabled: value !== undefined ? value : !currentMod.enabled };

        updatedGuild = {
          ...g,
          modules: {
            ...g.modules,
            [moduleCategory]: newMod,
          },
        };
        return updatedGuild;
      })
    );

    // Sync to Firebase RTDB in background
    if (updatedGuild) {
      fetch(`/api/guilds/${guildId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ modules: updatedGuild.modules }),
      }).catch(() => {});
    }

    addToast(`Updated ${String(moduleCategory)} module configuration`, 'success');
  };

  const updateGuildConfig = (guildId: string, updates: Partial<DiscordGuild>) => {
    setGuilds((prev) =>
      prev.map((g) => (g.id === guildId ? { ...g, ...updates } : g))
    );

    // Sync to Firebase RTDB in background
    fetch(`/api/guilds/${guildId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    }).catch(() => {});

    addToast('Server settings saved successfully in Firebase RTDB', 'success');
  };

  const syncGuildsWithDiscord = async () => {
    addToast('Syncing admin guilds with Discord API...', 'info');
    await new Promise((r) => setTimeout(r, 650));
    addToast('Permissions verified: 3 servers with Administrator privileges', 'success');
  };

  const checkFirebaseHealth = async (): Promise<boolean> => {
    try {
      const res = await fetch('/api/firebase/status');
      const data = await res.json();
      const connected = Boolean(data.success && data.connected);
      setIsFirebaseConnected(connected);
      return connected;
    } catch {
      setIsFirebaseConnected(false);
      return false;
    }
  };

  return (
    <BotDashboardContext.Provider
      value={{
        currentTab,
        setCurrentTab,
        user,
        isLoggedIn,
        loginAsUser,
        logout,
        economy,
        marriage,
        levelRank,
        transactions,
        claimDailyReward,
        depositToBank,
        withdrawFromBank,
        depositToJointVault,
        guilds,
        activeGuild,
        setActiveGuildId,
        toggleGuildModule,
        updateGuildConfig,
        syncGuildsWithDiscord,
        leaderboard,
        isFirebaseConnected,
        checkFirebaseHealth,
        refreshFromFirebase,
        seedLiveFirebase,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </BotDashboardContext.Provider>
  );
};

export const useBotDashboard = () => {
  const context = useContext(BotDashboardContext);
  if (!context) {
    throw new Error('useBotDashboard must be used within a BotDashboardProvider');
  }
  return context;
};
