import React from 'react';
import { Shield, Sparkles, ExternalLink, Github } from 'lucide-react';

export const Navbar: React.FC = () => {
  return (
    <header className="border-b border-neutral-800/80 bg-black/60 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-solana-purple to-solana-green shadow-lg shadow-emerald-500/10">
            <Shield className="w-5 h-5 text-black" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black tracking-tight text-white">
                SolAgent <span className="text-solana-green">Sentinel</span>
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-solana-purple/20 text-solana-purple border border-solana-purple/30">
                v1.0
              </span>
            </div>
            <p className="text-[10px] text-neutral-400 -mt-0.5">
              AI Agent & Blinks Security Protocol
            </p>
          </div>
        </div>

        {/* Badges & Links */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-xs text-neutral-300">
            <span className="w-2 h-2 rounded-full bg-solana-green animate-pulse" />
            <span className="font-mono text-[11px]">Solana Devnet Live</span>
          </div>

          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 text-xs text-amber-300 font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Colosseum Fall 2026</span>
          </div>

          <a
            href="https://github.com/camesenin/solagent-sentinel"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold transition border border-neutral-700"
          >
            <Github className="w-4 h-4" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </div>
    </header>
  );
};
