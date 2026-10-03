const assert = require('assert');
const { parseTransactionFromBase64 } = require('./dist-test/instructionParser');
const { detectExploitPatterns } = require('./dist-test/drainerRules');
const { calculateRiskScore } = require('./dist-test/riskScorer');
const { generateHumanSummary } = require('./dist-test/humanTranslator');
const { DEMO_TEST_CASES } = require('./dist-test/mockTransactions');
const { PublicKey, Transaction, TransactionInstruction } = require('@solana/web3.js');

console.log('================================================================');
console.log('       SOLAGENT SENTINEL — EXHAUSTIVE SECURITY AUDIT SUITE       ');
console.log('================================================================\n');

let passedTests = 0;
let failedTests = 0;

function runTest(name, fn) {
  try {
    fn();
    console.log(`✅ [PASS] ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`❌ [FAIL] ${name}:`, err.message);
    failedTests++;
  }
}

// TEST 1: Pre-configured Jupiter Swap must be SAFE with score >= 90
runTest('Legitimate Jupiter Swap produces SAFE verdict and score >= 90', () => {
  const tc = DEMO_TEST_CASES[0];
  const { score, riskLevel } = calculateRiskScore(tc.report.threats, tc.report.instructions, tc.report.balanceChanges);
  assert.strictEqual(riskLevel, 'SAFE');
  assert.ok(score >= 90, `Score was ${score}, expected >= 90`);
});

// TEST 2: Pre-configured SetAuthority Drainer must be CRITICAL_BLOCKED with score < 20
runTest('Malicious SetAuthority Drainer produces CRITICAL_BLOCKED verdict and score < 20', () => {
  const tc = DEMO_TEST_CASES[1];
  const threats = detectExploitPatterns(tc.report.instructions);
  const { score, riskLevel } = calculateRiskScore(threats, tc.report.instructions, tc.report.balanceChanges);
  assert.strictEqual(riskLevel, 'CRITICAL_BLOCKED');
  assert.ok(score < 20, `Score was ${score}, expected < 20`);
  assert.ok(threats.some(t => t.id === 'SET_AUTHORITY_HIJACK'), 'Must detect SET_AUTHORITY_HIJACK');
});

// TEST 3: Pre-configured Unlimited Approve must be WARNING
runTest('Unlimited Approve produces WARNING verdict', () => {
  const tc = DEMO_TEST_CASES[2];
  const threats = detectExploitPatterns(tc.report.instructions);
  const { score, riskLevel } = calculateRiskScore(threats, tc.report.instructions, tc.report.balanceChanges);
  assert.strictEqual(riskLevel, 'WARNING');
  assert.ok(threats.some(t => t.id === 'UNLIMITED_TOKEN_DELEGATION'), 'Must detect UNLIMITED_TOKEN_DELEGATION');
});

// TEST 4: Synthesize System Program Assign exploit and verify detection
runTest('System Program Assign instruction is detected as CRITICAL hijack', () => {
  const fakeIx = {
    index: 0,
    programName: 'System Program',
    programId: '11111111111111111111111111111111',
    instructionType: 'Assign',
    isKnownProgram: true,
    isSignerAuthorized: true,
    params: { assignedProgram: 'AttackerProgram1111111111111111111' },
    riskTag: 'SAFE'
  };

  const threats = detectExploitPatterns([fakeIx]);
  const { score, riskLevel } = calculateRiskScore(threats, [fakeIx], []);
  
  assert.strictEqual(riskLevel, 'CRITICAL_BLOCKED');
  assert.ok(threats.some(t => t.id === 'SYSTEM_ASSIGN_TAKEOVER'), 'Must detect SYSTEM_ASSIGN_TAKEOVER');
  assert.ok(score <= 25, 'Score must be penalized by at least 75 points');
});

// TEST 5: Graceful error handling on malformed Base64 payload
runTest('Malformed / Corrupted Base64 payload does not throw uncaught error', () => {
  const corrupted = 'NOT_A_VALID_BASE64_SOLANA_PAYLOAD_!!@#$$%';
  const res = parseTransactionFromBase64(corrupted);
  assert.ok(Array.isArray(res.instructions), 'Must return instructions array');
  assert.ok(Array.isArray(res.accounts), 'Must return accounts array');
});

// TEST 6: Human narrative generation clarity
runTest('Human narrative produces clean translation without hex dumps', () => {
  const tc = DEMO_TEST_CASES[1];
  const summary = generateHumanSummary('CRITICAL_BLOCKED', tc.report.instructions, tc.report.threats, tc.report.balanceChanges);
  assert.ok(summary.actionHeadline.includes('BLOQUEADO'), 'Headline must state BLOQUEADO');
  assert.ok(!summary.narrative.includes('0x'), 'Must not leak raw hex in human view');
  assert.ok(summary.safeguardBadge.includes('BLOQUEADO'), 'Badge must show BLOQUEADO');
});

// TEST 7: Token-2022 compatibility
runTest('Token-2022 SetAuthority is detected identically to SPL Token', () => {
  const token2022Ix = {
    index: 0,
    programName: 'Token-2022 Program',
    programId: 'TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb',
    instructionType: 'SetAuthority',
    isKnownProgram: true,
    isSignerAuthorized: true,
    params: { authorityType: 'CloseAuthority', newAuthority: 'Attacker111' },
    riskTag: 'SAFE'
  };

  const threats = detectExploitPatterns([token2022Ix]);
  assert.ok(threats.some(t => t.id === 'SET_AUTHORITY_HIJACK'), 'Must detect SetAuthority on Token-2022');
});

console.log('\n================================================================');
console.log(`AUDIT RESULTS: ${passedTests} PASSED, ${failedTests} FAILED`);
console.log('================================================================\n');

if (failedTests > 0) process.exit(1);
process.exit(0);
