import asyncio
import edge_tts
import os

OUTPUT_DIR = r"C:\Users\cames\.gemini\antigravity\scratch\solagent-sentinel\docs\audio"
ARTIFACTS_AUDIO = r"C:\Users\cames\.gemini\antigravity\brain\8a010ff1-f307-4130-ab7c-1aa7e092e263\pitch_audio"
os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs(ARTIFACTS_AUDIO, exist_ok=True)

# GuyNeural: Warm, enthusiastic, energetic, approachable American English voice
VOICE = "en-US-GuyNeural"

SCENES = [
    {
        "id": "scene1",
        "file": "scene1_hook_and_crisis.mp3",
        "text": (
            "Hi everyone! I'm Carlos Murillo, and to be completely honest, this is my very first time submitting to the Colosseum Hackathon, "
            "so I'm a little bit nervous, but I am so genuinely excited to show you what we've built! "
            "Solana is leading the absolute frontier of crypto with Blinks and Autonomous AI Agents. "
            "But as I dove deep into the ecosystem, I realized a massive blind spot: agents and everyday users are signing transactions completely blind. "
            "A single malicious Blink can inject a hidden SetAuthority instruction, silently stealing your token accounts forever. "
            "That curiosity to solve this critical danger led to SolAgent Sentinel."
        )
    },
    {
        "id": "scene2",
        "file": "scene2_live_demo_drainer.mp3",
        "text": (
            "Let me show you how it works in our live production app right now. "
            "Here, we simulate an actual phishing airdrop Blink. Usually, your wallet just shows meaningless hexadecimal strings. "
            "But look at what Sentinel does in under 15 milliseconds! "
            "It deconstructs the compiled Abstract Syntax Tree and immediately hits a CRITICAL BLOCK with a score of 12 out of 100. "
            "For a normal user, it speaks plain human language: 'Blocked: This transaction tries to take over your account ownership.' "
            "It even shows a visual balance card: 1,250 USDC saved! "
            "And because I wanted both everyday users and hardcore developers to love this, one click toggles into Auditor Mode, "
            "exposing the decoded instruction hierarchy, account privileges, and CPI traces."
        )
    },
    {
        "id": "scene3",
        "file": "scene3_technical_engine.mp3",
        "text": (
            "Building this was an incredible learning curve for me. Our engine, sentinel-core, is completely deterministic and cryptographic. "
            "We inspect SPL Token instructions, the new Token-2022 extensions, and System Program account assignments. "
            "We even built a dedicated Server-Side Request Forgery firewall to prevent metadata attacks on Blinks! "
            "Furthermore, every evaluation can be anchored to our smart contract on Solana Devnet, "
            "creating a decentralized, immutable registry of blacklisted drainer signatures that any application can query."
        )
    },
    {
        "id": "scene4",
        "file": "scene4_business_model.mp3",
        "text": (
            "Where this gets really thrilling is the autonomous agent economy. "
            "As frameworks like Solana Agent Kit and Eliza take off, autonomous bots are going to execute millions of on-chain transactions without human supervision. "
            "They need a pre-flight firewall! "
            "That's why we packaged our SDK so any agent builder can add SentinelGuard middleware in just two lines of code. "
            "It checks the AST, tests RPC simulation, and aborts before the bot signs a poisoned transaction. "
            "It's a scalable B2B SaaS model that grows with Solana's agent volume."
        )
    },
    {
        "id": "scene5",
        "file": "scene5_team_and_vision.mp3",
        "text": (
            "I have been contributing heavily to open source this year with over 24 merged pull requests across blockchain infrastructure, "
            "but winning a spot in Colosseum's Accelerator would be life-changing. "
            "I have a burning curiosity to learn from the best mentors in the ecosystem, refine Sentinel, and make Solana the safest home for autonomous finance. "
            "Thank you so much for your time and consideration!"
        )
    }
]

async def generate_scene(scene):
    out_path = os.path.join(OUTPUT_DIR, scene["file"])
    communicate = edge_tts.Communicate(scene["text"], VOICE, rate="+3%", pitch="+1Hz")
    await communicate.save(out_path)
    # Also copy to artifacts directory
    art_path = os.path.join(ARTIFACTS_AUDIO, scene["file"])
    with open(out_path, "rb") as f_in, open(art_path, "wb") as f_out:
        f_out.write(f_in.read())
    size = os.path.getsize(out_path)
    print(f"Generated {scene['file']} ({size} bytes)")

async def main():
    print(f"Starting neural voiceover generation using energetic voice: {VOICE}...")
    full_text = "\n\n".join([s["text"] for s in SCENES])
    full_out = os.path.join(OUTPUT_DIR, "full_pitch_voiceover.mp3")
    art_full_out = os.path.join(ARTIFACTS_AUDIO, "full_pitch_voiceover.mp3")
    
    # Generate individual scene clips
    for s in SCENES:
        await generate_scene(s)
        
    # Generate full concatenated voiceover
    print("Generating full concatenated voiceover...")
    comm = edge_tts.Communicate(full_text, VOICE, rate="+3%", pitch="+1Hz")
    await comm.save(full_out)
    with open(full_out, "rb") as f_in, open(art_full_out, "wb") as f_out:
        f_out.write(f_in.read())
    print(f"Generated full_pitch_voiceover.mp3 ({os.path.getsize(full_out)} bytes)")
    print("All enthusiastic neural voiceover files generated and synced to artifacts!")

if __name__ == "__main__":
    asyncio.run(main())
