# Product Requirements Document (PRD)

## Devla — The Codility of AI-Assisted Backend Engineering

---

## 1. One-Line Summary

> A browser-based platform where backend engineers solve real challenges **with an AI pair programmer** — and get scored on how well they collaborate with AI, not just whether they got the answer right.

---

## 2. The Problem

Three pains converging in 2025–2026:

1. **Engineers don't know how to work with AI.** They either blindly copy-paste from ChatGPT or ignore AI tools entirely. Neither approach works.
2. **Juniors need to specialize.** Being a generalist doesn't get you hired anymore. Backend engineers need to prove deep, real-world competence.
3. **Nobody assesses AI collaboration skill.** Codility tests DSA. LeetCode tests puzzles. **Nobody tests whether you can actually engineer a solution with AI as your co-pilot.**

Devla fills this gap.

---

## 3. The Product

### What the User Sees

1. Land on **devla.dev** → see a library of backend challenges (Easy / Medium / Hard)
2. Pick a challenge → click **"Start"**
3. Browser opens an environment:
   - 📝 **Code editor** (left) — the challenge code, ready to edit
   - 🤖 **Devla AI** (right) — an AI pair programmer to chat with
   - ▶️ **Test runner** (bottom) — run tests with one click
4. Solve the challenge using Devla AI however you want
5. Click **"Submit"** → hidden tests run server-side
6. Get a **score card**: correctness + code quality + AI collaboration profile
7. **Share** your score on LinkedIn/X → appear on **leaderboard**

### What Makes This Different

| | Codility / LeetCode | **Devla** |
|---|---|---|
| What it tests | DSA / puzzles | **Real backend engineering** |
| AI tools | Banned | **AI is the core feature** |
| What's scored | "Did you solve it?" | **"How did you build it with AI?"** |
| Output | Pass / Fail | **AI Engineer Profile + Score Card** |
| Sharing | Nobody shares | **Designed for LinkedIn virality** |

---

## 4. The MOAT

**Devla provides the AI.** That's the moat.

Because the AI assistant is built into the platform, we capture every interaction:

| Signal | What It Tells Us |
|---|---|
| Prompt quality | Can they ask precise, context-rich questions? |
| Verification behavior | Do they test AI suggestions before using them? |
| Iteration patterns | Do they refine AI output or blindly accept? |
| Orchestration skill | Can they break a problem into effective AI prompts? |
| Independence balance | Do they lean on AI for everything or use judgment? |
| Context sharing | Do they give the AI relevant code/error context? |

**Nobody else measures this.** And it gets better with every user (data flywheel → better scoring models → more accurate profiles → more valuable to B2B).

---

## 5. Adaptive AI Pair Programmer

The AI assistant adapts based on **challenge difficulty** to mirror real-world pair programming dynamics. This is what makes difficulty engaging — it's not just harder code, it's a harder AI collaboration challenge.

### 🟢 Easy — "The Helpful Senior"

> *Like pair programming with a senior engineer who knows the codebase.*

- AI gives detailed, contextual guidance when asked
- Proactively suggests relevant approaches
- Points out common pitfalls
- Will give direct code snippets if asked

**What's tested:** Can you collaborate with a helpful AI to fix a real bug? Can you understand what it suggests and apply it correctly? Do you verify the fix?

**Target user:** Juniors, career switchers, anyone new to AI-assisted engineering.

### 🟡 Medium — "The Knowledgeable Peer"

> *Like pair programming with a peer who knows the tech but hasn't seen this specific code.*

- AI answers questions accurately but doesn't volunteer solutions
- Requires better prompting — vague questions get vague answers
- Won't hand-hold through the implementation
- Helps with concepts, syntax, and debugging hints

**What's tested:** Can you guide the AI effectively? Can you provide sufficient context? Can you decompose the problem into good prompts?

**Target user:** Mid-level engineers, juniors leveling up.

### 🔴 Hard — "The Research Assistant"

> *Like having a junior researcher who can look things up and draft code, but you make all the decisions.*

- AI can research concepts and draft snippets
- Requires precise, well-structured prompts to be useful
- May give partially correct answers that need verification
- User must orchestrate, verify, and own the architecture

**What's tested:** Can you architect a solution and orchestrate AI as a tool? Can you spot when AI is wrong? Can you break a complex problem into AI-solvable pieces?

**Target user:** Mid to senior engineers, anyone preparing for lead roles.

### Why This Design Works

1. **Easy is genuinely accessible** — newcomers aren't punished, they're supported
2. **Difficulty scales in TWO dimensions** — harder code AND harder AI collaboration
3. **Mirrors real career progression** — junior uses AI as a guide, senior uses AI as a tool
4. **Teaches AI skills implicitly** — users learn to prompt better by experiencing the difference
5. **Scoring adapts** — each level has its own scoring model (you don't compare easy and hard scores directly)

---

## 6. Challenge Library (MVP — Backend, Node.js)

| # | Title | Difficulty | Time | Concepts |
|---|---|---|---|---|
| 1 | Fix a broken JWT auth middleware | 🟢 Easy | 30 min | Auth, debugging, middleware |
| 2 | Optimize slow database queries | 🟢 Easy | 30 min | SQL, indexing, N+1 |
| 3 | Build a rate limiter middleware | 🟡 Medium | 45 min | Middleware, algorithms, state |
| 4 | Debug a race condition in checkout | 🟡 Medium | 60 min | Concurrency, transactions |
| 5 | Design a webhook retry system | 🔴 Hard | 90 min | Queues, reliability, error handling |

### Challenge Design Principles

1. **Feel like real work** — "Your team lead Slacks you: the checkout is double-charging customers. Fix it."
2. **AI-compatible** — Solvable with AI, but require engineering judgment to score well
3. **Graduated difficulty** — In BOTH code complexity and AI collaboration skill required
4. **Single-sitting** — Completable in one focused session
5. **Backend-only** — Auth, APIs, databases, queues, caching. No frontend, no DSA.

---

## 7. Scoring & Profiles

### Scoring Dimensions

| Dimension | Weight | What It Measures |
|---|---|---|
| **Correctness** | 35% | Hidden test pass rate |
| **Code Quality** | 20% | Lint score, complexity, readability, diff cleanliness |
| **AI Collaboration** | 30% | Prompt quality, context sharing, iteration, verification |
| **Engineering Practice** | 15% | Test frequency, incremental approach, debugging methodology |

> AI Collaboration is weighted **30%** — this is the differentiator. This is what makes Devla scores mean something different from Codility scores.

### AI Engineer Profiles

Generated from scoring patterns:

| Profile | Description |
|---|---|
| 🎯 **Strong Orchestrator** | Effective AI collaboration, strong verification, good judgment |
| 🔧 **Careful Engineer** | Methodical, thorough testing, balanced AI usage |
| ⚡ **Fast but Risky** | Quick with AI, skips verification, ships fast but breaks things |
| 🤖 **Over-Reliant** | Heavy AI usage, low ownership, doesn't verify suggestions |
| 🧠 **Independent Solver** | Minimal AI usage, strong fundamentals, could leverage AI more |

### Score Card (Shareable)

Each completion generates a score card with:
- Overall score (0–100)
- 4-dimension breakdown (radar chart)
- Profile label + description
- Strengths and improvement tips
- Challenge name + difficulty
- Unique shareable URL with OG image (optimized for LinkedIn/X)

---

## 8. Target Users

### Primary
- Junior to mid-level **backend engineers** (0–3 years)
- Actively using or wanting to use AI tools
- Need to prove backend competence + AI collaboration skill
- Job seekers, career switchers, or engineers leveling up

### Secondary
- Mid-level engineers exploring AI workflows
- Engineering students preparing for backend roles
- Senior engineers curious about their AI collaboration patterns

### Why They Come
- "How good am I at working with AI? Let me find out."
- "I want to practice real backend engineering, not LeetCode."
- "I want something to put on my LinkedIn."

### Why They Stay
- Score cards are addictive — "I got Over-Reliant, let me try again"
- Multiple difficulties let them progress
- New challenges keep it fresh

---

## 9. MVP Scope

### In Scope
- 5 backend challenges (Node.js) — 2 Easy, 2 Medium, 1 Hard
- Browser-based environment: editor + AI chat + test runner
- Adaptive AI assistant (behavior changes by difficulty)
- Server-side hidden test evaluation
- Automated 4-dimension scoring + profile generation
- Shareable score cards (OG image for social)
- Leaderboard (per-challenge, weekly)
- GitHub OAuth authentication

### Out of Scope (MVP)
- Challenge marketplace / authoring tools
- Team / org features
- Payments
- Mobile app
- Enterprise features
- Multiple languages (Python later)
- Git integration in sandbox
- Customizable AI settings

---

## 10. Technical Architecture (MVP)

### Frontend
- React (Vite or Next.js)
- Monaco Editor (code editing)
- xterm.js (terminal)
- Tailwind CSS
- Pages: Landing, Challenge List, Challenge Detail, Workspace, Score Card, Leaderboard

### Backend
- FastAPI (Python)
- Supabase / PostgreSQL
- Auth via GitHub OAuth (Supabase Auth)
- OpenAI / Anthropic API (proxied for AI assistant)

### Sandbox
- Docker containers per session (or Gitpod / Codespaces)
- Isolated execution environment
- Pre-loaded with challenge code

### AI Assistant
- GPT-4o or Claude under the hood
- System prompts tuned per difficulty tier
- All interactions logged server-side
- Rate-limited per session

---

## 11. Non-Functional Requirements

### Performance
- Workspace load < 15 seconds
- AI response < 5 seconds average
- Test runs < 10 seconds
- Score card generation < 30 seconds

### Reliability
- Sessions recoverable (auto-save)
- No data loss on evaluation failures
- Submissions idempotent

### Security
- Isolated Docker sandboxes
- No secret leakage
- Rate-limited AI (prevent abuse/cost overrun)
- Service role key server-only

### Cost Controls
- AI API cost per challenge: target < $0.10
- Sandbox uptime: tear down after inactivity
- Rate limiting on AI prompts per session

---

## 12. Launch Plan

### Pre-Launch (Week 1–2)
- Ship 5 challenges with adaptive AI tuning
- Build in public on LinkedIn/X
- Recruit 20–30 beta testers from backend communities
- Frame: "I'm building the Codility for AI-assisted backend engineering"

### Launch (Week 3)
- LinkedIn, X, HackerNews, Reddit (r/backend, r/cscareerquestions)
- Dev Discord servers
- Hook: "Find out your AI Engineer Profile — are you an Orchestrator or Over-Reliant?"

### Post-Launch (Week 4+)
- Interview 10 users
- Identify friction and drop-offs
- Ship improvements
- Collect B2B interest signals

---

## 13. Success Criteria

| Metric | Target | Why |
|---|---|---|
| Users completing ≥1 challenge | 200 | Core engagement |
| Completion rate per challenge | ≥60% | Challenges aren't too hard/boring |
| Users completing ≥2 challenges | 40% | Retention |
| Score card shares | ≥15% | Virality loop |
| "Want more challenges" signal | ≥30% | Demand validation |
| B2B inquiries (organic) | ≥3 | Enterprise potential |

---

## 14. Risks & Mitigation

| Risk | Mitigation |
|---|---|
| Overbuilding | Strict MVP scope, 5 challenges max |
| Sandbox complexity / cost | Start with lightweight Docker, fallback to Gitpod |
| AI API costs | Rate limiting, cost caps per session |
| Low engagement | Easy challenges as on-ramp, shareable score cards for virality |
| "I want to use my own AI" | Position: standardized conditions = fair scores (like Codility's editor) |
| Challenges too easy with AI | Hidden tests cover edge cases, AI collaboration IS the test |

---

## 15. Long-Term Vision

```
Phase 1 (MVP):     B2C — individuals prove AI engineering skills
Phase 2:           More challenges, Python support, community features
Phase 3:           B2B — companies use Devla to assess candidates' AI collaboration
Phase 4:           "Codility for AI-assisted engineering" — standard for hiring
```

---

## 16. Guiding Principle

> Do backend engineers want a credible way to prove — and improve — how they build real systems with AI?

Everything else is secondary. Ship fast. Learn faster. Iterate ruthlessly.