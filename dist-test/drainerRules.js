"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DRAINER_KNOWN_SIGNATURES = exports.KNOWN_PROGRAMS = void 0;
exports.detectExploitPatterns = detectExploitPatterns;
exports.KNOWN_PROGRAMS = {
    '11111111111111111111111111111111': 'System Program',
    'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA': 'SPL Token Program',
    'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb': 'Token-2022 Program',
    'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL': 'Associated Token Program',
    'ComputeBudget111111111111111111111111111111': 'Compute Budget Program',
    'JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4': 'Jupiter V6 Aggregator',
    '675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8': 'Raydium AMM V4',
    'whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc': 'Orca Whirlpool',
    'MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr': 'Memo Program',
};
exports.DRAINER_KNOWN_SIGNATURES = [
    'SetAuthority:AccountOwner',
    'SetAuthority:CloseAuthority',
    'Approve:UnlimitedAllowance',
    'Drainer:UncheckedSignerDelegation',
    'Phishing:ActionsJsonSpoofing',
];
/**
 * Checks instructions against known exploit patterns
 */
function detectExploitPatterns(instructions) {
    const threats = [];
    for (const ix of instructions) {
        // 1. Check for SetAuthority (AccountOwner or CloseAuthority hijack)
        if ((ix.programId === 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA' ||
            ix.programId === 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb') &&
            ix.instructionType === 'SetAuthority') {
            const authorityType = ix.params?.authorityType || 'UnknownAuthority';
            threats.push({
                id: 'SET_AUTHORITY_HIJACK',
                severity: 'CRITICAL',
                title: 'Intento Crítico de Robo de Autoridad de Token (SetAuthority)',
                description: `Esta instrucción transfiere el control de tu cuenta token (${authorityType}) a un tercero no autorizado. Si firmas esto, perderás el control permanente de tus tokens.`,
                technicalDetails: `Detected SPL Token instruction SetAuthority (Type: ${authorityType}) targeting account ${ix.params?.account || 'unknown'}. New authority: ${ix.params?.newAuthority || 'external address'}.`,
                mitigationRecommendation: 'BLOQUEAR INMEDIATAMENTE. Cero protocolos legítimos solicitan transferir la titularidad de tu cuenta de tokens durante un swap normal.',
                programId: ix.programId,
                instructionIndex: ix.index,
            });
            ix.riskTag = 'MALICIOUS';
        }
        // 1.5 Check for System Program Assign (Account Hijack)
        if (ix.programId === '11111111111111111111111111111111' && (ix.instructionType === 'Assign' || ix.instructionType === 'AssignWithSeed')) {
            threats.push({
                id: 'SYSTEM_ASSIGN_TAKEOVER',
                severity: 'CRITICAL',
                title: 'Ataque de Secuestro de Cuenta del Sistema (System::Assign)',
                description: 'La transacción intenta cambiar el programa propietario de tu cuenta a un smart contract externo no verificado.',
                technicalDetails: `SystemProgram::${ix.instructionType} targeting signer account. Reassigning owner to an untrusted contract.`,
                mitigationRecommendation: 'BLOQUEO TOTAL. Modificar el propietario de tu cuenta permite al atacante drenar todos los fondos futuros.',
                programId: ix.programId,
                instructionIndex: ix.index,
            });
            ix.riskTag = 'MALICIOUS';
        }
        // 2. Check for Unlimited Approve (infinite token allowance drainer)
        if ((ix.programId === 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA' ||
            ix.programId === 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb') &&
            (ix.instructionType === 'Approve' || ix.instructionType === 'ApproveChecked')) {
            const amount = BigInt(ix.params?.amount || '0');
            const isUnlimited = amount > BigInt('18446744073709551615') / BigInt(2); // close to u64::MAX
            if (isUnlimited) {
                threats.push({
                    id: 'UNLIMITED_TOKEN_DELEGATION',
                    severity: 'HIGH',
                    title: 'Delegación Ilimitada de Tokens Detectada (Approve)',
                    description: 'Esta instrucción otorga permiso ilimitado a un contrato externo para retirar fondos de tu cuenta token en cualquier momento futuro.',
                    technicalDetails: `Approve instruction requesting delegation of max u64 amount (${amount.toString()}) to delegate: ${ix.params?.delegate || 'unknown'}.`,
                    mitigationRecommendation: 'Rechazar o limitar la aprobación únicamente al monto exacto de la operación actual.',
                    programId: ix.programId,
                    instructionIndex: ix.index,
                });
                ix.riskTag = 'SUSPICIOUS';
            }
        }
        // 3. Check for Suspicious Unknown Programs demanding Signer authority
        if (!ix.isKnownProgram && ix.isSignerAuthorized) {
            threats.push({
                id: 'UNVERIFIED_PROGRAM_SIGNER_EXECUTION',
                severity: 'MEDIUM',
                title: 'Programa No Verificado con Privilegio de Firma',
                description: 'La transacción invoca un contrato no catalogado ni verificado en el registro de Solana, solicitando la autorización directa de tu clave privada.',
                technicalDetails: `Program ID: ${ix.programId} is not in the verified DeFi/Infrastructure whitelist. Signer authority is granted.`,
                mitigationRecommendation: 'Proceder con extrema precaución. Verifica la reputación del creador del Blink o agente antes de firmar.',
                programId: ix.programId,
                instructionIndex: ix.index,
            });
            ix.riskTag = 'SUSPICIOUS';
        }
    }
    return threats;
}
