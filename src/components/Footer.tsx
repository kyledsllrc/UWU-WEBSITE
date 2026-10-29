import React from 'react';
import { useBotDashboard } from '../context/BotDashboardContext';
import { Shield, Sparkles, Database, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setCurrentTab } = useBotDashboard();

  return (
    <footer className="w-full bg-[#1e1f22] border-t border-[#2b2d31] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand & info */}
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="text-sm font-bold text-white tracking-tight">uwu-bot Dashboard</span>
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-[#EB459E]/20 text-[#EB459E] border border-[#EB459E]/30 uppercase">
                v2.4
              </span>
            </div>
            <p className="text-xs text-[#949BA4]">
              Custom Discord community bot by <strong>@kyledsllrc</strong>. Integrated with NextAuth, Tailwind CSS, TypeScript, and Firebase Realtime Database.
            </p>
          </div>

          {/* Clean text nav links */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-[#949BA4]">
            <button
              onClick={() => setCurrentTab('landing')}
              className="hover:text-[#DBDEE1] transition-colors"
            >
              Overview
            </button>
            <button
              onClick={() => setCurrentTab('dashboard')}
              className="hover:text-[#DBDEE1] transition-colors"
            >
              User Stats
            </button>
            <button
              onClick={() => setCurrentTab('servers')}
              className="hover:text-[#DBDEE1] transition-colors"
            >
              Server Panel
            </button>
            <button
              onClick={() => setCurrentTab('leaderboard')}
              className="hover:text-[#DBDEE1] transition-colors"
            >
              Leaderboards
            </button>
            <button
              onClick={() => setCurrentTab('setup')}
              className="hover:text-[#DBDEE1] transition-colors text-[#5865F2]"
            >
              Firebase & API Config
            </button>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-[#2b2d31] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#949BA4]">
          <div>
            © {new Date().getFullYear()} uwu-bot by Kyle (kyledsllrc). Built with Firebase Realtime Database & Discord OAuth2.
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/kyledsllrc/uwu-bot"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white flex items-center gap-1 text-[#EB459E]"
            >
              <span>GitHub: kyledsllrc/uwu-bot</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://firebase.google.com/docs/database"
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#DBDEE1] flex items-center gap-1"
            >
              <span>Firebase Database Docs</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
