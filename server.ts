import express, { NextFunction, Request, Response } from 'express';
import { randomBytes } from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';
import { getFirebaseAdminDatabase, FIREBASE_DATABASE_URL } from './src/server/firebase-config.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.set('trust proxy', 1);
app.use(express.json());

interface DiscordGuildSession {
  id: string;
  name: string;
  icon: string | null;
  owner: boolean;
  permissions: string;
  approximate_member_count?: number;
}

interface DiscordSession {
  expiresAt: number;
  user: {
    id: string;
    username: string;
    globalName: string;
    avatar: string;
  };
  guilds: DiscordGuildSession[];
}

const discordSessions = new Map<string, DiscordSession>();
const sessionCookie = 'uwu_dashboard_session';
const stateCookie = 'uwu_discord_oauth_state';
const dashboardAdminIds = new Set(
  (process.env.DASHBOARD_ADMIN_USER_IDS || '906461875221434428')
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean),
);

function cookieValue(request: Request, name: string): string | undefined {
  const cookies = request.headers.cookie?.split(';') || [];
  const cookie = cookies.map((part) => part.trim()).find((part) => part.startsWith(`${name}=`));
  return cookie ? decodeURIComponent(cookie.slice(name.length + 1)) : undefined;
}

function setCookie(response: Response, request: Request, name: string, value: string, maxAge: number): void {
  const secure = request.secure ? '; Secure' : '';
  response.append('Set-Cookie', `${name}=${encodeURIComponent(value)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure}`);
}

function getDiscordSession(request: Request): DiscordSession | undefined {
  const id = cookieValue(request, sessionCookie);
  if (!id) return undefined;
  const session = discordSessions.get(id);
  if (session && session.expiresAt <= Date.now()) {
    discordSessions.delete(id);
    return undefined;
  }
  return session;
}

function isDashboardAdmin(session: DiscordSession): boolean {
  return dashboardAdminIds.has(session.user.id);
}

function hasGuildAdminAccess(guild: DiscordGuildSession): boolean {
  try {
    const permissions = BigInt(guild.permissions);
    return guild.owner || (permissions & 0x8n) === 0x8n || (permissions & 0x20n) === 0x20n;
  } catch {
    return guild.owner;
  }
}

function mapBotUserRecord(discordUserId: string, rawData: Record<string, any>) {
  return {
    discordUserId,
    username: rawData.username || rawData.name || discordUserId,
    displayName: rawData.displayName || rawData.display_name || rawData.username || rawData.name || discordUserId,
    wallet: Number(rawData.wallet || 0),
    bank: Number(rawData.bank || 0),
    streak: Number(rawData.daily_streak || rawData.streak || 0),
    prestige: Number(rawData.prestige || 0),
    isBooster: Boolean(rawData.is_booster),
    cryptoPositions: rawData.crypto_positions || {},
    history: Array.isArray(rawData.history) ? rawData.history.slice(0, 15) : [],
    rank: rawData.rank || 'Member',
    charismaExp: Number(rawData.charisma_exp || 0),
    boostCount: Number(rawData.boost_count || 0),
    stats: {
      gamesPlayed: Number(rawData.games_played || 0),
      gamesWon: Number(rawData.games_won || 0),
      totalWagered: Number(rawData.total_wagered || 0),
      totalWon: Number(rawData.total_won || 0),
    },
  };
}

function requireDiscordSession(request: Request, response: Response, next: NextFunction): void {
  const session = getDiscordSession(request);
  if (!session) {
    response.status(401).json({ error: 'Discord authentication required.' });
    return;
  }
  if (!isDashboardAdmin(session)) {
    response.status(403).json({ error: 'This Discord account is not authorized to administer uwu-bot.' });
    return;
  }
  next();
}

app.get('/api/auth/session', (request: Request, response: Response) => {
  const session = getDiscordSession(request);
  if (!session) return response.json({ authenticated: false });
  response.json({
    authenticated: true,
    authorized: isDashboardAdmin(session),
    user: session.user,
    guilds: session.guilds.filter(hasGuildAdminAccess),
  });
});

app.get('/api/auth/discord', (request: Request, response: Response) => {
  const clientId = process.env.DISCORD_CLIENT_ID;
  if (!clientId) return response.status(503).send('Discord OAuth is not configured.');

  const state = randomBytes(24).toString('hex');
  setCookie(response, request, stateCookie, state, 600);
  const appUrl = (process.env.APP_URL || `${request.protocol}://${request.get('host')}`).replace(/\/$/, '');
  const redirectUri = `${appUrl}/api/auth/discord/callback`;
  const authorizeUrl = new URL('https://discord.com/oauth2/authorize');
  authorizeUrl.search = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'identify guilds',
    state,
  }).toString();
  response.redirect(authorizeUrl.toString());
});

app.get('/api/auth/discord/callback', async (request: Request, response: Response) => {
  const code = typeof request.query.code === 'string' ? request.query.code : '';
  const state = typeof request.query.state === 'string' ? request.query.state : '';
  const expectedState = cookieValue(request, stateCookie);
  const clientId = process.env.DISCORD_CLIENT_ID;
  const clientSecret = process.env.DISCORD_CLIENT_SECRET;
  const appUrl = (process.env.APP_URL || `${request.protocol}://${request.get('host')}`).replace(/\/$/, '');
  const redirectUri = `${appUrl}/api/auth/discord/callback`;

  response.append('Set-Cookie', `${stateCookie}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${request.secure ? '; Secure' : ''}`);
  if (!code || !state || !expectedState || state !== expectedState || !clientId || !clientSecret) {
    return response.redirect('/?authError=discord');
  }

  try {
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
      }),
    });
    if (!tokenResponse.ok) throw new Error('Discord token exchange failed.');
    const tokenData = await tokenResponse.json() as { access_token: string };

    const [userResponse, guildResponse] = await Promise.all([
      fetch('https://discord.com/api/v10/users/@me', { headers: { Authorization: `Bearer ${tokenData.access_token}` } }),
      fetch('https://discord.com/api/v10/users/@me/guilds?with_counts=true', { headers: { Authorization: `Bearer ${tokenData.access_token}` } }),
    ]);
    if (!userResponse.ok || !guildResponse.ok) throw new Error('Discord profile fetch failed.');
    const profile = await userResponse.json() as { id: string; username: string; global_name?: string | null; avatar?: string | null };
    const guilds = await guildResponse.json() as DiscordGuildSession[];
    const avatar = profile.avatar
      ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.${profile.avatar.startsWith('a_') ? 'gif' : 'png'}`
      : `https://cdn.discordapp.com/embed/avatars/${Number(BigInt(profile.id) >> 22n) % 6}.png`;
    const sessionId = randomBytes(32).toString('hex');

    discordSessions.set(sessionId, {
      expiresAt: Date.now() + 60 * 60 * 12 * 1000,
      user: { id: profile.id, username: profile.username, globalName: profile.global_name || profile.username, avatar },
      guilds: guilds.filter(hasGuildAdminAccess),
    });
    setCookie(response, request, sessionCookie, sessionId, 60 * 60 * 12);
    response.redirect('/');
  } catch {
    response.redirect('/?authError=discord');
  }
});

app.post('/api/auth/logout', (request: Request, response: Response) => {
  const sessionId = cookieValue(request, sessionCookie);
  if (sessionId) discordSessions.delete(sessionId);
  response.append('Set-Cookie', `${sessionCookie}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${request.secure ? '; Secure' : ''}`);
  response.json({ success: true });
});

app.use('/api', requireDiscordSession);

app.get('/api/live', (request: Request, response: Response) => {
  let db: ReturnType<typeof getFirebaseAdminDatabase>;
  try {
    db = getFirebaseAdminDatabase();
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Firebase is unavailable.';
    return response.status(503).json({ error: message });
  }

  response.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no',
  });
  response.flushHeaders();

  const watchedPaths = [
    ['users', db.ref('users')],
    ['economy_settings', db.ref('economy_settings')],
    ['crypto_market', db.ref('crypto_market')],
    ['game_odds', db.ref('game_odds')],
  ] as const;
  const selectedUserId = typeof request.query.userId === 'string' && /^\d{15,22}$/.test(request.query.userId)
    ? request.query.userId
    : '';
  let heartbeat: ReturnType<typeof setInterval> | undefined;
  let closed = false;
  const subscriptions = watchedPaths.map(([eventName, ref]) => {
    const listener = (snapshot: { val: () => unknown }) => {
      if (!response.writableEnded) {
        const value = snapshot.val();
        if (eventName === 'users') {
          const users = value && typeof value === 'object' ? value as Record<string, any> : {};
          const allUsers = Object.entries(users)
            .filter(([, user]) => user && typeof user === 'object')
            .map(([id, user]) => {
              const record = mapBotUserRecord(id, user);
              return {
                id,
                username: record.username,
                displayName: record.displayName,
                wallet: record.wallet,
                bank: record.bank,
                netWorth: record.wallet + record.bank,
                rank: record.rank,
                prestige: record.prestige,
                streak: record.streak,
                charismaExp: record.charismaExp,
                isBooster: record.isBooster,
                boostCount: record.boostCount,
              };
            })
            .sort((left, right) => right.netWorth - left.netWorth);
          const user = selectedUserId ? users[selectedUserId] : null;
          const payload = {
            leaderboard: allUsers.slice(0, 50),
            totalUsers: allUsers.length,
            totalCirculation: allUsers.reduce((sum, record) => sum + record.netWorth, 0),
            userRecord: user && typeof user === 'object' ? mapBotUserRecord(selectedUserId, user) : null,
          };
          response.write(`event: users\ndata: ${JSON.stringify(payload)}\n\n`);
        } else {
          response.write(`event: ${eventName}\ndata: ${JSON.stringify(value)}\n\n`);
        }
      }
    };
    ref.on('value', listener, (error) => {
      if (!response.writableEnded) {
        response.write(`event: stream-error\ndata: ${JSON.stringify({ message: error.message })}\n\n`);
      }
    });
    return { ref, listener };
  });

  const closeStream = () => {
    if (closed) return;
    closed = true;
    if (heartbeat) clearInterval(heartbeat);
    subscriptions.forEach(({ ref, listener }) => ref.off('value', listener));
  };

  heartbeat = setInterval(() => {
    const session = getDiscordSession(request);
    if (!session || !isDashboardAdmin(session)) {
      closeStream();
      response.end();
      return;
    }
    response.write(': keep-alive\n\n');
  }, 15000);
  response.on('close', closeStream);
});

// API Route: Firebase Connection Status & Diagnostics
app.get('/api/firebase/status', async (_req: Request, res: Response) => {
  try {
    const db = getFirebaseAdminDatabase();
    // Test database read from real economy_settings
    const snap = await db.ref('economy_settings').once('value');
    const ecoVal = snap.val();

    res.json({
      success: true,
      projectId: process.env.FIREBASE_PROJECT_ID || null,
      databaseURL: FIREBASE_DATABASE_URL,
      connected: true,
      economySettings: ecoVal,
    });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({
      success: false,
      projectId: process.env.FIREBASE_PROJECT_ID || null,
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
    const settings = snap.val();
    if (!settings) return res.status(404).json({ error: 'No economy settings record exists.' });
    res.json(settings);
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
    res.json(snap.val());
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

    const list = Object.entries(usersMap)
      .filter(([, user]) => user && typeof user === 'object')
      .map(([id, user]: [string, any]) => {
        const wallet = Number(user.wallet || 0);
        const bank = Number(user.bank || 0);
        return {
          id,
          username: user.username || user.name || id,
          displayName: user.displayName || user.display_name || user.username || user.name || id,
          wallet,
          bank,
          netWorth: wallet + bank,
          rank: user.rank || 'Member',
          prestige: Number(user.prestige || 0),
          streak: Number(user.daily_streak || user.streak || 0),
          charismaExp: Number(user.charisma_exp || 0),
          isBooster: Boolean(user.is_booster),
          boostCount: Number(user.boost_count || 0),
        };
      })
      .sort((left, right) => right.netWorth - left.netWorth);

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

app.get('/api/servers', async (req: Request, res: Response) => {
  const botToken = process.env.DISCORD_BOT_TOKEN?.trim();
  if (!botToken) return res.status(503).json({ error: 'DISCORD_BOT_TOKEN is not configured.' });

  try {
    const session = getDiscordSession(req)!;
    const servers = [];
    for (let index = 0; index < session.guilds.length; index += 5) {
      const batch = session.guilds.slice(index, index + 5);
      const results = await Promise.all(batch.map(async (guild) => {
        const response = await fetch(`https://discord.com/api/v10/guilds/${guild.id}?with_counts=true`, {
          headers: { Authorization: `Bot ${botToken}` },
        });
        if (!response.ok && response.status !== 404) {
          throw new Error(`Discord server lookup failed (${response.status}).`);
        }
        const botGuild = response.ok ? await response.json() as { name?: string; icon?: string | null; approximate_member_count?: number } : null;
        return {
          id: guild.id,
          name: botGuild?.name || guild.name,
          icon: botGuild?.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${botGuild.icon}.png` : null,
          memberCount: botGuild?.approximate_member_count ?? guild.approximate_member_count ?? null,
          owner: guild.owner,
          botInstalled: response.ok,
        };
      }));
      servers.push(...results);
    }
    res.json({ servers });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Discord API error';
    res.status(500).json({ error: errorMsg });
  }
});

app.get('/api/bot/status', async (_req: Request, res: Response) => {
  const botToken = process.env.DISCORD_BOT_TOKEN?.trim();
  let botIdentity: { username?: string; avatar?: string | null } | null = null;
  try {
    if (botToken) {
      const discordResponse = await fetch('https://discord.com/api/v10/users/@me', {
        headers: { Authorization: `Bot ${botToken}` },
      });
      if (discordResponse.ok) botIdentity = await discordResponse.json();
    }

    const db = getFirebaseAdminDatabase();
    const [usersSnapshot, settingsSnapshot, marketSnapshot, oddsSnapshot] = await Promise.all([
      db.ref('users').once('value'),
      db.ref('economy_settings').once('value'),
      db.ref('crypto_market').once('value'),
      db.ref('game_odds').once('value'),
    ]);
    const users = usersSnapshot.val() || {};
    const totalCirculation = Object.values(users).reduce((total: number, user: any) =>
      total + Number(user?.wallet || 0) + Number(user?.bank || 0), 0);
    const economy = settingsSnapshot.val();
    res.json({
      connected: Boolean(botIdentity),
      username: botIdentity?.username || null,
      avatar: botIdentity?.avatar || null,
      totalUsers: Object.keys(users).length,
      totalCirculation,
      jackpot: typeof economy?.jackpot === 'number' ? economy.jackpot : null,
      gameOdds: oddsSnapshot.val(),
      cryptoMarket: marketSnapshot.val(),
    });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Database error';
    res.status(500).json({ error: errorMsg, connected: Boolean(botIdentity) });
  }
});

app.get('/api/game-odds', async (_req: Request, res: Response) => {
  try {
    const db = getFirebaseAdminDatabase();
    const snapshot = await db.ref('game_odds').once('value');
    res.json(snapshot.val());
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Database error';
    res.status(500).json({ error: errorMsg });
  }
});

app.patch('/api/bot/economy-settings', async (req: Request, res: Response) => {
  const updates = req.body as Record<string, unknown>;
  const allowedKeys = ['jackpot', 'claim_reward', 'max_bet_percent', 'bet_cap_enabled'];
  const keys = Object.keys(updates || {});
  if (!keys.length || keys.some((key) => !allowedKeys.includes(key))) {
    return res.status(400).json({ error: 'Unsupported economy setting.' });
  }
  for (const [key, value] of Object.entries(updates)) {
    if (key === 'bet_cap_enabled' && typeof value !== 'boolean') return res.status(400).json({ error: 'bet_cap_enabled must be boolean.' });
    if (key === 'max_bet_percent' && (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > 100)) {
      return res.status(400).json({ error: 'max_bet_percent must be between 0 and 100.' });
    }
    if ((key === 'jackpot' || key === 'claim_reward') && (typeof value !== 'number' || !Number.isSafeInteger(value) || value < 0)) {
      return res.status(400).json({ error: `${key} must be a non-negative safe integer.` });
    }
  }

  try {
    const ref = getFirebaseAdminDatabase().ref('economy_settings');
    if (!(await ref.once('value')).exists()) return res.status(404).json({ error: 'No economy_settings record exists in Firebase.' });
    await ref.update(updates);
    res.json({ success: true });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Database error';
    res.status(500).json({ error: errorMsg });
  }
});

app.patch('/api/bot/game-odds', async (req: Request, res: Response) => {
  const updates = req.body as Record<string, unknown>;
  const supportedGames = new Set(['slots', 'coinflip', 'blackjack', 'mines', 'colorgame', 'dice', 'highlow', 'roulette', 'crash', 'tower', 'wheel', 'ladder', 'scratch', 'sabong']);
  const entries = Object.entries(updates || {});
  if (!entries.length || entries.some(([game, chance]) => !supportedGames.has(game) || typeof chance !== 'number' || !Number.isFinite(chance) || chance < 0 || chance > 100)) {
    return res.status(400).json({ error: 'Odds must use a supported game and a percentage from 0 to 100.' });
  }

  try {
    const ref = getFirebaseAdminDatabase().ref('game_odds');
    if (!(await ref.once('value')).exists()) return res.status(404).json({ error: 'No game_odds record exists in Firebase.' });
    await ref.update(updates);
    res.json({ success: true });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Database error';
    res.status(500).json({ error: errorMsg });
  }
});

app.patch('/api/bot/crypto-market', async (req: Request, res: Response) => {
  if (typeof req.body?.paused !== 'boolean' || Object.keys(req.body).length !== 1) {
    return res.status(400).json({ error: 'Only the crypto market paused state can be updated.' });
  }

  try {
    const ref = getFirebaseAdminDatabase().ref('crypto_market');
    if (!(await ref.once('value')).exists()) return res.status(404).json({ error: 'No crypto_market record exists in Firebase.' });
    await ref.child('paused').set(req.body.paused);
    res.json({ success: true });
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : 'Database error';
    res.status(500).json({ error: errorMsg });
  }
});

// API Route: Fetch User Data by Discord User ID
app.get('/api/users/:discordUserId', async (req: Request, res: Response) => {
  const { discordUserId } = req.params;
  if (!/^\d{15,22}$/.test(discordUserId)) {
    return res.status(400).json({ error: 'A valid Discord user ID is required.' });
  }
  try {
    const db = getFirebaseAdminDatabase();
    const snapshot = await db.ref(`users/${discordUserId}`).once('value');
    const rawData = snapshot.val();

    if (!rawData) {
      return res.status(404).json({
        exists: false,
        discordUserId,
      });
    }

    return res.json({ exists: true, ...mapBotUserRecord(discordUserId, rawData) });
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
