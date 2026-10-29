import React, { useEffect, useState } from 'react';
import { useBotDashboard } from '../context/BotDashboardContext';
import { Database, RefreshCw, Save } from 'lucide-react';

export const FirebaseAndApiSetup: React.FC = () => {
  const { isFirebaseConnected, refreshFromFirebase, economySettings, cryptoMarket, gameOdds, addToast } = useBotDashboard();
  const [checking, setChecking] = useState(false);
  const [saving, setSaving] = useState('');
  const [economyDraft, setEconomyDraft] = useState({ jackpot: '', claim_reward: '', max_bet_percent: '', bet_cap_enabled: false });
  const [oddsDraft, setOddsDraft] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!economySettings) return;
    setEconomyDraft({
      jackpot: String(economySettings.jackpot ?? ''),
      claim_reward: String(economySettings.claim_reward ?? ''),
      max_bet_percent: String(economySettings.max_bet_percent ?? ''),
      bet_cap_enabled: Boolean(economySettings.bet_cap_enabled),
    });
  }, [economySettings]);

  useEffect(() => {
    if (gameOdds) setOddsDraft(Object.fromEntries(Object.entries(gameOdds).map(([game, chance]) => [game, String(chance)])));
  }, [gameOdds]);

  const refresh = async () => {
    setChecking(true);
    await refreshFromFirebase();
    setChecking(false);
  };

  const save = async (key: string, route: string, payload: Record<string, unknown>) => {
    setSaving(key);
    try {
      const response = await fetch(route, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Unable to save settings.');
      await refreshFromFirebase();
      addToast('Settings saved to Firebase.', 'success');
    } catch (error) {
      addToast(error instanceof Error ? error.message : 'Unable to save settings.', 'error');
    } finally {
      setSaving('');
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
      <header className="flex items-end justify-between gap-4 border-b border-[#35383d] pb-7">
        <div>
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#73c8ad]"><Database className="h-4 w-4" /> Firebase Realtime Database</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Bot data</h1>
        </div>
        <button onClick={refresh} disabled={checking} title="Check Firebase connection" className="rounded-md border border-[#45494f] p-2.5 text-white hover:bg-[#202326] disabled:opacity-50">
          <RefreshCw className={`h-4 w-4 ${checking ? 'animate-spin' : ''}`} />
        </button>
      </header>

      <div className={`flex items-center gap-2 border-b border-[#35383d] pb-5 text-sm ${isFirebaseConnected ? 'text-[#9cddc7]' : 'text-[#efd18b]'}`}>
        <span className={`h-2 w-2 rounded-full ${isFirebaseConnected ? 'bg-[#73c8ad]' : 'bg-[#e2a36d]'}`} />
        {isFirebaseConnected ? 'Database connected' : 'Database unavailable'}
      </div>

      <div className="grid gap-10 lg:grid-cols-2">
        <section>
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold text-white">Economy settings</h2>
            {economySettings && <button onClick={() => void save('economy', '/api/bot/economy-settings', {
              jackpot: Number(economyDraft.jackpot),
              claim_reward: Number(economyDraft.claim_reward),
              max_bet_percent: Number(economyDraft.max_bet_percent),
              bet_cap_enabled: economyDraft.bet_cap_enabled,
            })} disabled={Boolean(saving)} className="inline-flex items-center gap-2 rounded-md bg-[#73c8ad] px-3 py-2 text-xs font-semibold text-[#10231e] disabled:opacity-50"><Save className="h-3.5 w-3.5" />{saving === 'economy' ? 'Saving' : 'Save'}</button>}
          </div>
          {economySettings ? (
            <div className="mt-4 grid gap-4 border-y border-[#35383d] py-4 sm:grid-cols-2">
              <NumberField label="Jackpot" value={economyDraft.jackpot} onChange={(value) => setEconomyDraft((draft) => ({ ...draft, jackpot: value }))} min="0" step="1" />
              <NumberField label="Claim reward" value={economyDraft.claim_reward} onChange={(value) => setEconomyDraft((draft) => ({ ...draft, claim_reward: value }))} min="0" step="1" />
              <NumberField label="Maximum bet (%)" value={economyDraft.max_bet_percent} onChange={(value) => setEconomyDraft((draft) => ({ ...draft, max_bet_percent: value }))} min="0" max="100" step="0.1" />
              <label className="flex items-center gap-3 self-end py-2 text-sm text-[#d9e0e2]">
                <input type="checkbox" checked={economyDraft.bet_cap_enabled} onChange={(event) => setEconomyDraft((draft) => ({ ...draft, bet_cap_enabled: event.target.checked }))} className="h-4 w-4 accent-[#73c8ad]" />
                Bet cap enabled
              </label>
            </div>
          ) : <p className="mt-4 border-y border-[#35383d] py-5 text-sm text-[#858c93]">No economy settings record is available.</p>}
        </section>

        <section>
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold text-white">Game win chances (%)</h2>
            {gameOdds && <button onClick={() => void save('odds', '/api/bot/game-odds', Object.fromEntries(Object.entries(oddsDraft).map(([game, value]) => [game, Number(value)])))} disabled={Boolean(saving)} className="inline-flex items-center gap-2 rounded-md bg-[#73c8ad] px-3 py-2 text-xs font-semibold text-[#10231e] disabled:opacity-50"><Save className="h-3.5 w-3.5" />{saving === 'odds' ? 'Saving' : 'Save'}</button>}
          </div>
          {gameOdds ? (
            <div className="mt-4 grid gap-x-4 border-y border-[#35383d] py-3 sm:grid-cols-2">
              {Object.entries(oddsDraft).map(([game, value]) => <NumberField key={game} label={game} value={value} onChange={(next) => setOddsDraft((draft) => ({ ...draft, [game]: next }))} min="0" max="100" step="0.1" />)}
            </div>
          ) : <p className="mt-4 border-y border-[#35383d] py-5 text-sm text-[#858c93]">No game odds record is available.</p>}
        </section>

        <section className="lg:col-span-2">
          <h2 className="text-sm font-semibold text-white">Crypto market</h2>
          {cryptoMarket ? (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-y border-[#35383d] py-4">
              <div><p className="text-sm text-white">Market status</p><p className="mt-1 text-xs text-[#858c93]">{cryptoMarket.paused ? 'Paused' : 'Live'}</p></div>
              <button onClick={() => void save('crypto', '/api/bot/crypto-market', { paused: !cryptoMarket.paused })} disabled={Boolean(saving)} className="rounded-md border border-[#45494f] px-4 py-2 text-sm text-white hover:bg-[#202326] disabled:opacity-50">{saving === 'crypto' ? 'Saving' : cryptoMarket.paused ? 'Resume market' : 'Pause market'}</button>
            </div>
          ) : <p className="mt-4 border-y border-[#35383d] py-5 text-sm text-[#858c93]">No crypto market record is available.</p>}
        </section>
      </div>
    </div>
  );
};

const NumberField: React.FC<{ label: string; value: string; onChange: (value: string) => void; min: string; max?: string; step: string }> = ({ label, value, onChange, min, max, step }) => (
  <label className="block py-1 text-xs capitalize text-[#aeb4bb]">
    {label.replaceAll('_', ' ')}
    <input type="number" value={value} onChange={(event) => onChange(event.target.value)} min={min} max={max} step={step} className="mt-1.5 w-full rounded-md border border-[#45494f] bg-[#202326] px-3 py-2 text-sm text-white focus:border-[#73c8ad] focus:outline-none" />
  </label>
);