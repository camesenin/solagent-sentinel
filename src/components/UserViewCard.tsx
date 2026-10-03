import React from 'react';
import { SecurityAuditReport } from '../lib/sentinel-core/types';
import { BalanceSimulationWidget } from './BalanceSimulationWidget';
import { CheckCircle2, AlertOctagon, HelpCircle, ShieldAlert } from 'lucide-react';

interface Props {
  report: SecurityAuditReport;
}

export const UserViewCard: React.FC<Props> = ({ report }) => {
  const { humanSummary, threats, balanceChanges, riskLevel } = report;

  return (
    <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl backdrop-blur-sm">
      {/* Header Info */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          {riskLevel === 'SAFE' && <CheckCircle2 className="w-6 h-6 text-emerald-400" />}
          {riskLevel === 'WARNING' && <AlertOctagon className="w-6 h-6 text-amber-400" />}
          {riskLevel === 'CRITICAL_BLOCKED' && <ShieldAlert className="w-6 h-6 text-rose-500" />}
          <h3 className="text-xl font-bold text-white tracking-tight">
            {humanSummary.actionHeadline}
          </h3>
        </div>
        <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
          {humanSummary.narrative}
        </p>
      </div>

      {/* Balance Simulation */}
      <div className="pt-2 border-t border-neutral-800">
        <BalanceSimulationWidget changes={balanceChanges} />
      </div>

      {/* Threats in Simple Words */}
      {threats.length > 0 && (
        <div className="pt-4 border-t border-neutral-800 space-y-3">
          <div className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4" /> Alertas de Seguridad Detectadas
          </div>
          <div className="space-y-2.5">
            {threats.map((t, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30 text-rose-200 text-sm space-y-1.5"
              >
                <div className="font-bold flex items-center gap-2 text-rose-300">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                  {t.title}
                </div>
                <div className="text-xs text-rose-200/90 leading-relaxed">
                  {t.description}
                </div>
                <div className="mt-2 text-xs font-semibold text-rose-400/90 bg-black/40 p-2 rounded-lg border border-rose-500/20">
                  💡 Qué debes hacer: {t.mitigationRecommendation}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trust & Explanation footer */}
      <div className="pt-4 border-t border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
        <div className="flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-neutral-500" />
          <span>Protegido por el estándar de verificación SolAgent Sentinel v1.0</span>
        </div>
        <div className="font-mono text-neutral-500">
          Ref: {report.signatureOrHash.slice(0, 12)}...
        </div>
      </div>
    </div>
  );
};
