use anchor_lang::prelude::*;

declare_id!("Sent777777777777777777777777777777777777777");

#[program]
pub mod sentinel_registry {
    use super::*;

    /// Initialize the global Sentinel authority registry
    pub fn initialize_registry(ctx: Context<InitializeRegistry>) -> Result<()> {
        let registry = &mut ctx.accounts.registry;
        registry.authority = ctx.accounts.authority.key();
        registry.total_attestations = 0;
        registry.total_blocked_threats = 0;
        msg!("SolAgent Sentinel Registry initialized by authority: {}", registry.authority);
        Ok(())
    }

    /// Record a verified security attestation for a Blink or AI agent transaction
    pub fn record_attestation(
        ctx: Context<RecordAttestation>,
        tx_hash: [u8; 32],
        score: u8,
        threat_count: u8,
        is_blocked: bool,
    ) -> Result<()> {
        let attestation = &mut ctx.accounts.attestation;
        let registry = &mut ctx.accounts.registry;

        attestation.evaluator = ctx.accounts.evaluator.key();
        attestation.tx_hash = tx_hash;
        attestation.score = score;
        attestation.threat_count = threat_count;
        attestation.is_blocked = is_blocked;
        attestation.timestamp = Clock::get()?.unix_timestamp;

        registry.total_attestations = registry.total_attestations.checked_add(1).unwrap();
        if is_blocked {
            registry.total_blocked_threats = registry.total_blocked_threats.checked_add(1).unwrap();
        }

        msg!(
            "Attestation recorded: Score {}/100, Blocked: {}, Timestamp: {}",
            score,
            is_blocked,
            attestation.timestamp
        );
        Ok(())
    }
}

#[derive(Accounts)]
pub fn InitializeRegistry<'info>(ctx: Context<InitializeRegistry>) -> Result<()> {
    Ok(())
}

#[derive(Accounts)]
pub struct InitializeRegistry<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + 32 + 8 + 8 + 64,
        seeds = [b"sentinel_registry"],
        bump
    )]
    pub registry: Account<'info, GlobalRegistry>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(tx_hash: [u8; 32])]
pub struct RecordAttestation<'info> {
    #[account(
        init,
        payer = evaluator,
        space = 8 + 32 + 32 + 1 + 1 + 1 + 8 + 32,
        seeds = [b"attestation", tx_hash.as_ref()],
        bump
    )]
    pub attestation: Account<'info, AttestationRecord>,
    #[account(
        mut,
        seeds = [b"sentinel_registry"],
        bump
    )]
    pub registry: Account<'info, GlobalRegistry>,
    #[account(mut)]
    pub evaluator: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct GlobalRegistry {
    pub authority: Pubkey,
    pub total_attestations: u64,
    pub total_blocked_threats: u64,
}

#[account]
pub struct AttestationRecord {
    pub evaluator: Pubkey,
    pub tx_hash: [u8; 32],
    pub score: u8,
    pub threat_count: u8,
    pub is_blocked: bool,
    pub timestamp: i64,
}
