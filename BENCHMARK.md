# SolAgent Sentinel — Benchmark & Performance Methodology

This document outlines the performance benchmarks, test methodology, and reproducibility steps for **SolAgent Sentinel**'s transaction AST inspection engine.

---

## 🎯 Benchmark Objective

SolAgent Sentinel functions as an inline firewall and pre-flight transaction inspector for autonomous AI agents (e.g., ElizaOS, Solana Agent Kit) and user-facing Blink clients. To prevent front-running and avoid introducing noticeable latency into high-frequency execution pipelines, the core heuristic engine must evaluate transaction instructions in **sub-millisecond (< 1 ms)** time.

---

## 🔬 Test Methodology & Architecture

The benchmark evaluates the engine across five specific dimensions:

1. **Legitimate Transaction Throughput**: Measures latency on valid multi-instruction decentralized exchange swaps (e.g., Jupiter swap instruction trees) to ensure zero false positives and minimal overhead.
2. **Adversarial Threat Interception**: Injects malicious transaction instructions (`SetAuthority` hijacking, unauthorized `ApproveChecked` allowances) and measures time-to-verdict (`CRITICAL_BLOCKED`).
3. **Swarm Immunization Fast-Path**: Verifies fast-path cache lookup latency when an identical attacker signature/hash is re-evaluated.
4. **Concurrency Stress Test**: Executes 50 parallel transaction evaluations concurrently via Node.js asynchronous event loop (`Promise.all`).
5. **Zero-Crash Resilience & Fuzzing**: Feeds malformed base64, truncated buffers, empty strings, and poisoned JSON payloads to ensure 100% graceful handling with zero unhandled exceptions.

> **Note on Network vs. Heuristic Latency**:  
> The **0.028 ms – 0.070 ms** latency figures represent the **in-memory deterministic AST parsing and security heuristic evaluation**. They do not include external Solana RPC network roundtrips (which depend on regional RPC cluster latency, typically 10–100 ms).

---

## 📊 Measured Benchmark Results

Conducted using `autonomous_agent_integration_benchmark.js` on Node.js (v20+):

| Test Vector | Sample Size / Operations | Result | Average Latency |
| :--- | :--- | :--- | :--- |
| **Legitimate Swaps (Jupiter AST)** | 25 continuous runs | 25/25 Approved (0 False Positives) | **0.028 ms** |
| **Adversarial Drainer Interception** | `SetAuthority` Hijack | Blocked (`CRITICAL_BLOCKED`, Score 15) | **0.038 ms** |
| **Immunization Fast-Path** | Cache Hit on Threat Hash | Blocked (`THREAT_IMMUNIZATION_HIT`) | **0.004 ms** |
| **Batch Concurrency** | 50 Concurrent Promises | 50/50 Evaluated | **< 0.050 ms / tx** |
| **Fuzzing & Poisoned Payloads** | 5 malformed/fuzzed payloads | 0 Unhandled Crashes | Handled Gracefully |

---

## 🛠️ Reproducing the Benchmark

To verify and reproduce these measurements on your local machine:

```bash
# 1. Clone repository and install dependencies
git clone https://github.com/camesenin/solagent-sentinel.git
cd solagent-sentinel
npm install

# 2. Run the automated integration & latency benchmark
node autonomous_agent_integration_benchmark.js

# 3. Run the security vulnerability audit suite
node sentinel_security_vulnerability_audit.js
```

---

## 🛡️ Threat Model Summary

SolAgent Sentinel defends against:
1. **Ownership Transfer Exploit (`SetAuthority`)**: Detection of unauthorized account authority changes.
2. **Unlimited Delegation (`ApproveChecked`)**: Flagging transactions granting excessive token transfer allowances.
3. **Obfuscated CPI Drainers**: Inspecting inner instructions within cross-program invocation call stacks.
4. **Domain & Origin Spoofing**: Matching transaction target addresses against known malicious registry hashes.
