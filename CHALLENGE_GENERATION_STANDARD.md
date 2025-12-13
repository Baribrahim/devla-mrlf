1\. Purpose
-----------

This document defines the **non-negotiable standards** for generating micro-repo challenges for this platform.

The goal of every challenge is to:

> **Train and assess real-world software debugging ability in an AI-assisted era.**

Challenges must simulate **real production bugs**, not academic exercises, toy problems, or greenfield tasks.

This standard exists to ensure:

*   consistency across challenges
    
*   high learning value
    
*   resistance to shallow or copy-pasted AI solutions
    
*   long-term trust from learners and hiring partners
    

2\. Core Philosophy
-------------------

### 2.1 What We Are Building

We are building a **flight simulator for debugging production software**.

Participants are placed into an _existing system_ that is:

*   imperfect
    
*   partially broken
    
*   written by someone else
    
*   constrained by real-world trade-offs
    

They must **diagnose, reason, and fix** — not build from scratch.

### 2.2 What We Are Explicitly NOT

Challenges must **not** be:

*   algorithm puzzles
    
*   syntax drills
    
*   greenfield feature builds
    
*   LeetCode-style problems
    
*   “follow the tutorial” tasks
    
*   problems solvable by editing a single obvious line
    

If a challenge can be solved without _reading and understanding the codebase_, it fails this standard.

3\. Scope of a Micro-Repo
-------------------------

### 3.1 Size Constraints

Each challenge must remain intentionally small:

*   **Target size:** 50–300 lines of meaningful code
    
*   **Upper bound:** ~400 lines (hard stop)
    
*   Excludes config, lockfiles, and boilerplate
    

The challenge should feel:

*   small enough to complete in 20–45 minutes
    
*   large enough to require navigation and reasoning
    

### 3.2 Multi-File Requirement

Every challenge must involve **causality across at least two files**.

Examples:

*   middleware + route handler
    
*   React hook + component
    
*   DB query helper + service logic
    
*   cache utility + API endpoint
    

Single-file challenges are not allowed.

4\. Allowed Task Type (Strict)
------------------------------

### 4.1 Debugging-Only

All challenges must be **debugging tasks**.

The system is already implemented.Something is wrong.Tests fail or behavior is incorrect.

The participant’s job is to:

*   find the root cause
    
*   fix it correctly
    
*   without breaking constraints
    

### 4.2 Disallowed Task Types

Challenges must NOT require:

*   implementing new features
    
*   designing APIs from scratch
    
*   significant UI design
    
*   architectural rewrites
    
*   large refactors
    

Small, targeted fixes are expected.Large rewrites are not.

5\. Repository Structure (Required)
-----------------------------------

Every micro-repo must follow this structure:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   /  ├── README.md  ├── challenge.json  ├── src/  │   └── (application code)  ├── tests/  │   └── (visible tests)  ├── tests_hidden/  │   └── (hidden tests – not shown to users)  └── package.json / config files   `

6\. README.md Requirements
--------------------------

The README must include:

### 6.1 Contextual Story

A short, realistic scenario written as if the participant joined a real team.

Example tone:

*   “Support reports…”
    
*   “After a recent deploy…”
    
*   “Users noticed…”
    
*   “A security audit flagged…”
    

Avoid:

*   abstract phrasing
    
*   academic language
    
*   explicit hints
    

### 6.2 Clear Objective

Describe **what is broken**, not how to fix it.

✅ “Fix the bug causing duplicate results when paging.”❌ “Add a stable sort to the query.”

### 6.3 Constraints (Critical)

Every README must include at least **one explicit constraint**, such as:

*   “The API contract must remain unchanged.”
    
*   “Caching must remain enabled.”
    
*   “Backward compatibility is required.”
    
*   “Retries must be handled safely.”
    
*   “Do not disable validation or checks.”
    

These constraints exist to prevent trivial or destructive fixes.

7\. challenge.json Metadata Standard
------------------------------------

Every challenge must include structured metadata:

Required fields:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   {    "id": "string",    "stack": "string",    "skill": ["debugging"],    "area": ["backend" | "frontend" | "database"],    "difficulty": 1-5,    "time_estimate_minutes": number,    "concepts": ["string", "..."]  }   `

Metadata must reflect **what the challenge actually measures**, not what it superficially touches.

8\. Test Design Standards (CRITICAL)
------------------------------------

### 8.1 Visible Tests

Visible tests should:

*   clearly fail at the start
    
*   guide exploration
    
*   never reveal the exact fix
    

They must not:

*   encode the solution
    
*   assert implementation details
    
*   allow hardcoding to pass
    

### 8.2 Hidden Tests (Mandatory)

Hidden tests are **the primary quality gate**.

Every challenge must include **2–5 hidden test cases** that:

*   test edge cases
    
*   vary data shape, size, or ordering
    
*   simulate real-world conditions
    
*   defeat naive or hardcoded fixes
    

A solution that only passes visible tests is considered incorrect.

### 8.3 Adversarial Test Design

Hidden tests must intentionally break:

*   hardcoded values
    
*   special-cased inputs
    
*   “return early” hacks
    
*   disabling features instead of fixing them
    

If a “lazy” fix passes all tests, the challenge fails this standard.

9\. AI-Resistance Principles
----------------------------

### 9.1 AI Use Is Allowed — Shallow Use Must Fail

Participants are allowed to use AI.

However, challenges must be designed such that:

*   copy-pasted patches
    
*   generic LLM suggestions
    
*   pattern-matching fixes
    

**will fail hidden tests** unless the underlying issue is truly understood.

### 9.2 Second-Order Correctness (Required)

Every challenge must require **at least two correctness conditions**.

Examples:

*   Pagination must be correct _and_ stable.
    
*   Auth must be enforced _and_ trust boundaries respected.
    
*   Caching must work _and_ invalidate correctly.
    
*   Optimistic UI must update _and_ rollback safely.
    

Single-condition fixes are insufficient.

### 9.3 Bait Fixes (Intentional)

Each challenge should contain at least one **plausible but incorrect fix** that:

*   passes visible tests
    
*   fails hidden tests
    

This is intentional and required.

10\. Multi-Step Reasoning Requirement
-------------------------------------

Challenges must require:

*   reading code
    
*   tracing flow across files
    
*   understanding intent
    
*   reconciling tests with behavior
    

If a challenge can be solved by:

*   scanning error output
    
*   changing one obvious line
    
*   following a test message literally
    

…it fails this standard.

11\. Realism & Professionalism
------------------------------

### 11.1 Code Style

Code must look like:

*   real production code
    
*   written by humans
    
*   slightly imperfect but reasonable
    

Avoid:

*   overly clean demo code
    
*   hyper-optimized abstractions
    
*   excessive comments explaining the bug
    

### 11.2 Bug Authenticity

Bugs must reflect **real engineering mistakes**, such as:

*   incorrect assumptions
    
*   missing edge cases
    
*   race conditions
    
*   misplaced logic
    
*   trust boundary violations
    
*   incorrect caching or state handling
    

Avoid:

*   contrived “puzzle bugs”
    
*   unrealistic mistakes no engineer would make
    

12\. Difficulty Calibration
---------------------------

Difficulty is determined by:

*   depth of reasoning required
    
*   number of interacting components
    
*   subtlety of the bug
    

Difficulty is **not** determined by:

*   amount of code
    
*   obscure language features
    
*   trick syntax
    

13\. Future-Proofing Requirement
--------------------------------

Challenges must be designed so they can later support:

*   seeded variants
    
*   mutation
    
*   procedural generation
    
*   expanded datasets
    

Avoid hard dependencies on:

*   fixed IDs
    
*   fixed data shapes
    
*   single fixtures
    

14\. Quality Gate (Non-Negotiable)
----------------------------------

A challenge is acceptable **only if**:

*   ❏ It cannot be solved without understanding the code.
    
*   ❏ Naive AI-generated fixes fail hidden tests.
    
*   ❏ At least one constraint prevents destructive fixes.
    
*   ❏ The bug feels realistic to a working engineer.
    
*   ❏ The fix improves correctness without reducing safeguards.
    

If any box cannot be checked, the challenge must be revised.

15\. Guiding Principle (Final)
------------------------------

> **We reward understanding, not output.****We value correctness over cleverness.****We simulate reality, not exercises.**

This standard is the foundation of the platform.All generated challenges must comply fully.