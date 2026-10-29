import React, { useState } from 'react';
import { useBotDashboard } from '../context/BotDashboardContext';
import {
  BOT_AVATAR_PATH,
  HERO_BANNER_PATH,
  BOT_COMMANDS,
  BOT_NAME,
  BOT_AUTHOR,
  GITHUB_REPO_URL,
} from '../data/mockData';
import {
  Coins,
  Dice5,
  Heart,
  Gem,
  CheckCircle2,
  Terminal,
  ShieldCheck,
  Zap,
  ArrowRight,
  ExternalLink,
  Sliders,
  DollarSign,
  TrendingUp,
  Github,
  Sparkles,
} from 'lucide-react';

interface LandingPageProps {
  onOpenAuthModal: () => void;
  onOpenInviteModal: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenAuthModal, onOpenInviteModal }) => {
  const { setCurrentTab, isLoggedIn } = useBotDashboard();
  const [selectedCommand, setSelectedCommand] = useState(BOT_COMMANDS[0]);
  const [activeCategory, setActiveCategory] = useState<'All' | 'Economy' | 'Gambling' | 'Social' | 'Booster'>('All');
  const [simulatedLog, setSimulatedLog] = useState<string[]>([
    'Default prefix: uwu (or slash commands /)',
    'Real-time sync with Firebase: uwu-bot-4cff1',
  ]);

  const filteredCommands = activeCategory === 'All'
    ? BOT_COMMANDS
    : BOT_COMMANDS.filter((c) => c.category === activeCategory);

  const handleRunCommand = (cmdName: string) => {
    const target = BOT_COMMANDS.find((c) => c.name === cmdName) || selectedCommand;
    setSimulatedLog((prev) => [
      `User sent: ${target.syntax.split('|')[0].trim()}`,
      target.exampleOutput,
      ...prev.slice(0, 4),
    ]);
  };

  return (
    <div className="space-y-16 pb-20">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-8 md:pt-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left Copy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#EB459E]">
              <span className="flex items-center gap-1.5 font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{BOT_NAME}</span>
              </span>
              <span aria-hidden="true" className="text-[#3f4147]">·</span>
              <a
                href={GITHUB_REPO_URL}
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors flex items-center gap-1 text-[#DBDEE1]"
              >
                <Github className="w-3 h-3" />
                <span>github.com/{BOT_AUTHOR}/uwu-bot</span>
              </a>
              <span aria-hidden="true" className="text-[#3f4147]">·</span>
              <span className="text-[#57F287]">Firebase DB Active</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1] text-balance">
              The Ultimate <span className="text-[#EB459E]">uwu-bot</span> Discord Dashboard & Management Suite
            </h1>

            <p className="text-base sm:text-lg text-[#949BA4] leading-relaxed max-w-2xl">
              Equip your Discord servers with <strong>cowoncy currency</strong>, kawaii animal hunting & zoo collection,
              provably fair coinflips, marriage vows, server booster dividends, and real-time administrator controls.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => {
                  if (isLoggedIn) {
                    setCurrentTab('dashboard');
                  } else {
                    onOpenAuthModal();
                  }
                }}
                className="flex items-center justify-center gap-3 px-6 py-3.5 text-sm font-bold text-white bg-[#5865F2] hover:bg-[#4752C4] active:scale-95 rounded-xl shadow-lg shadow-[#5865F2]/25 transition-all whitespace-nowrap"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
                <span>{isLoggedIn ? 'Open Web Dashboard' : 'Login with Discord'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenInviteModal}
                className="flex items-center justify-center gap-2 px-5 py-3.5 text-sm font-semibold text-[#DBDEE1] bg-[#2b2d31] hover:bg-[#313338] border border-[#3f4147] rounded-xl transition-colors whitespace-nowrap"
              >
                <Zap className="w-4 h-4 text-[#FEE75C]" />
                <span>Add Bot to Discord Server</span>
              </button>
            </div>

            {/* Quick Proof Strip */}
            <div className="pt-4 border-t border-[#2b2d31] flex flex-wrap items-center gap-6 text-xs text-[#949BA4]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#57F287]" />
                <span>NextAuth v5 & Discord OAuth2</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#57F287]" />
                <span>Firebase Realtime Database</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#57F287]" />
                <span>99.98% Bot Uptime SLA</span>
              </div>
            </div>
          </div>

          {/* Hero Right: Live Interactive Discord Bot Preview Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl bg-[#1e1f22] border border-[#3f4147] shadow-2xl p-5 space-y-4">
              {/* Header preview */}
              <div className="flex items-center justify-between pb-3 border-b border-[#2b2d31]">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-full overflow-hidden bg-[#2b2d31] border border-[#EB459E]/40">
                    <img
                      src={BOT_AVATAR_PATH}
                      alt="uwu-bot Mascot"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-white">uwu-bot</span>
                      <span className="text-[9px] font-bold uppercase px-1 rounded bg-[#EB459E] text-white">
                        APP
                      </span>
                    </div>
                    <div className="text-[11px] text-[#949BA4]">Today at 10:50 AM</div>
                  </div>
                </div>
                <span className="text-xs text-[#57F287] font-semibold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#57F287]" />
                  Active
                </span>
              </div>

              {/* Bot Embed Mock */}
              <div className="bg-[#2b2d31] border-l-4 border-l-[#EB459E] rounded-r-xl p-4 space-y-3">
                <div className="text-xs font-bold text-white tracking-wide uppercase flex items-center justify-between">
                  <span>🌸 uwu Central Bank & Zoo Stats</span>
                  <Coins className="w-4 h-4 text-[#FEE75C]" />
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-[#1e1f22] p-2.5 rounded-lg border border-[#3f4147]">
                    <div className="text-[10px] text-[#949BA4] uppercase font-bold">Cowoncy Wallet</div>
                    <div className="text-sm font-extrabold text-[#57F287] font-mono tabular-nums">38,450 🪙</div>
                  </div>
                  <div className="bg-[#1e1f22] p-2.5 rounded-lg border border-[#3f4147]">
                    <div className="text-[10px] text-[#949BA4] uppercase font-bold">Bank Vault</div>
                    <div className="text-sm font-extrabold text-[#5865F2] font-mono tabular-nums">245,000 🏦</div>
                  </div>
                </div>
                <div className="text-[11px] text-[#DBDEE1] bg-[#1e1f22]/70 p-2 rounded border border-[#3f4147]/50 flex items-center justify-between">
                  <span>Zoo: <strong className="text-white">102 Animals</strong> (🦊 Mythic Kitsune)</span>
                  <span className="text-[#EB459E] font-bold">💍 Married to Aria</span>
                </div>
              </div>

              {/* Interactive Quick Command Tester */}
              <div className="space-y-2 pt-1">
                <div className="text-xs font-semibold text-[#949BA4] flex items-center justify-between">
                  <span>uwu Command Tester</span>
                  <span className="text-[10px] text-[#EB459E]">Click to execute:</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  <button
                    onClick={() => handleRunCommand('daily')}
                    className="px-2 py-1.5 text-xs font-mono font-medium rounded-lg bg-[#2b2d31] hover:bg-[#313338] text-[#DBDEE1] hover:text-white border border-[#3f4147] transition-colors text-center truncate"
                  >
                    uwu daily
                  </button>
                  <button
                    onClick={() => handleRunCommand('cf')}
                    className="px-2 py-1.5 text-xs font-mono font-medium rounded-lg bg-[#2b2d31] hover:bg-[#313338] text-[#DBDEE1] hover:text-white border border-[#3f4147] transition-colors text-center truncate"
                  >
                    uwu cf
                  </button>
                  <button
                    onClick={() => handleRunCommand('hunt')}
                    className="px-2 py-1.5 text-xs font-mono font-medium rounded-lg bg-[#2b2d31] hover:bg-[#313338] text-[#DBDEE1] hover:text-white border border-[#3f4147] transition-colors text-center truncate"
                  >
                    uwu hunt
                  </button>
                  <button
                    onClick={() => handleRunCommand('pray')}
                    className="px-2 py-1.5 text-xs font-mono font-medium rounded-lg bg-[#2b2d31] hover:bg-[#313338] text-[#DBDEE1] hover:text-white border border-[#3f4147] transition-colors text-center truncate"
                  >
                    uwu pray
                  </button>
                </div>

                {/* Simulated Log Output */}
                {simulatedLog.length > 0 && (
                  <div className="bg-[#111214] p-3 rounded-lg border border-[#3f4147] text-xs font-mono space-y-1.5 max-h-28 overflow-y-auto">
                    {simulatedLog.map((line, idx) => (
                      <div
                        key={idx}
                        className={idx % 2 === 0 ? 'text-[#5865F2] font-semibold' : 'text-[#57F287]'}
                      >
                        {line}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Four Core Feature Showcases */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-[#5865F2]">
            Comprehensive Server Suite
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Engineered for High Engagement & Community Retention
          </h2>
          <p className="text-sm text-[#949BA4]">
            Every module is configurable per guild with toggle switches, customizable prefixes,
            audit log webhooks, and Firebase Realtime Database synchronization.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Feature 1: Economy */}
          <div className="bg-[#1e1f22] rounded-2xl border border-[#2b2d31] hover:border-[#5865F2]/50 p-6 space-y-4 transition-all duration-200">
            <div className="w-12 h-12 rounded-xl bg-[#FEE75C]/10 border border-[#FEE75C]/20 flex items-center justify-center text-[#FEE75C]">
              <Coins className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Dynamic Economy & Banking</h3>
              <p className="text-xs text-[#949BA4] mt-2 leading-relaxed">
                Compound interest bank accounts, robbery defense mechanics, customizable daily streak multipliers, and custom server shop catalogs.
              </p>
            </div>
            <div className="pt-2 text-xs font-mono text-[#DBDEE1] space-y-1.5">
              <div className="flex justify-between">
                <span className="text-[#949BA4]">Daily Allowance:</span>
                <span className="text-white font-semibold">1,000 + 75/day</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#949BA4]">Interest Yield:</span>
                <span className="text-[#57F287] font-semibold">1.5% Weekly</span>
              </div>
            </div>
          </div>

          {/* Feature 2: High Stakes Gambling */}
          <div className="bg-[#1e1f22] rounded-2xl border border-[#2b2d31] hover:border-[#5865F2]/50 p-6 space-y-4 transition-all duration-200">
            <div className="w-12 h-12 rounded-xl bg-[#5865F2]/10 border border-[#5865F2]/20 flex items-center justify-center text-[#5865F2]">
              <Dice5 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Casino & Gambling Suite</h3>
              <p className="text-xs text-[#949BA4] mt-2 leading-relaxed">
                Provably fair 50/50 coinflips, cyber roulette wheels, multi-line slot reels, and configurable server max bet caps with house edge controls.
              </p>
            </div>
            <div className="pt-2 text-xs font-mono text-[#DBDEE1] space-y-1.5">
              <div className="flex justify-between">
                <span className="text-[#949BA4]">Supported Games:</span>
                <span className="text-white font-semibold">Coinflip, Roulette, Slots</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#949BA4]">Max Server Bet:</span>
                <span className="text-[#FEE75C] font-semibold">Up to 250,000</span>
              </div>
            </div>
          </div>

          {/* Feature 3: Social & Marriage */}
          <div className="bg-[#1e1f22] rounded-2xl border border-[#2b2d31] hover:border-[#5865F2]/50 p-6 space-y-4 transition-all duration-200">
            <div className="w-12 h-12 rounded-xl bg-[#EB459E]/10 border border-[#EB459E]/20 flex items-center justify-center text-[#EB459E]">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Social & Marriage Vaults</h3>
              <p className="text-xs text-[#949BA4] mt-2 leading-relaxed">
                Ceremonial proposals with ring customization, shared couple bank vaults, love affinity milestones, and custom married partner roles.
              </p>
            </div>
            <div className="pt-2 text-xs font-mono text-[#DBDEE1] space-y-1.5">
              <div className="flex justify-between">
                <span className="text-[#949BA4]">Ring Tiers:</span>
                <span className="text-white font-semibold">Silver to Celestial Band</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#949BA4]">Joint Vault:</span>
                <span className="text-[#EB459E] font-semibold">Shared Interest</span>
              </div>
            </div>
          </div>

          {/* Feature 4: Booster Perks */}
          <div className="bg-[#1e1f22] rounded-2xl border border-[#2b2d31] hover:border-[#5865F2]/50 p-6 space-y-4 transition-all duration-200">
            <div className="w-12 h-12 rounded-xl bg-[#57F287]/10 border border-[#57F287]/20 flex items-center justify-center text-[#57F287]">
              <Gem className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Booster Rewards & Sync</h3>
              <p className="text-xs text-[#949BA4] mt-2 leading-relaxed">
                Reward server Nitro boosters with automatic custom gradient roles, 2x XP multipliers, weekly coin drops, and audit log tracking.
              </p>
            </div>
            <div className="pt-2 text-xs font-mono text-[#DBDEE1] space-y-1.5">
              <div className="flex justify-between">
                <span className="text-[#949BA4]">Booster Multiplier:</span>
                <span className="text-[#57F287] font-semibold">+50% All Earnings</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#949BA4]">Custom Roles:</span>
                <span className="text-white font-semibold">Auto Synced</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Command Explorer Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-white">Interactive Command Directory</h3>
            <p className="text-xs text-[#949BA4]">
              Slash commands (`/`) and customizable server prefixes supported across all guilds.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-[#1e1f22] rounded-xl border border-[#2b2d31]">
            {(['All', 'Economy', 'Gambling', 'Social', 'Booster'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  activeCategory === cat
                    ? 'bg-[#5865F2] text-white'
                    : 'text-[#949BA4] hover:text-[#DBDEE1]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCommands.map((cmd) => (
            <div
              key={cmd.name}
              onClick={() => setSelectedCommand(cmd)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                selectedCommand.name === cmd.name
                  ? 'bg-[#2b2d31] border-[#5865F2]'
                  : 'bg-[#1e1f22] border-[#2b2d31] hover:border-[#3f4147]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold font-mono text-white">/{cmd.name}</span>
                <span className="text-[10px] font-semibold uppercase text-[#949BA4] px-1.5 py-0.5 rounded bg-[#111214]">
                  {cmd.category}
                </span>
              </div>
              <p className="text-xs text-[#949BA4] mt-2 line-clamp-2">{cmd.description}</p>
              <div className="mt-3 text-[11px] font-mono text-[#5865F2] bg-[#111214] px-2 py-1 rounded truncate">
                {cmd.syntax}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Discord Community Hero Banner Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl overflow-hidden border border-[#2b2d31] bg-[#1e1f22]">
          <div className="relative h-64 sm:h-80 w-full overflow-hidden">
            <img
              src={HERO_BANNER_PATH}
              alt="uwu-bot Server Community Hub"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center brightness-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111214] via-[#111214]/60 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
              <div className="space-y-1">
                <div className="text-xs font-bold uppercase tracking-wider text-[#EB459E]">
                  Cloud Native Architecture
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Powered by Firebase Realtime Database
                </h3>
                <p className="text-xs sm:text-sm text-[#DBDEE1] max-w-xl">
                  Real-time synchronization for uwu-bot-4cff1 across Discord WebSocket events, animal hunting, and economy banking.
                </p>
              </div>
              <button
                onClick={() => setCurrentTab('setup')}
                className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-[#5865F2] hover:bg-[#4752C4] rounded-xl shadow-md transition-colors whitespace-nowrap"
              >
                <span>View Firebase & API Setup</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
