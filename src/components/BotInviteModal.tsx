import React, { useState } from 'react';
import { BOT_AVATAR_PATH } from '../data/mockData';
import { useBotDashboard } from '../context/BotDashboardContext';
import { Shield, Copy, Check, ExternalLink, Sparkles } from 'lucide-react';

interface BotInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BotInviteModal: React.FC<BotInviteModalProps> = ({ isOpen, onClose }) => {
  const { addToast } = useBotDashboard();
  const [clientId, setClientId] = useState('123456789012345678');
  const [isAdmin, setIsAdmin] = useState(true);
  const [permissions, setPermissions] = useState({
    manageRoles: true,
    manageChannels: true,
    sendMessages: true,
    embedLinks: true,
    attachFiles: true,
    readHistory: true,
    useSlashCommands: true,
  });

  if (!isOpen) return null;

  // Compute Discord permission bitfield
  let bitfield = 0;
  if (isAdmin) {
    bitfield = 8; // Administrator
  } else {
    if (permissions.manageRoles) bitfield |= 268435456;
    if (permissions.manageChannels) bitfield |= 16;
    if (permissions.sendMessages) bitfield |= 2048;
    if (permissions.embedLinks) bitfield |= 16384;
    if (permissions.attachFiles) bitfield |= 32768;
    if (permissions.readHistory) bitfield |= 65536;
    if (permissions.useSlashCommands) bitfield |= 2147483648;
  }

  const inviteUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&permissions=${bitfield}&scope=bot%20applications.commands`;

  const copyInvite = () => {
    navigator.clipboard.writeText(inviteUrl);
    addToast('Bot invite URL copied to clipboard!', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#1e1f22] border border-[#3f4147] rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden space-y-5 p-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#2b2d31]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl overflow-hidden bg-[#2b2d31] border border-[#3f4147]">
              <img
                src={BOT_AVATAR_PATH}
                alt="AetherBot"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-base font-bold text-white">Add AetherBot to Discord</h3>
                <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-[#5865F2] text-white">
                  APP
                </span>
              </div>
              <p className="text-xs text-[#949BA4]">Generate custom OAuth2 authorization invite link</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#949BA4] hover:text-white text-lg font-bold"
          >
            ✕
          </button>
        </div>

        {/* Client ID input */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#DBDEE1]">
            Bot Application Client ID
          </label>
          <input
            type="text"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            placeholder="Discord Application ID"
            className="w-full px-3.5 py-2 bg-[#111214] border border-[#3f4147] rounded-xl text-white font-mono text-xs focus:outline-none focus:border-[#5865F2]"
          />
        </div>

        {/* Permission Calculator */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-[#DBDEE1]">
              Requested Server Permissions (Bitmask: <span className="font-mono text-[#5865F2]">{bitfield}</span>)
            </label>
            <button
              onClick={() => setIsAdmin(!isAdmin)}
              className={`text-xs font-semibold px-2 py-0.5 rounded transition-colors ${
                isAdmin
                  ? 'bg-[#5865F2] text-white'
                  : 'bg-[#2b2d31] text-[#949BA4]'
              }`}
            >
              {isAdmin ? 'Administrator (Recommended)' : 'Custom Scopes'}
            </button>
          </div>

          {isAdmin ? (
            <div className="p-3 bg-[#2b2d31] rounded-xl border border-[#3f4147] text-xs text-[#DBDEE1] flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#57F287] shrink-0" />
              <span>
                Administrator permission (<code>8</code>) gives full access to execute slash commands, manage roles for marriage/booster perks, and log events.
              </span>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 text-xs">
              {Object.entries(permissions).map(([key, val]) => (
                <label
                  key={key}
                  className="flex items-center gap-2 p-2 bg-[#2b2d31] rounded-lg border border-[#3f4147] cursor-pointer hover:bg-[#313338]"
                >
                  <input
                    type="checkbox"
                    checked={val}
                    onChange={(e) =>
                      setPermissions((prev) => ({ ...prev, [key]: e.target.checked }))
                    }
                    className="rounded border-[#3f4147] text-[#5865F2] focus:ring-[#5865F2]"
                  />
                  <span className="capitalize text-[#DBDEE1]">
                    {key.replace(/([A-Z])/g, ' $1')}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Generated URL Box */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-[#949BA4]">
            OAuth2 Authorization URL
          </label>
          <div className="flex items-center gap-2 bg-[#111214] p-2.5 rounded-xl border border-[#3f4147]">
            <span className="text-[11px] font-mono text-[#DBDEE1] truncate flex-1 select-all">
              {inviteUrl}
            </span>
            <button
              onClick={copyInvite}
              className="p-1.5 rounded-lg bg-[#2b2d31] hover:bg-[#313338] text-white transition-colors shrink-0"
              title="Copy URL"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Footer actions */}
        <div className="pt-2 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-[#DBDEE1] hover:text-white"
          >
            Close
          </button>
          <button
            onClick={copyInvite}
            className="flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-[#5865F2] hover:bg-[#4752C4] rounded-xl shadow-md transition-all active:scale-95"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy Bot Invite Link</span>
          </button>
        </div>
      </div>
    </div>
  );
};
