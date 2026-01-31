Product Requirements Document (PRD)
===================================

AI-Assisted Engineering Practice Platform — MVP v1
--------------------------------------------------

1\. Objective
-------------

Build and launch a single, high-quality, AI-assisted software engineering simulation that:

*   Feels like real production work
    
*   Integrates AI naturally
    
*   Teaches responsible “vibe coding”
    
*   Is completed by 100+ real users
    
*   Generates organic sharing and retention
    

The MVP is successful if:

*   ≥100 users complete the challenge
    
*   ≥50% finish rate
    
*   ≥30% ask for another challenge
    
*   ≥20% share results
    

All other metrics are secondary.

2\. Target User
---------------

Primary:

*   Junior to mid-level software engineers
    
*   Using ChatGPT / Copilot regularly
    
*   Working in startups or product teams
    

Secondary:

*   Senior engineers curious about AI workflows
    
*   Engineering students preparing for industry
    

Users care about realism, not theory.

3\. Value Proposition
---------------------

“This is the closest thing to practicing real AI-assisted engineering without breaking production.”

Users learn to:

*   Collaborate with AI
    
*   Debug legacy systems
    
*   Verify fixes
    
*   Manage risk
    
*   Ship responsibly
    

In ~90 minutes.

4\. MVP Scope
-------------

### In Scope

*   One flagship challenge
    
*   Web-based experience
    
*   Integrated AI console
    
*   Sandbox execution
    
*   Automated evaluation
    
*   Personalized report
    
*   Basic leaderboard
    

### Out of Scope

*   Challenge marketplace
    
*   Authoring tools
    
*   Multiple scenarios
    
*   Team features
    
*   Payments
    
*   Mobile app
    
*   Enterprise features
    

No scope creep.

5\. Flagship Challenge
----------------------

### Name

**Friday Checkout Incident**

### Scenario

Production checkout service is causing duplicate charges under retry conditions after a recent deploy.

Revenue is leaking.Support is escalating.CTO is waiting.

User must investigate and fix safely.

### Stack

Node.js + Express + SQLite/Postgres

### Bug Design

Primary:

*   Missing idempotency under retries
    

Secondary:

*   Cache invalidation race
    

Includes:

*   Bait fix
    
*   Hidden concurrency tests
    

6\. Core User Flow
------------------

1.  Sign in (Google/GitHub)
    
2.  Start challenge
    
3.  Read scenario
    
4.  Enter sandbox
    
5.  Use AI + code + tests
    
6.  Submit
    
7.  Receive report
    
8.  Share / replay
    

Time target: 60–90 minutes.

7\. Product Features
--------------------

### 7.1 Sandbox

*   Browser-based editor
    
*   Terminal
    
*   Test runner
    
*   Git integration (optional MVP+)
    

### 7.2 AI Console

*   Chat interface
    
*   Context-aware
    
*   Prompt history
    
*   Copy-to-editor
    

### 7.3 Telemetry

Track:

*   Edits
    
*   Test runs
    
*   Prompts
    
*   Diffs
    
*   Timestamps
    
*   Submissions
    

### 7.4 Evaluation Engine

Implements MVP scoring:

DimensionWeightOutcome40%Verification25%Iteration15%Stability10%AI Balance5%Risk5%

### 7.5 Report Generator

Outputs:

*   Overall score
    
*   Subscores
    
*   Profile label
    
*   Strengths
    
*   Improvement tips
    

### 7.6 Leaderboard

*   Weekly
    
*   Based on Overall Score
    
*   One entry per user
    

8\. Non-Functional Requirements
-------------------------------

### Performance

*   Sandbox start < 15s
    
*   AI response < 5s avg
    
*   Test run < 5s
    

### Reliability

*   Runs must be recoverable
    
*   No data loss
    

### Security

*   Isolated sandboxes
    
*   No secret leakage
    
*   Rate-limited AI
    

9\. Evaluation & Scoring
------------------------

### Hard Gate

If tests fail → score = 0.

### Signals

*   Post-edit test frequency
    
*   Final verification
    
*   Diff size
    
*   Revert count
    
*   Prompt-to-progress ratio
    
*   Late-change ratio
    

### Profiles

Generated automatically:

*   Strong Orchestrator
    
*   Careful Engineer
    
*   Fast but Risky
    
*   Over-Reliant
    
*   Independent Solver
    

10\. Technical Architecture (MVP)
---------------------------------

### Frontend

*   Next.js
    
*   Monaco Editor
    
*   Tailwind
    

### Backend

*   Node.js API
    
*   Supabase/Postgres
    
*   Auth via OAuth
    

### Sandbox

*   Gitpod / Codespaces / Docker
    

### AI

*   OpenAI API
    
*   Proxy via backend
    

11\. Data Model (Core)
----------------------

Entities:

*   User
    
*   Run
    
*   Event
    
*   AIInteraction
    
*   Report
    
*   LeaderboardEntry
    

All analytics derive from Run + Event.

12\. Analytics
--------------

Track:

*   Start → Finish rate
    
*   Time spent
    
*   Drop-off points
    
*   Report views
    
*   Shares
    
*   Replays
    

These determine PMF.

13\. Launch Plan
----------------

### Pre-Launch

*   Build in public
    
*   Recruit 30 testers
    
*   Fix friction
    

### Launch

*   LinkedIn/X post
    
*   HackerNews
    
*   Dev communities
    
*   Personal DMs
    

### Post-Launch

*   Interview 10 users
    
*   Identify friction
    
*   Ship v1.1
    

14\. 30-Day Execution Plan
--------------------------

### Week 1

Challenge repo + tests

### Week 2

Sandbox + AI console

### Week 3

Telemetry + evaluation + report

### Week 4

Polish + launch + distribution

No new features after Day 21.

15\. Risks & Mitigation
-----------------------

RiskMitigationOverbuildingStrict scopeLow engagementImprove storyHigh drop-offReduce frictionAI costQuotasSandbox issuesFallback local

16\. Success Criteria
---------------------

MVP is successful if:

*   ≥100 completions
    
*   ≥50% finish rate
    
*   ≥30% retention intent
    
*   ≥20% organic shares
    
*   ≥5 companies inquire
    

If achieved → scale.

17\. Guiding Principle
----------------------

This MVP exists to validate one thing:

Do engineers want to practice real AI-assisted engineering?

Everything else is secondary.

Ship fast.Learn faster.Iterate ruthlessly.

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML