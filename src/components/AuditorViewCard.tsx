import React, { useState } from 'react';
import { SecurityAuditReport } from '../lib/sentinel-core/types';
import { Terminal, Code, Cpu, Database, ShieldCheck, Key } from 'lucide-react';

interface Props {
  report: SecurityAuditReport;
}

export const AuditorViewCard: React.FC<Props> = ({ report }) => {
  const [showRawJson, setShowRawJson] = useState(false);
  const { instructions, accountsInvolved, onChainAttestation, threats } = report;

  return (
    <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl font-mono text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
        <div className="flex items-center gap-2 text-solana-green">
          <Terminal className="w-5 h-5" />
          <span className="font-bold text-sm tracking-wider uppercase">
            Solana AST Transaction Inspector (Auditor Mode)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowRawJson(!showRawJson)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg text-xs transition"
          >
            <Code className="w-3.5 h-3.5" />
            {showRawJson ? 'Ver Vista Estructurada' : 'Ver Raw JSON'}
          </button>
        </div>
      </div>

      {showRawJson ? (
        <pre className="p-4 bg-black rounded-xl border border-neutral-800 text-neutral-300 overflow-x-auto max-h-[500px]">
          {JSON.stringify(report, null, 2)}
        </pre>
      ) : (
        <div className="space-y-6">
          {/* Instructions Pipeline */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-neutral-400 font-bold uppercase tracking-wider">
              <Cpu className="w-4 h-4 text-purple-400" /> Instrucciones Deserializadas ({instructions.length})
            </div>

            <div className="space-y-2.5">
              {instructions.map((ix, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-xl border ${
                    ix.riskTag === 'MALICIOUS'
                      ? 'bg-rose-950/30 border-rose-500/40 text-rose-300'
                      : ix.riskTag === 'SUSPICIOUS'
                      ? 'bg-amber-950/30 border-amber-500/40 text-amber-300'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-bold text-solana-green">
                      #{ix.index} — {ix.programName}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        ix.riskTag === 'MALICIOUS'
                          ? 'bg-rose-500/30 text-rose-300 border border-rose-500/40'
                          : ix.riskTag === 'SUSPICIOUS'
                          ? 'bg-amber-500/30 text-amber-300 border border-amber-500/40'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      {ix.instructionType}
                    </span>
                  </div>

                  <div className="text-[11px] text-neutral-400 space-y-1">
                    <div>
                      <span className="text-neutral-500">Program ID:</span>{' '}
                      <span className="font-mono text-neutral-300">{ix.programId}</span>
                    </div>
                    {Object.keys(ix.params).length > 0 && (
                      <div>
                        <span className="text-neutral-500">Parámetros:</span>{' '}
                        <span className="text-purple-300">{JSON.stringify(ix.params)}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Accounts Involved */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-neutral-400 font-bold uppercase tracking-wider">
              <Key className="w-4 h-4 text-emerald-400" /> Cuentas & Permisos ({accountsInvolved.length})
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {accountsInvolved.map((acc, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-neutral-900/60 border border-neutral-800 flex items-center justify-between text-[11px]"
                >
                  <div className="truncate max-w-[200px] text-neutral-300 font-mono">
                    {acc.pubkey}
                    {acc.label && (
                      <div className="text-[10px] text-solana-green font-sans">{acc.label}</div>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px]">
                    {acc.isSigner && (
                      <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        SIGNER
                      </span>
                    )}
                    {acc.isWritable && (
                      <span className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        WRITABLE
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* On-Chain Attestation */}
          <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/30 text-purple-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 font-bold text-purple-300">
                <Database className="w-4 h-4 text-purple-400" />
                <span>On-Chain Sentinel Attestation (Solana Devnet)</span>
              </div>
              <p className="text-[11px] text-purple-300/80">
                Programa Anchor: <span className="font-mono">{onChainAttestation.registryProgramId}</span>
              </p>
              {onChainAttestation.attestationHash && (
                <p className="text-[11px] text-purple-300/80 truncate max-w-sm">
                  Hash de Verificación: <span className="font-mono">{onChainAttestation.attestationHash}</span>
                </p>
              )}
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-[11px] font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              {onChainAttestation.verifiedInRegistry ? 'Atestado On-Chain' : 'Evaluación Local'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
