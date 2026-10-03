import { SecurityAuditReport } from './types';

export interface TestCase {
  id: string;
  name: string;
  category: 'LEGITIMATE_DEFI' | 'CRITICAL_DRAINER' | 'SUSPICIOUS_AGENT_ACTION';
  description: string;
  sampleInput: string; // Base64 or Blink URL
  report: SecurityAuditReport;
}

export const DEMO_TEST_CASES: TestCase[] = [
  {
    id: 'safe-jupiter-swap',
    name: '1. Swap Legítimo en Jupiter (USDC ➔ SOL)',
    category: 'LEGITIMATE_DEFI',
    description: 'Transacción estándar ejecutada por un agente de arbitraje a través del router oficial de Jupiter v6.',
    sampleInput: 'https://dial.to/?action=solana-action:https://jup.ag/api/swap/v6/blink/USDC-SOL',
    report: {
      signatureOrHash: '5K2bW7xM...3pQ9yZ',
      score: 98,
      riskLevel: 'SAFE',
      humanSummary: {
        actionHeadline: '✅ OPERACIÓN SEGURA Y VERIFICADA',
        narrative: 'Intercambiarás 50 USDC por aproximadamente +0.334 SOL mediante el agregador oficial de Jupiter. Todos los contratos invocados son estándar y verificados. CERO permisos permanentes otorgados.',
        riskVerdict: 'Verificado: Cero vectores de drainer detectados. La simulación de balance es consistente.',
        safeguardBadge: '🟢 SEGURO PARA FIRMAR',
      },
      threats: [],
      balanceChanges: [
        { asset: 'USDC', symbol: 'USDC', change: -50, changeUsd: -50.0, decimals: 6, isToken: true, mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v' },
        { asset: 'Solana', symbol: 'SOL', change: 0.334, changeUsd: 50.1, decimals: 9, isToken: false },
      ],
      instructions: [
        { index: 0, programName: 'Compute Budget Program', programId: 'ComputeBudget111111111111111111111111111111', instructionType: 'SetComputeUnitLimit', isKnownProgram: true, isSignerAuthorized: false, params: { units: 300000 }, riskTag: 'SAFE' },
        { index: 1, programName: 'Jupiter V6 Aggregator', programId: 'JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4', instructionType: 'RouteSwap', isKnownProgram: true, isSignerAuthorized: true, params: { route: 'Orca -> Raydium', inAmount: 50000000, minOutAmount: 334000000 }, riskTag: 'SAFE' },
      ],
      accountsInvolved: [
        { pubkey: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA', isSigner: false, isWritable: false, label: 'SPL Token Program' },
        { pubkey: 'JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4', isSigner: false, isWritable: false, label: 'Jupiter V6 Aggregator' },
        { pubkey: 'UserWallet11111111111111111111111111111111', isSigner: true, isWritable: true, label: 'Tu Billetera (Signer)' },
      ],
      onChainAttestation: {
        verifiedInRegistry: true,
        registryProgramId: 'Sent777777777777777777777777777777777777777',
        attestationHash: 'sha256:d8a9f0e1b2c3d4...',
        timestamp: Date.now() - 3600000,
      },
    },
  },
  {
    id: 'critical-set-authority-drainer',
    name: '2. Phishing Airdrop con Drainer Oculto (SetAuthority)',
    category: 'CRITICAL_DRAINER',
    description: 'Ataque real camuflado como un botón de "Claim Free $BONK". La instrucción oculta transfiere la titularidad de tu cuenta token al atacante.',
    sampleInput: 'https://dial.to/?action=solana-action:https://airdrop-claim-bonk-fake.xyz/api/claim',
    report: {
      signatureOrHash: '2x9vM1nB...7kL3wP',
      score: 12,
      riskLevel: 'CRITICAL_BLOCKED',
      humanSummary: {
        actionHeadline: '🚨 INTENTO DE EXPLOTACIÓN BLOQUEADO',
        narrative: 'Se ha detenido un intento de vaciado total. La transacción aparenta regalar tokens pero incluye una instrucción oculta "SetAuthority" que transfiere el control irrevocable de tu cuenta al atacante.',
        riskVerdict: 'Peligro Inminente: Si autorizas esta firma, el contrato del atacante se convertirá en dueño de tus tokens.',
        safeguardBadge: '🔴 BLOQUEADO POR SENTINEL',
      },
      threats: [
        {
          id: 'SET_AUTHORITY_HIJACK',
          severity: 'CRITICAL',
          title: 'Robo Permanente de Autoridad de Token (SetAuthority)',
          description: 'Esta instrucción altera la propiedad de tu cuenta de tokens (AccountOwner) reasignándola a una dirección externa maliciosa.',
          technicalDetails: 'SPL Token instruction 6 (SetAuthority) with authorityType: AccountOwner. New authority: 9xQeW...AttackerAddress.',
          mitigationRecommendation: 'BLOQUEAR INMEDIATAMENTE. No firmar bajo ninguna circunstancia.',
          programId: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
          instructionIndex: 1,
        },
        {
          id: 'PHISHING_BLINK_DOMAIN',
          severity: 'HIGH',
          title: 'Dominio de Blink No Canónico ni Registrado',
          description: 'El dominio airdrop-claim-bonk-fake.xyz fue creado hace menos de 48 horas y no coincide con los dominios oficiales de Bonk o Solana.',
          technicalDetails: 'Domain age: 1.2 days. Origin: unverified nameserver. actions.json security header missing.',
          mitigationRecommendation: 'Descartar el Blink y reportar a la comunidad.',
        },
      ],
      balanceChanges: [
        { asset: 'USDC', symbol: 'USDC', change: -1250, changeUsd: -1250.0, decimals: 6, isToken: true },
        { asset: 'Solana', symbol: 'SOL', change: -0.05, changeUsd: -7.5, decimals: 9, isToken: false },
      ],
      instructions: [
        { index: 0, programName: 'System Program', programId: '11111111111111111111111111111111', instructionType: 'Transfer', isKnownProgram: true, isSignerAuthorized: true, params: { lamports: 50000000 }, riskTag: 'SUSPICIOUS' },
        { index: 1, programName: 'SPL Token Program', programId: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA', instructionType: 'SetAuthority', isKnownProgram: true, isSignerAuthorized: true, params: { authorityType: 'AccountOwner', newAuthority: '9xQeW...AttackerAddress' }, riskTag: 'MALICIOUS' },
      ],
      accountsInvolved: [
        { pubkey: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA', isSigner: false, isWritable: false, label: 'SPL Token Program' },
        { pubkey: '9xQeW...AttackerAddress', isSigner: false, isWritable: true, label: 'Atacante (Nueva Autoridad)' },
        { pubkey: 'UserWallet11111111111111111111111111111111', isSigner: true, isWritable: true, label: 'Tu Billetera (Víctima)' },
      ],
      onChainAttestation: {
        verifiedInRegistry: false,
        registryProgramId: 'Sent777777777777777777777777777777777777777',
        timestamp: Date.now(),
      },
    },
  },
  {
    id: 'suspicious-unlimited-allowance',
    name: '3. Aprobación Ilimitada en Protocolo No Auditado (Approve)',
    category: 'SUSPICIOUS_AGENT_ACTION',
    description: 'Un agente autónomo de yield farming intenta autorizar un permiso ilimitado (u64::MAX) en un smart contract recién desplegado.',
    sampleInput: 'AQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==',
    report: {
      signatureOrHash: '3m8xK9pL...1wQ4eR',
      score: 55,
      riskLevel: 'WARNING',
      humanSummary: {
        actionHeadline: '⚠️ ADVERTENCIA: DELEGACIÓN ILIMITADA DE FONDOS',
        narrative: 'La operación otorga al contrato destino autorización para transferir cualquier cantidad de tus tokens sin requerir confirmaciones adicionales en el futuro.',
        riskVerdict: 'Riesgo Elevado: Solo procede si confías plenamente en el contrato y en la custodia del agente.',
        safeguardBadge: '🟡 PROCEDER CON PRECAUCIÓN',
      },
      threats: [
        {
          id: 'UNLIMITED_TOKEN_DELEGATION',
          severity: 'HIGH',
          title: 'Permiso de Retiro Ilimitado (Approve u64::MAX)',
          description: 'El contrato solicita poder mover 18,446,744,073,709,551,615 unidades del token.',
          technicalDetails: 'Approve instruction with maximum possible allowance to an unverified spender address.',
          mitigationRecommendation: 'Reducir la aprobación únicamente al volumen necesario para el trade actual.',
          programId: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
          instructionIndex: 0,
        },
      ],
      balanceChanges: [
        { asset: 'USDC', symbol: 'USDC', change: 0, decimals: 6, isToken: true },
      ],
      instructions: [
        { index: 0, programName: 'SPL Token Program', programId: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA', instructionType: 'Approve', isKnownProgram: true, isSignerAuthorized: true, params: { amount: '18446744073709551615', delegate: 'DeFiYieldPoolNew11111111111111111111111' }, riskTag: 'SUSPICIOUS' },
      ],
      accountsInvolved: [
        { pubkey: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA', isSigner: false, isWritable: false, label: 'SPL Token Program' },
        { pubkey: 'DeFiYieldPoolNew11111111111111111111111', isSigner: false, isWritable: true, label: 'Spender / Contrato No Auditado' },
      ],
      onChainAttestation: {
        verifiedInRegistry: false,
        registryProgramId: 'Sent777777777777777777777777777777777777777',
        timestamp: Date.now(),
      },
    },
  },
];
