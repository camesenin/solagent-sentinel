'use client';

import React from 'react';
import { BalanceChange } from '../lib/sentinel-core/types';
import { ArrowDownRight, ArrowUpRight, Coins } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface Props {
  changes: BalanceChange[];
}

export const BalanceSimulationWidget: React.FC<Props> = ({ changes }) => {
  const { t } = useLanguage();

  if (!changes || changes.length === 0) {
    return (
      <div className="bg-black/30 border border-white/10 rounded-xl p-4 text-center text-sm text-neutral-400">
        {t.balanceWidget.noChange}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs font-bold text-neutral-400 uppercase tracking-wider">
        <span>{t.balanceWidget.title}</span>
        <span className="flex items-center gap-1 text-emerald-400">
          <Coins className="w-3.5 h-3.5" /> {t.balanceWidget.badge}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {changes.map((c, idx) => {
          const isNegative = c.change < 0;
          return (
            <div
              key={idx}
              className={`p-4 rounded-xl border flex items-center justify-between ${
                isNegative
                  ? 'bg-rose-950/20 border-rose-500/20 text-rose-300'
                  : 'bg-emerald-950/20 border-emerald-500/20 text-emerald-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg ${
                    isNegative ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'
                  }`}
                >
                  {isNegative ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                </div>
                <div>
                  <div className="text-xs font-semibold text-neutral-400">
                    {isNegative ? t.balanceWidget.gives : t.balanceWidget.receives}
                  </div>
                  <div className="text-base font-extrabold text-white">
                    {c.symbol}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className={`text-lg font-black ${isNegative ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {c.change > 0 ? `+${c.change}` : c.change}
                </div>
                {c.changeUsd !== undefined && (
                  <div className="text-[11px] font-mono text-neutral-500">
                    ≈ ${Math.abs(c.changeUsd).toFixed(2)} USD
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
