import React from 'react';
import { RiskLevel } from '../lib/sentinel-core/types';
import { ShieldCheck, AlertTriangle, ShieldAlert } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface Props {
  score: number;
  riskLevel: RiskLevel;
  badgeText: string;
}

export const SecurityShieldBadge: React.FC<Props> = ({ score, riskLevel, badgeText }) => {
  const { language } = useLanguage();
  const isEn = language === 'en';

  const getColors = () => {
    switch (riskLevel) {
      case 'SAFE':
        return {
          bg: 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400',
          badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
          icon: ShieldCheck,
          scoreColor: 'text-emerald-400',
          ringColor: 'stroke-emerald-400',
        };
      case 'WARNING':
        return {
          bg: 'bg-amber-950/40 border-amber-500/40 text-amber-400',
          badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
          icon: AlertTriangle,
          scoreColor: 'text-amber-400',
          ringColor: 'stroke-amber-400',
        };
      case 'CRITICAL_BLOCKED':
        return {
          bg: 'bg-rose-950/40 border-rose-500/50 text-rose-400',
          badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
          icon: ShieldAlert,
          scoreColor: 'text-rose-400',
          ringColor: 'stroke-rose-500',
        };
    }
  };

  const c = getColors();
  const Icon = c.icon;

  const titles = {
    SAFE: isEn ? 'Safe & Verified Transaction' : 'Transacción Segura y Confiable',
    WARNING: isEn ? 'Warning: Anomalous Parameters' : 'Advertencia: Parámetros Anómalos',
    CRITICAL_BLOCKED: isEn ? 'Attack Blocked! Malicious Vector' : '¡Ataque Bloqueado! Vector Malicioso',
  };

  const subtitle = isEn
    ? 'Evaluated in real-time by SolAgent Sentinel deterministic rules engine.'
    : 'Evaluado en tiempo real por el motor de inferencia y reglas deterministas de SolAgent Sentinel.';

  const scoreLabel = isEn ? 'Sentinel Score' : 'Score Sentinel';

  return (
    <div className={`p-6 rounded-2xl border ${c.bg} backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-6 transition-all duration-300`}>
      <div className="flex items-center gap-4">
        <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 shadow-inner">
          <Icon className="w-10 h-10 animate-pulse" />
        </div>
        <div>
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase border mb-1.5 ${c.badgeBg}`}>
            {badgeText}
          </span>
          <h2 className="text-2xl font-extrabold tracking-tight text-white">
            {titles[riskLevel]}
          </h2>
          <p className="text-xs text-neutral-300 mt-0.5">
            {subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 bg-black/50 px-6 py-4 rounded-xl border border-white/10 shadow-lg min-w-[140px] justify-center">
        <div className="text-center">
          <div className="text-xs font-semibold text-neutral-400 uppercase tracking-widest">
            {scoreLabel}
          </div>
          <div className={`text-4xl font-black ${c.scoreColor}`}>
            {score}<span className="text-lg text-neutral-500 font-normal">/100</span>
          </div>
        </div>
      </div>
    </div>
  );
};
