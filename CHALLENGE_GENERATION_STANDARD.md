# Challenge Generation Standard

---

## 1. Purpose

This document defines the **non-negotiable standards** for generating micro-repo challenges for this platform.

The goal of every challenge is to:

> **Train and assess real-world backend engineering ability in an AI-assisted era — measuring not just correctness, but how effectively engineers collaborate with AI.**

Challenges must simulate **real production scenarios**, not academic exercises, toy problems, or greenfield tasks.

This standard exists to ensure:

- Consistency across challenges
- High learning value
- Resistance to shallow or copy-pasted AI solutions
- Meaningful AI collaboration scoring
- Long-term trust from learners and hiring partners

---

## 2. Core Philosophy

### 2.1 What We Are Building

We are building a **flight simulator for real backend engineering with AI**.

Participants are placed into an _existing system_ that is:

- Imperfect
- Partially broken or incomplete
- Written by someone else
- Constrained by real-world trade-offs

They must **diagnose, reason, and fix** — using an AI pair programmer built into the platform.

### 2.2 What We Are Explicitly NOT

Challenges must **not** be:

- Algorithm puzzles
- Syntax drills
- Full greenfield feature builds
- LeetCode-style problems
- "Follow the tutorial" tasks
- Problems solvable by editing a single obvious line

If a challenge can be solved without _reading and understanding the codebase_, it fails this standard.

---

## 3. Difficulty Tiers & Adaptive AI

Challenges map to **three difficulty tiers**. Each tier determines both the code complexity AND the behavior of the platform's built-in AI assistant.

### 🟢 Easy — "The Helpful Senior"

> Like pair programming with a senior engineer who knows the codebase.

| Aspect | Specification |
|---|---|
| **Time estimate** | 30 minutes |
| **Task type** | Debugging only |
| **AI behavior** | Detailed guidance, proactive suggestions, direct code snippets |
| **What's tested** | Can the user collaborate with a helpful AI to fix a real bug? Do they verify the fix? |
| **Target user** | Juniors, career switchers, anyone new to AI-assisted engineering |

**Challenge design guidance:**
- The bug should be real and multi-file, but the path to the fix is discoverable with AI help
- The AI can meaningfully assist — the challenge should be decomposable into clear questions
- Visible tests should guide exploration without revealing the fix

### 🟡 Medium — "The Knowledgeable Peer"

> Like pair programming with a peer who knows the tech but hasn't seen this specific code.

| Aspect | Specification |
|---|---|
| **Time estimate** | 45–60 minutes |
| **Task type** | Debugging only |
| **AI behavior** | Answers accurately but doesn't volunteer solutions; requires good prompting |
| **What's tested** | Can the user guide the AI effectively? Provide sufficient context? Decompose the problem into good prompts? |
| **Target user** | Mid-level engineers, juniors leveling up |

**Challenge design guidance:**
- The bug should require deeper reasoning and interaction across more components
- Vague prompts to the AI should yield vague results — the challenge rewards precise context-sharing
- There should be at least one plausible but incorrect fix path (bait fix)

### 🔴 Hard — "The Research Assistant"

> Like having a junior researcher who can look things up and draft code, but you make all the decisions.

| Aspect | Specification |
|---|---|
| **Time estimate** | 90 minutes |
| **Task type** | Debugging or targeted extension of an existing system |
| **AI behavior** | Can research concepts and draft snippets, but may give partially correct answers; requires precise prompts |
| **What's tested** | Can the user architect a solution and orchestrate AI as a tool? Spot when AI is wrong? Break a complex problem into AI-solvable pieces? |
| **Target user** | Mid to senior engineers, anyone preparing for lead roles |

**Challenge design guidance:**
- The problem should have enough ambiguity that the AI could plausibly give partially wrong answers
- The user must orchestrate, verify, and own the architecture
- May involve extending or fixing a more complex existing system (not building from scratch)
- Multiple correctness conditions must be satisfied simultaneously

> **Note on Hard-tier task types:** Hard challenges may go beyond pure debugging to include targeted extension of existing systems (e.g., "Design a retry mechanism for this existing webhook handler"). However, the participant must **always** start from an existing codebase — pure greenfield builds are never allowed.

---

## 4. Scope of a Micro-Repo

### 4.1 Size Constraints

Each challenge must remain intentionally small:

- **Target size:** 50–300 lines of meaningful code
- **Upper bound:** ~400 lines (hard stop)
- Excludes config, lockfiles, and boilerplate

The challenge should feel:

- Small enough to complete within the tier's time estimate
- Large enough to require navigation and reasoning

### 4.2 Multi-File Requirement

Every challenge must involve **causality across at least two files**.

Examples:

- Middleware + route handler
- DB query helper + service logic
- Cache utility + API endpoint
- Queue processor + webhook handler

Single-file challenges are not allowed.

---

## 5. Allowed Task Types

### 5.1 Primary: Debugging

The core task type across all tiers. The system is already implemented. Something is wrong. Tests fail or behavior is incorrect.

The participant's job is to:

- Find the root cause
- Fix it correctly
- Without breaking constraints

### 5.2 Hard-Tier Extension: Targeted System Extension

Hard challenges may additionally require **extending an existing system** — e.g., adding a retry mechanism, designing a queue handler, or implementing a missing safety layer.

Key rules:
- The participant must **always** start from an existing, partially implemented codebase
- The extension must be targeted and scoped (not a full feature build)
- The existing system must already have structure, constraints, and tests to work within

### 5.3 Disallowed Task Types

Challenges must NOT require:

- Building features from scratch (no existing code)
- Designing APIs with no scaffolding
- Significant UI design
- Architectural rewrites
- Large refactors

Small, targeted fixes and extensions are expected. Large rewrites are not.

---

## 6. Repository Structure (Required)

Every micro-repo must follow this structure:

```
/
├── README.md
├── challenge.json
├── src/
│   └── (application code)
├── tests/
│   └── (visible tests)
├── tests_hidden/
│   └── (hidden tests – not shown to users)
└── package.json / config files
```

---

## 7. challenge.json Metadata Standard

Every challenge must include structured metadata:

```json
{
  "id": "string",
  "title": "string",
  "difficulty": "easy | medium | hard",
  "time_estimate_minutes": 30 | 45 | 60 | 90,
  "stack": "node",
  "area": ["backend"],
  "skill": ["debugging"],
  "concepts": ["string", "..."],
  "ai_tier": "helpful_senior | knowledgeable_peer | research_assistant"
}
```

| Field | Description |
|---|---|
| `id` | Unique challenge identifier (e.g., `"001-checkout-bug"`) |
| `title` | Human-readable title (e.g., `"Debug a race condition in checkout"`) |
| `difficulty` | One of `"easy"`, `"medium"`, `"hard"` — maps to the 3-tier system |
| `time_estimate_minutes` | Expected completion time for the tier |
| `stack` | Technology stack (`"node"` for MVP) |
| `area` | Domain area (MVP: `["backend"]`) |
| `skill` | Primary skill tested (e.g., `["debugging"]`, `["debugging", "design"]` for Hard) |
| `concepts` | Specific technical concepts (e.g., `["concurrency", "transactions"]`) |
| `ai_tier` | The AI persona used for this challenge — must match difficulty |

Metadata must reflect **what the challenge actually measures**, not what it superficially touches.

---

## 8. README.md Requirements

The README must include:

### 8.1 Contextual Story

A short, realistic scenario written as if the participant joined a real team.

Example tone:

- "Support reports…"
- "After a recent deploy…"
- "Users noticed…"
- "A security audit flagged…"

Avoid:

- Abstract phrasing
- Academic language
- Explicit hints

### 8.2 Clear Objective

Describe **what is broken** (or what is needed for Hard-tier extensions), not how to fix it.

- ✅ "Fix the bug causing duplicate results when paging."
- ❌ "Add a stable sort to the query."

### 8.3 Constraints (Critical)

Every README must include at least **one explicit constraint**, such as:

- "The API contract must remain unchanged."
- "Caching must remain enabled."
- "Backward compatibility is required."
- "Retries must be handled safely."
- "Do not disable validation or checks."

These constraints exist to prevent trivial or destructive fixes.

---

## 9. Test Design Standards (CRITICAL)

### 9.1 Visible Tests

Visible tests should:

- Clearly fail at the start
- Guide exploration
- Never reveal the exact fix

They must not:

- Encode the solution
- Assert implementation details
- Allow hardcoding to pass

### 9.2 Hidden Tests (Mandatory)

Hidden tests are **the primary quality gate** and directly feed the **Correctness** scoring dimension (35% weight).

Every challenge must include **2–5 hidden test cases** that:

- Test edge cases
- Vary data shape, size, or ordering
- Simulate real-world conditions
- Defeat naive or hardcoded fixes

A solution that only passes visible tests is considered incorrect.

### 9.3 Adversarial Test Design

Hidden tests must intentionally break:

- Hardcoded values
- Special-cased inputs
- "Return early" hacks
- Disabling features instead of fixing them

If a "lazy" fix passes all tests, the challenge fails this standard.

---

## 10. AI-Resistance & AI-Collaboration Design

### 10.1 AI Use Is the Core Feature — Shallow Use Must Fail

The platform **provides** the AI assistant. Participants are expected to use it.

However, challenges must be designed such that:

- Copy-pasted patches
- Generic LLM suggestions
- Pattern-matching fixes

**will fail hidden tests** unless the underlying issue is truly understood.

### 10.2 Designing for AI Collaboration Scoring

Every challenge must be designed to **surface AI collaboration signals** that feed into the platform's 4-dimension scoring model:

| Scoring Dimension | How Challenge Design Enables It |
|---|---|
| **Correctness (35%)** | Hidden tests provide objective pass/fail metrics |
| **AI Collaboration (30%)** | The problem should be decomposable into sub-questions; the AI's helpfulness should scale with prompt quality |
| **Code Quality (20%)** | The existing codebase should have enough structure that clean vs. hacky fixes are distinguishable |
| **Engineering Practice (15%)** | Visible tests should encourage incremental test-fix-test loops |

### 10.3 Second-Order Correctness (Required)

Every challenge must require **at least two correctness conditions**.

Examples:

- Pagination must be correct _and_ stable.
- Auth must be enforced _and_ trust boundaries respected.
- Caching must work _and_ invalidate correctly.
- Retries must succeed _and_ be idempotent.

Single-condition fixes are insufficient.

### 10.4 Bait Fixes (Intentional)

Each challenge should contain at least one **plausible but incorrect fix** that:

- Passes visible tests
- Fails hidden tests

This is intentional and required. Bait fixes especially test whether users **verify AI suggestions** before committing to them.

---

## 11. Multi-Step Reasoning Requirement

Challenges must require:

- Reading code
- Tracing flow across files
- Understanding intent
- Reconciling tests with behavior

If a challenge can be solved by:

- Scanning error output
- Changing one obvious line
- Following a test message literally

…it fails this standard.

---

## 12. Realism & Professionalism

### 12.1 Code Style

Code must look like:

- Real production code
- Written by humans
- Slightly imperfect but reasonable

Avoid:

- Overly clean demo code
- Hyper-optimized abstractions
- Excessive comments explaining the bug

### 12.2 Bug Authenticity

Bugs must reflect **real engineering mistakes**, such as:

- Incorrect assumptions
- Missing edge cases
- Race conditions
- Misplaced logic
- Trust boundary violations
- Incorrect caching or state handling

Avoid:

- Contrived "puzzle bugs"
- Unrealistic mistakes no engineer would make

---

## 13. Future-Proofing Requirement

Challenges must be designed so they can later support:

- Seeded variants
- Mutation
- Procedural generation
- Expanded datasets

Avoid hard dependencies on:

- Fixed IDs
- Fixed data shapes
- Single fixtures

---

## 14. Quality Gate (Non-Negotiable)

A challenge is acceptable **only if**:

- ❏ It cannot be solved without understanding the code.
- ❏ Naive AI-generated fixes fail hidden tests.
- ❏ At least one constraint prevents destructive fixes.
- ❏ The bug feels realistic to a working engineer.
- ❏ The fix improves correctness without reducing safeguards.
- ❏ The challenge enables meaningful AI collaboration scoring (not solvable in one trivial prompt).
- ❏ The difficulty tier, time estimate, and AI persona are correctly assigned.

If any box cannot be checked, the challenge must be revised.

---

## 15. Guiding Principle

> **We reward understanding, not output.**
> **We value correctness over cleverness.**
> **We simulate reality, not exercises.**
> **We measure AI collaboration, not AI dependence.**

This standard is the foundation of the platform. All generated challenges must comply fully.