import asyncio
import edge_tts
import os

OUTPUT_DIR = r"C:\Users\cames\.gemini\antigravity\scratch\solagent-sentinel\docs\audio"
os.makedirs(OUTPUT_DIR, exist_ok=True)

VOICE = "en-US-ChristopherNeural" # Professional, authoritative, clear American English male voice

SCENES = [
    {
        "id": "scene1",
        "file": "scene1_hook_and_crisis.mp3",
        "text": (
            "Solana is leading the world in consumer crypto with Solana Blinks and Autonomous AI Agents. "
            "But with this explosion comes a systemic vulnerability: users and AI agents are blindly signing transactions without knowing what is happening under the hood. "
            "A single malicious Blink claiming to offer an Airdrop can inject a hidden SetAuthority instruction, transferring permanent ownership of your token accounts to an attacker. "
            "Standard wallets just show cryptic hex data. That ends today with SolAgent Sentinel."
        )
    },
    {
        "id": "scene2",
        "file": "scene2_live_demo_drainer.mp3",
        "text": (
            "Here is SolAgent Sentinel in action. "
            "In our live inspector, we test an actual phishing airdrop Blink. Notice how standard wallets would normally fail to warn you. "
            "But Sentinel deconstructs the compiled Abstract Syntax Tree in under 15 milliseconds. "
            "It immediately flags a CRITICAL BLOCK with a score of 12 out of 100. "
            "For the everyday user, it translates the exploit into crystal clear human language: Blocked, this instruction transfers ownership of your tokens to an untrusted third party. "
            "Plus, our visual balance simulation shows the exact impact: 1,250 USDC would have been drained. "
            "And for security auditors and engineers, one click switches to Auditor Mode, displaying the full decoded CPI tree, account privilege maps, and signature verification."
        )
    },
    {
        "id": "scene3",
        "file": "scene3_technical_engine.mp3",
        "text": (
            "Sentinel is not a superficial chatbot wrapper. Our core engine, sentinel-core, is deterministic and cryptographic. "
            "It inspects SPL Token instructions, the new Token-2022 extensions, System Program account assignments, and actions dot json headers. "
            "Furthermore, every evaluation is anchored to our smart contract on Solana Devnet, creating an immutable, decentralized registry of security attestations and blacklisted threat signatures that any wallet or decentralized application can query."
        )
    },
    {
        "id": "scene4",
        "file": "scene4_business_model.mp3",
        "text": (
            "Our go-to-market is two-fold. "
            "First, a free, community-powered web inspector and browser extension for retail decentralized finance traders. "
            "Second, our Sentinel Guard API, a B2B pre-flight middleware designed for AI agent frameworks like the Solana Agent Kit and Eliza. "
            "Every autonomous trading agent needs a firewall before executing transactions on mainnet. "
            "We charge micro-fees per verified batch, building a recurring, high-margin software-as-a-service model."
        )
    },
    {
        "id": "scene5",
        "file": "scene5_team_and_vision.mp3",
        "text": (
            "I'm Carlos Murillo, a systems engineer with over 24 merged pull requests across open-source blockchain infrastructure in 2026 alone. "
            "We built SolAgent Sentinel because autonomous agents are the future of finance, but they cannot scale without absolute security. "
            "With Colosseum's accelerator and seed funding, we will make Sentinel the default security runtime for the entire Solana ecosystem. Thank you."
        )
    }
]

async def generate_scene(scene):
    out_path = os.path.join(OUTPUT_DIR, scene["file"])
    communicate = edge_tts.Communicate(scene["text"], VOICE, rate="-2%")
    await communicate.save(out_path)
    size = os.path.getsize(out_path)
    print(f"Generated {scene['file']} ({size} bytes)")

async def main():
    print(f"Starting neural voiceover generation using voice: {VOICE}...")
    full_text = "\n\n".join([s["text"] for s in SCENES])
    full_out = os.path.join(OUTPUT_DIR, "full_pitch_voiceover.mp3")
    
    # Generate individual scene clips
    for s in SCENES:
        await generate_scene(s)
        
    # Generate full concatenated voiceover
    print("Generating full concatenated voiceover...")
    comm = edge_tts.Communicate(full_text, VOICE, rate="-2%")
    await comm.save(full_out)
    print(f"Generated full_pitch_voiceover.mp3 ({os.path.getsize(full_out)} bytes)")
    print("Neural audio generation completed successfully!")

if __name__ == "__main__":
    asyncio.run(main())
