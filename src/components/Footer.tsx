import React from 'react';
import { GITHUB_REPO_URL } from '../data/siteConfig';

export const Footer: React.FC = () => (
  <footer className="mt-auto border-t border-[#35383d]">
    <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-[#858c93] sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
      <span>uwu-bot dashboard</span>
      <a href={GITHUB_REPO_URL} target="_blank" rel="noreferrer" className="hover:text-white">Source repository</a>
    </div>
  </footer>
);