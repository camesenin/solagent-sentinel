export type RiskLevel = 'SAFE' | 'WARNING' | 'CRITICAL_BLOCKED';

export interface ThreatDetection {
  id: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  description: string;
  technicalDetails: string;
  mitigationRecommendation: string;
  programId?: string;
  instructionIndex?: number;
}

export interface BalanceChange {
  asset: string;
  symbol: string;
  change: number; // positive = incoming, negative = outgoing
  changeUsd?: number;
  decimals: number;
  isToken: boolean;
  mint?: string;
}

export interface DecodedInstruction {
  index: number;
  programName: string;
  programId: string;
  instructionType: string;
  isKnownProgram: boolean;
  isSignerAuthorized: boolean;
  params: Record<string, any>;
  riskTag?: 'SAFE' | 'SUSPICIOUS' | 'MALICIOUS';
}

export interface SecurityAuditReport {
  signatureOrHash: string;
  score: number; // 0 (Extremely dangerous) to 100 (Completely safe)
  riskLevel: RiskLevel;
  humanSummary: {
    actionHeadline: string;
    narrative: string;
    riskVerdict: string;
    safeguardBadge: string;
  };
  threats: ThreatDetection[];
  balanceChanges: BalanceChange[];
  instructions: DecodedInstruction[];
  accountsInvolved: {
    pubkey: string;
    isSigner: boolean;
    isWritable: boolean;
    label?: string;
  }[];
  onChainAttestation: {
    verifiedInRegistry: boolean;
    registryProgramId: string;
    attestationHash?: string;
    timestamp: number;
  };
}
