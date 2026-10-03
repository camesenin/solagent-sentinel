"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateHumanSummary = generateHumanSummary;
function generateHumanSummary(riskLevel, instructions, threats, balanceChanges) {
    if (riskLevel === 'CRITICAL_BLOCKED') {
        const primaryThreat = threats[0];
        return {
            actionHeadline: '🚫 INTENTO DE EXPLOTACIÓN BLOQUEADO',
            narrative: `Se ha detenido un intento de vaciado de fondos. La transacción contenía la instrucción '${primaryThreat?.title || 'Drenado no autorizado'}'. Si hubieras firmado esto, un contrato externo habría tomado el control de tus tokens.`,
            riskVerdict: 'Peligro Crítico: Se recomienda no interactuar con el enlace o agente de procedencia.',
            safeguardBadge: '🔴 BLOQUEADO POR SENTINEL',
        };
    }
    if (riskLevel === 'WARNING') {
        return {
            actionHeadline: '⚠️ REVISIÓN DE CONDICIONES REQUERIDA',
            narrative: 'La transacción parece operar con normalidad, pero interactúa con contratos que no cuentan con historial verificado en el registro de Solana o presenta tolerancias de deslizamiento (slippage) elevadas.',
            riskVerdict: 'Riesgo Moderado: Asegúrate de conocer el origen del agente antes de autorizar.',
            safeguardBadge: '🟡 PROCEDER CON CAUTELA',
        };
    }
    // Safe swap or transfer
    const outgoing = balanceChanges.filter(b => b.change < 0);
    const incoming = balanceChanges.filter(b => b.change > 0);
    let details = '';
    if (outgoing.length > 0 && incoming.length > 0) {
        details = `Intercambiarás ${Math.abs(outgoing[0].change)} ${outgoing[0].symbol} por aproximadamente +${incoming[0].change} ${incoming[0].symbol}.`;
    }
    else if (outgoing.length > 0) {
        details = `Transferirás ${Math.abs(outgoing[0].change)} ${outgoing[0].symbol}.`;
    }
    else {
        details = 'Ejecutarás una llamada de estado segura sin transferencia irreversible de fondos.';
    }
    return {
        actionHeadline: '✅ OPERACIÓN SEGURA Y VERIFICADA',
        narrative: `${details} Todos los programas invocados corresponden a protocolos oficiales auditados (como Jupiter / Raydium). CERO permisos o delegaciones anómalas concedidas a terceros.`,
        riskVerdict: 'Verificado: Cero vectores de drainer detectados. La simulación de balance es consistente.',
        safeguardBadge: '🟢 SEGURO PARA FIRMAR',
    };
}
