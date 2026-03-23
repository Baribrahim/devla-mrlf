# Content Strategy — TikTok + Instagram

> **Account identity:** "Everything AI Engineering" — The account doesn't teach you how to code. It teaches you how to orchestrate, architecture, and verify when your co-pilot writes the code.
> **Format:** Carousels + infographics (primary), occasional Reels (secondary).
> **Goal:** Provide value → build audience → promote Devla later.

---

## How This File Works

This is the **base reference**. Every Sunday, a new weekly plan gets created at:

```
content/
  week-1/
    schedule.md    ← 7 days of content, fully ideated
  week-2/
    schedule.md
  ...
```

All content ideas are tracked in the **Used Ideas Log** at the bottom of this file to prevent repeats.

---

## Content Formats

### Format 1: "Trust but Verify" Code Carousels (Engagement Driver)

**3 slides. Fast. No answer revealed.**

The core mechanic: You post a code scenario and force the audience to evaluate it. The answer goes in a **pinned comment** 2–4 hours later to drive repeat engagement.

#### Variant A: "AI Wrote This. Ship or Reject? 🚢"

Focuses on subtle AI hallucinations, bad security practices, and performance traps that AI models frequently output. 

**The 80/20 Rule & The Subjectivity Trap:** 
80% of these should be **REJECT** (broken code). 20% should be **SHIP** (functional code). 
* **The REJECT rule:** The bug must be 100% fatal and objective (security flaw, race condition, crash). No pedantic "rejects".
* **The SHIP rule:** The code must be objectively functional, but can be subjectively imperfect (e.g. not hyper-optimized). When commenters scream "REJECT" over subjective opinions, you pin: *"✅ SHIP. Is it perfect? No. But it works. Don't overengineer AI output. Devla scores you on iteration efficiency for a reason."*
This sparks the exact debates the algorithm rewards.

| Slide | Content |
|---|---|
| **1 (Cover)** | Hook: "AI Wrote This. Ship or Reject? 🚢" + difficulty badge |
| **2** | AI-generated code snippet (10–12 lines). Caption: "Prompt: [Prompt here]. AI gave me this. Do you merge it?" |
| **3** | CTA: "Drop your verdict below 👇 Answer pinned later today." |

#### Variant B: "What's the Output?" 🤔

Focuses on edge cases, async behavior, and deep language understanding. You need strong fundamentals to orchestrate AI well, and this format tests those fundamentals.

| Slide | Content |
|---|---|
| **1 (Cover)** | "What does this code output? 🤔" |
| **2** | Code snippet + 4 multiple choice options (A/B/C/D) |
| **3** | "Comment A, B, C, or D 👇 Answer pinned later." |

#### Variant C: "Bad Prompt vs. Good Prompt" ⚡

Direct comparison of inputs and outputs to teach prompt engineering for backend tasks.

| Slide | Content |
|---|---|
| **1 (Cover)** | "Stop saying 'Fix my code' ❌" |
| **2** | Left/Top: Bad Prompt (red). Right/Bottom: Orchestrator Prompt (green). |
| **3** | "Which one gets the bug fixed on the first try? 👇" |

---

### Format 2: The AI Engineering Framework (Value Driver)

**5–7 slides. Teaches the core skills required to be a senior AI-assisted engineer.**

These directly map to the 4 dimensions Devla uses to score users. You are teaching the rubric before the test exists.

#### Variant A: The 4 Dimensions Series

Teach one of the 4 core AI engineering dimensions per post. Use the "Bad Example vs. Good Example" format.

**Dimension 1: AI Prompting Quality** (Specificity, constraints, context)
- Bad prompt vs. good prompt (side by side)
- "The 3-part prompt formula: Context + Problem + Constraint"
- "Why 'fix this code' is the worst prompt you can write"
- "How to give AI enough context without pasting your whole codebase"

**Dimension 2: Verification Discipline** (Testing, review, skepticism)
- "The #1 mistake: trusting AI output"
- "One habit that prevents 90% of AI-caused bugs"
- "AI doesn't make typos, it makes confident wrong answers"
- "Test BEFORE you commit, not after"

**Dimension 3: Independence Balance** (Architectural ownership vs. delegation)
- "Using AI for everything makes you worse"
- "Things you SHOULD ask AI vs things you shouldn't"
- "The best engineers use AI 40% of the time, not 100%"
- "AI for syntax, you for architecture"

**Dimension 4: Engineering Practice** (Debugging methodologies, incrementalism)
- "The best debugging workflow with AI (3 steps)"
- "Read the error first, THEN ask AI"
- "Incremental > Big Bang — even with AI"
- "Run tests after every change, not just at the end"

#### Variant B: AI Engineer Profiles (Recurring Series)

The 5 profiles are **characters** you place in infinite scenarios:

| Post Type | Example |
|---|---|
| Overview | "5 types of AI engineers — which one are you?" |
| Deep-dive | "The most dangerous type: ⚡ The Speedrunner" |
| Situational | "Prod bug at 2am — what each profile does" |
| Matchups | "Orchestrator vs. Speedrunner — who ships better?" |
| Growth path | "Delegator → Orchestrator in 3 habits" |
| Under pressure | "Your AI profile changes based on deadline pressure" |

---

### Format 3: Reels (Occasional — 1–2x/week)

No voiceover. Text-on-screen + trending sound.

| Type | Example |
|---|---|
| Hot take text | "AI coding tools won't replace you. The engineer who knows HOW to use them will." + trending sound |
| Workflow scroll | Screen recording of a hyper-efficient AI workflow |
| Meme/relatable | "POV: You're a Delegator reviewing your own PR" |

---

## Content Banks (Pull From These Weekly)

### AI Trap Bank (For "Ship or Reject" Carousels)

| Category | AI Hallucinations & Subtle Bugs |
|---|---|
| **Auth** | AI implements JWT but forgets `expiresIn`, AI uses insecure hashing (MD5), AI forgets to validate resource ownership. |
| **SQL** | AI loops over an array and does a `SELECT` inside (Classic N+1), AI writes a raw query without parameters. |
| **Async** | AI uses `forEach` with `async/await` (which doesn't wait), AI returns a promise without awaiting it. |
| **API** | AI builds a paginated endpoint but fetches EVERYTHING into memory first, AI forgets CORS headers. |
| **Logic** | AI hallucinates library methods that look right but don't exist, AI ignores timezones in date math. |

### Hot Takes Bank

- "AI coding tools won't replace you. The engineer who knows HOW to use them will."
- "The fastest coders are no longer the most valuable engineers. The best orchestrators are."
- "If you can't build it without AI, you can't maintain it with AI."
- "Stop using Copilot to write your architecture."
- "The new senior developer is just a junior developer with extreme verification discipline."
- "LeetCode tests your ability to memorize. Devla tests your ability to engineer. (Launch phase)"

---

## Engagement Rules

| Rule | How |
|---|---|
| **Never reveal answers in carousel** | Pin answer in comments after 2–4 hrs |
| **Reply to every comment** | First 30 min after posting — "close!", "not quite 👀", "explain?" |
| **End every post with a CTA** | "Comment your answer" / "Save this 🔖" / "Tag someone" |
| **Cross-post TikTok ↔ IG** | Same carousel, slightly different caption |
| **Post at peak times** | 7–9 AM or 6–8 PM (audience timezone) |
| **3–5 hashtags** | #aiengineering #softwareengineering #codinglife #developer #chatgpt |

---

## Batch Creation Workflow (Sundays, ~2 hrs)

1. Ask me to generate the weekly schedule → I create `content/week-N/schedule.md`
2. Open Canva/Figma templates (set up once)
3. Fill in that week's content from the schedule
4. Schedule all 7 posts in Meta Business Suite / Later.com
5. Done

---

## Design Specs

| Element | Spec |
|---|---|
| Canvas | 1080×1350px (4:5) |
| Code font | JetBrains Mono or Fira Code, 18–22pt |
| Code background | Dark (#1E1E2E) |
| Bug highlight | Red border/underline (#FF6B6B) |
| Fix highlight | Green border/underline (#4ECB71) |
| Text font | Inter or Plus Jakarta Sans |
| Max code lines | 10–12 per slide |
| Branding | Handle watermark on every slide |

---

## Used Ideas Log

> Every time a weekly schedule is created, used ideas get logged here to prevent repeats.

**Week 1:**
- Format 1A (Auth): JWT `decode()` vs `verify()` signature validation bypass
- Format 2A (Prompting): The 3-Part Prompt Formula (Context, Problem, Constraint) vs "Fix my code"
- Format 1B (Output/Async): `forEach` with `async/await` not waiting for promises
- Format 2B (Profiles): 5 Profiles Overview ("Which one are you?")
- Format 1C (Prompting): Refactoring prompt (no constraints) vs Strategy pattern (strict API constraints)
- Format 3 (Reel): "LeetCode is dead, orchestration is the new skill"
- Format 2A (System Design): 3 AI Architecture limits (Database, Auth Boundaries, Dependencies)