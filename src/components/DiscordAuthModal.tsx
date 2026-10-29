import React from 'react';
import { useBotDashboard } from '../context/BotDashboardContext';
import { BOT_AVATAR_PATH } from '../data/mockData';
import { Check, Shield, User, Users, ChevronRight } from 'lucide-react';
import { DiscordUser } from '../types/discord';

interface DiscordAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DiscordAuthModal: React.FC<DiscordAuthModalProps> = ({ isOpen, onClose }) => {
  const { loginAsUser, setCurrentTab } = useBotDashboard();

  if (!isOpen) return null;

  const mockProfiles: DiscordUser[] = [
    {
      id: '439281729104829102',
      username: 'astro_alex',
      discriminator: '0',
      globalName: 'AstroAlex',
      avatar: 'https://cdn.discordapp.com/embed/avatars/0.png',
      nitroType: 'booster',
      status: 'online',
      customStatus: '⚡ Grinding daily streaks on AetherBot',
    },
    {
      id: 'user_1',
      username: 'zephyr_valkyrie',
      discriminator: '0',
      globalName: 'ZephyrValkyrie',
      avatar: 'https://cdn.discordapp.com/embed/avatars/4.png',
      nitroType: 'booster',
      status: 'online',
      customStatus: '👑 Rank #1 Global Wealth Champion',
    },
    {
      id: 'user_2',
      username: 'shadow_kitsune',
      discriminator: '0',
      globalName: 'ShadowKitsune',
      avatar: 'https://cdn.discordapp.com/embed/avatars/1.png',
      nitroType: 'classic',
      status: 'idle',
      customStatus: '🎲 High-Stakes Coinflip Master',
    },
  ];

  const handleAuthorize = (profile: DiscordUser) => {
    loginAsUser(profile);
    setCurrentTab('dashboard');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#1e1f22] border border-[#3f4147] rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
        {/* Discord Header */}
        <div className="p-6 text-center border-b border-[#2b2d31] space-y-3 bg-[#2b2d31]/40">
          <div className="flex items-center justify-center -space-x-3">
            <div className="w-14 h-14 rounded-full overflow-hidden bg-[#111214] border-2 border-[#5865F2] shadow-lg">
              <img
                src={BOT_AVATAR_PATH}
                alt="AetherBot"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-8 h-8 rounded-full bg-[#5865F2] text-white flex items-center justify-center text-xs font-bold shadow-md z-10 border-2 border-[#1e1f22]">
              ⇄
            </div>
            <div className="w-14 h-14 rounded-full overflow-hidden bg-[#111214] border-2 border-white/20 shadow-lg flex items-center justify-center">
              <svg className="w-8 h-8 fill-[#5865F2]" viewBox="0 0 24 24">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
            </div>
          </div>

          <div>
            <h3 className="text-base font-bold text-white">An application is requesting access</h3>
            <p className="text-xs text-[#949BA4] mt-1">
              <strong>AetherBot</strong> wants to access your Discord account.
            </p>
          </div>
        </div>

        {/* OAuth2 Permissions List */}
        <div className="p-6 space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-[#949BA4]">
            This will allow AetherBot to:
          </div>

          <div className="space-y-3 text-xs text-[#DBDEE1]">
            <div className="flex items-start gap-3">
              <Check className="w-4 h-4 text-[#57F287] shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-medium">Access your identity (`identify`)</strong>
                <span className="text-[#949BA4]">Your username, avatar, banner, and unique Discord ID.</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Check className="w-4 h-4 text-[#57F287] shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block font-medium">Know what servers you are in (`guilds`)</strong>
                <span className="text-[#949BA4]">Verify administrator permissions to unlock Server Management.</span>
              </div>
            </div>
          </div>

          {/* Quick profile switch for instant demo */}
          <div className="pt-2 border-t border-[#2b2d31] space-y-2">
            <span className="text-[11px] text-[#949BA4] font-semibold block">
              Select Discord Profile to Authenticate:
            </span>
            <div className="space-y-1.5">
              {mockProfiles.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleAuthorize(p)}
                  className="w-full flex items-center justify-between p-2 rounded-xl bg-[#2b2d31] hover:bg-[#313338] border border-[#3f4147] transition-all text-left group"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={p.avatar}
                      alt={p.username}
                      referrerPolicy="no-referrer"
                      className="w-7 h-7 rounded-full object-cover bg-[#111214]"
                    />
                    <div>
                      <div className="text-xs font-bold text-white group-hover:text-[#5865F2] transition-colors">
                        {p.globalName}
                      </div>
                      <div className="text-[10px] text-[#949BA4]">@{p.username}</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#949BA4] group-hover:translate-x-0.5 transition-transform" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#2b2d31]/50 border-t border-[#2b2d31] flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-[#DBDEE1] hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => handleAuthorize(mockProfiles[0])}
            className="px-5 py-2 text-xs font-bold text-white bg-[#5865F2] hover:bg-[#4752C4] rounded-xl transition-all shadow-md active:scale-95"
          >
            Authorize Access
          </button>
        </div>
      </div>
    </div>
  );
};
