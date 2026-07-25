---
layout: page
title: "Software Quality Assurance"
permalink: /sqa-guide/
---

# Software Quality Assurance

## PART 1 — SOFTWARE TESTING FUNDAMENTALS

### 1.1 SDLC (Software Development Life Cycle)

SDLC is the overall process of building software — testing is _one phase inside it_, not separate from it.

```
Requirement  →  Design  →  Development  →  Testing  →  Deployment  →  Maintenance
Analysis         (HLD/LLD)   (Coding)       (QA)         (Release)     (Support/Bugfix)
```

**Common SDLC models (know the tradeoffs — this is a classic interview question):**

| Model             | How it works                                                                                                                                      | When it's good                                                            | Weakness                                                   |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- | ---------------------------------------------------------- |
| **Waterfall**     | Strictly sequential, one phase finishes before next starts                                                                                        | Fixed, well-understood requirements (e.g., government/compliance systems) | Testing happens too late; expensive to fix late-found bugs |
| **V-Model**       | Each dev phase has a matching test phase planned in parallel (Requirements↔UAT, HLD↔System Testing, LLD↔Integration Testing, Coding↔Unit Testing) | Forces early test-case design                                             | Still rigid, hard with changing requirements               |
| **Agile (Scrum)** | Short sprints (1–2 weeks), incremental delivery, continuous testing                                                                               | Changing requirements, fast feedback                                      | Needs disciplined regression testing every sprint          |
| **Spiral**        | Repeated risk-analysis + prototyping cycles                                                                                                       | Large, high-risk projects                                                 | Complex to manage, costly                                  |

**Why this matters for QA:** In Agile, testers get involved from Day 1 (sprint planning) instead of waiting for "code complete" — this is called **shift-left testing**.

## 1.2 STLC (Software Testing Life Cycle)

STLC is the sub-process _inside_ SDLC that testers actually own.

```
1. Requirement Analysis
2. Test Planning
3. Test Case Development
4. Environment Setup
5. Test Execution
6. Test Closure
```

| Phase                     | What happens                                            | Key deliverable                       |
| ------------------------- | ------------------------------------------------------- | ------------------------------------- |
| **Requirement Analysis**  | Understand what's testable; flag ambiguous requirements | Requirement Traceability Matrix (RTM) |
| **Test Planning**         | Decide scope, approach, tools, timelines, resources     | Test Plan document                    |
| **Test Case Development** | Write test cases, test data, review them                | Test Case document, Test Data         |
| **Environment Setup**     | Prepare test servers, test DB, test accounts            | Environment readiness checklist       |
| **Test Execution**        | Run test cases, log actual vs expected, raise bugs      | Test execution report, Bug reports    |
| **Test Closure**          | Analyze results, exit criteria met?, lessons learned    | Test Closure Report                   |

**Entry/Exit criteria** are important interview vocabulary:

- **Entry criteria** = conditions that must be true _before_ a phase starts (e.g., test cases reviewed before execution starts).
- **Exit criteria** = conditions that must be true to _end_ a phase (e.g., 95% test cases executed, no open Critical bugs, before moving to release).

## 1.3 Levels of Testing

```
Unit Testing  →  Integration Testing  →  System Testing  →  User Acceptance Testing (UAT)
  (one function/                (modules talking       (whole app,        (real users/client
   component, by devs)           to each other)          end-to-end)        sign-off)
```

- **Unit Testing**: Tests a single function/class in isolation. Usually written by developers (Jest, JUnit, PyTest).
- **Integration Testing**: Tests that modules work together (e.g., does the API correctly write to the DB?). Can be **Big Bang** (integrate everything at once) or **Incremental** (Top-down / Bottom-up, adding modules one at a time).
- **System Testing**: Full black-box testing of the entire application against requirements.
- **UAT**: Business/client verifies the software meets real-world needs before go-live.

## 1.4 Types of Testing (quick reference table)

| Type                   | Purpose                                                | Example                                                             |
| ---------------------- | ------------------------------------------------------ | ------------------------------------------------------------------- |
| Functional Testing     | Does the feature do what it's supposed to?             | Login succeeds with valid credentials                               |
| Non-functional Testing | Performance, security, usability                       | Page loads in <2s under 500 concurrent users                        |
| Smoke Testing          | Quick check — is the build even stable enough to test? | Can the app launch and can you log in?                              |
| Sanity Testing         | Quick, narrow check after a small fix                  | Did the specific bug fix work, without deep testing everything else |
| Regression Testing     | Did new code break existing features?                  | Re-run old test cases after a new feature is added                  |
| Exploratory Testing    | Unscripted, tester uses domain knowledge to hunt bugs  | "Let me try weird stuff on the checkout page"                       |
| Retesting              | Re-verify a specific bug fix                           | Bug #123 fixed → re-execute the exact failing test case             |

**Smoke vs Sanity vs Regression — a very common confusion:**

- **Smoke** = "Is this build worth testing at all?" (broad, shallow, done first)
- **Sanity** = "Is this specific fix/feature working?" (narrow, shallow)
- **Regression** = "Did we break anything that used to work?" (broad, deep, done last)

---

# PART 2 — TEST CASE WRITING

## 2.1 Anatomy of a Good Test Case

| Field             | Description                                                                   |
| ----------------- | ----------------------------------------------------------------------------- |
| Test Case ID      | Unique identifier, e.g., `TC_LOGIN_001`                                       |
| Title/Summary     | Short, descriptive: "Verify login fails with incorrect password"              |
| Preconditions     | State required before test starts (e.g., "User account exists and is active") |
| Test Steps        | Numbered, precise, reproducible actions                                       |
| Test Data         | Exact input values used                                                       |
| Expected Result   | What _should_ happen                                                          |
| Actual Result     | Filled in during execution                                                    |
| Status            | Pass / Fail / Blocked / Not Executed                                          |
| Priority/Severity | (see Part 2.3 below)                                                          |

### Example — Well-written test case

```
TC ID: TC_LOGIN_002
Title: Verify error message when password is incorrect
Preconditions: User "testuser@mail.com" exists with password "Pass@123"
Test Steps:
  1. Navigate to login page
  2. Enter email: testuser@mail.com
  3. Enter password: WrongPass1
  4. Click "Login"
Test Data: email=testuser@mail.com, password=WrongPass1
Expected Result: Error message "Invalid email or password" is displayed;
                 user remains on login page; no session/token created
```

**Common mistakes to avoid (assessment graders look for these):**

- Vague steps: "Login with wrong password" (which wrong password? what account?)
- Missing expected result specificity ("shows error" — WHICH error, WHERE, does the field stay filled?)
- No precondition (tester doesn't know what state the system starts in)
- Testing multiple things in one test case (violates single responsibility of a test case)

## 2.2 Test Case Design Techniques (overview — details in Part 3 & 4)

- **Boundary Value Analysis (BVA)** — test the edges of input ranges
- **Equivalence Partitioning (EP)** — group inputs into classes, test one from each
- **Decision Table Testing** — test combinations of conditions/rules
- **State Transition Testing** — test based on system states and valid transitions (e.g., order status: Pending → Shipped → Delivered)
- **Error Guessing** — experience-based, guessing likely failure points

## 2.3 Severity vs Priority (this is almost guaranteed to appear on the assessment)

These are **two independent axes** — people conflate them constantly.

|                         | Severity                                             | Priority                                                     |
| ----------------------- | ---------------------------------------------------- | ------------------------------------------------------------ |
| **Definition**          | How badly the bug affects the _functionality/system_ | How urgently the bug needs to be _fixed_ (business decision) |
| **Decided by**          | Tester (technical impact)                            | Product Manager / Business (business impact)                 |
| **Question it answers** | "How broken is it?"                                  | "How soon do we fix it?"                                     |

**The 2x2 matrix — memorize this with examples:**

```
                    HIGH PRIORITY              LOW PRIORITY
HIGH SEVERITY   │ Login page completely   │ Crash in a rarely-used     │
                │ broken — CEO demo        │ admin report tomorrow —    │
                │ tomorrow. Fix NOW.       │ but affects 2 internal     │
                │ (High Sev, High Pri)     │ users. (High Sev, Low Pri) │
────────────────┼──────────────────────────┼────────────────────────────┤
LOW SEVERITY    │ Company logo is wrong    │ Typo in a footer link      │
                │ color on homepage —      │ nobody reads.              │
                │ launch is today, brand   │ (Low Sev, Low Pri)         │
                │ visibility matters.      │                            │
                │ (Low Sev, High Pri)      │                            │
```

**Key exam-trap example:** "Misspelled company name on the homepage during a product launch" → **Low severity** (doesn't break functionality) but **High priority** (brand reputation, must fix before launch).

**Severity levels typically used:**

1. **Critical/Blocker** — system crash, data loss, no workaround (e.g., checkout payment fails for all users)
2. **Major/High** — major feature broken, workaround exists
3. **Minor/Medium** — minor feature issue, doesn't block main flow
4. **Trivial/Low** — cosmetic (spacing, color, typo)

---

# PART 3 — BOUNDARY VALUE ANALYSIS (BVA)

**Core idea:** Most bugs live at the _edges_ of valid input ranges, not in the middle. So test the boundary, not just "a normal value."

**Rule of thumb:** For a range `[min, max]`, test:

- `min - 1` (just below, should be invalid)
- `min` (exactly at boundary, should be valid)
- `min + 1` (just inside, should be valid)
- `max - 1` (just inside, should be valid)
- `max` (exactly at boundary, should be valid)
- `max + 1` (just above, should be invalid)

### Example: Age field accepting 18–60

```
Valid range: 18 to 60

Test values:  17    18    19   ...  59    60    61
              ↑     ↑     ↑         ↑     ↑     ↑
            INVALID VALID VALID   VALID VALID INVALID
            (below   (min)              (max)  (above
             min)                              max)
```

| Input | Expected Result                            |
| ----- | ------------------------------------------ |
| 17    | Rejected — "Age must be between 18 and 60" |
| 18    | Accepted                                   |
| 19    | Accepted                                   |
| 59    | Accepted                                   |
| 60    | Accepted                                   |
| 61    | Rejected                                   |

### Why BVA matters (real bug example)

A classic **off-by-one error**: developer writes `if (age > 18)` instead of `if (age >= 18)`. A BVA test at exactly `age = 18` catches this immediately — testing only `age = 25` (a "normal" middle value) would never catch it. This is _the_ reason BVA exists.

### BVA applies beyond numbers:

- **String length**: field allows 8–20 characters → test 7, 8, 9, 19, 20, 21 char strings
- **File upload size**: max 5MB → test 4.9MB, 5MB exactly, 5.1MB
- **Date ranges**: booking allowed 1–30 days in advance → test day 0, day 1, day 30, day 31

---

# PART 4 — EQUIVALENCE PARTITIONING (EP)

**Core idea:** Instead of testing every possible input (impossible), divide inputs into groups ("partitions") where the system is expected to behave the _same way_ — then test just **one representative value per partition**.

### Example: Age field accepting 18–60

```
   Invalid Low        Valid Partition         Invalid High
 ┌───────────────┐  ┌────────────────────┐  ┌───────────────┐
 │   ... , 17    │  │    18 to 60        │  │   61, ...     │
 └───────────────┘  └────────────────────┘  └───────────────┘
        ↓                    ↓                      ↓
   pick e.g. 10        pick e.g. 35            pick e.g. 75
```

Instead of testing 100 numbers, you test **3 numbers** (one from each partition) and get equivalent coverage confidence.

### EP + BVA together (this combo is what real test suites use)

EP tells you _which groups exist_. BVA tells you _where inside/around each group to actually poke_. Together:

```
Invalid       Valid                          Invalid
(<18)        (18–60)                          (>60)
  10      17 | 18  19 ... 35 ... 59  60 | 61      75
                  ↑BVA edges↑    ↑EP mid↑  ↑BVA edges↑
```

### Example: Password field (8–16 chars, must include 1 special char)

**Equivalence classes:**
| Class | Example | Valid? |
|---|---|---|
| Length < 8 | `"Ab1!"` | Invalid |
| Length 8–16, has special char | `"Abcdef1!"` | Valid |
| Length 8–16, no special char | `"Abcdefgh1"` | Invalid |
| Length > 16 | `"Abcdefghijklmno1!"` | Invalid |

**Negative/invalid classes matter just as much as valid ones** — this leads directly into Part 5.

---

# PART 5 — FUNCTIONAL & NEGATIVE TESTING

## 5.1 Functional Testing

Verifies the system does what the requirement says, using **valid/expected inputs and normal user flows**.

Example (login):

- Valid email + valid password → successful login, redirected to dashboard
- Click "Forgot Password" → reset email sent

## 5.2 Negative Testing

Verifies the system **fails gracefully and correctly** when given invalid/unexpected input, instead of crashing, leaking data, or silently corrupting state.

**Negative testing checklist (memorize this — used constantly in real QA work):**

- Empty/blank required fields
- Special characters / SQL injection attempts (`' OR '1'='1`)
- Extremely long strings (buffer/length overflow)
- Wrong data type (letters in a number field)
- Duplicate entries where uniqueness is required
- Expired/invalid tokens or sessions
- Network interruption mid-action (e.g., submit form, lose connection)
- Concurrent conflicting actions (two users editing same record)

### Example: Login form — Functional vs Negative

| Type       | Test Case                                   | Expected Result                                              |
| ---------- | ------------------------------------------- | ------------------------------------------------------------ |
| Functional | Valid email + valid password                | Login success                                                |
| Functional | Click "Remember Me", close browser, reopen  | Session persists                                             |
| Negative   | Valid email + wrong password                | "Invalid credentials" error, no login                        |
| Negative   | SQL injection in email field: `' OR 1=1 --` | Rejected/sanitized, no login bypass                          |
| Negative   | Email field empty                           | "Email is required" validation, form not submitted           |
| Negative   | 5 failed login attempts                     | Account locked / CAPTCHA triggered (if that's a requirement) |

**This maps directly to your SauceDemo assessment context** — e.g., testing `locked_out_user`, wrong password, empty fields on the SauceDemo login page are all textbook negative test cases.

---

# PART 6 — BUG REPORTING BEST PRACTICES

A bug report is a **communication artifact** — its only job is to let a developer reproduce and understand the bug _without asking you follow-up questions_.

## 6.1 Anatomy of a Great Bug Report

| Field                      | Purpose                         | Example                                                                       |
| -------------------------- | ------------------------------- | ----------------------------------------------------------------------------- |
| **Title**                  | One-line, specific, searchable  | "Checkout fails with 500 error when cart has 0 items" (NOT "checkout broken") |
| **Environment**            | Browser, OS, build/version, URL | Chrome 126, Windows 11, staging build v2.3.1                                  |
| **Preconditions**          | State before the bug happens    | User logged in, cart empty                                                    |
| **Steps to Reproduce**     | Numbered, exact, minimal        | 1. Go to /cart 2. Click "Checkout" with 0 items                               |
| **Expected Result**        | What should happen              | Should show "Your cart is empty" message                                      |
| **Actual Result**          | What actually happened          | Page shows 500 Internal Server Error                                          |
| **Screenshots/Video/Logs** | Evidence                        | Screenshot of error, console log, network tab                                 |
| **Severity**               | Technical impact                | Major (blocks checkout flow)                                                  |
| **Priority**               | Business urgency                | High                                                                          |

### Example — Bad vs Good bug report

```
❌ BAD:
Title: "Checkout doesn't work"
Description: "I tried to checkout and it didn't work. Please fix."

✅ GOOD:
Title: Checkout returns 500 error when cart is empty
Environment: Chrome 126.0, staging (v2.3.1), https://staging.shop.com
Preconditions: Logged in as testuser@mail.com, cart contains 0 items
Steps to Reproduce:
  1. Log in as testuser@mail.com
  2. Ensure cart is empty (remove all items if any)
  3. Navigate directly to /checkout
Expected: App should redirect to /cart with message "Your cart is empty"
Actual: Page displays "500 Internal Server Error", console shows
        TypeError: Cannot read property 'total' of undefined at checkout.js:42
Severity: Major (blocks a valid user path)
Priority: High
Attachments: screenshot.png, console-log.txt
```

## 6.2 Golden Rules

1. **One bug per report** — don't bundle 3 issues into one ticket.
2. **Be reproducible** — if a dev can't reproduce it in <5 min, expect it bounced back "Cannot Reproduce."
3. **Be objective, not emotional** — describe facts, not "this is terrible UX."
4. **Attach evidence** — screenshots/videos/HAR files/console logs. A picture ends most disputes.
5. **Isolate the minimal repro** — strip away unrelated steps until you find the smallest set of actions that trigger it.

## 6.3 Bug Life Cycle

```
New → Assigned → In Progress → Fixed → Retest → Closed
                                  │        │
                                  │        └──→ Reopened (if still broken) → back to In Progress
                                  └──→ (dev disputes) → Rejected / Duplicate / Deferred
```

---

# PART 7 — ROOT CAUSE ANALYSIS (RCA)

**RCA = figuring out _why_ a bug happened, not just _that_ it happened** — so the same class of bug doesn't recur.

## 7.1 The "5 Whys" technique

```
Problem: Checkout fails with 500 error for empty cart.

Why #1: Why did it fail?
   → Because checkout.js tried to read cart.total on an undefined cart object.

Why #2: Why was cart undefined?
   → Because the API returned an empty array instead of a cart object when cart has 0 items.

Why #3: Why did the API return an empty array?
   → Because the backend query filters out carts with 0 items entirely.

Why #4: Why does the query filter out empty carts?
   → Because it was written assuming "cart always has ≥1 item" — an
     assumption baked in from an old requirement.

Why #5: Why wasn't this assumption caught?
   → Because there was no test case for "checkout with an empty cart"
     in the original test suite (a negative/edge case was missed).

ROOT CAUSE: Missing edge-case handling for empty-cart state, both in
            backend query logic and in original test coverage.
FIX: Handle empty cart explicitly in API (return proper empty-cart object,
     not filtered-out result) + add regression test case for empty-cart checkout.
```

## 7.2 Fishbone (Ishikawa) Diagram — categorizing root causes

Used when a problem could stem from multiple categories of causes:

```
                     People        Process
                       │              │
                       └──────┐  ┌────┘
                              ▼  ▼
        Environment  ──────► BUG/DEFECT ◄────── Tools
                              ▲  ▲
                       ┌──────┘  └────┐
                       │              │
                     Code          Data
```

Example categories for a software bug:

- **People**: dev misunderstood requirement
- **Process**: no code review, no test case for this scenario
- **Code**: off-by-one, race condition, null check missing
- **Data**: bad test data, unexpected production data shape
- **Environment**: works on dev, fails on staging due to config difference
- **Tools**: CI pipeline skipped a test stage

## 7.3 Why RCA matters for QA (not just devs)

As a tester, RCA helps you:

- Write **better regression test cases** targeting the actual root cause, not just the symptom
- Identify **test coverage gaps** (as in the 5-whys example above — root cause was literally "no test case existed")
- Communicate more credibly with developers ("this is a class of missing-edge-case bugs" vs just reporting symptoms one by one)

---

# PART 8 — BROWSER CACHE & FRONTEND STATE MANAGEMENT

Relevant both for **testing** (many bugs are cache/state related) and for **understanding the systems you test**.

## 8.1 Types of Browser Storage

| Storage             | Persistence                                           | Sent to server automatically?                 | Typical size limit   | Use case                                        |
| ------------------- | ----------------------------------------------------- | --------------------------------------------- | -------------------- | ----------------------------------------------- |
| **Cookies**         | Configurable (session or expiry date)                 | Yes, on every HTTP request to matching domain | ~4KB                 | Auth session tokens, tracking                   |
| **Session Storage** | Cleared when tab closes                               | No                                            | ~5-10MB              | Per-tab temp state (e.g., multi-step form data) |
| **Local Storage**   | Persists until explicitly cleared                     | No                                            | ~5-10MB              | User preferences, cached non-sensitive data     |
| **IndexedDB**       | Persists until cleared                                | No                                            | Much larger (100MB+) | Offline apps, large structured data             |
| **HTTP Cache**      | Controlled by cache headers (`Cache-Control`, `ETag`) | N/A (browser mechanism)                       | Varies               | Static assets (images, JS, CSS)                 |

## 8.2 Why This Matters for Testing

**Classic cache-related bugs to test for:**

- **Stale data after logout**: user logs out, but cached page/local storage still shows their data when browser back-button is pressed
- **Cross-user data leakage**: User A logs out, User B logs in on same browser — does User A's cached data (cart, profile) leak into User B's session?
- **Stale JS/CSS after deployment**: user has old cached `app.js`, gets a broken page after a new deploy (fixed via cache-busting filenames/hashes)
- **"Works after hard refresh" bugs**: symptom of aggressive caching; testers should always test both normal load and hard refresh (Ctrl+Shift+R)

### Example test case

```
TC: Verify no residual session data after logout
Steps:
  1. Log in as User A, add items to cart
  2. Log out
  3. Check LocalStorage/SessionStorage/Cookies (via DevTools)
  4. Log in as User B
Expected: User A's cart/session data is fully cleared before
          User B's session starts; no data bleeds across sessions
```

## 8.3 Cache-Control headers (know these for API/HTTP context)

- `Cache-Control: no-store` — never cache (sensitive data)
- `Cache-Control: no-cache` — cache but revalidate with server every time
- `Cache-Control: max-age=3600` — cache for 3600 seconds before revalidating
- `ETag` — a hash/version identifier; browser sends it back (`If-None-Match`) so server can respond `304 Not Modified` if unchanged (saves bandwidth)

---

# PART 9 — REST APIs

## 9.1 What is REST?

REST (**Re**presentational **S**tate **T**ransfer) is an architectural style for designing networked APIs, built around:

- **Resources** identified by URLs (e.g., `/users/42`, not `/getUser?id=42`)
- **Stateless** communication — each request contains everything needed; server doesn't remember previous requests
- Standard **HTTP methods** representing actions (GET/POST/PUT/PATCH/DELETE)
- Data typically exchanged as **JSON**

## 9.2 Example REST API design (a "users" resource)

| Endpoint    | Method | Purpose                  |
| ----------- | ------ | ------------------------ |
| `/users`    | GET    | List all users           |
| `/users/42` | GET    | Get user with ID 42      |
| `/users`    | POST   | Create a new user        |
| `/users/42` | PUT    | Replace user 42 entirely |
| `/users/42` | PATCH  | Update part of user 42   |
| `/users/42` | DELETE | Delete user 42           |

## 9.3 Example request/response

**Request:**

```
POST /users HTTP/1.1
Host: api.example.com
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "name": "Sharmin Akther",
  "email": "sharmin@example.com"
}
```

**Response:**

```
HTTP/1.1 201 Created
Content-Type: application/json

{
  "id": 42,
  "name": "Sharmin Akther",
  "email": "sharmin@example.com",
  "createdAt": "2026-07-24T10:00:00Z"
}
```

## 9.4 Why REST matters for QA

API testing is often **faster and more reliable than UI testing** because it skips rendering/JS entirely — you're directly checking:

- Correct status code
- Correct response body/schema
- Correct headers
- Correct behavior for invalid input (negative testing again!)

---

# PART 10 — HTTP METHODS

| Method     | Purpose                                   | Idempotent?      | Safe (no side effects)? | Has body?                 |
| ---------- | ----------------------------------------- | ---------------- | ----------------------- | ------------------------- |
| **GET**    | Retrieve a resource                       | Yes              | Yes                     | No (query params instead) |
| **POST**   | Create a new resource / trigger an action | No               | No                      | Yes                       |
| **PUT**    | Replace a resource entirely               | Yes              | No                      | Yes                       |
| **PATCH**  | Partially update a resource               | Not guaranteed\* | No                      | Yes                       |
| **DELETE** | Remove a resource                         | Yes              | No                      | Usually no                |

**Idempotent** = calling it multiple times has the _same effect_ as calling it once.

- `DELETE /users/42` called 5 times → user 42 is deleted (same end state as calling once) → idempotent
- `POST /users` called 5 times → creates 5 new users → **not** idempotent

**PUT vs PATCH — a very common interview question:**

```
Original resource: { "id": 42, "name": "Juthi", "email": "old@mail.com" }

PUT /users/42  { "name": "Juthi" }
→ Replaces ENTIRE resource. Email is now GONE (unless included in the body).
Result: { "id": 42, "name": "Juthi" }   ← email lost!

PATCH /users/42  { "name": "Juthi Rahman" }
→ Only updates the specified field(s).
Result: { "id": 42, "name": "Juthi Rahman", "email": "old@mail.com" }  ← email preserved
```

**Testing implication:** A common real bug is a backend team implementing `PATCH` behavior on a `PUT` endpoint (or vice versa) — a negative/functional test that sends a partial body to `PUT` and checks whether other fields get wiped out is a great test case.

---

# PART 11 — HTTP STATUS CODES

## 11.1 Categories

| Range | Category      | Meaning                                        |
| ----- | ------------- | ---------------------------------------------- |
| 1xx   | Informational | Request received, continuing process           |
| 2xx   | Success       | Request succeeded                              |
| 3xx   | Redirection   | Further action needed to complete request      |
| 4xx   | Client Error  | The _client_ did something wrong               |
| 5xx   | Server Error  | The _server_ failed, even with a valid request |

## 11.2 The status codes you MUST know cold

| Code    | Name                  | Meaning                                                                        | Example scenario                                                             |
| ------- | --------------------- | ------------------------------------------------------------------------------ | ---------------------------------------------------------------------------- |
| **200** | OK                    | Request succeeded                                                              | GET /users/42 returns the user                                               |
| **201** | Created               | Resource successfully created                                                  | POST /users creates a new user                                               |
| **204** | No Content            | Success, but no body returned                                                  | DELETE /users/42 succeeds, nothing to return                                 |
| **400** | Bad Request           | Malformed request / invalid syntax                                             | Sending `{"email": }` (broken JSON), or missing required field               |
| **401** | Unauthorized          | **Not authenticated** — who are you?                                           | Missing or invalid/expired auth token                                        |
| **403** | Forbidden             | **Authenticated, but not allowed** — I know who you are, but you can't do this | Logged-in regular user tries to access an admin-only endpoint                |
| **404** | Not Found             | Resource doesn't exist                                                         | GET /users/9999 (no such user)                                               |
| **422** | Unprocessable Entity  | Syntactically valid request, but **semantically/logically invalid data**       | Valid JSON, but email field = "not-an-email" (fails validation rules)        |
| **500** | Internal Server Error | Server crashed/bugged while handling a valid request                           | Unhandled exception in backend code (like the checkout.js example in Part 7) |

## 11.3 401 vs 403 — the #1 confused pair (guaranteed assessment question)

```
                Do you have valid credentials/token?
                         │
             ┌───────────┴───────────┐
            NO                       YES
             │                        │
             ▼                        ▼
        401 Unauthorized      Do you have PERMISSION for this action?
     "I don't know who               │
      you are, or your      ┌────────┴────────┐
      token is invalid"     NO                YES
                             │                  │
                             ▼                  ▼
                      403 Forbidden        200/201/etc.
                    "I know who you are,   (proceed normally)
                     but you're not
                     allowed to do this"
```

**Example:**

- You're not logged in and try to access `/admin/dashboard` → **401** (no identity at all)
- You ARE logged in as a normal user and try to access `/admin/dashboard` → **403** (identity known, but insufficient permission)

## 11.4 400 vs 422 — the second most confused pair

- **400**: The request itself is broken (malformed JSON, wrong content-type, missing required field entirely)
- **422**: The request is well-formed and parseable, but the _data fails validation_ (e.g., `"age": -5`, or `"email": "notanemail"`)

```
POST /users   Body: { "email": "bad-json"    ← 400 (malformed JSON, missing closing brace)

POST /users   Body: { "email": "not-an-email-format" }   ← 422 (valid JSON, invalid value)
```

---

# PART 12 — AUTHENTICATION (JWT, Bearer Token)

## 12.1 The Problem Auth Solves

HTTP is stateless — the server doesn't remember you between requests. Auth mechanisms let the server know **"who is making this request"** on every single call.

## 12.2 JWT (JSON Web Token)

A JWT is a compact, self-contained token with **3 parts**, separated by dots, each Base64URL-encoded:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9 . eyJzdWIiOiI0MiIsIm5hbWUiOiJKdXRoaSJ9 . SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
└──────────────┬──────────────┘  └───────────────┬───────────────┘  └──────────────┬──────────────┘
             HEADER                          PAYLOAD                          SIGNATURE
      (algorithm & token type)      (claims — user data, e.g. sub, exp)   (verifies token wasn't tampered with)
```

**Decoded example:**

```json
// Header
{ "alg": "HS256", "typ": "JWT" }

// Payload (claims)
{ "sub": "42", "name": "Sharmin Akther", "role": "user", "exp": 1785000000 }

// Signature = HMACSHA256(base64(header) + "." + base64(payload), SECRET_KEY)
```

**Key properties:**

- **Self-contained** — the server doesn't need to store session state; it just verifies the signature.
- **Signed, not encrypted** (by default) — anyone can _read_ the payload (it's just Base64, not encrypted), but they **cannot alter it** without invalidating the signature. → **Never put secrets/passwords inside a JWT payload.**
- Has an **expiry (`exp`)** — testers should always test **expired token** behavior (should return 401).

## 12.3 Bearer Token — how JWT is actually sent

```
GET /profile HTTP/1.1
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0MiJ9.SflKxw...
```

"Bearer" literally means: _whoever "bears" (holds) this token is trusted_ — the server does no further check beyond verifying the token's signature and expiry. This is why **token leakage is dangerous** (unlike a password, no extra factor is needed once you have the token).

## 12.4 Auth flow diagram

```
┌────────┐  1. POST /login (email+password)    ┌────────┐
│ Client │ ───────────────────────────────────► │ Server │
└────────┘                                       └────────┘
     ▲          2. Returns JWT (if valid)             │
     └──────────────────────────────────────────────┘
     │
     │  3. Client stores JWT (localStorage / memory / httpOnly cookie)
     ▼
┌────────┐  4. GET /profile                    ┌────────┐
│ Client │  Authorization: Bearer <JWT>  ─────► │ Server │
└────────┘                                       └────────┘
                5. Server verifies signature +
                   expiry, extracts user id,
                   returns profile data
```

## 12.5 Test cases every QA should think of for auth

| Scenario                                                                                                   | Expected Status                         |
| ---------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| Valid token, valid permissions                                                                             | 200                                     |
| No token at all                                                                                            | 401                                     |
| Malformed/tampered token (signature invalid)                                                               | 401                                     |
| Expired token                                                                                              | 401                                     |
| Valid token, but insufficient role/permission                                                              | 403                                     |
| Valid token, but for a resource the user doesn't own (e.g., User A requesting User B's private data by ID) | 403 (or 404 to avoid leaking existence) |

---

# PART 13 — BASIC JAVASCRIPT / TYPESCRIPT

## 13.1 Functions

```javascript
// Function declaration
function add(a, b) {
  return a + b;
}

// Arrow function
const add = (a, b) => a + b;

// TypeScript — typed function
function add(a: number, b: number): number {
  return a + b;
}
```

## 13.2 Loops

```javascript
// for loop
for (let i = 0; i < 5; i++) {
  console.log(i); // 0 1 2 3 4
}

// while loop
let i = 0;
while (i < 5) {
  console.log(i);
  i++;
}

// for...of (iterate values — arrays/strings)
for (const char of "hello") {
  console.log(char); // h e l l o
}

// for...in (iterate keys — objects)
const obj = { a: 1, b: 2 };
for (const key in obj) {
  console.log(key, obj[key]); // a 1, b 2
}
```

## 13.3 Strings

```javascript
const s = "Hello World";
s.length; // 11
s.toUpperCase(); // "HELLO WORLD"
s.toLowerCase(); // "hello world"
s.includes("World"); // true
s.split(" "); // ["Hello", "World"]
s.slice(0, 5); // "Hello"
s.trim(); // removes leading/trailing whitespace
s.replace("World", "JS"); // "Hello JS"
```

## 13.4 Conditions

```javascript
if (age >= 18) {
  console.log("Adult");
} else if (age >= 13) {
  console.log("Teen");
} else {
  console.log("Child");
}

// Ternary
const status = age >= 18 ? "Adult" : "Minor";

// Switch
switch (day) {
  case "Mon":
    console.log("Start of week");
    break;
  default:
    console.log("Some other day");
}
```

## 13.5 TypeScript basics (on top of JS)

```typescript
// Basic types
let age: number = 25;
let name: string = "Juthi";
let isActive: boolean = true;
let scores: number[] = [90, 85, 70];

// Interface (shape of an object)
interface User {
  id: number;
  name: string;
  email?: string; // optional property
}

function greet(user: User): string {
  return `Hello, ${user.name}`;
}

// Type union
function printId(id: number | string) {
  console.log(id);
}
```

---

# PART 14 — BASIC ALGORITHMS

These are extremely common "warm-up" questions in technical assessments. Know them cold, including edge cases.

## 14.1 Prime Number Check

```javascript
function isPrime(n) {
  if (n <= 1) return false; // 0, 1, negatives are NOT prime
  if (n === 2) return true; // 2 is the only even prime
  if (n % 2 === 0) return false; // other even numbers aren't prime
  for (let i = 3; i * i <= n; i += 2) {
    if (n % i === 0) return false;
  }
  return true;
}
```

**Why loop only to `sqrt(n)`:** if `n = a * b` and both `a, b > sqrt(n)`, then `a*b > n` — contradiction. So a factor must exist at or below `sqrt(n)`.

**Edge cases to test:** `0`, `1`, `2`, negative numbers, large prime (e.g., `97`), large composite (e.g., `100`).

## 14.2 Palindrome Check

```javascript
function isPalindrome(str) {
  const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, ""); // ignore case/punctuation
  const reversed = cleaned.split("").reverse().join("");
  return cleaned === reversed;
}

isPalindrome("Racecar"); // true
isPalindrome("A man a plan a canal Panama"); // true
isPalindrome("hello"); // false
```

**Two-pointer approach (more efficient, no extra array):**

```javascript
function isPalindromeTwoPointer(str) {
  let left = 0,
    right = str.length - 1;
  while (left < right) {
    if (str[left] !== str[right]) return false;
    left++;
    right--;
  }
  return true;
}
```

## 14.3 Reverse a String

```javascript
function reverseString(str) {
  return str.split("").reverse().join("");
}

// Manual (without built-in reverse — often what's actually asked)
function reverseStringManual(str) {
  let result = "";
  for (let i = str.length - 1; i >= 0; i--) {
    result += str[i];
  }
  return result;
}
```

## 14.4 Factorial

```javascript
// Iterative
function factorial(n) {
  if (n < 0) return undefined; // undefined for negatives
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

// Recursive
function factorialRecursive(n) {
  if (n < 0) return undefined;
  if (n === 0 || n === 1) return 1; // base case
  return n * factorialRecursive(n - 1);
}
```

**Edge cases:** `0! = 1` (by definition, easy to forget), negative input (undefined/error), large `n` (overflow risk in some languages — less of an issue in JS due to floating point, but precision is lost above ~2^53).

---

# PART 15 — SELENIUM / PLAYWRIGHT FUNDAMENTALS

## 15.1 What they are & core difference

|                  | Selenium                                                 | Playwright                                               |
| ---------------- | -------------------------------------------------------- | -------------------------------------------------------- |
| Origin           | Older (2004), industry standard for years                | Newer (Microsoft, 2020), built for modern web apps       |
| Architecture     | WebDriver protocol — separate driver process per browser | Direct browser protocol connection (faster, more stable) |
| Auto-waiting     | Manual waits often needed (`WebDriverWait`)              | **Built-in auto-waiting** for elements to be actionable  |
| Multi-browser    | Chrome, Firefox, Safari, Edge (via separate drivers)     | Chromium, Firefox, WebKit — one API                      |
| Language support | Java, Python, C#, JS, Ruby                               | JS/TS, Python, Java, C#                                  |

## 15.2 Playwright basic structure

```javascript
const { test, expect } = require("@playwright/test");

test("login with valid credentials", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/");
  await page.fill("#user-name", "standard_user");
  await page.fill("#password", "secret_sauce");
  await page.click("#login-button");
  await expect(page).toHaveURL(/.*inventory.html/);
  await expect(page.locator(".title")).toHaveText("Products");
});

test("login fails with locked out user", async ({ page }) => {
  await page.goto("https://www.saucedemo.com/");
  await page.fill("#user-name", "locked_out_user");
  await page.fill("#password", "secret_sauce");
  await page.click("#login-button");
  await expect(page.locator('[data-test="error"]')).toContainText(
    "Sorry, this user has been locked out",
  );
});
```

## 15.3 Common Playwright locator strategies

```javascript
page.locator("#login-button"); // CSS ID
page.locator(".btn-primary"); // CSS class
page.locator("text=Login"); // exact text
page.getByRole("button", { name: "Login" }); // accessibility role (preferred, modern)
page.getByTestId("login-button"); // data-testid (most robust for automation)
page.getByLabel("Password"); // associated <label>
page.getByPlaceholder("Enter your email");
```

**Why `getByTestId` / `data-testid` is preferred over CSS classes:** CSS classes change often (styling refactors), breaking tests. `data-testid` attributes exist _only_ for testing and are stable contracts between devs and QA.

## 15.4 Auto-waiting (Playwright's biggest advantage)

Playwright automatically waits for an element to be:

- Attached to the DOM
- Visible
- Stable (not animating)
- Enabled
- Not obscured by another element

...before interacting — **so you rarely need manual `sleep()`**. In Selenium, you commonly need:

```java
WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
wait.until(ExpectedConditions.elementToBeClickable(By.id("login-button")));
```

vs Playwright, which does this by default on `.click()`.

## 15.5 Assertions (Playwright)

```javascript
await expect(page.locator(".error")).toBeVisible();
await expect(page.locator(".error")).toHaveText("Invalid credentials");
await expect(page).toHaveTitle("Swag Labs");
await expect(page.locator(".cart-count")).toHaveText("2");
await expect(page.locator("#submit")).toBeDisabled();
```

---

# PART 16 — CSS SELECTORS

CSS selectors identify HTML elements for both styling AND test automation.

| Selector                           | Meaning                       | Example                 |
| ---------------------------------- | ----------------------------- | ----------------------- |
| `#id`                              | Element with specific ID      | `#login-button`         |
| `.class`                           | Element with specific class   | `.btn-primary`          |
| `tag`                              | Element type                  | `input`, `button`       |
| `tag.class`                        | Tag with class                | `button.btn-primary`    |
| `[attr]`                           | Has attribute                 | `[disabled]`            |
| `[attr="value"]`                   | Attribute equals value        | `[type="submit"]`       |
| `[attr*="value"]`                  | Attribute _contains_ value    | `[class*="error"]`      |
| `[attr^="value"]`                  | Attribute _starts with_ value | `[id^="product-"]`      |
| `[attr$="value"]`                  | Attribute _ends with_ value   | `[id$="-btn"]`          |
| `parent > child`                   | Direct child                  | `div.cart > span`       |
| `ancestor descendant`              | Any descendant (space)        | `form input`            |
| `elem:nth-child(n)`                | nth child of its parent       | `li:nth-child(2)`       |
| `elem:first-child` / `:last-child` | First/last child              | `li:first-child`        |
| `a:not(.disabled)`                 | Negation                      | `button:not(.disabled)` |
| `a, b`                             | Multiple selectors (OR)       | `.error, .warning`      |

### Example HTML → selector mapping

```html
<form id="login-form">
  <input
    type="text"
    name="username"
    class="form-input"
    data-testid="username-input"
  />
  <input
    type="password"
    name="password"
    class="form-input"
    data-testid="password-input"
  />
  <button type="submit" class="btn btn-primary" disabled>Login</button>
</form>
```

```css
#login-form                          /* the whole form */
#login-form input[type="password"]   /* the password field */
.btn.btn-primary                     /* the login button */
button[disabled]                     /* disabled button */
[data-testid="username-input"]       /* preferred automation selector */
```

---

# PART 17 — XPATH

XPath ("XML Path Language") navigates HTML/XML documents like a file path system, and is more powerful than CSS for some cases (e.g., selecting by text content, or navigating _upward_ to parents).

## 17.1 Absolute vs Relative XPath

```
Absolute:  /html/body/div[1]/form/button
           (starts from root — VERY fragile, breaks if page structure changes even slightly)

Relative:  //button[@class='btn-primary']
           (starts anywhere in the document using // — robust, preferred in real automation)
```

**Rule of thumb: always prefer relative XPath (`//...`) over absolute (`/html/...`) in real test automation.**

## 17.2 Common XPath syntax

| XPath                              | Meaning                             |
| ---------------------------------- | ----------------------------------- |
| `//tagname`                        | All elements of that tag anywhere   |
| `//tagname[@attr='value']`         | Tag with exact attribute value      |
| `//*[@id='login-button']`          | Any tag with a specific id          |
| `//button[text()='Login']`         | Button with exact visible text      |
| `//button[contains(text(),'Log')]` | Button whose text contains "Log"    |
| `//input[contains(@class,'form')]` | Attribute contains substring        |
| `//div[@class='cart']//span`       | Any descendant span inside div.cart |
| `//div[@class='cart']/span`        | Direct child span only              |

## 17.3 XPath Axes (navigating relative to a known element — very commonly tested)

```html
<div class="product-row">
  <span class="name">Backpack</span>
  <span class="price">$29.99</span>
  <button class="add-to-cart">Add to cart</button>
</div>
```

| Axis                  | Meaning                                      | Example                                           |
| --------------------- | -------------------------------------------- | ------------------------------------------------- |
| `parent::`            | Go up one level                              | `//span[@class='price']/parent::div`              |
| `ancestor::`          | Any ancestor up the tree                     | `//button/ancestor::div[@class='product-row']`    |
| `child::`             | Direct children                              | `//div[@class='product-row']/child::span`         |
| `following-sibling::` | Siblings after this element                  | `//span[@class='name']/following-sibling::button` |
| `preceding-sibling::` | Siblings before this element                 | `//button/preceding-sibling::span[1]`             |
| `following::`         | Any element after this one in document order | `//span[@class='name']/following::button[1]`      |

**Real-world use case:** "Find the 'Add to Cart' button for the product named 'Backpack'" — when there are 20 identical products on a page, you can't just select `.add-to-cart` (ambiguous, matches all 20). Instead:

```xpath
//span[text()='Backpack']/following-sibling::button[@class='add-to-cart']
```

This says: _find the span with text "Backpack", then find its sibling button_ — this is exactly how axes solve real automation problems (e.g., SauceDemo product grid).

## 17.4 XPath Functions

| Function            | Purpose                                   | Example                                   |
| ------------------- | ----------------------------------------- | ----------------------------------------- |
| `text()`            | Get visible text of element               | `//h1[text()='Products']`                 |
| `contains(a, b)`    | Substring match                           | `//div[contains(@class,'error')]`         |
| `starts-with(a, b)` | Prefix match                              | `//input[starts-with(@id,'product-')]`    |
| `normalize-space()` | Trim/collapse whitespace before comparing | `//span[normalize-space(text())='Login']` |
| `count()`           | Count matched nodes                       | `count(//li[@class='cart-item'])`         |
| `last()`            | Select the last matching node             | `(//li)[last()]`                          |
| `position()`        | Get position in node set                  | `//li[position()=2]`                      |

---

# PART 18 — HTML DOM STRUCTURE

## 18.1 The DOM (Document Object Model)

The DOM is the browser's **in-memory tree representation** of the HTML page — this tree is what CSS selectors and XPath actually query.

```
document
  └── html
        ├── head
        │     ├── title
        │     └── meta
        └── body
              ├── header
              ├── main
              │    ├── div.product-list
              │    │      ├── div.product-row
              │    │      │      ├── span.name
              │    │      │      ├── span.price
              │    │      │      └── button.add-to-cart
              │    │      └── div.product-row (repeated)
              │    └── div.cart-summary
              └── footer
```

**Key DOM concepts:**

- **Node**: any single item in the tree (element, text, comment, etc.)
- **Element node**: an HTML tag (`<div>`, `<button>`)
- **Parent/Child/Sibling**: relationships in the tree — this is exactly what XPath axes and CSS combinators (`>`, `+`, `~`) navigate.
- **Attributes**: key-value pairs on an element (`id`, `class`, `data-testid`, `disabled`)

## 18.2 Why DOM knowledge matters for automation

Every locator strategy (CSS, XPath, Playwright's `getByRole`/`getByTestId`) is ultimately just a **query language over this tree**. Understanding parent/child/sibling relationships is _the_ skill that lets you write robust, unambiguous locators for elements that don't have unique IDs.

---

# PART 19 — DYNAMIC ELEMENT HANDLING

Real apps rarely have neat, static, uniquely-ID'd elements. Dynamic element handling is about writing locators that **survive** re-renders, dynamic IDs, and repeated components.

## 19.1 The problem: dynamically generated attributes

```html
<!-- Framework (React/Vue) generated IDs — these CHANGE on every render/build -->
<button id="button-8f3a29">Add to cart</button>
<button id="button-1c9e42">Add to cart</button>
```

If your test hardcodes `#button-8f3a29`, it will break the next time the app re-renders/deploys — **this is one of the most common causes of flaky/broken automated tests.**

## 19.2 The solution: `data-testid` and `aria-label`

```html
<button data-testid="add-to-cart-backpack" aria-label="Add Backpack to cart">
  Add to cart
</button>
```

```javascript
// Playwright — stable regardless of internal framework re-renders
page.getByTestId("add-to-cart-backpack");
page.getByLabel("Add Backpack to cart");
```

**Why these are preferred:**

- `data-testid` exists _solely_ for testing — devs won't casually change it during a styling refactor (unlike classes).
- `aria-label` serves double duty: accessibility (screen readers) **and** stable test locators — a great "ask for this to be added" request when working with dev teams.

## 19.3 Handling dynamic _lists_ (e.g., product grids, cart items)

```html
<ul class="cart-items">
  <li data-testid="cart-item" data-product-id="101">Backpack - $29.99</li>
  <li data-testid="cart-item" data-product-id="102">Water Bottle - $12.99</li>
</ul>
```

```javascript
// Get ALL cart items
const items = page.getByTestId("cart-item");
await expect(items).toHaveCount(2);

// Get a SPECIFIC item using contains() / filter
const backpackItem = page.locator('[data-testid="cart-item"]', {
  hasText: "Backpack",
});

// XPath equivalent using contains()
//li[@data-testid='cart-item'][contains(text(),'Backpack')]
```

## 19.4 Waiting for dynamically loaded elements (e.g., after an API call / spinner)

```javascript
// Playwright — wait for element to actually appear before interacting
await page.waitForSelector('[data-testid="cart-item"]');

// Wait for a loading spinner to DISAPPEAR before proceeding
await page.locator(".spinner").waitFor({ state: "hidden" });

// Wait for network response (more robust than waiting for a fixed time)
await page.waitForResponse(
  (resp) => resp.url().includes("/api/cart") && resp.status() === 200,
);
```

**Anti-pattern to avoid (and to flag if you see it in existing test code):**

```javascript
await page.waitForTimeout(5000); // ❌ fixed sleep — slow, flaky, and arbitrary
```

Always prefer **condition-based waits** (element visible, network response received) over fixed-time sleeps — this is a core automation best practice and a good thing to mention if asked "how would you improve this test suite."

---

# QUICK-REFERENCE CHEAT SHEET (last-minute review)

- **SDLC vs STLC**: SDLC = whole software process; STLC = testing sub-process inside it
- **Smoke → Sanity → Regression**: broad/shallow first check → narrow/shallow fix check → broad/deep full check
- **Severity** = technical impact (tester decides) | **Priority** = business urgency (PM decides)
- **BVA**: test min-1, min, min+1, max-1, max, max+1
- **EP**: one representative value per class (valid classes + invalid classes)
- **RCA**: 5 Whys — keep asking "why" until you hit the systemic cause, not just the symptom
- **401** = who ARE you? (no/invalid identity) | **403** = I know you, but you can't do this (permission)
- **400** = broken request format | **422** = well-formed request, invalid data/values
- **PUT** replaces the whole resource | **PATCH** updates part of it
- **JWT** = header.payload.signature — signed (tamper-proof) but NOT encrypted (readable) — never put secrets in it
- **Absolute XPath** (`/html/...`) = fragile | **Relative XPath** (`//...`) = robust — always prefer relative
- **`data-testid`** > CSS class/dynamic ID for automation stability
- Prefer **condition-based waits** (`waitForSelector`, `waitForResponse`) over fixed `sleep()`/`waitForTimeout()`
