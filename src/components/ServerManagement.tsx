import React from 'react';
import { useBotDashboard } from '../context/BotDashboardContext';
import { Server } from 'lucide-react';

export const ServerManagement: React.FC = () => {
  const { servers, serverStatusMessage } = useBotDashboard();
  const installedServers = servers.filter((server) => server.botInstalled === true);
  const botMembershipUnchecked = servers.some((server) => server.botInstalled === null || server.botInstalled === undefined);

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <header className="border-b border-[#35383d] pb-7">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#73c8ad]"><Server className="h-4 w-4" /> Discord OAuth</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Servers</h1>
        <p className="mt-2 text-sm text-[#aeb4bb]">Servers you own or can manage, checked against the bot's Discord membership.</p>
      </header>

      {serverStatusMessage ? (
        <p role="status" className="border-y border-[#665a3e] py-5 text-sm text-[#efd18b]">{serverStatusMessage}</p>
      ) : servers.length === 0 ? (
        <p className="border-y border-[#35383d] py-14 text-center text-sm text-[#aeb4bb]">No manageable Discord servers were returned by the connected account.</p>
      ) : (
        <>
          <p className="text-sm text-[#aeb4bb]">
            {botMembershipUnchecked
              ? 'Bot membership checks require DISCORD_BOT_TOKEN.'
              : `${installedServers.length} of ${servers.length} manageable servers have the bot installed.`}
          </p>
          <div className="divide-y divide-[#35383d] border-y border-[#35383d]">
            {servers.map((server) => {
              const memberCountLabel = typeof server.memberCount === 'number'
                ? `${server.memberCount.toLocaleString()} members`
                : 'Member count unavailable';
              return (
                <div key={server.id} className="flex items-center gap-4 py-4">
                  {server.icon ? <img src={server.icon} alt="" className="h-10 w-10 rounded-md object-cover" /> : <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#202326] text-sm font-semibold text-[#aeb4bb]">{server.name.slice(0, 1)}</div>}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-white">{server.name}</p>
                    <p className="mt-1 text-xs text-[#858c93]">{server.owner ? 'Owner' : 'Manage Server'} <span className="mx-1">·</span> {memberCountLabel}</p>
                  </div>
                  <span className={`shrink-0 rounded px-2 py-1 text-xs font-medium ${server.botInstalled === true ? 'bg-[#1d302a] text-[#9cddc7]' : 'bg-[#292d31] text-[#aeb4bb]'}`}>
                    {server.botInstalled === null || server.botInstalled === undefined ? 'Not checked' : server.botInstalled ? 'Bot installed' : 'Not installed'}
                  </span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};