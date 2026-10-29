export interface DiscordUser {
  id: string;
  username: string;
  globalName: string;
  avatar: string;
}

export interface BotUserStats {
  gamesPlayed: number;
  gamesWon: number;
  totalWagered: number;
  totalWon: number;
}

export interface BotUserRecord {
  discordUserId: string;
  username: string;
  displayName: string;
  wallet: number;
  bank: number;
  streak: number;
  prestige: number;
  isBooster: boolean;
  cryptoPositions: Record<string, unknown>;
  history: Record<string, unknown>[];
  rank: string;
  charismaExp: number;
  boostCount: number;
  stats: BotUserStats;
}

export interface BotLeaderboardEntry {
  id: string;
  username: string;
  displayName: string;
  wallet: number;
  bank: number;
  netWorth: number;
  rank: string;
  prestige: number;
  streak: number;
  charismaExp: number;
  isBooster: boolean;
  boostCount: number;
}