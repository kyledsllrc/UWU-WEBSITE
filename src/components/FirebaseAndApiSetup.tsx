import React, { useState, useEffect } from 'react';
import { useBotDashboard } from '../context/BotDashboardContext';
import {
  NEXTAUTH_DISCORD_ROUTE_CODE,
} from '../lib/auth-config';
import {
  KeyRound,
  Database,
  Terminal,
  CheckCircle2,
  Copy,
  ExternalLink,
  Shield,
  Layers,
  Sparkles,
  Zap,
  Github,
  Flame,
  Search,
  RefreshCw,
  Code2,
} from 'lucide-react';

export const FIREBASE_ADMIN_ROUTE_CODE = `// app/api/users/[id]/route.ts (or server.ts backend)
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getDatabase } from 'firebase-admin/database';

// Initialize Firebase Admin (Server-side)
if (!getApps().length) {
  initializeApp({
    credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY!)),
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  });
}

const db = getDatabase();

export async function GET(request: Request, { params }: { params: { id: string } }) {
  // Example: Fetch user data by Discord User ID
  const discordUserId = params.id || "123456789012345678";
  const snapshot = await db.ref(\`users/\${discordUserId}\`).once('value');
  const userData = snapshot.val();

  return Response.json(userData || { exists: false });
}
`;

export const RTDB_DATA_STRUCTURE_JSON = `{
  "users": {
    "439281729104829102": {
      "username": "kyledsllrc",
      "wallet": 38450,
      "bank": 245000,
      "dailyStreak": 24,
      "lastClaim": "2026-10-29T10:50:00Z",
      "zoo": {
        "captured": 102,
        "mythic": 2,
        "legendary": 1,
        "epic": 5
      },
      "marriage": {
        "partnerId": "829104829102847192",
        "partnerName": "Aria (Sakura)",
        "ring": "Sakura Diamond Promise Ring (Tier V)",
        "sharedVault": 128500,
        "loveAffinity": 98
      }
    }
  },
  "guilds": {
    "guild_uwu_1": {
      "name": "Kyle's Community Lounge",
      "prefix": "uwu ",
      "logChannelId": "109283746501",
      "welcomeChannelId": "109283746502",
      "modules": {
        "economy": true,
        "gambling": true,
        "social": true,
        "zoo": true
      }
    }
  }
}`;

export const FirebaseAndApiSetup: React.FC = () => {
  const { addToast, seedLiveFirebase, refreshFromFirebase } = useBotDashboard();
  const [isSeeding, setIsSeeding] = useState(false);

  // Firebase testing states
  const [firebaseStatus, setFirebaseStatus] = useState<{
    tested: boolean;
    loading: boolean;
    success: boolean;
    data?: any;
    error?: string;
  }>({
    tested: false,
    loading: false,
    success: false,
  });

  const [queryUserId, setQueryUserId] = useState('906461875221434428');
  const [queryResult, setQueryResult] = useState<any>(null);
  const [isQuerying, setIsQuerying] = useState(false);

  const [activeCodeTab, setActiveCodeTab] = useState<'firebase' | 'nextauth' | 'structure'>('firebase');

  // Test Firebase Status on mount
  useEffect(() => {
    checkFirebaseStatus();
  }, []);

  const checkFirebaseStatus = async () => {
    setFirebaseStatus((prev) => ({ ...prev, loading: true }));
    try {
      const res = await fetch('/api/firebase/status');
      if (res.ok) {
        const data = await res.json();
        setFirebaseStatus({
          tested: true,
          loading: false,
          success: true,
          data,
        });
      } else {
        const err = await res.json();
        setFirebaseStatus({
          tested: true,
          loading: false,
          success: false,
          error: err.error || 'Failed to ping Firebase Admin',
        });
      }
    } catch (err: unknown) {
      setFirebaseStatus({
        tested: true,
        loading: false,
        success: false,
        error: err instanceof Error ? err.message : 'Network error reaching backend',
      });
    }
  };

  const handleSeedDatabase = async () => {
    setIsSeeding(true);
    await seedLiveFirebase();
    await checkFirebaseStatus();
    setIsSeeding(false);
  };

  const handleQueryDiscordUser = async (e?: React.FormEvent, customId?: string) => {
    if (e) e.preventDefault();
    const idToFetch = customId || queryUserId.trim();
    if (!idToFetch) return;
    setIsQuerying(true);
    try {
      const res = await fetch(`/api/users/${idToFetch}`);
      const data = await res.json();
      setQueryResult(data);
      addToast(`Fetched Discord user from Firebase Realtime DB (${idToFetch})`, 'success');
    } catch {
      addToast('Error querying Firebase Realtime DB', 'error');
    } finally {
      setIsQuerying(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    addToast(`Copied ${label} to clipboard`, 'success');
  };

  const sampleEnvText = `# Discord OAuth2 Credentials (https://discord.com/developers/applications)
DISCORD_CLIENT_ID="123456789012345678"
DISCORD_CLIENT_SECRET="your_discord_client_secret_here"

# NextAuth / Auth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your_nextauth_random_secret_at_least_32_chars"

# Firebase Realtime Database & Admin SDK (project: uwu-bot-4cff1)
# Injected via AI Studio Secrets:
FIREBASE_PROJECT_ID="uwu-bot-4cff1"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-fbsvc@uwu-bot-4cff1.iam.gserviceaccount.com"
NEXT_PUBLIC_FIREBASE_DATABASE_URL="https://uwu-bot-4cff1-default-rtdb.asia-southeast1.firebasedatabase.app"
FIREBASE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"uwu-bot-4cff1",...}'
`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* 1. Header with GitHub repository link */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#EB459E]">
            <Database className="w-4 h-4" />
            <span>Firebase Realtime Database & Discord API</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            uwu-bot Firebase & API Integration
          </h1>
          <p className="text-xs text-[#949BA4] mt-1">
            Connected to Firebase project <code className="text-[#DBDEE1]">uwu-bot-4cff1</code> and GitHub repository <code className="text-[#DBDEE1]">kyledsllrc/uwu-bot</code>.
          </p>
        </div>

        <a
          href="https://github.com/kyledsllrc/uwu-bot"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2b2d31] hover:bg-[#313338] border border-[#3f4147] text-xs font-semibold text-white transition-colors shrink-0"
        >
          <Github className="w-4 h-4 text-white" />
          <span>View kyledsllrc/uwu-bot on GitHub</span>
          <ExternalLink className="w-3.5 h-3.5 text-[#949BA4]" />
        </a>
      </div>

      {/* 2. Active Firebase Realtime Database Panel (uwu-bot-4cff1) */}
      <div className="bg-[#1e1f22] rounded-2xl border border-[#2b2d31] p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#2b2d31]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FEE75C]/10 border border-[#FEE75C]/20 flex items-center justify-center text-[#FEE75C]">
              <Flame className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">Firebase Realtime Database (uwu-bot-4cff1)</h2>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-[#57F287]/20 text-[#57F287] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#57F287]" />
                  Admin SDK Initialized
                </span>
              </div>
              <p className="text-xs text-[#949BA4]">
                Service Account: <code className="text-[#DBDEE1]">firebase-adminsdk-fbsvc@uwu-bot-4cff1.iam.gserviceaccount.com</code>
              </p>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            <a
              href="https://console.firebase.google.com/project/uwu-bot-4cff1/database"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#5865F2] hover:text-[#7983f5] font-semibold"
            >
              <span>Firebase Console</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={handleSeedDatabase}
              disabled={isSeeding}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#5865F2] hover:bg-[#4752C4] text-xs font-semibold text-white transition-all shadow"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isSeeding ? 'animate-spin' : ''}`} />
              <span>{isSeeding ? 'Seeding...' : 'Seed / Sync Live Database'}</span>
            </button>

            <button
              onClick={checkFirebaseStatus}
              disabled={firebaseStatus.loading}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#2b2d31] hover:bg-[#313338] text-xs font-semibold text-[#DBDEE1] transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#FEE75C] ${firebaseStatus.loading ? 'animate-spin' : ''}`} />
              <span>Ping Health</span>
            </button>
          </div>
        </div>

        {/* Live Query Tester (matches the user's screenshot exactly!) */}
        <div className="bg-[#2b2d31] rounded-xl p-5 border border-[#3f4147] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Search className="w-4 h-4 text-[#5865F2]" />
                <span>Live Data Fetcher: `users/$&#123;discordUserId&#125;`</span>
              </h3>
              <p className="text-xs text-[#949BA4]">
                Executes `db.ref(&apos;users/$&#123;discordUserId&#125;&apos;).once(&apos;value&apos;)` through server proxy.
              </p>
            </div>
            <span className="text-[11px] text-[#5865F2] font-mono">
              GET /api/users/:discordUserId
            </span>
          </div>

          {/* Quick Select Chips */}
          <div className="flex items-center flex-wrap gap-2 text-xs">
            <span className="text-[#949BA4]">Sample user IDs in database:</span>
            {[
              { id: '906461875221434428', label: 'kyledsllrc (Dev)' },
              { id: '1001976932520439868', label: 'User 1001' },
              { id: '1009448329744224317', label: 'User 1009' },
              { id: '1019868985933701143', label: 'User 1019' },
            ].map((chip) => (
              <button
                key={chip.id}
                type="button"
                onClick={() => {
                  setQueryUserId(chip.id);
                  handleQueryDiscordUser(undefined, chip.id);
                }}
                className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-colors ${
                  queryUserId === chip.id
                    ? 'bg-[#5865F2] text-white font-bold'
                    : 'bg-[#1e1f22] text-[#DBDEE1] hover:bg-[#313338] border border-[#3f4147]'
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleQueryDiscordUser} className="flex flex-col sm:flex-row items-center gap-2">
            <input
              type="text"
              value={queryUserId}
              onChange={(e) => setQueryUserId(e.target.value)}
              placeholder="Enter Discord User ID (e.g. 906461875221434428)"
              className="flex-1 w-full px-3.5 py-2.5 bg-[#111214] border border-[#3f4147] rounded-xl text-white font-mono text-xs focus:outline-none focus:border-[#5865F2]"
            />
            <button
              type="submit"
              disabled={isQuerying}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] text-white text-xs font-bold transition-all shadow-md active:scale-95 disabled:opacity-50 whitespace-nowrap"
            >
              {isQuerying ? 'Querying...' : 'Fetch User Data'}
            </button>
          </form>

          {/* Result JSON Viewer */}
          {queryResult && (
            <div className="space-y-1.5 pt-2">
              <div className="flex items-center justify-between text-[11px] text-[#949BA4]">
                <span>Firebase Returned Document:</span>
                <button
                  onClick={() => copyToClipboard(JSON.stringify(queryResult, null, 2), 'JSON Data')}
                  className="text-[#5865F2] hover:text-white"
                >
                  Copy JSON
                </button>
              </div>
              <pre className="bg-[#111214] p-3 rounded-lg border border-[#3f4147] text-xs font-mono text-[#57F287] overflow-x-auto max-h-56 leading-relaxed">
                {JSON.stringify(queryResult, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>

      {/* 3. Discord Developer Portal & OAuth Setup Guide */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Step-by-Step Instructions */}
        <div className="bg-[#1e1f22] rounded-2xl border border-[#2b2d31] p-6 space-y-4">
          <div className="flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-[#5865F2]" />
            <h3 className="text-base font-bold text-white">Discord OAuth2 Setup Steps</h3>
          </div>

          <div className="space-y-3 text-xs text-[#DBDEE1] leading-relaxed">
            <div className="p-3 bg-[#2b2d31] rounded-xl border border-[#3f4147] space-y-1">
              <div className="font-bold text-white flex items-center justify-between">
                <span>1. Create Discord Application</span>
                <span className="text-[10px] text-[#5865F2]">Step 1</span>
              </div>
              <p className="text-[#949BA4]">
                Visit <a href="https://discord.com/developers/applications" target="_blank" rel="noreferrer" className="text-[#5865F2] underline">Discord Developer Portal</a>, click &quot;New Application&quot;, and name it <code>uwu-bot</code>.
              </p>
            </div>

            <div className="p-3 bg-[#2b2d31] rounded-xl border border-[#3f4147] space-y-1">
              <div className="font-bold text-white flex items-center justify-between">
                <span>2. Copy Client ID & Secret</span>
                <span className="text-[10px] text-[#5865F2]">Step 2</span>
              </div>
              <p className="text-[#949BA4]">
                Go to <strong>OAuth2</strong> tab. Copy the <strong>Client ID</strong> and reset/copy the <strong>Client Secret</strong> into your <code>.env</code> file.
              </p>
            </div>

            <div className="p-3 bg-[#2b2d31] rounded-xl border border-[#3f4147] space-y-1">
              <div className="font-bold text-white flex items-center justify-between">
                <span>3. Add OAuth2 Redirect URI</span>
                <span className="text-[10px] text-[#5865F2]">Step 3</span>
              </div>
              <p className="text-[#949BA4]">
                Under <strong>Redirects</strong>, click &quot;Add Redirect&quot; and enter:
              </p>
              <div className="bg-[#111214] p-2 rounded text-white font-mono text-[11px] select-all flex items-center justify-between">
                <span>http://localhost:3000/api/auth/callback/discord</span>
                <button
                  onClick={() => copyToClipboard('http://localhost:3000/api/auth/callback/discord', 'Redirect URI')}
                  className="text-[#5865F2] hover:text-white"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="p-3 bg-[#2b2d31] rounded-xl border border-[#3f4147] space-y-1">
              <div className="font-bold text-white flex items-center justify-between">
                <span>4. OAuth2 Scopes</span>
                <span className="text-[10px] text-[#5865F2]">Step 4</span>
              </div>
              <p className="text-[#949BA4]">
                We request <code>identify</code> (user profile, handle, avatar) and <code>guilds</code> (server list to verify administrator permissions).
              </p>
            </div>
          </div>
        </div>

        {/* Environment File Template */}
        <div className="bg-[#1e1f22] rounded-2xl border border-[#2b2d31] p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-[#FEE75C]" />
                <h3 className="text-base font-bold text-white">.env Environment Variables</h3>
              </div>
              <button
                onClick={() => copyToClipboard(sampleEnvText, '.env config')}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#2b2d31] hover:bg-[#313338] text-xs font-semibold text-[#DBDEE1] transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy .env</span>
              </button>
            </div>
            <p className="text-xs text-[#949BA4]">
              Place these key-value pairs in your project root <code>.env</code> file or configure in the AI Studio Secrets panel.
            </p>
          </div>

          <pre className="bg-[#111214] p-4 rounded-xl border border-[#3f4147] text-xs font-mono text-[#DBDEE1] overflow-x-auto whitespace-pre leading-relaxed">
            {sampleEnvText}
          </pre>

          <div className="p-3 bg-[#2b2d31] rounded-xl border border-[#3f4147] text-xs text-[#949BA4]">
            <strong className="text-white">Active Database:</strong>
            <div className="text-[#57F287] font-mono mt-1 select-all break-all">
              https://uwu-bot-4cff1-default-rtdb.asia-southeast1.firebasedatabase.app
            </div>
          </div>
        </div>
      </div>

      {/* 4. Code Implementation Explorer (Firebase Admin Route, NextAuth, RTDB Structure) */}
      <div className="bg-[#1e1f22] rounded-2xl border border-[#2b2d31] overflow-hidden shadow-xl">
        {/* Tabs */}
        <div className="p-4 bg-[#111214] border-b border-[#2b2d31] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveCodeTab('firebase')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                activeCodeTab === 'firebase'
                  ? 'bg-[#FEE75C] text-black font-bold'
                  : 'text-[#949BA4] hover:text-[#DBDEE1]'
              }`}
            >
              app/api/users/[id]/route.ts (Firebase Admin)
            </button>
            <button
              onClick={() => setActiveCodeTab('nextauth')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                activeCodeTab === 'nextauth'
                  ? 'bg-[#5865F2] text-white'
                  : 'text-[#949BA4] hover:text-[#DBDEE1]'
              }`}
            >
              app/api/auth/[...nextauth]/route.ts
            </button>
            <button
              onClick={() => setActiveCodeTab('structure')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                activeCodeTab === 'structure'
                  ? 'bg-[#5865F2] text-white'
                  : 'text-[#949BA4] hover:text-[#DBDEE1]'
              }`}
            >
              Firebase RTDB Schema Structure
            </button>
          </div>

          <button
            onClick={() => {
              if (activeCodeTab === 'firebase') copyToClipboard(FIREBASE_ADMIN_ROUTE_CODE, 'Firebase Admin route');
              else if (activeCodeTab === 'nextauth') copyToClipboard(NEXTAUTH_DISCORD_ROUTE_CODE, 'NextAuth code');
              else copyToClipboard(RTDB_DATA_STRUCTURE_JSON, 'RTDB Structure JSON');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2b2d31] hover:bg-[#313338] text-xs font-semibold text-[#DBDEE1] transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy Snippet</span>
          </button>
        </div>

        {/* Code Content */}
        <div className="p-5 overflow-x-auto max-h-[460px] bg-[#111214]">
          <pre className="text-xs font-mono text-[#DBDEE1] leading-relaxed">
            {activeCodeTab === 'firebase' && FIREBASE_ADMIN_ROUTE_CODE}
            {activeCodeTab === 'nextauth' && NEXTAUTH_DISCORD_ROUTE_CODE}
            {activeCodeTab === 'structure' && RTDB_DATA_STRUCTURE_JSON}
          </pre>
        </div>
      </div>
    </div>
  );
};
