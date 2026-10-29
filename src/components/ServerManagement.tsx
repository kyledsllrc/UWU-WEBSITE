import React, { useState } from 'react';
import { useBotDashboard } from '../context/BotDashboardContext';
import {
  Server,
  Settings2,
  Coins,
  Dice5,
  Heart,
  ShieldCheck,
  RefreshCw,
  Hash,
  Save,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Crown,
  Lock,
} from 'lucide-react';

export const ServerManagement: React.FC = () => {
  const {
    guilds,
    activeGuild,
    setActiveGuildId,
    toggleGuildModule,
    updateGuildConfig,
    syncGuildsWithDiscord,
  } = useBotDashboard();

  const [prefixInput, setPrefixInput] = useState(activeGuild.prefix);
  const [logChannelInput, setLogChannelInput] = useState(activeGuild.logChannelId);
  const [welcomeChannelInput, setWelcomeChannelInput] = useState(activeGuild.welcomeChannelId);
  const [autoRoleInput, setAutoRoleInput] = useState(activeGuild.autoRoleId);
  const [isSaving, setIsSaving] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // When active guild changes, sync inputs
  const handleSelectGuild = (id: string) => {
    setActiveGuildId(id);
    const target = guilds.find((g) => g.id === id);
    if (target) {
      setPrefixInput(target.prefix);
      setLogChannelInput(target.logChannelId);
      setWelcomeChannelInput(target.welcomeChannelId);
      setAutoRoleInput(target.autoRoleId);
    }
  };

  const handleSaveSettings = () => {
    setIsSaving(true);
    setTimeout(() => {
      updateGuildConfig(activeGuild.id, {
        prefix: prefixInput,
        logChannelId: logChannelInput,
        welcomeChannelId: welcomeChannelInput,
        autoRoleId: autoRoleInput,
      });
      setIsSaving(false);
    }, 350);
  };

  const handleSyncDiscord = async () => {
    setIsSyncing(true);
    await syncGuildsWithDiscord();
    setIsSyncing(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Header & Server Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#5865F2]">
            <Server className="w-4 h-4" />
            <span>Administrator Guild Control</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Server Management Panel
          </h1>
          <p className="text-xs text-[#949BA4] mt-1">
            Configure bot modules, custom prefixes, moderation channels, and role rewards.
          </p>
        </div>

        {/* Sync Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleSyncDiscord}
            disabled={isSyncing}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2b2d31] hover:bg-[#313338] border border-[#3f4147] text-xs font-semibold text-[#DBDEE1] transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#5865F2] ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing with Discord...' : 'Sync Roles & Permissions'}</span>
          </button>
        </div>
      </div>

      {/* 2. Admin Guilds Grid / Switcher */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {guilds.map((guild) => {
          const isSelected = guild.id === activeGuild.id;
          return (
            <button
              key={guild.id}
              onClick={() => handleSelectGuild(guild.id)}
              className={`text-left p-4 rounded-2xl border transition-all ${
                isSelected
                  ? 'bg-[#2b2d31] border-[#5865F2] shadow-lg shadow-[#5865F2]/10 ring-1 ring-[#5865F2]'
                  : 'bg-[#1e1f22] border-[#2b2d31] hover:border-[#3f4147]'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#111214] border border-[#3f4147] flex items-center justify-center font-bold text-sm text-white shrink-0">
                  {guild.icon}
                </div>
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-[#111214] text-[#DBDEE1]">
                  {guild.userRole}
                </span>
              </div>

              <div className="mt-3">
                <div className="text-sm font-bold text-white truncate">{guild.name}</div>
                <div className="text-xs text-[#949BA4] font-mono tabular-nums mt-0.5">
                  {guild.memberCount.toLocaleString()} members
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-[#3f4147]/40 flex items-center justify-between text-[11px]">
                <span className={guild.botInstalled ? 'text-[#57F287] font-medium' : 'text-[#FEE75C] font-medium'}>
                  {guild.botInstalled ? '● Bot Active' : '○ Needs Invite'}
                </span>
                <span className="text-[#949BA4] font-mono">Prefix: {guild.prefix}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. Active Server Settings Workspace */}
      <div className="bg-[#1e1f22] rounded-2xl border border-[#2b2d31] overflow-hidden shadow-xl space-y-8 p-6 sm:p-8">
        {/* Server Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#2b2d31]">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#111214] border-2 border-[#5865F2] flex items-center justify-center text-lg font-bold text-white">
              {activeGuild.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">{activeGuild.name}</h2>
                <Crown className="w-4 h-4 text-[#FEE75C]" />
              </div>
              <div className="text-xs text-[#949BA4] font-mono">
                Guild ID: {activeGuild.id} · Role: {activeGuild.userRole}
              </div>
            </div>
          </div>

          <button
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#5865F2] hover:bg-[#4752C4] text-white text-xs font-bold transition-all shadow-md active:scale-95 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving Changes...' : 'Save Configuration'}</span>
          </button>
        </div>

        {/* General Guild Configuration (Prefix & Channels) */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Settings2 className="w-4 h-4 text-[#5865F2]" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Core Bot Configuration
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Command Prefix */}
            <div className="bg-[#2b2d31] p-4 rounded-xl border border-[#3f4147] space-y-1.5">
              <label className="text-xs font-semibold text-[#DBDEE1]">
                Custom Command Prefix
              </label>
              <input
                type="text"
                maxLength={4}
                value={prefixInput}
                onChange={(e) => setPrefixInput(e.target.value)}
                placeholder="!, /, $, ?"
                className="w-full px-3 py-2 bg-[#111214] border border-[#3f4147] rounded-lg text-white font-mono text-sm focus:outline-none focus:border-[#5865F2]"
              />
              <span className="text-[10px] text-[#949BA4]">Example: {prefixInput}daily</span>
            </div>

            {/* Audit Log Channel ID */}
            <div className="bg-[#2b2d31] p-4 rounded-xl border border-[#3f4147] space-y-1.5">
              <label className="text-xs font-semibold text-[#DBDEE1]">
                Audit Log Channel ID
              </label>
              <input
                type="text"
                value={logChannelInput}
                onChange={(e) => setLogChannelInput(e.target.value)}
                placeholder="e.g. 102938475601"
                className="w-full px-3 py-2 bg-[#111214] border border-[#3f4147] rounded-lg text-white font-mono text-sm focus:outline-none focus:border-[#5865F2]"
              />
              <span className="text-[10px] text-[#949BA4]">Where bot actions are logged</span>
            </div>

            {/* Welcome Channel ID */}
            <div className="bg-[#2b2d31] p-4 rounded-xl border border-[#3f4147] space-y-1.5">
              <label className="text-xs font-semibold text-[#DBDEE1]">
                Welcome Channel ID
              </label>
              <input
                type="text"
                value={welcomeChannelInput}
                onChange={(e) => setWelcomeChannelInput(e.target.value)}
                placeholder="e.g. 102938475602"
                className="w-full px-3 py-2 bg-[#111214] border border-[#3f4147] rounded-lg text-white font-mono text-sm focus:outline-none focus:border-[#5865F2]"
              />
              <span className="text-[10px] text-[#949BA4]">Automated arrival greetings</span>
            </div>

            {/* Auto Role ID */}
            <div className="bg-[#2b2d31] p-4 rounded-xl border border-[#3f4147] space-y-1.5">
              <label className="text-xs font-semibold text-[#DBDEE1]">
                Default Member Auto-Role
              </label>
              <input
                type="text"
                value={autoRoleInput}
                onChange={(e) => setAutoRoleInput(e.target.value)}
                placeholder="e.g. 102938475603"
                className="w-full px-3 py-2 bg-[#111214] border border-[#3f4147] rounded-lg text-white font-mono text-sm focus:outline-none focus:border-[#5865F2]"
              />
              <span className="text-[10px] text-[#949BA4]">Assigned upon joining</span>
            </div>
          </div>
        </div>

        {/* 4. Module Toggles Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Feature Modules & Permissions
            </h3>
            <span className="text-xs text-[#949BA4]">Changes apply immediately to active bot workers</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Economy Module */}
            <div className="bg-[#2b2d31] rounded-xl border border-[#3f4147] p-5 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FEE75C]/10 border border-[#FEE75C]/20 flex items-center justify-center text-[#FEE75C]">
                    <Coins className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Economy System</h4>
                    <p className="text-xs text-[#949BA4]">Wallets, bank interest, robbery & daily claims</p>
                  </div>
                </div>

                {/* Purple Toggle Switch */}
                <button
                  onClick={() => toggleGuildModule(activeGuild.id, 'economy')}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    activeGuild.modules.economy.enabled ? 'bg-[#5865F2]' : 'bg-[#111214]'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      activeGuild.modules.economy.enabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {activeGuild.modules.economy.enabled && (
                <div className="pt-2 border-t border-[#3f4147] space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[#DBDEE1]">Daily Allowance Amount</span>
                    <span className="font-mono font-semibold text-white">
                      {activeGuild.modules.economy.dailyReward} coins
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#DBDEE1]">Robbery Success Chance</span>
                    <span className="font-mono font-semibold text-[#FEE75C]">
                      {Math.round(activeGuild.modules.economy.robberyRate * 100)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#DBDEE1]">Custom Guild Shop</span>
                    <button
                      onClick={() => toggleGuildModule(activeGuild.id, 'economy', 'shopEnabled')}
                      className={`text-xs font-semibold px-2 py-0.5 rounded ${
                        activeGuild.modules.economy.shopEnabled
                          ? 'bg-[#57F287]/20 text-[#57F287]'
                          : 'bg-[#ED4245]/20 text-[#ED4245]'
                      }`}
                    >
                      {activeGuild.modules.economy.shopEnabled ? 'Enabled' : 'Disabled'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Gambling Module */}
            <div className="bg-[#2b2d31] rounded-xl border border-[#3f4147] p-5 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#5865F2]/10 border border-[#5865F2]/20 flex items-center justify-center text-[#5865F2]">
                    <Dice5 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Gambling & Casino</h4>
                    <p className="text-xs text-[#949BA4]">Coinflip, roulette, slots, and high-roller tables</p>
                  </div>
                </div>

                {/* Purple Toggle Switch */}
                <button
                  onClick={() => toggleGuildModule(activeGuild.id, 'gambling')}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    activeGuild.modules.gambling.enabled ? 'bg-[#5865F2]' : 'bg-[#111214]'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      activeGuild.modules.gambling.enabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {activeGuild.modules.gambling.enabled && (
                <div className="pt-2 border-t border-[#3f4147] space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[#DBDEE1]">Max Bet Ceiling</span>
                    <span className="font-mono font-semibold text-white">
                      {activeGuild.modules.gambling.maxBet.toLocaleString()} coins
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#DBDEE1]">House Edge Margin</span>
                    <span className="font-mono font-semibold text-[#57F287]">
                      {Math.round(activeGuild.modules.gambling.houseEdge * 100)}%
                    </span>
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[#949BA4]">Active games:</span>
                    <span className="font-semibold text-white">Coinflip, Cyber Roulette, Slots</span>
                  </div>
                </div>
              )}
            </div>

            {/* Social & Marriage Module */}
            <div className="bg-[#2b2d31] rounded-xl border border-[#3f4147] p-5 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#EB459E]/10 border border-[#EB459E]/20 flex items-center justify-center text-[#EB459E]">
                    <Heart className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Social & Marriage</h4>
                    <p className="text-xs text-[#949BA4]">Proposals, rings, joint couple vaults & affinity</p>
                  </div>
                </div>

                {/* Purple Toggle Switch */}
                <button
                  onClick={() => toggleGuildModule(activeGuild.id, 'social')}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    activeGuild.modules.social.enabled ? 'bg-[#5865F2]' : 'bg-[#111214]'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      activeGuild.modules.social.enabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {activeGuild.modules.social.enabled && (
                <div className="pt-2 border-t border-[#3f4147] space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[#DBDEE1]">Ceremony Marriage Fee</span>
                    <span className="font-mono font-semibold text-white">
                      {activeGuild.modules.social.marriageFee.toLocaleString()} coins
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#DBDEE1]">Custom Couple Roles</span>
                    <span className="text-[#57F287] font-semibold">Enabled</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#DBDEE1]">Joint Vault System</span>
                    <span className="text-[#EB459E] font-semibold">Active</span>
                  </div>
                </div>
              )}
            </div>

            {/* Moderation & Boosters Module */}
            <div className="bg-[#2b2d31] rounded-xl border border-[#3f4147] p-5 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#57F287]/10 border border-[#57F287]/20 flex items-center justify-center text-[#57F287]">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Boosters & Moderation</h4>
                    <p className="text-xs text-[#949BA4]">Automated booster perks, anti-spam & log alerts</p>
                  </div>
                </div>

                {/* Purple Toggle Switch */}
                <button
                  onClick={() => toggleGuildModule(activeGuild.id, 'moderation')}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    activeGuild.modules.moderation.enabled ? 'bg-[#5865F2]' : 'bg-[#111214]'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      activeGuild.modules.moderation.enabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {activeGuild.modules.moderation.enabled && (
                <div className="pt-2 border-t border-[#3f4147] space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[#DBDEE1]">Nitro Booster Bonus XP</span>
                    <span className="text-[#57F287] font-semibold">+50% Active</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#DBDEE1]">Automated Link Anti-Spam</span>
                    <button
                      onClick={() => toggleGuildModule(activeGuild.id, 'moderation', 'antiSpam')}
                      className={`text-xs font-semibold px-2 py-0.5 rounded ${
                        activeGuild.modules.moderation.antiSpam
                          ? 'bg-[#57F287]/20 text-[#57F287]'
                          : 'bg-[#ED4245]/20 text-[#ED4245]'
                      }`}
                    >
                      {activeGuild.modules.moderation.antiSpam ? 'Enabled' : 'Disabled'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
