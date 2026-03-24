# TikTok/IG Content Schedule — Week 1

**Start Date:** Monday, March 23, 2026

---

## 📅 Monday: Format 1 (Variant A) — Ship or Reject? 🚢
**Focus:** Auth & Security (JWT)

**Slide 1 (Cover):** AI Wrote This. Ship or Reject? 🚢 (Badge: Medium)
**Slide 2 (Code):**
```javascript
// Prompt: Write a secure JWT verification middleware
const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).send('No token');
  
  // Verify token
  const decoded = jwt.decode(token);
  if (decoded) {
    req.user = decoded;
    next();
  } else {
    res.status(401).send('Invalid token');
  }
}
```
*Caption overlay:* "Prompt: Build a secure JWT middleware. AI gave me this. Do you merge it?"
**Slide 3 (CTA):** Drop your verdict below 👇 Answer pinned later today.

**Caption:** AI wrote this JWT middleware in 2 seconds. Looks clean, right? Would you merge this to production? Drop your verdict below 🚢👇 Answer pinned in 3 hours. #aiengineering #softwareengineering #nodejs #backend

**Pinned Comment Answer (Post later):** ❌ REJECT. The AI used `jwt.decode()` instead of `jwt.verify()`. Decode just reads the payload — it *doesn't check the signature*. Anyone could forge a token and get in. This is why verification > speed. Always read what Copilot writes.

---

## 📅 Tuesday: Format 2 (Variant A) — The AI Engineering Framework
**Focus:** Prompting Quality (The 3-Part Formula)

**Slide 1 (Cover):** Stop saying "Fix my code" ❌ (Use The 3-Part Prompt Formula)
**Slide 2:** The worst prompt you can write: "Why is my database query slow? Fix it." 
**Slide 3:** Here is the 3-Part Formula used by top AI Engineers: 1. Context 2. Problem 3. Constraint
**Slide 4:** ✅ Context: "Here is my PostgreSQL schema and the raw SQL query I'm running."
**Slide 5:** ✅ Problem: "It takes 4 seconds to execute when the `users` table has >1M rows."
**Slide 6:** ✅ Constraint: "Fix this by adding an index or rewriting the JOIN, but do NOT change the table structure."
**Slide 7:** Summary. "Same AI. Different prompt. Different engineer. Save this for your next debugging session 🔖"

**Caption:** AI is only as smart as the context you give it. Stop treating it like a search engine and start treating it like a junior dev. #chatgpt #codingtips #developer #aiengineering

---

## 📅 Wednesday: Format 1 (Variant B) — What's the Output? 🤔
**Focus:** Async Fundamentals

**Slide 1 (Cover):** What does this code output? 🤔 
**Slide 2 (Code):**
```javascript
async function processUsers(users) {
  users.forEach(async (user) => {
    await saveToDatabase(user);
    console.log(`Saved ${user.name}`);
  });
  console.log('All users processed!');
}

processUsers([{name: 'Alice'}, {name: 'Bob'}]);
```
*Options Overlay:*
A) Saved Alice \n Saved Bob \n All users processed!
B) All users processed! \n Saved Alice \n Saved Bob
C) Syntax Error
D) All users processed! (and nothing else)
**Slide 3:** Comment A, B, C, or D 👇 Answer pinned later.

**Caption:** If you rely on AI to write your async logic, you need to know how to spot this bug. What's the output? 🤔👇 #javascript #asynccoding #backend #webdev

**Pinned Comment Answer:** ✅ ANSWER: B. `forEach` does NOT wait for promises. It fires them all off and immediately continues to the next line logging "All users processed!". AI makes this mistake constantly. Use a `for...of` loop or `Promise.all()` instead. 

---

## 📅 Thursday: Format 2 (Variant B) — AI Profile Content
**Focus:** Profile Overview

**Slide 1 (Cover):** 5 Types of AI Engineers (Which one are you?) 🤖
**Slide 2:** 🎯 The Orchestrator — Treats AI like a junior dev. Gives context, reviews output, makes the architectural decisions.
**Slide 3:** 🔧 The Careful One — Methodical. Tests every single AI suggestion before committing. Slower but never breaks prod.
**Slide 4:** ⚡ The Speedrunner — Ships in 10 minutes. Breaks prod in 11. Copies Copilot blindly.
**Slide 5:** 🤖 The Delegator — Gives the entire problem to AI. Doesn't understand the PR they just opened.
**Slide 6:** 🧠 The Lone Wolf — Refuses to use AI. Great fundamentals, but leaving massive speed on the table.
**Slide 7:** Which one are you? Be honest 👇 Save this and tag your team's Speedrunner 🔖

**Caption:** The industry is changing. You aren't just an engineer anymore, you're an AI orchestrator. Which profile fits you best? 🎯🔧⚡🤖🧠 #softwareengineer #techcareer #techtok #aiengineering

---

## 📅 Friday: Format 1 (Variant C) — Bad Prompt vs. Good Prompt ⚡
**Focus:** Refactoring

**Slide 1 (Cover):** Keep getting trash code from AI? 🗑️
**Slide 2:** ❌ The Speedrunner Prompt: "Refactor this `paymentService.ts` file to be cleaner." -> *Result: AI rewrites the whole file, changes the API contract, and breaks 42 tests.*
**Slide 3:** ✅ The Orchestrator Prompt: "Refactor the `calculateTax` method in this file to use the Strategy pattern. Do NOT change the public interface or export signatures." -> *Result: Clean, isolated refactor that passes all tests on the first try.*
**Slide 4:** Which one does your co-worker use? 👇

**Caption:** If your AI is breaking your codebase, it's not the AI's fault. It's your prompt constraint. Tag a coworker who needs this 👀 #promptengineering #codinglife #developer

---

## 📅 Saturday: Format 3 — Reel (Hot Take)
**Focus:** The Devla Narrative

**Visual:** You looking at the camera / pointing at text on screen. Trending tech/lo-fi audio.
**On-Screen Text:**
"Unpopular opinion: LeetCode is dead."
*(Wait 2 seconds)*
"In 2026, nobody cares if you can invert a binary tree on a whiteboard."
*(Wait 2 seconds)*
"Companies want to know: Can you architect a system and orchestrate an AI to help you build it?"
*(Wait 2 seconds)*
"The engineers who thrive won't be the fastest coders. They'll be the best orchestrators."

**Caption:** The game has changed. Stop grinding puzzles and start learning how to orchestrate. Agree or disagree? 👇 #softwareengineering #leetcode #techjobs #aiengineering

---

## 📅 Sunday: Format 2 — System Architecture Idea
**Focus:** Things AI Can't Decide 

**Slide 1 (Cover):** 3 Architectural Decisions You Should NEVER Let AI Make 🏗️
**Slide 2:** 1️⃣ Database Selection. Copilot doesn't know your company's read/write ratio, scaling budget, or team expertise. *You decide Postgres vs Mongo. Let AI write the queries.*
**Slide 3:** 2️⃣ Auth Boundaries. AI doesn't understand your business logic for who should see what data. *You draw the boundaries. Let AI write the middleware.*
**Slide 4:** 3️⃣ Third-party Dependencies. AI will happily suggest an unmaintained, deprecated library from 2021 because it's in the training data. *You vet the dependencies. Let AI read their docs.*
**Slide 5:** You are the architect. Copilot is the intern. Act like it. Save this 🔖

**Caption:** AI is amazing at writing implementation details, but terrible at context-heavy system design. Know the difference. #systemdesign #softwarearchitecture #backend #devlife
