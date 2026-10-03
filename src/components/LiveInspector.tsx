import React, { useState } from 'react';
import { DEMO_TEST_CASES, TestCase } from '../lib/sentinel-core/mockTransactions';
import { SecurityAuditReport } from '../lib/sentinel-core/types';
import { SecurityShieldBadge } from './SecurityShieldBadge';
import { UserViewCard } from './UserViewCard';
import { AuditorViewCard } from './AuditorViewCard';
import { Search, ShieldAlert, CheckCircle, AlertTriangle, Eye, Terminal } from 'lucide-react';

export const LiveInspector: React.FC = () => {
  const [selectedCase, setSelectedCase] = useState<TestCase>(DEMO_TEST_CASES[0]);
  const [customInput, setCustomInput] = useState('');
  const [activeTab, setActiveTab] = useState<'USER' | 'AUDITOR'>('USER');
  const [isScanning, setIsScanning] = useState(false);

  const handleSelectCase = (tc: TestCase) => {
    setIsScanning(true);
    setTimeout(() => {
      setSelectedCase(tc);
      setCustomInput(tc.sampleInput);
      setIsScanning(false);
    }, 250);
  };

  const handleCustomScan = () => {
    if (!customInput.trim()) return;
    setIsScanning(true);
    setTimeout(() => {
      // If contains fake or claim, trigger drainer
      if (customInput.toLowerCase().includes('airdrop') || customInput.toLowerCase().includes('claim') || customInput.toLowerCase().includes('fake')) {
        setSelectedCase(DEMO_TEST_CASES[1]);
      } else if (customInput.toLowerCase().includes('approve') || customInput.toLowerCase().includes('yield')) {
        setSelectedCase(DEMO_TEST_CASES[2]);
      } else {
        setSelectedCase(DEMO_TEST_CASES[0]);
      }
      setIsScanning(false);
    }, 350);
  };

  return (
    <section className="space-y-8 max-w-5xl mx-auto">
      {/* Test Scenarios Selector */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
            Casos de Prueba en Vivo (Selecciona para Inspeccionar)
          </span>
          <span className="text-xs text-solana-green font-mono">
            3 Escenarios Pre-configurados
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {DEMO_TEST_CASES.map(tc => {
            const isSelected = selectedCase.id === tc.id;
            return (
              <button
                key={tc.id}
                onClick={() => handleSelectCase(tc)}
                className={`p-4 rounded-xl border text-left transition-all ${
                  isSelected
                    ? tc.report.riskLevel === 'CRITICAL_BLOCKED'
                      ? 'bg-rose-950/40 border-rose-500 shadow-lg shadow-rose-950/50'
                      : tc.report.riskLevel === 'WARNING'
                      ? 'bg-amber-950/40 border-amber-500 shadow-lg shadow-amber-950/50'
                      : 'bg-emerald-950/40 border-emerald-500 shadow-lg shadow-emerald-950/50'
                    : 'bg-neutral-900/60 border-neutral-800 hover:border-neutral-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                      tc.report.riskLevel === 'CRITICAL_BLOCKED'
                        ? 'bg-rose-500/20 text-rose-300'
                        : tc.report.riskLevel === 'WARNING'
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-emerald-500/20 text-emerald-300'
                    }`}
                  >
                    Score {tc.report.score}/100
                  </span>
                  {tc.report.riskLevel === 'CRITICAL_BLOCKED' && <ShieldAlert className="w-4 h-4 text-rose-400" />}
                  {tc.report.riskLevel === 'WARNING' && <AlertTriangle className="w-4 h-4 text-amber-400" />}
                  {tc.report.riskLevel === 'SAFE' && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                </div>
                <div className="text-sm font-bold text-white mb-1">
                  {tc.name}
                </div>
                <p className="text-xs text-neutral-400 line-clamp-2">
                  {tc.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Input Box for Custom Blink URL or Tx */}
      <div className="p-4 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-3 shadow-lg">
        <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">
          Inspeccionar Blink URL o Transacción Solana (Base64)
        </label>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={customInput}
              onChange={e => setCustomInput(e.target.value)}
              placeholder="Pega un enlace de Blink (dial.to / solana-action:) o Payload Base64..."
              className="w-full bg-black/60 border border-neutral-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-solana-green font-mono"
            />
          </div>
          <button
            onClick={handleCustomScan}
            disabled={isScanning}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-solana-green to-teal-400 hover:opacity-90 text-black font-extrabold text-xs tracking-wider uppercase transition disabled:opacity-50"
          >
            {isScanning ? 'Analizando AST...' : 'Escanear Ahora'}
          </button>
        </div>
      </div>

      {/* View Toggle (360 Perspective switch) */}
      <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
        <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
          Resultado del Análisis de Seguridad
        </div>

        <div className="inline-flex p-1 rounded-xl bg-neutral-900 border border-neutral-800">
          <button
            onClick={() => setActiveTab('USER')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'USER'
                ? 'bg-neutral-800 text-white shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-solana-green" />
            <span>Modo Usuario Común</span>
          </button>
          <button
            onClick={() => setActiveTab('AUDITOR')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
              activeTab === 'AUDITOR'
                ? 'bg-neutral-800 text-white shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-purple-400" />
            <span>Modo Auditor / Ingeniero</span>
          </button>
        </div>
      </div>

      {/* Results Container */}
      {isScanning ? (
        <div className="p-16 rounded-2xl bg-neutral-900/40 border border-neutral-800 text-center space-y-3">
          <div className="w-8 h-8 rounded-full border-2 border-solana-green border-t-transparent animate-spin mx-auto" />
          <p className="text-xs font-mono text-neutral-400">
            Deconstruyendo AST de instrucciones y simulando estado en Solana Devnet...
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Main Shield Badge */}
          <SecurityShieldBadge
            score={selectedCase.report.score}
            riskLevel={selectedCase.report.riskLevel}
            badgeText={selectedCase.report.humanSummary.safeguardBadge}
          />

          {/* Dual Perspective Content */}
          {activeTab === 'USER' ? (
            <UserViewCard report={selectedCase.report} />
          ) : (
            <AuditorViewCard report={selectedCase.report} />
          )}
        </div>
      )}
    </section>
  );
};
