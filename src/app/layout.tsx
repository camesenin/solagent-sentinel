import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SolAgent Sentinel — Solana AI Agent & Blinks Security Protocol',
  description: 'Runtime transaction verification and drainer protection protocol for autonomous AI agents and Solana Blinks.',
};

import { LanguageProvider } from '@/lib/i18n/LanguageContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#08090d] text-neutral-100 antialiased selection:bg-solana-green selection:text-black">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
