'use client';

import React, { useState, useEffect } from 'react';
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Wallet, CheckCircle, ExternalLink, LogOut } from 'lucide-react';

export const WalletButton: React.FC = () => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    // Check if wallet is already connected
    const checkConnected = async () => {
      if (typeof window !== 'undefined' && (window as any).solana?.isPhantom) {
        try {
          const resp = await (window as any).solana.connect({ onlyIfTrusted: true });
          if (resp.publicKey) {
            const pubkeyStr = resp.publicKey.toString();
            setWalletAddress(pubkeyStr);
            fetchBalance(resp.publicKey);
          }
        } catch {
          // not connected yet
        }
      }
    };
    checkConnected();
  }, []);

  const fetchBalance = async (pubkey: PublicKey) => {
    try {
      const conn = new Connection('https://api.devnet.solana.com', 'confirmed');
      const lamports = await conn.getBalance(pubkey);
      setBalance(lamports / LAMPORTS_PER_SOL);
    } catch {
      setBalance(null);
    }
  };

  const handleConnect = async () => {
    if (typeof window === 'undefined') return;

    const solana = (window as any).solana;
    const solflare = (window as any).solflare;

    const provider = solana?.isPhantom ? solana : solflare?.isSolflare ? solflare : solana;

    if (!provider) {
      window.open('https://phantom.app/', '_blank');
      return;
    }

    try {
      setIsConnecting(true);
      const resp = await provider.connect();
      const pubkey = resp.publicKey || provider.publicKey;
      if (pubkey) {
        setWalletAddress(pubkey.toString());
        fetchBalance(pubkey);
      }
    } catch (err) {
      console.error('Wallet connection error:', err);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    if (typeof window !== 'undefined' && (window as any).solana) {
      try {
        (window as any).solana.disconnect();
      } catch {}
    }
    setWalletAddress(null);
    setBalance(null);
  };

  if (walletAddress) {
    return (
      <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-700 rounded-xl px-3 py-1.5 shadow-md">
        <span className="w-2 h-2 rounded-full bg-solana-green animate-pulse" />
        <div className="text-xs">
          <div className="font-mono text-white font-bold">
            {walletAddress.slice(0, 4)}...{walletAddress.slice(-4)}
          </div>
          {balance !== null && (
            <div className="text-[10px] text-neutral-400 font-mono">
              {balance.toFixed(3)} SOL (Devnet)
            </div>
          )}
        </div>
        <button
          onClick={handleDisconnect}
          title="Desconectar Billetera"
          className="p-1 hover:bg-neutral-800 rounded text-neutral-400 hover:text-rose-400 transition"
        >
          <LogOut className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleConnect}
      disabled={isConnecting}
      className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-solana-purple/20 hover:bg-solana-purple/30 border border-solana-purple/40 text-solana-purple hover:text-purple-200 text-xs font-bold transition shadow-sm"
    >
      <Wallet className="w-3.5 h-3.5" />
      <span>{isConnecting ? 'Conectando...' : 'Conectar Billetera'}</span>
    </button>
  );
};
