const WebSocket = require('ws');
const fs = require('fs');
const path = require('path');

const ARTIFACTS_DIR = 'C:\\Users\\cames\\.gemini\\antigravity\\brain\\8a010ff1-f307-4130-ab7c-1aa7e092e263';

async function runAudit() {
  console.log('================================================================');
  console.log('     SOLAGENT SENTINEL — DUAL PERSPECTIVE QA & USER AUDIT       ');
  console.log('================================================================');

  const tabsRes = await fetch('http://127.0.0.1:9222/json');
  const tabs = await tabsRes.json();
  const pageTab = tabs.find(t => t.url && t.url.includes('localhost:3000'));
  if (!pageTab) throw new Error('Could not find localhost:3000 in Chrome CDP');

  const ws = new WebSocket(pageTab.webSocketDebuggerUrl);
  let id = 1;
  const pending = new Map();

  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const msgId = id++;
      const payload = { id: msgId, method, params };
      pending.set(msgId, { resolve, reject });
      ws.send(JSON.stringify(payload));
    });
  }

  await new Promise((resolve, reject) => {
    ws.on('open', resolve);
    ws.on('error', reject);
    ws.on('message', (data) => {
      const msg = JSON.parse(data.toString());
      if (msg.id && pending.has(msg.id)) {
        const { resolve, reject } = pending.get(msg.id);
        pending.delete(msg.id);
        if (msg.error) reject(msg.error);
        else resolve(msg.result);
      }
    });
  });

  console.log('Connected to Chrome CDP WebSocket');

  await send('Page.enable');
  await send('Runtime.enable');
  await send('DOM.enable');

  // 1. Reload page
  console.log('\n--- [TEST 1] Page Reload & Initial DOM State ---');
  await send('Page.reload', { ignoreCache: true });
  await new Promise(r => setTimeout(r, 2000));

  const pageInfo = await send('Runtime.evaluate', {
    expression: `(() => {
      return {
        title: document.title,
        url: window.location.href,
        hasHeader: !!document.querySelector('header'),
        buttonCount: document.querySelectorAll('button').length
      };
    })()`,
    returnByValue: true
  });
  console.log('Page State:', pageInfo.result.value);

  // 2. PERSPECTIVE: END-USER (Scenario 1 Default: Safe Jupiter Swap)
  console.log('\n--- [TEST 2] Perspective: End-User (Default Safe Swap Inspection) ---');
  const userModeState = await send('Runtime.evaluate', {
    expression: `(() => {
      const text = document.body.innerText;
      return {
        hasSafeBadge: text.includes('SEGURO PARA FIRMAR') || text.includes('Score 98/100'),
        hasNarrative: text.includes('Intercambiarás 50 USDC por aproximadamente +0.334 SOL'),
        hasVisualBalance: text.includes('+0.334') && text.includes('-50') && text.includes('USDC') && text.includes('SOL'),
        hasNoHexInNarrative: !text.includes('0x4f82')
      };
    })()`,
    returnByValue: true
  });
  console.log('End-User Safe Scenario Verification:', userModeState.result.value);
  if (!userModeState.result.value.hasSafeBadge || !userModeState.result.value.hasVisualBalance) {
    throw new Error('End-User Safe scenario failed verification');
  }

  const shotUserSafe = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(ARTIFACTS_DIR, 'audit_perspective_user_safe.png'), Buffer.from(shotUserSafe.data, 'base64'));
  console.log('Saved: audit_perspective_user_safe.png');

  // 3. PERSPECTIVE: QA TESTER (Drainer Exploit Reproduction - Scenario 2)
  console.log('\n--- [TEST 3] Perspective: QA Tester (Scenario 2 - SetAuthority Drainer) ---');
  const clickDrainerRes = await send('Runtime.evaluate', {
    expression: `(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const drainerBtn = buttons.find(b => b.innerText.includes('Phishing Airdrop') || b.innerText.includes('SetAuthority'));
      if (drainerBtn) {
        drainerBtn.click();
        return { clicked: true, text: drainerBtn.innerText.substring(0, 40) };
      }
      return { clicked: false };
    })()`,
    returnByValue: true
  });
  console.log('Clicked Scenario 2:', clickDrainerRes.result.value);
  await new Promise(r => setTimeout(r, 600));

  const drainerState = await send('Runtime.evaluate', {
    expression: `(() => {
      const text = document.body.innerText;
      return {
        hasScore12: text.includes('12/100') || text.includes('Score 12'),
        hasCriticalBlocked: text.includes('CRITICAL_BLOCKED') || text.includes('BLOQUEADO'),
        hasDrainerThreat: text.includes('VECTORES DE AMENAZA') || text.includes('SetAuthority') || text.includes('Robo total')
      };
    })()`,
    returnByValue: true
  });
  console.log('Drainer Threat Verification:', drainerState.result.value);
  if (!drainerState.result.value.hasScore12 || !drainerState.result.value.hasCriticalBlocked) {
    throw new Error('Drainer scenario failed verification');
  }

  const shotDrainer = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(ARTIFACTS_DIR, 'audit_perspective_qa_drainer_blocked.png'), Buffer.from(shotDrainer.data, 'base64'));
  console.log('Saved: audit_perspective_qa_drainer_blocked.png');

  // 4. PERSPECTIVE: QA / AUDITOR (Switch to Auditor Mode & Inspect AST & PDAs)
  console.log('\n--- [TEST 4] Perspective: Auditor / SecOps (Auditor Tab Deep Dive) ---');
  const clickAuditorRes = await send('Runtime.evaluate', {
    expression: `(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const auditorBtn = buttons.find(b => b.innerText.includes('Modo Auditor / Ingeniero'));
      if (auditorBtn) {
        auditorBtn.click();
        return { clicked: true };
      }
      return { clicked: false };
    })()`,
    returnByValue: true
  });
  console.log('Switched to Auditor Mode:', clickAuditorRes.result.value);
  await new Promise(r => setTimeout(r, 600));

  const auditorState = await send('Runtime.evaluate', {
    expression: `(() => {
      const text = document.body.innerText;
      return {
        hasAstSection: text.includes('Árbol de Descompilación de Instrucciones') || text.includes('AST'),
        hasOnChainRegistry: text.includes('Atestación Criptográfica On-Chain') || text.includes('Sent777777777777777777777777777777777777777'),
        hasProgramDetails: text.includes('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA') || text.includes('SPL Token Program')
      };
    })()`,
    returnByValue: true
  });
  console.log('Auditor SecOps Verification:', auditorState.result.value);
  if (!auditorState.result.value.hasAstSection || !auditorState.result.value.hasOnChainRegistry) {
    throw new Error('Auditor SecOps verification failed');
  }

  const shotAuditor = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(ARTIFACTS_DIR, 'audit_perspective_qa_auditor_mode.png'), Buffer.from(shotAuditor.data, 'base64'));
  console.log('Saved: audit_perspective_qa_auditor_mode.png');

  // 5. TEST SCENARIO 3 (Unlimited Delegation Warning)
  console.log('\n--- [TEST 5] Scenario 3 (Unlimited Approve Warning) ---');
  const clickWarningRes = await send('Runtime.evaluate', {
    expression: `(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const warnBtn = buttons.find(b => b.innerText.includes('Delegación') || b.innerText.includes('ApproveChecked') || b.innerText.includes('3.'));
      if (warnBtn) {
        warnBtn.click();
        return { clicked: true };
      }
      return { clicked: false };
    })()`,
    returnByValue: true
  });
  console.log('Clicked Scenario 3:', clickWarningRes.result.value);
  await new Promise(r => setTimeout(r, 600));

  const warnState = await send('Runtime.evaluate', {
    expression: `(() => {
      const text = document.body.innerText;
      return {
        hasScore55: text.includes('55/100') || text.includes('Score 55'),
        hasWarningBadge: text.includes('WARNING') || text.includes('PRECAUCIÓN') || text.includes('RIESGO MODERADO'),
        hasDelegationThreat: text.includes('ApproveChecked') || text.includes('ilimitado') || text.includes('Delegación')
      };
    })()`,
    returnByValue: true
  });
  console.log('Scenario 3 Warning Verification:', warnState.result.value);
  if (!warnState.result.value.hasScore55 || !warnState.result.value.hasDelegationThreat) {
    throw new Error('Scenario 3 Warning verification failed');
  }

  // 6. ATTACK SIMULATOR (Live Agent Defense Animation)
  console.log('\n--- [TEST 6] Attack Simulator (AI Agent Defense Lifecycle) ---');
  const simRes = await send('Runtime.evaluate', {
    expression: `(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const simBtn = buttons.find(b => b.innerText.includes('Simular Ataque Drainer'));
      if (simBtn) {
        simBtn.click();
        return { clicked: true };
      }
      return { clicked: false };
    })()`,
    returnByValue: true
  });
  console.log('Clicked Simulator Button:', simRes.result.value);
  await new Promise(r => setTimeout(r, 2000)); // Wait for 3-step animation

  const simFinalState = await send('Runtime.evaluate', {
    expression: `(() => {
      const text = document.body.innerText;
      return {
        hasSimBlocked: text.includes('Transacción Abortada (Score 12)'),
        hasFundsSaved: text.includes('Sentinel bloquea la firma. El atacante no puede extraer ni un solo token')
      };
    })()`,
    returnByValue: true
  });
  console.log('Simulation Defense State:', simFinalState.result.value);
  if (!simFinalState.result.value.hasSimBlocked || !simFinalState.result.value.hasFundsSaved) {
    throw new Error('Simulator defense verification failed');
  }

  const shotSim = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(ARTIFACTS_DIR, 'audit_attack_simulator_blocked.png'), Buffer.from(shotSim.data, 'base64'));
  console.log('Saved: audit_attack_simulator_blocked.png');

  // 7. BACKEND API AUDIT (/api/blinks & /api/analyze)
  console.log('\n--- [TEST 7] Backend API Cryptographic Verification ---');
  
  // Test /api/blinks
  const blinksRes = await fetch('http://localhost:3000/api/blinks');
  const blinksJson = await blinksRes.json();
  const corsHeader = blinksRes.headers.get('access-control-allow-origin');
  console.log('Blinks API Status:', blinksRes.status, 'CORS Header:', corsHeader);
  console.log('Blinks Action Title:', blinksJson.title);
  if (blinksRes.status !== 200 || !blinksJson.links || !blinksJson.links.actions) {
    throw new Error('Blinks API failed verification');
  }

  // Test /api/analyze with sampleId
  const analyzeRes = await fetch('http://localhost:3000/api/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sampleId: 'critical-set-authority-drainer' })
  });
  const analyzeJson = await analyzeRes.json();
  console.log('Analyze API Status:', analyzeRes.status, 'Score:', analyzeJson.score, 'RiskLevel:', analyzeJson.riskLevel);
  if (analyzeRes.status !== 200 || analyzeJson.riskLevel !== 'CRITICAL_BLOCKED') {
    throw new Error('Analyze API failed status 200 or riskLevel CRITICAL_BLOCKED');
  }

  ws.close();
  console.log('\n================================================================');
  console.log('  🎯 ALL DUAL PERSPECTIVE & API AUDITS PASSED WITH 100% SUCCESS  ');
  console.log('================================================================');
}

runAudit().catch(err => {
  console.error('Audit failed:', err);
  process.exit(1);
});
