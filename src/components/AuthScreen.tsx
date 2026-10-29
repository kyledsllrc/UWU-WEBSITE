import React from 'react';
import { BOT_AVATAR_PATH, BOT_NAME } from '../data/siteConfig';
import { useBotDashboard } from '../context/BotDashboardContext';
import { LogIn } from 'lucide-react';

export const AuthScreen: React.FC = () => {
  const { isAuthLoading, authMessage } = useBotDashboard();
  const authError = new URLSearchParams(window.location.search).has('authError');

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#171a1c] px-4 py-12 text-[#d9e0e2]">
      <section className="w-full max-w-md border-y border-[#35383d] py-10 text-center">
        <img src={BOT_AVATAR_PATH} alt="" className="mx-auto h-16 w-16 rounded-lg object-cover" />
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-[#73c8ad]">{BOT_NAME}</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Bot administration</h1>
        <p className="mt-3 text-sm text-[#aeb4bb]">Sign in with Discord to access your bot's user and server data.</p>

        {authMessage && <p role="alert" className="mt-6 rounded-md border border-[#68484a] bg-[#302426] px-3 py-2.5 text-sm text-[#ffb9b9]">{authMessage}</p>}
        {!authMessage && authError && <p role="alert" className="mt-6 rounded-md border border-[#68484a] bg-[#302426] px-3 py-2.5 text-sm text-[#ffb9b9]">Discord authorization failed. Please try again.</p>}

        <a
          href="/api/auth/discord"
          aria-disabled={isAuthLoading}
          className={`mt-7 inline-flex items-center justify-center gap-2 rounded-md bg-[#5865f2] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#4752c4] ${isAuthLoading ? 'pointer-events-none opacity-60' : ''}`}
        >
          <LogIn className="h-4 w-4" /> Continue with Discord
        </a>
        <p className="mt-5 text-xs text-[#858c93]">Discord authorizes access to your identity and servers you manage.</p>
      </section>
    </main>
  );
};