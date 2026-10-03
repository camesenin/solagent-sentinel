import { Transaction, VersionedTransaction, PublicKey } from '@solana/web3.js';
import { DecodedInstruction } from './types';
import { KNOWN_PROGRAMS } from './drainerRules';

export function parseTransactionFromBase64(base64Payload: string): {
  instructions: DecodedInstruction[];
  accounts: { pubkey: string; isSigner: boolean; isWritable: boolean; label?: string }[];
  signatureOrHash: string;
} {
  try {
    const buffer = Buffer.from(base64Payload, 'base64');
    let tx: Transaction | VersionedTransaction;
    let isVersioned = false;

    try {
      tx = VersionedTransaction.deserialize(buffer);
      isVersioned = true;
    } catch {
      tx = Transaction.from(buffer);
    }

    if (isVersioned) {
      const vtx = tx as VersionedTransaction;
      const accountKeys = vtx.message.staticAccountKeys.map((k, idx) => ({
        pubkey: k.toBase58(),
        isSigner: vtx.message.isAccountSigner(idx),
        isWritable: vtx.message.isAccountWritable(idx),
        label: KNOWN_PROGRAMS[k.toBase58()] || undefined,
      }));

      const decodedIxs: DecodedInstruction[] = vtx.message.compiledInstructions.map((ix, idx) => {
        const programId = accountKeys[ix.programIdIndex]?.pubkey || 'unknown';
        const programName = KNOWN_PROGRAMS[programId] || 'Custom / Unverified Program';
        const isKnown = !!KNOWN_PROGRAMS[programId];
        const isSigner = ix.accountKeyIndexes.some(aIdx => accountKeys[aIdx]?.isSigner);

        // Decode basic SPL token instruction type if applicable
        let instructionType = 'CustomInvocation';
        const params: Record<string, any> = {};

        if (
          (programId === 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA' ||
            programId === 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb') &&
          ix.data.length > 0
        ) {
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
        } else if (programId === '11111111111111111111111111111111' && ix.data.length >= 4) {
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
        } else if (programId === 'ComputeBudget111111111111111111111111111111') {
          instructionType = 'SetComputeBudget';
        } else if (programId.includes('JUP6')) {
          instructionType = 'RouteSwap';
        } else if (programId.includes('675k')) {
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
    } else {
      const ltx = tx as Transaction;
      const accountKeys = ltx.instructions.flatMap(i => i.keys).map(k => ({
        pubkey: k.pubkey.toBase58(),
        isSigner: k.isSigner,
        isWritable: k.isWritable,
        label: KNOWN_PROGRAMS[k.pubkey.toBase58()] || undefined,
      }));

      const decodedIxs: DecodedInstruction[] = ltx.instructions.map((ix, idx) => {
        const programId = ix.programId.toBase58();
        const programName = KNOWN_PROGRAMS[programId] || 'Custom / Unverified Program';
        const isKnown = !!KNOWN_PROGRAMS[programId];
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
  } catch (err: any) {
    // If not a raw binary payload, return simulated fallback
    return {
      instructions: [],
      accounts: [],
      signatureOrHash: 'parse_error',
    };
  }
}
