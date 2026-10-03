export type Language = 'en' | 'es';

export interface Translations {
  navbar: {
    protocolTag: string;
    devnetLive: string;
    colosseum: string;
    connectWallet: string;
  };
  hero: {
    pill: string;
    titleStart: string;
    titleHighlight: string;
    subtitle: string;
    statBlocked: string;
    statBlockedDesc: string;
    statLatency: string;
    statLatencyDesc: string;
    statSaved: string;
    statSavedDesc: string;
  };
  inspector: {
    scenariosTitle: string;
    scenariosCount: string;
    inputLabel: string;
    inputPlaceholder: string;
    scanBtn: string;
    scanningText: string;
    resultsTitle: string;
    tabUser: string;
    tabAuditor: string;
  };
  simulator: {
    tag: string;
    title: string;
    subtitle: string;
    btnSafe: string;
    btnAttack: string;
    step1Title: string;
    step1Safe: string;
    step1Attack: string;
    step1SafeDesc: string;
    step1AttackDesc: string;
    step2Title: string;
    step2Desc: string;
    step3TitleSafe: string;
    step3TitleAttack: string;
    step3SafeDesc: string;
    step3AttackDesc: string;
  };
  developer: {
    tag: string;
    title: string;
    subtitle: string;
  };
  scenarios: {
    s1: {
      name: string;
      desc: string;
      headline: string;
      narrative: string;
      verdict: string;
      badge: string;
    };
    s2: {
      name: string;
      desc: string;
      headline: string;
      narrative: string;
      verdict: string;
      badge: string;
      threatTitle: string;
      threatDesc: string;
      mitigation: string;
    };
    s3: {
      name: string;
      desc: string;
      headline: string;
      narrative: string;
      verdict: string;
      badge: string;
      threatTitle: string;
      threatDesc: string;
      mitigation: string;
    };
  };
  balanceWidget: {
    title: string;
    badge: string;
    gives: string;
    receives: string;
    noChange: string;
  };
  auditorCard: {
    astTitle: string;
    programsTitle: string;
    attestationTitle: string;
    rawPayloadBtn: string;
  };
}

export const TRANSLATIONS: Record<Language, Translations> = {
  en: {
    navbar: {
      protocolTag: 'AI Agent & Blinks Security Protocol',
      devnetLive: 'Solana Devnet Live',
      colosseum: 'Colosseum Fall 2026',
      connectWallet: 'Connect Wallet',
    },
    hero: {
      pill: 'Runtime Security Shield for Autonomous AI Agents & Blinks',
      titleStart: 'The Cryptographic Firewall for',
      titleHighlight: "Solana's Agentic Economy",
      subtitle:
        'Intercepts drainer exploits (SetAuthority account takeover, unauthorized transfers, and unlimited delegations) in milliseconds before your agent or wallet signs.',
      statBlocked: 'Zero-Tolerance Drainer Shield',
      statBlockedDesc: 'Deterministic AST inspection on SPL Token, Token-2022 & System Program.',
      statLatency: '< 15ms Latency',
      statLatencyDesc: 'High-frequency algorithmic agent pre-flight verification.',
      statSaved: '100% Capital Preserved',
      statSavedDesc: 'On-chain verifiable attestation registry on Solana Devnet.',
    },
    inspector: {
      scenariosTitle: 'Live Test Scenarios (Select to Inspect)',
      scenariosCount: '3 Pre-configured Scenarios',
      inputLabel: 'Inspect Blink URL or Solana Transaction (Base64)',
      inputPlaceholder: 'Paste a Blink URL (dial.to / solana-action:) or Base64 serialized payload...',
      scanBtn: 'Scan Now',
      scanningText: 'Deconstructing instruction AST & simulating state on Solana Devnet...',
      resultsTitle: 'Security Verification Result',
      tabUser: 'Simple (User View)',
      tabAuditor: 'Auditor (SecOps View)',
    },
    simulator: {
      tag: 'Interactive AI Agent Firewall Demo',
      title: 'Real-Time Agent Defense Simulation',
      subtitle: 'Watch the exact defense lifecycle when an autonomous agent or Blink creates a Solana transaction.',
      btnSafe: 'Test Safe Flow',
      btnAttack: 'Simulate Drainer Attack',
      step1Title: 'STEP 1',
      step1Safe: 'Arbitrage Agent / Official Blink',
      step1Attack: 'Compromised Agent / Phishing Blink',
      step1SafeDesc: 'The agent crafts an optimal 50 USDC swap for SOL using Jupiter router.',
      step1AttackDesc: 'The agent or Blink injects a hidden SetAuthority instruction to seize account ownership.',
      step2Title: 'Sentinel Runtime Guard',
      step2Desc: 'AST instruction deconstruction, mutable account verification, and on-chain simulation.',
      step3TitleSafe: 'Signature Approved (Score 98)',
      step3TitleAttack: 'Transaction Aborted (Score 12)',
      step3SafeDesc: 'The wallet signs with complete confidence. Tokens are atomically swapped.',
      step3AttackDesc: 'Sentinel blocks the signing process. Zero tokens stolen. Threat hash recorded on-chain.',
    },
    developer: {
      tag: 'Fast Integration for Agent Builders (SDK / API)',
      title: 'Engineered to Integrate with Solana Agent Kit & Eliza',
      subtitle: 'Protect your production autonomous agents by adding Sentinel Guard middleware before the RPC broadcast:',
    },
    scenarios: {
      s1: {
        name: '1. Legitimate Jupiter Swap (USDC ➔ SOL)',
        desc: 'Standard transaction routed through official Jupiter v6 aggregator by an autonomous arbitrage agent.',
        headline: '✅ SAFE AND VERIFIED TRANSACTION',
        narrative: 'You will swap 50 USDC for approximately +0.334 SOL via Jupiter official router. All invoked smart contracts are verified. ZERO permanent permissions granted.',
        verdict: 'Verified: Zero drainer vectors detected. Balance simulation is consistent.',
        badge: '🟢 SAFE TO SIGN',
      },
      s2: {
        name: '2. Phishing Airdrop with Hidden Drainer (SetAuthority)',
        desc: 'Real-world exploit disguised as "Claim Free $BONK". Hidden instruction steals token account ownership.',
        headline: '🚨 BLOCKED: CRITICAL DRAINER VECTOR DETECTED',
        narrative: 'CRITICAL THREAT BLOCKED: This transaction attempts to transfer permanent ownership of your USDC account to an untrusted third party. If signed, you lose 100% of your tokens permanently.',
        verdict: 'CRITICAL ALERT: Unauthorized SetAuthority instruction detected.',
        badge: '🔴 BLOCKED BY SENTINEL',
        threatTitle: 'Account Ownership Hijack (SetAuthority)',
        threatDesc: 'Instruction #1 executes SetAuthority(AccountOwner), changing the owner to AttackerEvilKey... This grants the attacker permanent, unrevocable control.',
        mitigation: 'Do NOT sign. Close this Blink immediately and flag the originating URL.',
      },
      s3: {
        name: '3. Suspicious Unlimited Token Delegation (ApproveChecked)',
        desc: 'DeFi Blink requesting u64::MAX token allowance, exposing your wallet to indefinite contract drain.',
        headline: '⚠️ WARNING: UNRESTRICTED TOKEN ALLOWANCE',
        narrative: 'This contract is asking for permission to spend unlimited tokens from your wallet. While not an immediate drainer, rogue contracts could drain funds later.',
        verdict: 'WARNING: Excessive delegation limit (u64::MAX).',
        badge: '🟡 MODERATE RISK',
        threatTitle: 'Unlimited Token Delegation',
        threatDesc: 'The instruction grants unlimited spending authority to an unverified third-party address.',
        mitigation: 'Modify approval limit to the exact amount needed for this swap.',
      },
    },
    balanceWidget: {
      title: 'Simulated Wallet Impact',
      badge: 'Balance Simulation',
      gives: 'You Send (Out)',
      receives: 'You Receive (In)',
      noChange: 'No projected balance changes in tokens or SOL.',
    },
    auditorCard: {
      astTitle: 'Instruction Decompilation Tree (AST)',
      programsTitle: 'Account Keys & Privilege Map',
      attestationTitle: 'On-Chain Cryptographic Attestation',
      rawPayloadBtn: 'View / Copy Base64 Payload',
    },
  },
  es: {
    navbar: {
      protocolTag: 'Protocolo de Seguridad para Agentes IA y Blinks',
      devnetLive: 'Solana Devnet Live',
      colosseum: 'Colosseum Fall 2026',
      connectWallet: 'Conectar Billetera',
    },
    hero: {
      pill: 'Seguridad de Ejecución para Agentes Autónomos y Blinks',
      titleStart: 'El Firewall Criptográfico para la',
      titleHighlight: 'Economía de Agentes de Solana',
      subtitle:
        'Intercepta vectores de ataque de drainers (SetAuthority, transferencias no autorizadas y aprobaciones ilimitadas) en milisegundos antes de que tu agente o billetera firme la transacción.',
      statBlocked: 'Cero Tolerancia a Drainers',
      statBlockedDesc: 'Inspección determinista de AST en SPL Token, Token-2022 y System Program.',
      statLatency: '< 15ms de Latencia',
      statLatencyDesc: 'Verificación previa para agentes algorítmicos de alta frecuencia.',
      statSaved: '100% Capital Preservado',
      statSavedDesc: 'Registro de atestaciones verificable en Solana Devnet.',
    },
    inspector: {
      scenariosTitle: 'Casos de Prueba en Vivo (Selecciona para Inspeccionar)',
      scenariosCount: '3 Escenarios Pre-configurados',
      inputLabel: 'Inspeccionar Blink URL o Transacción Solana (Base64)',
      inputPlaceholder: 'Pega un enlace de Blink (dial.to / solana-action:) o Payload Base64...',
      scanBtn: 'Escanear Ahora',
      scanningText: 'Deconstruyendo AST de instrucciones y simulando estado en Solana Devnet...',
      resultsTitle: 'Resultado del Análisis de Seguridad',
      tabUser: 'Modo Usuario Común',
      tabAuditor: 'Modo Auditor / Ingeniero',
    },
    simulator: {
      tag: 'Interactive AI Agent Firewall Demo',
      title: 'Simulador de Protección en Tiempo de Ejecución',
      subtitle: 'Observa el flujo exacto cuando un agente de trading o un Blink genera una transacción en Solana.',
      btnSafe: 'Probar Flujo Legítimo',
      btnAttack: 'Simular Ataque Drainer',
      step1Title: 'PASO 1',
      step1Safe: 'Agente de Arbitraje / Blink',
      step1Attack: 'Agente Comprometido / Phishing',
      step1SafeDesc: 'El agente orquesta un swap óptimo de 50 USDC a SOL usando Jupiter.',
      step1AttackDesc: 'El agente o Blink inyecta una instrucción camuflada de SetAuthority para transferir la cuenta.',
      step2Title: 'Sentinel Runtime Guard',
      step2Desc: 'Deconstrucción de AST, verificación de accounts modificables y simulación de balance en Devnet.',
      step3TitleSafe: 'Firma Aprobada (Score 98)',
      step3TitleAttack: 'Transacción Abortada (Score 12)',
      step3SafeDesc: 'La wallet firma con total confianza. Los fondos se intercambian de forma atómica.',
      step3AttackDesc: 'Sentinel bloquea la firma. El atacante no puede extraer ni un solo token. Alerta registrada en registry on-chain.',
    },
    developer: {
      tag: 'Integración Rápida para Desarrolladores de Agentes (SDK / API)',
      title: 'Diseñado para Integrarse con el Solana Agent Kit y Eliza',
      subtitle: 'Protege tus agentes autónomos en producción añadiendo el middleware de Sentinel antes de invocar la firma en el RPC:',
    },
    scenarios: {
      s1: {
        name: '1. Swap Legítimo en Jupiter (USDC ➔ SOL)',
        desc: 'Transacción estándar ejecutada por un agente de arbitraje a través del router oficial de Jupiter v6.',
        headline: '✅ OPERACIÓN SEGURA Y VERIFICADA',
        narrative: 'Intercambiarás 50 USDC por aproximadamente +0.334 SOL mediante el agregador oficial de Jupiter. Todos los contratos invocados son estándar y verificados. CERO permisos permanentes otorgados.',
        verdict: 'Verificado: Cero vectores de drainer detectados. La simulación de balance es consistente.',
        badge: '🟢 SEGURO PARA FIRMAR',
      },
      s2: {
        name: '2. Phishing Airdrop con Drainer Oculto (SetAuthority)',
        desc: 'Ataque real camuflado como un botón de "Claim Free $BONK". La instrucción oculta transfiere la titularidad de tu cuenta token al atacante.',
        headline: '🚨 BLOQUEADO: DETECTADO VECTOR CRÍTICO DE DRAINER',
        narrative: 'AMENAZA CRÍTICA BLOQUEADA: Esta transacción intenta transferir la titularidad de tu cuenta token a un tercero no verificado. Si firmas, perderás el control permanente de tus fondos.',
        verdict: 'ALERTA CRÍTICA: Instrucción maliciosa SetAuthority detectada.',
        badge: '🔴 BLOQUEADO POR SENTINEL',
        threatTitle: 'Secuestro de Titularidad (SetAuthority)',
        threatDesc: 'La instrucción #1 ejecuta SetAuthority(AccountOwner), asignando el control de la cuenta a AttackerEvilKey... Esto le otorga al atacante la potestad irreversible de retirar o congelar tus fondos.',
        mitigation: 'NO firmes bajo ninguna circunstancia. Cierra el Blink y reporta el dominio.',
      },
      s3: {
        name: '3. Delegación Ilimitada Sospechosa (ApproveChecked)',
        desc: 'Blink DeFi solicitando aprobación por u64::MAX tokens, exponiendo tu billetera a vaciado indefinido.',
        headline: '⚠️ ADVERTENCIA: DELEGACIÓN ILIMITADA DE FONDOS',
        narrative: 'Este contrato solicita autorización para gastar una cantidad ilimitada de tokens en tu nombre. Aunque no es un robo inmediato, un exploit en el protocolo receptor podría drenar tu balance.',
        verdict: 'PRECAUCIÓN: Límite de aprobación excesivo (u64::MAX).',
        badge: '🟡 RIESGO MODERADO',
        threatTitle: 'Aprobación Ilimitada de Tokens',
        threatDesc: 'Se otorga autorización de gasto indefinido a una dirección de terceros sin tope seguro.',
        mitigation: 'Ajusta el monto aprobado exactamente a la cantidad necesaria para esta operación.',
      },
    },
    balanceWidget: {
      title: 'Impacto Simulado en tu Billetera',
      badge: 'Simulación de Balance',
      gives: 'Entregas (Sale)',
      receives: 'Recibes (Entra)',
      noChange: 'Sin cambios proyectados de balance en tokens o SOL.',
    },
    auditorCard: {
      astTitle: 'Árbol de Descompilación de Instrucciones (AST)',
      programsTitle: 'Mapa de Cuentas y Privilegios',
      attestationTitle: 'Atestación Criptográfica On-Chain',
      rawPayloadBtn: 'Ver / Copiar Payload Base64',
    },
  },
};
