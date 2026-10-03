'use client';

import React from 'react';
import { Navbar } from '../components/Navbar';
import { HeroBanner } from '../components/HeroBanner';
import { LiveInspector } from '../components/LiveInspector';
import { AttackSimulator } from '../components/AttackSimulator';
import { Footer } from '../components/Footer';
import { Code2 } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function Home() {
  const { t } = useLanguage();

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
            <span>{t.developer.tag}</span>
          </div>

          <h3 className="text-2xl font-black text-white">
            {t.developer.title}
          </h3>

          <p className="text-sm text-neutral-400 leading-relaxed">
            {t.developer.subtitle}
          </p>

          <pre className="p-5 bg-black rounded-2xl border border-neutral-800 text-xs font-mono text-neutral-300 overflow-x-auto leading-relaxed">
{`import { SentinelGuard } from '@solagent/sentinel-core';

// 1. Initialize guard with Solana Devnet / Mainnet RPC
const sentinel = new SentinelGuard({ rpcUrl: 'https://api.devnet.solana.com' });

// 2. Intercept agent transaction before signing
const audit = await sentinel.verifyTransaction(agentTxBase64);

if (audit.riskLevel === 'CRITICAL_BLOCKED') {
  console.error('ALERT: Transaction aborted due to critical drainer vector:', audit.threats);
  return;
}

// 3. Proceed with secure signing
const txSignature = await wallet.sendAndConfirmTransaction(agentTx);`}
          </pre>
        </section>
      </div>

      <Footer />
    </main>
  );
}
