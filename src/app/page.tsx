'use client';

import React from 'react';
import { Navbar } from '../components/Navbar';
import { HeroBanner } from '../components/HeroBanner';
import { LiveInspector } from '../components/LiveInspector';
import { AttackSimulator } from '../components/AttackSimulator';
import { Footer } from '../components/Footer';
import { ShieldCheck, Cpu, Database, Code2 } from 'lucide-react';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#08090d] flex flex-col justify-between selection:bg-solana-green selection:text-black">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16 flex-1 w-full">
        {/* Hero Section */}
        <HeroBanner />

        {/* Live Transaction & Blink Inspector */}
        <LiveInspector />

        {/* Interactive Agent Attack Simulation */}
        <AttackSimulator />

        {/* Architecture & Integration Blueprint */}
        <section className="bg-neutral-950 border border-neutral-800 rounded-3xl p-6 sm:p-10 space-y-6 max-w-5xl mx-auto">
          <div className="flex items-center gap-2 text-solana-green font-bold text-xs uppercase tracking-wider">
            <Code2 className="w-4 h-4" />
            <span>Integración Rápida para Desarrolladores de Agentes (SDK / API)</span>
          </div>

          <h3 className="text-2xl font-black text-white">
            Diseñado para Integrarse con el Solana Agent Kit y Eliza
          </h3>

          <p className="text-sm text-neutral-400 leading-relaxed">
            Protege tus agentes autónomos en producción añadiendo el middleware de Sentinel antes de invocar la firma en el RPC:
          </p>

          <pre className="p-5 bg-black rounded-2xl border border-neutral-800 text-xs font-mono text-neutral-300 overflow-x-auto leading-relaxed">
{`import { SentinelGuard } from '@solagent/sentinel-core';

// 1. Inicializar el guardián con RPC de Solana Devnet / Mainnet
const sentinel = new SentinelGuard({ rpcUrl: 'https://api.devnet.solana.com' });

// 2. Interceptar la transacción del agente antes de firmar
const audit = await sentinel.verifyTransaction(agentTxBase64);

if (audit.riskLevel === 'CRITICAL_BLOCKED') {
  console.error('ALERTA: Se abortó la transacción por vector de drainer:', audit.threats);
  return;
}

// 3. Proceder con la firma segura
const txSignature = await wallet.sendAndConfirmTransaction(agentTx);`}
          </pre>
        </section>
      </div>

      <Footer />
    </main>
  );
}
