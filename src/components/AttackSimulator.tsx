'use client';

import React, { useState } from 'react';
import { Bot, ArrowRight, ShieldCheck, ShieldAlert, Cpu, Check, X } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export const AttackSimulator: React.FC = () => {
  const { t } = useLanguage();
  const [activeStep, setActiveStep] = useState<number>(0);
  const [scenario, setScenario] = useState<'SAFE' | 'ATTACK'>('ATTACK');
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const runSimulation = (selectedScenario: 'SAFE' | 'ATTACK') => {
    setScenario(selectedScenario);
    setIsRunning(true);
    setActiveStep(1);

    setTimeout(() => {
      setActiveStep(2);
      setTimeout(() => {
        setActiveStep(3);
        setIsRunning(false);
      }, 700);
    }, 700);
  };

  return (
    <div className="bg-neutral-900/50 border border-neutral-800 rounded-3xl p-6 sm:p-10 space-y-8 max-w-5xl mx-auto shadow-2xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold mb-2">
            <Bot className="w-3.5 h-3.5" />
            <span>{t.simulator.tag}</span>
          </div>
          <h3 className="text-2xl font-black text-white">
            {t.simulator.title}
          </h3>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            {t.simulator.subtitle}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => runSimulation('SAFE')}
            disabled={isRunning}
            className="px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition disabled:opacity-50"
          >
            {t.simulator.btnSafe}
          </button>
          <button
            onClick={() => runSimulation('ATTACK')}
            disabled={isRunning}
            className="px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 text-xs font-bold transition disabled:opacity-50"
          >
            {t.simulator.btnAttack}
          </button>
        </div>
      </div>

      {/* 3-Stage Interactive Pipeline */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Step 1: Origin */}
        <div
          className={`p-5 rounded-2xl border transition-all ${
            activeStep >= 1 ? 'bg-neutral-800/80 border-neutral-700' : 'bg-neutral-900/40 border-neutral-800 opacity-60'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono font-bold text-neutral-400">{t.simulator.step1Title}</span>
            <Bot className="w-5 h-5 text-solana-purple" />
          </div>
          <h4 className="text-sm font-bold text-white mb-1">
            {scenario === 'SAFE' ? t.simulator.step1Safe : t.simulator.step1Attack}
          </h4>
          <p className="text-xs text-neutral-400 leading-relaxed">
            {scenario === 'SAFE' ? t.simulator.step1SafeDesc : t.simulator.step1AttackDesc}
          </p>
        </div>

        {/* Step 2: Sentinel Interception */}
        <div
          className={`p-5 rounded-2xl border transition-all ${
            activeStep >= 2
              ? scenario === 'SAFE'
                ? 'bg-emerald-950/30 border-emerald-500/50'
                : 'bg-rose-950/30 border-rose-500/50'
              : 'bg-neutral-900/40 border-neutral-800 opacity-60'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono font-bold text-neutral-400">PASO 2</span>
            <Cpu className="w-5 h-5 text-solana-green" />
          </div>
          <h4 className="text-sm font-bold text-white mb-1">
            {t.simulator.step2Title}
          </h4>
          <p className="text-xs text-neutral-400 leading-relaxed">
            {t.simulator.step2Desc}
          </p>
        </div>

        {/* Step 3: Verdict */}
        <div
          className={`p-5 rounded-2xl border transition-all ${
            activeStep >= 3
              ? scenario === 'SAFE'
                ? 'bg-emerald-950/50 border-emerald-500'
                : 'bg-rose-950/50 border-rose-500'
              : 'bg-neutral-900/40 border-neutral-800 opacity-60'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono font-bold text-neutral-400">PASO 3</span>
            {scenario === 'SAFE' ? (
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            ) : (
              <ShieldAlert className="w-5 h-5 text-rose-500" />
            )}
          </div>
          <h4 className="text-sm font-bold text-white mb-1">
            {scenario === 'SAFE' ? t.simulator.step3TitleSafe : t.simulator.step3TitleAttack}
          </h4>
          <p className="text-xs text-neutral-400 leading-relaxed">
            {scenario === 'SAFE' ? t.simulator.step3SafeDesc : t.simulator.step3AttackDesc}
          </p>
        </div>
      </div>
    </div>
  );
};
