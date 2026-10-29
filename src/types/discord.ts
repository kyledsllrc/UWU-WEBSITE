export type UserStatus = 'online' | 'idle' | 'dnd' | 'offline';

export interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  globalName: string;
  avatar: string;
  banner?: string;
  nitroType?: 'booster' | 'classic' | 'none';
  status: UserStatus;
  customStatus?: string;
}

export interface EconomyStats {
  wallet: number;
  bank: number;
  bankLimit: number;
  dailyStreak: number;
  lastDailyClaim?: string;
  totalGambled: number;
  gambleWins: number;
  gambleLosses: number;
}

export interface MarriageData {
  isMarried: boolean;
  partnerId?: string;
  partnerName?: string;
  partnerAvatar?: string;
  partnerHandle?: string;
  marriedAt?: string;
  ringType?: string;
  sharedVaultBalance: number;
  loveAffinity: number; // 0 to 100
}

export interface LevelRank {
  level: number;
  currentXp: number;
  requiredXp: number;
  rankPosition: number;
  tierTitle: string;
  voiceHours: number;
  messageCount: number;
}

export interface Transaction {
  id: string;
  type: 'daily' | 'gamble_win' | 'gamble_loss' | 'transfer' | 'bank_deposit' | 'bank_withdraw' | 'booster_reward';
  amount: number;
  description: string;
  timestamp: string;
}

export interface GuildModules {
  economy: {
    enabled: boolean;
    dailyReward: number;
    robberyRate: number;
    shopEnabled: boolean;
  };
  gambling: {
    enabled: boolean;
    maxBet: number;
    houseEdge: number;
    coinflip: boolean;
    roulette: boolean;
    slots: boolean;
  };
  social: {
    enabled: boolean;
    marriageFee: number;
    customMarryRoles: boolean;
    sharedVault: boolean;
  };
  moderation: {
    enabled: boolean;
    boosterPerks: boolean;
    autoMod: boolean;
    antiSpam: boolean;
  };
}

export interface DiscordGuild {
  id: string;
  name: string;
  icon: string;
  banner?: string;
  memberCount: number;
  botInstalled: boolean;
  userRole: 'Owner' | 'Administrator' | 'Moderator';
  prefix: string;
  logChannelId: string;
  welcomeChannelId: string;
  autoRoleId: string;
  modules: GuildModules;
}

export interface LeaderboardEntry {
  rank: number;
  id: string;
  username: string;
  handle: string;
  avatar: string;
  wallet: number;
  bank: number;
  totalWealth: number;
  level: number;
  xp: number;
  messageCount: number;
  tierBadge: string;
  isBooster: boolean;
}

export interface BotCommand {
  name: string;
  description: string;
  category: 'Economy' | 'Gambling' | 'Social' | 'Booster' | 'Config';
  syntax: string;
  exampleOutput: string;
}
