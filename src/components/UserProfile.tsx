import React, { useEffect, useState } from 'react';
import { useBotDashboard } from '../context/BotDashboardContext';
import { RefreshCw, Search } from 'lucide-react';

export const UserProfile: React.FC = () => {
  const { user, userRecord, refreshFromFirebase } = useBotDashboard();
  const [query, setQuery] = useState(user?.id || '');
  const [recordId, setRecordId] = useState(user?.id || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.id) {
      setQuery(user.id);
      setRecordId(user.id);
    }
  }, [user?.id]);

  const findUser = async (event: React.FormEvent) => {
    event.preventDefault();
    const id = query.trim();
    if (!id) return;
    setLoading(true);
    setRecordId(id);
    await refreshFromFirebase(id);
    setLoading(false);
  };

  const [refreshing, setRefreshing] = useState(false);

  const refresh = async () => {
    setRefreshing(true);
    await refreshFromFirebase();
    setRefreshing(false);
  };

  const fields: [string, unknown][] = userRecord ? ([
    ['Wallet', userRecord.wallet],
    ['Bank', userRecord.bank],
    ['Daily streak', userRecord.streak],
    ['Prestige', userRecord.prestige],
    ['Charisma EXP', userRecord.charismaExp],
    ['Boost count', userRecord.boostCount],
    ['Games played', userRecord.stats?.gamesPlayed],
    ['Games won', userRecord.stats?.gamesWon],
    ['Total wagered', userRecord.stats?.totalWagered],
    ['Total won', userRecord.stats?.totalWon],
  ].filter(([, value]) => value !== undefined && value !== null) as [string, unknown][]) : [];

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-5 border-b border-[#35383d] pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#73c8ad]">Discord account</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Bot users</h1>
        </div>
        <form onSubmit={findUser} className="flex w-full gap-2 sm:max-w-md">
          <label className="sr-only" htmlFor="bot-user-id">Discord user ID</label>
          <input id="bot-user-id" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Discord user ID" className="min-w-0 flex-1 rounded-md border border-[#45494f] bg-[#202326] px-3 py-2.5 font-mono text-sm text-white placeholder:text-[#858c93] focus:border-[#73c8ad] focus:outline-none" />
          <button type="submit" disabled={loading} className="inline-flex items-center gap-2 rounded-md bg-[#73c8ad] px-3 py-2.5 text-sm font-semibold text-[#10231e] disabled:opacity-50">
            {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />} Find
          </button>
          <button type="button" onClick={refresh} disabled={refreshing} title="Refresh this record" className="rounded-md border border-[#45494f] p-2.5 text-[#d9e0e2] hover:bg-[#202326] disabled:opacity-50">
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </form>
      </header>

      {user && (
        <section className="flex items-center gap-4 border-b border-[#35383d] pb-7">
          <img src={user.avatar} alt="" className="h-14 w-14 rounded-full bg-[#202326] object-cover" />
          <div className="min-w-0">
            <h2 className="truncate text-xl font-semibold text-white">{userRecord?.displayName || user.globalName || user.username}</h2>
            <p className="mt-1 text-sm text-[#aeb4bb]">Record ID <span className="font-mono">{userRecord?.discordUserId || recordId}</span><span className="mx-2 text-[#626970]">·</span>Signed in as @{user.username}</p>
          </div>
        </section>
      )}

      {!userRecord ? (
        <p className="border-y border-[#35383d] py-14 text-center text-sm text-[#aeb4bb]">No bot user record exists in Firebase for Discord ID {recordId || '—'}.</p>
      ) : (
        <>
          <section className="grid grid-cols-2 gap-x-6 sm:grid-cols-3 lg:grid-cols-4">
            {fields.map(([label, value]) => (
              <div key={label} className="border-b border-[#35383d] py-4">
                <p className="text-xs text-[#858c93]">{label}</p>
                <p className="mt-2 font-mono text-lg font-semibold tabular-nums text-white">
                  {typeof value === 'number' ? value.toLocaleString() : String(value)}
                </p>
              </div>
            ))}
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white">Recent history</h2>
            {!userRecord.history?.length ? (
              <p className="mt-4 text-sm text-[#aeb4bb]">No history entries are stored.</p>
            ) : (
              <div className="mt-4 divide-y divide-[#35383d] border-y border-[#35383d]">
                {userRecord.history.map((entry: Record<string, unknown>, index: number) => (
                  <div key={`${String(entry.time || entry.timestamp || index)}-${index}`} className="flex flex-wrap justify-between gap-2 py-3 text-sm">
                    <span className="text-white">{String(entry.type || entry.action || 'Activity')} {entry.result ? `· ${String(entry.result)}` : ''}</span>
                    <span className="font-mono text-[#aeb4bb]">{entry.amount !== undefined ? String(entry.amount) : entry.bet !== undefined ? String(entry.bet) : ''}</span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
};