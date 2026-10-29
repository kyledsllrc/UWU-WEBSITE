import React, { createContext, useContext, useEffect, useState } from 'react';
import { BotLeaderboardEntry, BotUserRecord, DiscordUser } from '../types/discord';

export type DashboardTab = 'landing' | 'dashboard' | 'servers' | 'leaderboard' | 'setup';

export interface ManagedServer {
  id: string;
  name: string;
  icon: string | null;
  owner: boolean;
  permissions: string;
  approximate_member_count?: number;
  memberCount?: number | null;
  botInstalled?: boolean | null;
}

export interface BotStats {
  connected: boolean;
  username?: string;
  avatar?: string;
  totalUsers: number;
  totalCirculation: number;
  jackpot: number | null;
  gameOdds: Record<string, unknown> | null;
  cryptoMarket: Record<string, unknown> | null;
}

interface ToastNotification {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface BotDashboardContextType {
  currentTab: DashboardTab;
  setCurrentTab: (tab: DashboardTab) => void;
  user: DiscordUser | null;
  isAuthLoading: boolean;
  authMessage: string;
  logout: () => Promise<void>;
  userRecord: BotUserRecord | null;
  leaderboard: BotLeaderboardEntry[];
  servers: ManagedServer[];
  serverStatusMessage: string;
  botStats: BotStats | null;
  economySettings: Record<string, any> | null;
  cryptoMarket: Record<string, any> | null;
  gameOdds: Record<string, unknown> | null;
  isFirebaseConnected: boolean;
  checkFirebaseHealth: () => Promise<boolean>;
  refreshFromFirebase: (userId?: string) => Promise<boolean>;
  toasts: ToastNotification[];
  addToast: (message: string, type?: ToastNotification['type']) => void;
  removeToast: (id: string) => void;
}

const BotDashboardContext = createContext<BotDashboardContextType | undefined>(undefined);

export const BotDashboardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTab, setCurrentTab] = useState<DashboardTab>('landing');
  const [user, setUser] = useState<DiscordUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [authMessage, setAuthMessage] = useState('');
  const [userRecord, setUserRecord] = useState<BotUserRecord | null>(null);
  const [userRecordId, setUserRecordId] = useState('');
  const [leaderboard, setLeaderboard] = useState<BotLeaderboardEntry[]>([]);
  const [servers, setServers] = useState<ManagedServer[]>([]);
  const [serverStatusMessage, setServerStatusMessage] = useState('');
  const [botStats, setBotStats] = useState<BotStats | null>(null);
  const [economySettings, setEconomySettings] = useState<Record<string, any> | null>(null);
  const [cryptoMarket, setCryptoMarket] = useState<Record<string, any> | null>(null);
  const [gameOdds, setGameOdds] = useState<Record<string, unknown> | null>(null);
  const [isFirebaseConnected, setIsFirebaseConnected] = useState(false);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const removeToast = (id: string) => setToasts((current) => current.filter((toast) => toast.id !== id));

  const addToast = (message: string, type: ToastNotification['type'] = 'info') => {
    const id = Math.random().toString(36).slice(2, 9);
    setToasts((current) => [...current, { id, message, type }]);
    window.setTimeout(() => removeToast(id), 4000);
  };

  const checkFirebaseHealth = async (): Promise<boolean> => {
    try {
      const response = await fetch('/api/firebase/status');
      const data = await response.json();
      const connected = Boolean(response.ok && data.success && data.connected);
      setIsFirebaseConnected(connected);
      return connected;
    } catch {
      setIsFirebaseConnected(false);
      return false;
    }
  };

  const refreshFromFirebase = async (requestedUserId?: string): Promise<boolean> => {
    const targetUserId = requestedUserId || user?.id;
    if (!targetUserId) return false;
    setUserRecordId(targetUserId);

    try {
      const responses = await Promise.all([
        fetch('/api/firebase/status'),
        fetch(`/api/users/${encodeURIComponent(targetUserId)}`),
        fetch('/api/leaderboard'),
        fetch('/api/servers'),
        fetch('/api/bot/status'),
        fetch('/api/economy-settings'),
        fetch('/api/crypto-market'),
        fetch('/api/game-odds'),
      ]);
      const [statusResponse, userResponse, leaderboardResponse, serversResponse, botResponse, settingsResponse, cryptoResponse, oddsResponse] = responses;
      const status = await statusResponse.json();
      setIsFirebaseConnected(Boolean(statusResponse.ok && status.success && status.connected));

      if (userResponse.ok) {
        const data = await userResponse.json();
        setUserRecord(data.exists ? data : null);
      } else {
        setUserRecord(null);
      }

      if (leaderboardResponse.ok) {
        const data = await leaderboardResponse.json();
        setLeaderboard(Array.isArray(data.leaderboard) ? data.leaderboard : []);
      }
      if (serversResponse.ok) {
        const data = await serversResponse.json();
        setServers(Array.isArray(data.servers) ? data.servers : []);
        setServerStatusMessage('');
      } else {
        const data = await serversResponse.json();
        setServers([]);
        setServerStatusMessage(data.error || 'Server status could not be loaded.');
      }
      if (botResponse.ok) setBotStats(await botResponse.json());
      else setBotStats(null);
      if (settingsResponse.ok) setEconomySettings(await settingsResponse.json());
      if (cryptoResponse.ok) setCryptoMarket(await cryptoResponse.json());
      if (oddsResponse.ok) setGameOdds(await oddsResponse.json());
      return userResponse.ok;
    } catch {
      setIsFirebaseConnected(false);
      return false;
    }
  };

  useEffect(() => {
    let active = true;
    const loadSession = async () => {
      try {
        const response = await fetch('/api/auth/session');
        const data = await response.json();
        if (!active || !data.authenticated || !data.user) return;
        if (!data.authorized) {
          setAuthMessage('This Discord account is not authorized to administer uwu-bot.');
          return;
        }
        setUser({
          id: data.user.id,
          username: data.user.username,
          globalName: data.user.globalName,
          avatar: data.user.avatar,
        });
        await refreshFromFirebase(data.user.id);
      } catch {
        setIsFirebaseConnected(false);
      } finally {
        if (active) setIsAuthLoading(false);
      }
    };
    void loadSession();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!user) return;
    const selectedUserId = userRecordId || user.id;
    const stream = new EventSource(`/api/live?userId=${encodeURIComponent(selectedUserId)}`);

    stream.addEventListener('users', (event) => {
      try {
        const payload = JSON.parse((event as MessageEvent<string>).data) as {
          leaderboard: BotLeaderboardEntry[];
          totalUsers: number;
          totalCirculation: number;
          userRecord: BotUserRecord | null;
        };
        setLeaderboard(payload.leaderboard || []);
        setBotStats((current) => current ? {
          ...current,
          totalUsers: payload.totalUsers,
          totalCirculation: payload.totalCirculation,
        } : current);
        if (selectedUserId === (userRecordId || user.id)) setUserRecord(payload.userRecord);
        setIsFirebaseConnected(true);
      } catch {
        setIsFirebaseConnected(false);
      }
    });

    stream.addEventListener('economy_settings', (event) => {
      try {
        const settings = JSON.parse((event as MessageEvent<string>).data) as Record<string, any> | null;
        setEconomySettings(settings);
        setBotStats((current) => current ? {
          ...current,
          jackpot: typeof settings?.jackpot === 'number' ? settings.jackpot : null,
        } : current);
        setIsFirebaseConnected(true);
      } catch {
        setIsFirebaseConnected(false);
      }
    });

    stream.addEventListener('crypto_market', (event) => {
      try {
        const market = JSON.parse((event as MessageEvent<string>).data) as Record<string, any> | null;
        setCryptoMarket(market);
        setBotStats((current) => current ? { ...current, cryptoMarket: market } : current);
      } catch {
        setIsFirebaseConnected(false);
      }
    });

    stream.addEventListener('game_odds', (event) => {
      try {
        const odds = JSON.parse((event as MessageEvent<string>).data) as Record<string, unknown> | null;
        setGameOdds(odds);
        setBotStats((current) => current ? { ...current, gameOdds: odds } : current);
      } catch {
        setIsFirebaseConnected(false);
      }
    });

    stream.addEventListener('stream-error', () => setIsFirebaseConnected(false));
    stream.onerror = () => setIsFirebaseConnected(false);
    return () => stream.close();
  }, [user?.id, userRecordId]);

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' }).catch(() => undefined);
    setUser(null);
    setUserRecord(null);
    setLeaderboard([]);
    setServers([]);
    setBotStats(null);
    setCurrentTab('landing');
  };

  return (
    <BotDashboardContext.Provider value={{
      currentTab,
      setCurrentTab,
      user,
      isAuthLoading,
      authMessage,
      logout,
      userRecord,
      leaderboard,
      servers,
      serverStatusMessage,
      botStats,
      economySettings,
      cryptoMarket,
      gameOdds,
      isFirebaseConnected,
      checkFirebaseHealth,
      refreshFromFirebase,
      toasts,
      addToast,
      removeToast,
    }}>
      {children}
    </BotDashboardContext.Provider>
  );
};

export const useBotDashboard = () => {
  const context = useContext(BotDashboardContext);
  if (!context) throw new Error('useBotDashboard must be used within a BotDashboardProvider');
  return context;
};