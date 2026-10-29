import {
  DiscordUser,
  EconomyStats,
  MarriageData,
  LevelRank,
  Transaction,
  DiscordGuild,
  LeaderboardEntry,
  BotCommand,
} from '../types/discord';

export const BOT_NAME = 'uwu-bot';
export const BOT_AUTHOR = 'kyledsllrc';
export const GITHUB_REPO_URL = 'https://github.com/kyledsllrc/uwu-bot';

export const BOT_AVATAR_PATH = '/src/assets/images/uwu_bot_mascot_1793296277113.jpg';
export const HERO_BANNER_PATH = '/src/assets/images/uwu_bot_banner_1793296277645.jpg';
export const CASINO_THUMBNAIL_PATH = '/src/assets/images/casino_game_thumbnail_1793295650320.jpg';

export interface ZooAnimal {
  id: string;
  name: string;
  tier: 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Mythic' | 'Legendary' | 'Fabled';
  count: number;
  emoji: string;
  attackPower: number;
}

export const DEFAULT_ZOO_ANIMALS: ZooAnimal[] = [
  { id: 'a1', name: 'Mythic Celestial Kitsune', tier: 'Mythic', count: 2, emoji: '🦊', attackPower: 850 },
  { id: 'a2', name: 'Legendary Cyber Dragon', tier: 'Legendary', count: 1, emoji: '🐉', attackPower: 1200 },
  { id: 'a3', name: 'Epic Sakura Shiba', tier: 'Epic', count: 5, emoji: '🐕', attackPower: 420 },
  { id: 'a4', name: 'Rare Starlight Bunny', tier: 'Rare', count: 14, emoji: '🐇', attackPower: 180 },
  { id: 'a5', name: 'Uncommon Lucky Cat', tier: 'Uncommon', count: 28, emoji: '🐱', attackPower: 95 },
  { id: 'a6', name: 'Common Fluffy Hamster', tier: 'Common', count: 52, emoji: '🐹', attackPower: 35 },
];

export const DEFAULT_USER: DiscordUser = {
  id: '906461875221434428',
  username: 'kyledsllrc',
  discriminator: '0',
  globalName: 'Kyle (Dev)',
  avatar: 'https://cdn.discordapp.com/embed/avatars/0.png',
  banner: 'https://cdn.discordapp.com/embed/avatars/1.png',
  nitroType: 'booster',
  status: 'online',
  customStatus: '🌸 developing uwu-bot with Firebase Realtime DB',
};

export const DEFAULT_ECONOMY: EconomyStats = {
  wallet: 38450,
  bank: 245000,
  bankLimit: 500000,
  dailyStreak: 24,
  lastDailyClaim: new Date(Date.now() - 1000 * 60 * 60 * 25).toISOString(),
  totalGambled: 142000,
  gambleWins: 94500,
  gambleLosses: 47500,
};

export const DEFAULT_MARRIAGE: MarriageData = {
  isMarried: true,
  partnerId: '829104829102847192',
  partnerName: 'Aria (Sakura)',
  partnerHandle: '@aria_sakura',
  partnerAvatar: 'https://cdn.discordapp.com/embed/avatars/2.png',
  marriedAt: '2024-02-14T14:20:00Z',
  ringType: 'Sakura Diamond Promise Ring (Tier V)',
  sharedVaultBalance: 128500,
  loveAffinity: 98,
};

export const DEFAULT_LEVEL: LevelRank = {
  level: 56,
  currentXp: 9140,
  requiredXp: 12000,
  rankPosition: 1,
  tierTitle: 'Supreme Grandmaster (uwu)',
  voiceHours: 214.2,
  messageCount: 28410,
};

export const DEFAULT_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx_1',
    type: 'daily',
    amount: 2200,
    description: 'uwu daily bonus (24-day streak multiplier)',
    timestamp: 'Today at 9:15 AM',
  },
  {
    id: 'tx_2',
    type: 'gamble_win',
    amount: 15000,
    description: 'uwu cf (Coinflip won x2.0 on Tails)',
    timestamp: 'Yesterday at 10:45 PM',
  },
  {
    id: 'tx_3',
    type: 'transfer',
    amount: -5000,
    description: 'uwu cookie & gift sent to @Aria',
    timestamp: 'Yesterday at 4:30 PM',
  },
  {
    id: 'tx_4',
    type: 'bank_deposit',
    amount: -25000,
    description: 'Deposited cowoncy into secure bank vault',
    timestamp: '2 days ago',
  },
  {
    id: 'tx_5',
    type: 'booster_reward',
    amount: 5000,
    description: 'Weekly Server Booster cowoncy dividend',
    timestamp: '3 days ago',
  },
];

export const DEFAULT_GUILDS: DiscordGuild[] = [
  {
    id: 'guild_uwu_1',
    name: "Kyle's Community Lounge",
    icon: 'KC',
    memberCount: 16890,
    botInstalled: true,
    userRole: 'Owner',
    prefix: 'uwu ',
    logChannelId: '109283746501',
    welcomeChannelId: '109283746502',
    autoRoleId: '109283746503',
    modules: {
      economy: {
        enabled: true,
        dailyReward: 1200,
        robberyRate: 0.15,
        shopEnabled: true,
      },
      gambling: {
        enabled: true,
        maxBet: 100000,
        houseEdge: 0.04,
        coinflip: true,
        roulette: true,
        slots: true,
      },
      social: {
        enabled: true,
        marriageFee: 2500,
        customMarryRoles: true,
        sharedVault: true,
      },
      moderation: {
        enabled: true,
        boosterPerks: true,
        autoMod: true,
        antiSpam: true,
      },
    },
  },
  {
    id: 'guild_uwu_2',
    name: "Sakura Anime Cafe & Arcade",
    icon: 'SA',
    memberCount: 9420,
    botInstalled: true,
    userRole: 'Administrator',
    prefix: 'uwu ',
    logChannelId: '209283746501',
    welcomeChannelId: '209283746502',
    autoRoleId: '209283746503',
    modules: {
      economy: {
        enabled: true,
        dailyReward: 800,
        robberyRate: 0.0,
        shopEnabled: true,
      },
      gambling: {
        enabled: true,
        maxBet: 50000,
        houseEdge: 0.05,
        coinflip: true,
        roulette: true,
        slots: true,
      },
      social: {
        enabled: true,
        marriageFee: 2000,
        customMarryRoles: true,
        sharedVault: true,
      },
      moderation: {
        enabled: true,
        boosterPerks: true,
        autoMod: true,
        antiSpam: false,
      },
    },
  },
  {
    id: 'guild_uwu_3',
    name: 'UwU Dev & Testing Lab',
    icon: 'UL',
    memberCount: 1250,
    botInstalled: true,
    userRole: 'Owner',
    prefix: 'uwu!',
    logChannelId: '309283746501',
    welcomeChannelId: '309283746502',
    autoRoleId: '309283746503',
    modules: {
      economy: {
        enabled: true,
        dailyReward: 2500,
        robberyRate: 0.5,
        shopEnabled: true,
      },
      gambling: {
        enabled: true,
        maxBet: 500000,
        houseEdge: 0.02,
        coinflip: true,
        roulette: true,
        slots: true,
      },
      social: {
        enabled: true,
        marriageFee: 1000,
        customMarryRoles: true,
        sharedVault: true,
      },
      moderation: {
        enabled: true,
        boosterPerks: true,
        autoMod: true,
        antiSpam: true,
      },
    },
  },
];

export const DEFAULT_LEADERBOARD: LeaderboardEntry[] = [
  {
    rank: 1,
    id: '439281729104829102',
    username: 'kyledsllrc (You)',
    handle: '@kyledsllrc',
    avatar: 'https://cdn.discordapp.com/embed/avatars/0.png',
    wallet: 38450,
    bank: 245000,
    totalWealth: 283450,
    level: 56,
    xp: 9140,
    messageCount: 28410,
    tierBadge: 'Supreme Grandmaster (uwu)',
    isBooster: true,
  },
  {
    rank: 2,
    id: 'user_sakura',
    username: 'SakuraBlossom',
    handle: '@sakura_b',
    avatar: 'https://cdn.discordapp.com/embed/avatars/2.png',
    wallet: 42000,
    bank: 198000,
    totalWealth: 240000,
    level: 51,
    xp: 8200,
    messageCount: 24100,
    tierBadge: 'Mythic Queen',
    isBooster: true,
  },
  {
    rank: 3,
    id: 'user_fox',
    username: 'KitsuneMaster',
    handle: '@kitsune_m',
    avatar: 'https://cdn.discordapp.com/embed/avatars/4.png',
    wallet: 29500,
    bank: 184000,
    totalWealth: 213500,
    level: 47,
    xp: 6800,
    messageCount: 19500,
    tierBadge: 'Fabled Collector',
    isBooster: false,
  },
  {
    rank: 4,
    id: 'user_gamer',
    username: 'ChibiGamer',
    handle: '@chibi_g',
    avatar: 'https://cdn.discordapp.com/embed/avatars/1.png',
    wallet: 18400,
    bank: 165000,
    totalWealth: 183400,
    level: 44,
    xp: 5900,
    messageCount: 16200,
    tierBadge: 'Diamond Tier I',
    isBooster: true,
  },
  {
    rank: 5,
    id: 'user_luna',
    username: 'MoonlightUwU',
    handle: '@moonlight_u',
    avatar: 'https://cdn.discordapp.com/embed/avatars/3.png',
    wallet: 15200,
    bank: 142000,
    totalWealth: 157200,
    level: 39,
    xp: 4800,
    messageCount: 13800,
    tierBadge: 'Emerald Tier II',
    isBooster: false,
  },
];

export const BOT_COMMANDS: BotCommand[] = [
  {
    name: 'cash',
    description: 'Check your cowoncy wallet balance, bank vault savings, and daily streak.',
    category: 'Economy',
    syntax: 'uwu cash [user] | /cash',
    exampleOutput: '🌸 Cowoncy: 38,450 🪙 | 🏦 Bank: 245,000 / 500,000 | ⚡ Streak: 24 Days',
  },
  {
    name: 'daily',
    description: 'Claim daily allowance of cowoncy with streak bonus multiplier.',
    category: 'Economy',
    syntax: 'uwu daily | /daily',
    exampleOutput: '✨ Collected daily allowance of 2,200 cowoncy! (Day 24 streak bonus applied)',
  },
  {
    name: 'pray',
    description: 'Pray to a server friend to grant them luck, affinity, and random cowoncy.',
    category: 'Social',
    syntax: 'uwu pray <@user>',
    exampleOutput: '🙏 @kyledsllrc prayed for @Aria! +1 Love Affinity and 250 cowoncy blessed.',
  },
  {
    name: 'curse',
    description: 'Curse another player with a playful hex to reduce their robbery chance.',
    category: 'Social',
    syntax: 'uwu curse <@user>',
    exampleOutput: '😈 @kyledsllrc cast a playful hex on @Shadow! Next robbery penalty +10%.',
  },
  {
    name: 'cf',
    description: 'Coinflip game: wager cowoncy on heads (h) or tails (t) with 2x payout.',
    category: 'Gambling',
    syntax: 'uwu cf <bet> <h|t> | /coinflip',
    exampleOutput: '🪙 Coinflip landed on [Tails]! Won 15,000 cowoncy! (Payout: x2.0)',
  },
  {
    name: 'slots',
    description: 'Spin 3 reels for jackpot match multipliers up to 10x.',
    category: 'Gambling',
    syntax: 'uwu slots <bet> | /slots',
    exampleOutput: '🎰 [ 🌸 | 🌸 | 🌸 ] JACKPOT! Won 30,000 cowoncy! (Payout: x10.0)',
  },
  {
    name: 'hunt',
    description: 'Hunt wild kawaii animals in the forest to expand your zoo collection.',
    category: 'Economy',
    syntax: 'uwu hunt | /hunt',
    exampleOutput: '🐾 You found a [Mythic Celestial Kitsune 🦊]! Added to your /zoo.',
  },
  {
    name: 'zoo',
    description: 'Inspect your full collection of captured animals, rarities, and power.',
    category: 'Economy',
    syntax: 'uwu zoo [user] | /zoo',
    exampleOutput: '🦁 Zoo: 102 Animals | 1 Mythic, 1 Legendary, 5 Epic, 14 Rare, 81 Common',
  },
  {
    name: 'marry',
    description: 'Propose marriage with custom rings, joint bank vaults, and love buffs.',
    category: 'Social',
    syntax: 'uwu marry <@user> [ring]',
    exampleOutput: '💍 @Aria accepted your proposal! You are now happily married.',
  },
  {
    name: 'cookie',
    description: 'Gift cookies to friendly server members to build reputation.',
    category: 'Social',
    syntax: 'uwu cookie <@user>',
    exampleOutput: '🍪 You gave 5 warm chocolate chip cookies to @Aria! (+5 Rep)',
  },
  {
    name: 'booster claim',
    description: 'Exclusive reward drop for Discord Server Boosters.',
    category: 'Booster',
    syntax: 'uwu booster claim',
    exampleOutput: '💎 Nitro Booster Reward Claimed: 5,000 cowoncy + 500 XP bonus!',
  },
];
