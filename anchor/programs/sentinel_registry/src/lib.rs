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
        registry.total_blacklisted = 0;
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

        registry.total_attestations = registry.total_attestations.checked_add(1).ok_or(ErrorCode::Overflow)?;
        if is_blocked {
            registry.total_blocked_threats = registry.total_blocked_threats.checked_add(1).ok_or(ErrorCode::Overflow)?;
        }

        msg!(
            "Attestation recorded: Score {}/100, Blocked: {}, Timestamp: {}",
            score,
            is_blocked,
            attestation.timestamp
        );
        Ok(())
    }

    /// Add a malicious wallet, drainer program or compromised authority to the on-chain threat blacklist
    pub fn blacklist_threat(
        ctx: Context<BlacklistThreat>,
        malicious_key: Pubkey,
        severity: u8,
        reason: String,
    ) -> Result<()> {
        require!(reason.len() <= 64, ErrorCode::ReasonTooLong);

        let threat = &mut ctx.accounts.threat_record;
        let registry = &mut ctx.accounts.registry;

        threat.malicious_key = malicious_key;
        threat.reporter = ctx.accounts.authority.key();
        threat.severity = severity;
        threat.reason = reason;
        threat.timestamp = Clock::get()?.unix_timestamp;

        registry.total_blacklisted = registry.total_blacklisted.checked_add(1).ok_or(ErrorCode::Overflow)?;

        msg!("Threat signature blacklisted on-chain: key={}, severity={}", malicious_key, severity);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeRegistry<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + 32 + 8 + 8 + 8 + 64,
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

#[derive(Accounts)]
#[instruction(malicious_key: Pubkey)]
pub struct BlacklistThreat<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + 32 + 32 + 1 + 4 + 64 + 8,
        seeds = [b"threat", malicious_key.as_ref()],
        bump
    )]
    pub threat_record: Account<'info, ThreatRecord>,
    #[account(
        mut,
        has_one = authority,
        seeds = [b"sentinel_registry"],
        bump
    )]
    pub registry: Account<'info, GlobalRegistry>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct GlobalRegistry {
    pub authority: Pubkey,
    pub total_attestations: u64,
    pub total_blocked_threats: u64,
    pub total_blacklisted: u64,
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

#[account]
pub struct ThreatRecord {
    pub malicious_key: Pubkey,
    pub reporter: Pubkey,
    pub severity: u8,
    pub reason: String,
    pub timestamp: i64,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Calculation resulted in numerical overflow")]
    Overflow,
    #[msg("Threat reason description exceeds 64 characters limit")]
    ReasonTooLong,
}
