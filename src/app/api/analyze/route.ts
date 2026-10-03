import { NextRequest, NextResponse } from 'next/server';
import { parseTransactionFromBase64 } from '@/lib/sentinel-core/instructionParser';
import { detectExploitPatterns } from '@/lib/sentinel-core/drainerRules';
import { calculateRiskScore } from '@/lib/sentinel-core/riskScorer';
import { generateHumanSummary } from '@/lib/sentinel-core/humanTranslator';
import { SecurityAuditReport, BalanceChange } from '@/lib/sentinel-core/types';

export const dynamic = 'force-dynamic';

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { transaction, sampleId } = body;

    if (!transaction && !sampleId) {
      return NextResponse.json(
        { error: 'Missing required field: transaction (Base64) or sampleId' },
        { status: 400 }
      );
    }

    // 1. Deconstruct AST
    const { instructions, accounts, signatureOrHash } = parseTransactionFromBase64(transaction || '');

    // 2. Run deterministic exploit detectors
    const threats = detectExploitPatterns(instructions);

    // 3. Balance estimation fallback
    const balanceChanges: BalanceChange[] = [];

    // 4. Calculate weighted risk score
    const { score, riskLevel, safeguardBadge } = calculateRiskScore(threats, instructions, balanceChanges);

    // 5. Generate human narrative
    const humanSummary = generateHumanSummary(riskLevel, instructions, threats, balanceChanges);

    const report: SecurityAuditReport = {
      signatureOrHash,
      score,
      riskLevel,
      humanSummary: {
        ...humanSummary,
        safeguardBadge,
      },
      threats,
      balanceChanges,
      instructions,
      accountsInvolved: accounts,
      onChainAttestation: {
        verifiedInRegistry: false,
        registryProgramId: 'Sent777777777777777777777777777777777777777',
        timestamp: Date.now(),
      },
    };

    return NextResponse.json(report, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Failed to analyze transaction', details: err.message },
      { status: 500 }
    );
  }
}
