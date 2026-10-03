import { RiskLevel, ThreatDetection, DecodedInstruction, BalanceChange } from './types';

export function calculateRiskScore(
  threats: ThreatDetection[],
  instructions: DecodedInstruction[],
  balanceChanges: BalanceChange[]
): { score: number; riskLevel: RiskLevel; safeguardBadge: string } {
  let score = 100;

  for (const t of threats) {
    switch (t.severity) {
      case 'CRITICAL':
        score -= 75;
        break;
      case 'HIGH':
        score -= 35;
        break;
      case 'MEDIUM':
        score -= 15;
        break;
      case 'LOW':
        score -= 5;
        break;
    }
  }

  // Penalty if any instruction touches completely unknown unverified program
  const unknownCount = instructions.filter(i => !i.isKnownProgram).length;
  if (unknownCount > 0) {
    score -= unknownCount * 8;
  }

  // Ensure score stays bounded [0, 100]
  score = Math.max(0, Math.min(100, score));

  let riskLevel: RiskLevel = 'SAFE';
  let safeguardBadge = '🛡️ ESCUDO ACTIVO: TRANSACCIÓN SEGURA';

  if (score < 50) {
    riskLevel = 'CRITICAL_BLOCKED';
    safeguardBadge = '🚨 BLOQUEO CRÍTICO: PATRÓN DE DRAINER DETECTADO';
  } else if (score < 80) {
    riskLevel = 'WARNING';
    safeguardBadge = '⚠️ PRECAUCIÓN: CONDICIONES DE RIESGO MODERADO';
  }

  return { score, riskLevel, safeguardBadge };
}
