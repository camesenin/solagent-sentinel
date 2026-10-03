import React from 'react';
import { Shield, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-neutral-800/80 bg-black/40 mt-20 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-solana-green" />
          <span className="font-bold text-white">SolAgent Sentinel</span>
          <span>— Desarrollado para la Hackathon Colosseum Fall 2026</span>
        </div>

        <div className="flex items-center gap-6">
          <a
            href="https://github.com/camesenin/solagent-sentinel"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-solana-green transition"
          >
            GitHub Repository
          </a>
          <a
            href="https://colosseum.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-amber-400 transition flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Colosseum Platform</span>
          </a>
        </div>
      </div>
    </footer>
  );
};
