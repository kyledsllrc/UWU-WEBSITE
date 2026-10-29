import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { getFirebaseAdminDatabase, FIREBASE_DATABASE_URL } from './src/server/firebase-config.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());

// API Route: Firebase Connection Status & Diagnostics
app.get('/api/firebase/status', async (_req: Request, res: Response) => {
  try {
    const db = getFirebaseAdminDatabase();
    // Test database read from real economy_settings
    const snap = await db.ref('economy_settings').once('value');
    const ecoVal = snap.val();

    res.json({
      success: true,
      projectId: 'uwu-bot-4cff1',
      clientEmail: 'firebase-adminsdk-fbsvc@uwu-bot-4cff1.iam.gserviceaccount.com',
      databaseURL: FIREBASE_DATABASE_URL,
      connected: true,
      economySettings: ecoVal,
      message: 'Firebase Admin SDK connected directly to live uwu-bot-4cff1 database',
    });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({
      success: false,
      projectId: 'uwu-bot-4cff1',
      error: errorMsg,
      databaseURL: FIREBASE_DATABASE_URL,
      connected: false,
    });
  }
});

// API Route: Fetch Live Global Economy Settings
app.get('/api/economy-settings', async (_req: Request, res: Response) => {
  try {
    const db = getFirebaseAdminDatabase();
    const snap = await db.ref('economy_settings').once('value');
    res.json(snap.val() || { jackpot: 2.19e24, claim_reward: 500000000000, max_bet_percent: 25 });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Database error';
    res.status(500).json({ error: errorMsg });
  }
});

// API Route: Fetch Live Clans
app.get('/api/clans', async (_req: Request, res: Response) => {
  try {
    const db = getFirebaseAdminDatabase();
    const snap = await db.ref('clans').once('value');
    res.json(snap.val() || {});
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Database error';
    res.status(500).json({ error: errorMsg });
  }
});

// API Route: Fetch Live Crypto Market
app.get('/api/crypto-market', async (_req: Request, res: Response) => {
  try {
    const db = getFirebaseAdminDatabase();
    const snap = await db.ref('crypto_market').once('value');
    res.json(snap.val() || {});
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Database error';
    res.status(500).json({ error: errorMsg });
  }
});

// API Route: Fetch Live Leaderboard
app.get('/api/leaderboard', async (_req: Request, res: Response) => {
  try {
    const db = getFirebaseAdminDatabase();
    const snap = await db.ref('users').once('value');
    const usersMap = snap.val() || {};

    const list = Object.entries(usersMap).map(([id, u]: [string, any]) => {
      let atmTotal = 0;
      if (Array.isArray(u.atm_accounts)) {
        atmTotal = u.atm_accounts.reduce((acc: number, item: any) => acc + (item?.balance || 0), 0);
      }
      const wallet = Number(u.wallet || 0);
      const bank = Number(u.bank || 0);
      const totalWealth = wallet + bank + atmTotal;

      return {
        id,
        username: u.username || (id === '906461875221434428' ? 'kyledsllrc (Dev)' : `DiscordUser_${id.slice(-4)}`),
        wallet,
        bank,
        atmTotal,
        totalWealth,
        level: Number(u.level || 1),
        xp: Number(u.xp || 0),
        streak: Number(u.streak || 0),
        gamesPlayed: Number(u.games_played || 0),
        gamesWon: Number(u.games_won || 0),
        totalWon: Number(u.total_won || 0),
        huntTotal: Number(u.hunt_total || 0),
        prestige: Number(u.prestige || 0),
        isBooster: Boolean(u.is_booster),
        clanId: u.clan_id || '',
      };
    });

    // Sort by wealth descending
    list.sort((a, b) => (b.totalWealth !== a.totalWealth ? b.totalWealth - a.totalWealth : b.level - a.level));

    res.json({
      success: true,
      totalUsers: list.length,
      leaderboard: list.slice(0, 50),
    });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Database error';
    res.status(500).json({ error: errorMsg });
  }
});

// API Route: Fetch User Data by Discord User ID
app.get('/api/users/:discordUserId', async (req: Request, res: Response) => {
  const { discordUserId } = req.params;
  try {
    const db = getFirebaseAdminDatabase();
    const snapshot = await db.ref(`users/${discordUserId}`).once('value');
    const rawData = snapshot.val();

    if (!rawData) {
      return res.json({
        exists: false,
        discordUserId,
        wallet: 50000,
        bank: 250000,
        dailyStreak: 7,
        level: 12,
        xp: 4500,
        message: 'New user initialized in memory',
      });
    }

    // Calculate total ATM balances
    let atmTotal = 0;
    if (Array.isArray(rawData.atm_accounts)) {
      atmTotal = rawData.atm_accounts.reduce((sum: number, acc: any) => sum + (acc?.balance || 0), 0);
    }

    return res.json({
      exists: true,
      discordUserId,
      username: rawData.username || (discordUserId === '906461875221434428' ? 'kyledsllrc' : `User_${discordUserId.slice(-4)}`),
      wallet: Number(rawData.wallet || 0),
      bank: Number(rawData.bank || 0),
      atmAccounts: rawData.atm_accounts || [],
      atmTotal,
      level: Number(rawData.level || 1),
      xp: Number(rawData.xp || 0),
      streak: Number(rawData.streak || 0),
      prestige: Number(rawData.prestige || 0),
      prestigePoints: Number(rawData.prestige_points || 0),
      huntLevel: Number(rawData.hunt_level || 1),
      huntTotal: Number(rawData.hunt_total || 0),
      isBooster: Boolean(rawData.is_booster),
      properties: rawData.properties || [],
      inventory: rawData.inventory || [],
      quests: rawData.quests || [],
      history: (rawData.history || []).slice(0, 15),
      clanId: rawData.clan_id || '',
      marriage: {
        partnerId: rawData.marriage_partner_id || '',
        badge: rawData.marriage_badge || '',
        level: rawData.marriage_level || 0,
        exp: rawData.marriage_exp || 0,
        wallet: rawData.marriage_wallet || 0,
        isPrivate: Boolean(rawData.marriage_private),
      },
      stats: {
        gamesPlayed: rawData.games_played || 0,
        gamesWon: rawData.games_won || 0,
        gamesLost: rawData.games_lost || 0,
        totalWagered: rawData.total_wagered || 0,
        totalWon: rawData.total_won || 0,
        totalLost: rawData.total_lost || 0,
      },
      raw: rawData,
    });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Database error';
    res.status(500).json({ error: errorMsg });
  }
});

// API Route: Update User Economy & Stats in Firebase RTDB
app.post('/api/users/:discordUserId/economy', async (req: Request, res: Response) => {
  const { discordUserId } = req.params;
  const updates = req.body;
  try {
    const db = getFirebaseAdminDatabase();
    
    // Whitelist allowed fields to prevent accidental overwrites
    const sanitizedUpdates: Record<string, any> = {};
    if (typeof updates.wallet === 'number') sanitizedUpdates.wallet = updates.wallet;
    if (typeof updates.bank === 'number') sanitizedUpdates.bank = updates.bank;
    if (typeof updates.streak === 'number') sanitizedUpdates.streak = updates.streak;
    if (typeof updates.dailyStreak === 'number') sanitizedUpdates.streak = updates.dailyStreak;
    if (typeof updates.last_daily === 'number') sanitizedUpdates.last_daily = updates.last_daily;
    if (typeof updates.last_claim === 'number') sanitizedUpdates.last_claim = updates.last_claim;
    if (typeof updates.xp === 'number') sanitizedUpdates.xp = updates.xp;
    if (typeof updates.level === 'number') sanitizedUpdates.level = updates.level;
    if (Array.isArray(updates.inventory)) sanitizedUpdates.inventory = updates.inventory;
    if (Array.isArray(updates.quests)) sanitizedUpdates.quests = updates.quests;

    sanitizedUpdates.last_updated = Math.floor(Date.now() / 1000);

    await db.ref(`users/${discordUserId}`).update(sanitizedUpdates);

    res.json({ success: true, message: `Updated user ${discordUserId} in Firebase Realtime Database` });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Database error';
    res.status(500).json({ error: errorMsg });
  }
});

// API Route: Fetch Guild Config by Guild ID
app.get('/api/guilds/:guildId', async (req: Request, res: Response) => {
  const { guildId } = req.params;
  try {
    const db = getFirebaseAdminDatabase();
    const snapshot = await db.ref(`guilds/${guildId}`).once('value');
    const guildConfig = snapshot.val();
    res.json(guildConfig || { prefix: 'uwu ', modules: { economy: true, gambling: true, social: true, zoo: true } });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Database error';
    res.status(500).json({ error: errorMsg });
  }
});

// API Route: Update Guild Config in Firebase RTDB
app.post('/api/guilds/:guildId', async (req: Request, res: Response) => {
  const { guildId } = req.params;
  const updates = req.body;
  try {
    const db = getFirebaseAdminDatabase();
    await db.ref(`guilds/${guildId}`).update({
      ...updates,
      updatedAt: new Date().toISOString(),
    });
    res.json({ success: true, message: `Updated guild ${guildId} in Firebase Realtime Database` });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Database error';
    res.status(500).json({ error: errorMsg });
  }
});

// API Route: Seed default Kyle and Guild records into Firebase RTDB
app.post('/api/firebase/seed', async (_req: Request, res: Response) => {
  try {
    const db = getFirebaseAdminDatabase();
    
    // Ensure Kyle's user record exists with rich bot attributes
    await db.ref('users/906461875221434428').update({
      username: 'kyledsllrc',
      wallet: 154000000,
      bank: 8500000000,
      streak: 42,
      last_daily: Math.floor(Date.now() / 1000),
      level: 14,
      xp: 14200,
      hunt_level: 5,
      hunt_total: 48,
      is_booster: true,
      clan_id: 'CLAN-B1DE71',
    });

    // Seed default guild
    await db.ref('guilds/guild_uwu_1').set({
      id: 'guild_uwu_1',
      name: "Kyle's Community Lounge",
      prefix: 'uwu ',
      logChannelId: '109283746501',
      welcomeChannelId: '109283746502',
      autoRoleId: '109283746503',
      modules: {
        economy: { enabled: true, dailyReward: 1200, robberyRate: 0.15, shopEnabled: true },
        gambling: { enabled: true, maxBet: 100000, houseEdge: 0.04, coinflip: true, roulette: true, slots: true },
        social: { enabled: true, marriageFee: 2500, customMarryRoles: true, sharedVault: true },
        moderation: { enabled: true, boosterPerks: true, autoMod: true, antiSpam: true },
      },
      updatedAt: new Date().toISOString(),
    });

    res.json({ success: true, message: 'Successfully seeded/synced uwu-bot database in Firebase Realtime Database' });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Database error';
    res.status(500).json({ error: errorMsg });
  }
});

// Dev or Production Static/Vite Setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`uwu-bot dashboard server running on port ${port} with Firebase Admin`);
  });
}

startServer();
