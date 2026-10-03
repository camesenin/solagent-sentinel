'use client';

import React from 'react';
import { ShieldCheck, Zap, Lock, Cpu } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export const HeroBanner: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="text-center py-10 sm:py-14 space-y-6 max-w-4xl mx-auto">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neutral-900 border border-neutral-700 text-xs text-neutral-300 shadow-md">
        <span className="w-2 h-2 rounded-full bg-solana-green" />
        <span>{t.hero.pill}</span>
      </div>

      <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
        {t.hero.titleStart} <br />
        <span className="bg-gradient-to-r from-solana-green via-teal-300 to-solana-purple bg-clip-text text-transparent">
          {t.hero.titleHighlight}
        </span>
      </h1>

      <p className="text-sm sm:text-base text-neutral-400 max-w-2xl mx-auto leading-relaxed">
        {t.hero.subtitle}
      </p>

      {/* Feature Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 text-xs font-semibold text-neutral-300">
        <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800 flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-solana-green" />
          <span>Anti-Drainer AST</span>
        </div>
        <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800 flex items-center justify-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          <span>Blinks Validator</span>
        </div>
        <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800 flex items-center justify-center gap-2">
          <Cpu className="w-4 h-4 text-purple-400" />
          <span>AI Agent Guard API</span>
        </div>
        <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-800 flex items-center justify-center gap-2">
          <Lock className="w-4 h-4 text-blue-400" />
          <span>Anchor Devnet Registry</span>
        </div>
      </div>
    </div>
  );
};
