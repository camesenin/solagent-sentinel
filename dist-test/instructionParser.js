"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseTransactionFromBase64 = parseTransactionFromBase64;
const web3_js_1 = require("@solana/web3.js");
const drainerRules_1 = require("./drainerRules");
function parseTransactionFromBase64(base64Payload) {
    try {
        const buffer = Buffer.from(base64Payload, 'base64');
        let tx;
        let isVersioned = false;
        try {
            tx = web3_js_1.VersionedTransaction.deserialize(buffer);
            isVersioned = true;
        }
        catch {
            tx = web3_js_1.Transaction.from(buffer);
        }
        if (isVersioned) {
            const vtx = tx;
            const accountKeys = vtx.message.staticAccountKeys.map((k, idx) => ({
                pubkey: k.toBase58(),
                isSigner: vtx.message.isAccountSigner(idx),
                isWritable: vtx.message.isAccountWritable(idx),
                label: drainerRules_1.KNOWN_PROGRAMS[k.toBase58()] || undefined,
            }));
            const decodedIxs = vtx.message.compiledInstructions.map((ix, idx) => {
                const programId = accountKeys[ix.programIdIndex]?.pubkey || 'unknown';
                const programName = drainerRules_1.KNOWN_PROGRAMS[programId] || 'Custom / Unverified Program';
                const isKnown = !!drainerRules_1.KNOWN_PROGRAMS[programId];
                const isSigner = ix.accountKeyIndexes.some(aIdx => accountKeys[aIdx]?.isSigner);
                // Decode basic SPL token instruction type if applicable
                let instructionType = 'CustomInvocation';
                const params = {};
                if ((programId === 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA' ||
                    programId === 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb') &&
                    ix.data.length > 0) {
                    const typeCode = ix.data[0];
                    switch (typeCode) {
                        case 3:
                            instructionType = 'Transfer';
                            break;
                        case 4:
                            instructionType = 'Approve';
                            break;
                        case 6:
                            instructionType = 'SetAuthority';
                            params.authorityType = ix.data[1] === 0 ? 'AccountOwner' : ix.data[1] === 1 ? 'CloseAuthority' : 'Other';
                            break;
                        case 7:
                            instructionType = 'MintTo';
                            break;
                        case 8:
                            instructionType = 'Burn';
                            break;
                        case 9:
                            instructionType = 'CloseAccount';
                            break;
                        case 12:
                            instructionType = 'TransferChecked';
                            break;
                        case 13:
                            instructionType = 'ApproveChecked';
                            break;
                        case 17:
                            instructionType = 'SyncNative';
                            break;
                        default:
                            instructionType = `TokenInstruction_${typeCode}`;
                    }
                }
                else if (programId === '11111111111111111111111111111111' && ix.data.length >= 4) {
                    const typeCode = Buffer.from(ix.data).readUInt32LE(0);
                    switch (typeCode) {
                        case 0:
                            instructionType = 'CreateAccount';
                            break;
                        case 1:
                            instructionType = 'Assign';
                            params.assignedProgram = 'ExternalProgramTarget';
                            break;
                        case 2:
                            instructionType = 'Transfer';
                            break;
                        case 3:
                            instructionType = 'CreateAccountWithSeed';
                            break;
                        case 8:
                            instructionType = 'Allocate';
                            break;
                        case 10:
                            instructionType = 'AssignWithSeed';
                            break;
                        default:
                            instructionType = `SystemInstruction_${typeCode}`;
                    }
                }
                else if (programId === 'ComputeBudget111111111111111111111111111111') {
                    instructionType = 'SetComputeBudget';
                }
                else if (programId.includes('JUP6')) {
                    instructionType = 'RouteSwap';
                }
                else if (programId.includes('675k')) {
                    instructionType = 'SwapBaseIn';
                }
                return {
                    index: idx,
                    programName,
                    programId,
                    instructionType,
                    isKnownProgram: isKnown,
                    isSignerAuthorized: isSigner,
                    params,
                    riskTag: 'SAFE',
                };
            });
            return {
                instructions: decodedIxs,
                accounts: accountKeys,
                signatureOrHash: vtx.signatures[0] ? Buffer.from(vtx.signatures[0]).toString('hex').slice(0, 16) : 'unsigned_tx',
            };
        }
        else {
            const ltx = tx;
            const accountKeys = ltx.instructions.flatMap(i => i.keys).map(k => ({
                pubkey: k.pubkey.toBase58(),
                isSigner: k.isSigner,
                isWritable: k.isWritable,
                label: drainerRules_1.KNOWN_PROGRAMS[k.pubkey.toBase58()] || undefined,
            }));
            const decodedIxs = ltx.instructions.map((ix, idx) => {
                const programId = ix.programId.toBase58();
                const programName = drainerRules_1.KNOWN_PROGRAMS[programId] || 'Custom / Unverified Program';
                const isKnown = !!drainerRules_1.KNOWN_PROGRAMS[programId];
                const isSigner = ix.keys.some(k => k.isSigner);
                return {
                    index: idx,
                    programName,
                    programId,
                    instructionType: 'Invocation',
                    isKnownProgram: isKnown,
                    isSignerAuthorized: isSigner,
                    params: {},
                    riskTag: 'SAFE',
                };
            });
            return {
                instructions: decodedIxs,
                accounts: accountKeys,
                signatureOrHash: 'legacy_tx',
            };
        }
    }
    catch (err) {
        // If not a raw binary payload, return simulated fallback
        return {
            instructions: [],
            accounts: [],
            signatureOrHash: 'parse_error',
        };
    }
}
