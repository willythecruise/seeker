# Orion — Engineering Assessment Suite

A self-contained, timed testing suite for software-engineering candidates, with a full
admin console and a candidate portal. The interface follows a calm, Apple-inspired
design language: neutral canvas, subtle surface elevation, one refined accent color,
clean outline icons, and generous whitespace.

## Run it

Open **`index.html`** in any modern browser — no build step, no server, no dependencies.
Everything (question bank, tests, results, in-progress attempts) persists in
`localStorage`, so the suite survives reloads.

A published demo test (*Engineering Foundations — Screening*) is seeded on first run so
you can try the candidate flow immediately.

## What's inside

### Admin console
- **Dashboard** — counts, average score, pass rate, question coverage per category, recent attempts.
- **Tests** — create, edit, duplicate, preview, publish/unpublish, delete.
- **Test editor** — per-test configuration:
  - **Timed**: duration in minutes (stepper)
  - **Category selection**: multi-select chips across all 8 domains
  - **Difficulty focus**: Beginner / Balanced / Advanced weighting
  - **Question count** (clamped to the matching pool), pass mark, auto-submit at zero,
    reveal-answers toggle, question shuffle
- **Question bank** — 60 built-in questions; search, filter by category/difficulty/type;
  add, edit, delete questions; reset to defaults.
- **Results** — every attempt with score, pass/fail, time used, per-category breakdown,
  and a full answer review with explanations.

### Candidate portal
- Published-test list with duration, question count, pass mark, and category chips.
- Timed runner with a live countdown (warns under 5 min, pulses under 1 min),
  question navigator palette, flag-for-review, keyboard shortcuts
  (`1–4` answer, `F` flag, `←`/`→` navigate), and progress bar.
- **Auto-submit** when time expires (configurable per test).
- Leave & resume: progress and remaining time are saved mid-test.
- Instant results: score ring, verdict, time used, per-category breakdown, and a
  per-question review with correct answers and explanations.

## Question bank (802 questions)

| Category                     | Count | Category                     | Count |
|------------------------------|-------|------------------------------|-------|
| System Design                | 30    | C#                           | 28    |
| Frontend (React / Next.js)   | 64    | Java                         | 28    |
| Backend (Node.js)            | 29    | Python                       | 28    |
| Database — MongoDB           | 14    | .NET / ASP.NET Core          | 75    |
| Database — PostgreSQL        | 29    | Spring Boot                  | 75    |
| General Coding Practice      | 23    | Django                       | 62    |
| DevOps                       | 76    | TypeScript                   | 57    |
| Solutions Architecture       | 11    | Go                           | 59    |
|                              |       | Rust                         | 43    |
|                              |       | **Data Structures & Algorithms** | **36** |

**Six question types** (TestGorilla-style):
- **Multiple choice** (616) · **Fill in the blank** (105) · **Multi-select / choose-all-that-apply** (16) · **Matching pairs** (26) · **Ordering / ranking** (17) · **Write-code challenges** (22)

Every question has an explanation shown in the answer review; 14 include code snippets.
Difficulty: 103 beginner / 279 intermediate / 420 advanced.

The bank covers classic interview topics plus deep senior-level material drawn from real
engineering conversations across **19 categories** — including full-depth banks for C#, Java,
Python, .NET/ASP.NET Core, Spring Boot, Django, TypeScript, Go, and Rust, each covering
language fundamentals through advanced framework and concurrency internals.

### Write-code challenges
Coding questions present a prompt + starter code (defining `solution(...)`) in **JavaScript
or Python**. Candidates edit the code, press **Run** to self-test against a sample, and
submit — the server executes the code in a sandboxed VM (JS) or subprocess (Python) against
**hidden test cases**, and grading reports `passed/total` per question in the review.

### DSA suite
A dedicated `Data Structures & Algorithms` category with **22 write-code challenges**
(two-sum, valid parentheses, Kadane, binary search, sliding window, missing number, XOR
single-number, majority voting, Fibonacci, plus-one, max-profit, move-zeroes, and more),
**10 theory questions** (stacks, queues, hash maps, heaps, Dijkstra, traversal order,
complexities), and **4 matching/ordering** items (structure→use-case, algorithm→complexity,
binary-search steps, quicksort steps).

The bank covers classic interview topics plus deep senior-level material drawn from real
engineering conversations:

- **React internals & state** — batching, Fiber phases, hydration, stale closures,
  `useMemo` vs `useCallback`, Context re-renders, normalization, offline-first sync,
  Redux vs Context, lifting state, useReducer, observer/higher-order concepts
- **Coding challenges** — debounce implementation, useReducer carts, server-side vs
  client-side pagination, AbortController, lazy images, CSS Grid auto-fit, IndexedDB
  offline storage, MongoDB bulk inserts
- **Distributed systems & databases** — CAP/consistency models, junction-table schema
  design, isolation levels, optimistic locking, replication, partitioning, N+1, second-
  highest salary, top-rated aggregation (SQL + MongoDB), rate limiting (token bucket)
- **Full-stack & security** — JWT transport, password hashing, SQL injection, stored XSS,
  CORS, HSTS, 429 rate limits, upload progress, offline conflict resolution, webhooks
- **Production troubleshooting & OOP** — memory leaks, cache stampedes, incident response,
  SOLID, dependency injection, Singleton, Repository, thread safety, queue-with-two-stacks
- **Languages** — C# (LINQ, async/await, records, IDisposable, readonly vs const,
  value/reference types, delegates, Span<T>, reflection, generics, ConcurrentDictionary),
  Java (JVM, collections, streams, GC, equals/hashCode, volatile, try-with-resources),
  Python (data structures, comprehensions, GIL, generators, asyncio, context managers)
- **Frameworks** — .NET/ASP.NET Core (middleware, DI, EF Core, BackgroundService,
  DbContext lifetimes, IHttpClientFactory, JWT auth, IAsyncEnumerable, Options pattern,
  minimal APIs, SignalR, gRPC, Serilog, Polly, health checks, CORS, rate limiting,
  API versioning, Swagger, user secrets) and Spring Boot (auto-config, beans,
  @RestController, Spring Data JPA, Security, Actuator, @Transactional,
  @ConfigurationProperties, AOP, @ControllerAdvice, validation, WebClient, Resilience4j,
  caching, scheduling, Flyway, HikariCP, Feign, @Async, Micrometer, Docker, Config)
  and Django (MTV, ORM, migrations, urls, views, templates, admin, DRF, CSRF,
  select_related/prefetch_related, F() expressions, select_for_update, signals,
  management commands, Channels, SimpleJWT, throttling, caching, collectstatic,
  ATOMIC_REQUESTS, security defaults)
- **TypeScript** — superset, interface vs type, unions, any vs unknown, never, generics,
  inference, strict mode, narrowing, discriminated unions, keyof/typeof, mapped and
  conditional types, utility types (Partial, Pick, Record, Readonly, Exclude, ReturnType),
  tuples, enums vs unions, as const, satisfies, .d.ts, noImplicitAny, declaration merging,
  overloads, assertions, import type, tsconfig, structural & branded types, template
  literal and variadic tuple types
- **Go** — goroutines, channels, go keyword, defer, structs, implicit interfaces, pointers,
  slices vs arrays, maps, error handling, make vs new, methods, modules, build tools,
  gofmt, WaitGroup/Mutex/RWMutex, select, buffered channels, race detector, context,
  JSON tags, http.Handler, goroutine leaks, errors.Is/As/%w, init, embedding, generics,
  any, blank identifier, variadics, strings.Builder, GC, go vet
- **Backend engineering** — REST, connection pools, idempotency, cursor pagination,
  circuit breakers, RED monitoring, continuous delivery, contract testing, outbox pattern
- **DevOps & AWS** — blue-green/canary, secrets management, configuration drift, ELK,
  vulnerability scanning, GDPR, HPA, GitHub Actions, service mesh, container security,
  plus AWS: Global Accelerator, WAF, IAM roles, Organizations/SCPs, GuardDuty, cost
  optimization (RIs, Spot, Intelligent-Tiering, DynamoDB on-demand), DAX, Provisioned
  Concurrency, MSK, Cluster Autoscaler, StackSets, CDK, SSE-KMS, NAT Gateway, VPC,
  Logs Insights, Beanstalk, lifecycle policies, X-Ray, ElastiCache, least privilege

## Seeded demo tests (24)

On first run (or via `node tools/seed-demo-tests.js`) the app seeds a ready-made test catalog:

**General (published)** — Engineering Foundations · Frontend Engineering (React/Next.js) · Backend Engineering (Node.js) · Database Mastery (MongoDB + PostgreSQL) · DevOps & AWS Cloud · System Design & Architecture · Senior Full-Stack Gauntlet · Junior Level Assessment · Mid-Level General Assessment · Quick Screening (10 questions) · Coding Practice Sprint

**Languages & frameworks (published)** — C# Fundamentals · Java Fundamentals · Python Fundamentals · .NET & ASP.NET Core · Spring Boot · Django Framework · TypeScript Fundamentals · Go Fundamentals · Rust Fundamentals · Rust Systems Programming

**Backend / full-stack engineering (published)** — Backend Engineering — C# & .NET · Backend Engineering — Java & Spring · Backend Engineering — Python · Backend Engineering — Python & Django · Backend Engineering — Go · Backend Engineering — Rust · TypeScript Full-Stack

**Skills sampler (published)** — Skills Sampler — All Question Types (one of each: MCQ, multi-select, fill, matching, ordering)

**Data structures & algorithms (published)** — Data Structures & Algorithms — Fundamentals · DSA Coding Challenge (graded by hidden test cases)

**Drafts (11)** — Frontend Performance & Internals · Database Design & Query Optimization · AWS Services & Architecture Quiz · React State Management Special · Polyglot Backend Gauntlet · Advanced .NET & C# · Advanced Spring Boot & Java · Advanced TypeScript Patterns · Advanced Go & Concurrency · Matching & Ordering Challenge · DSA Marathon

Each defines its own duration, pass mark, difficulty focus, question count, and category set — edit or unpublish any of them from the admin console.

## Project structure

```
orion/
├── index.html          ← the app frontend (served by the Express server)
├── server.js           ← Express + MongoDB server (start with `npm start`)
├── .env                ← MONGO_URI, DB_NAME, PORT (copy from .env.example)
├── package.json
├── README.md
├── src/                ← frontend source (concatenated by the build script)
│   ├── shell.html
│   ├── styles.css      ← design system
│   ├── questions.js    ← built-in question bank (assembled from part-questions-*.js)
│   ├── part-questions-1..23.js
│   └── app-core.js / app-api.js / app-console.js / app-candidate.js / app-init.js
├── server/             ← backend source
│   ├── models.js       ← Mongoose schemas (Admin, Session, Question, Test, Attempt)
│   ├── auth.js         ← login/register/session middleware
│   ├── adminRoutes.js  ← admin API (stats, questions, tests, attempts, admins)
│   ├── candidateRoutes.js ← candidate API (tests, start, answers, submit)
│   ├── seed.js         ← question seeding + first-admin bootstrap
│   ├── lib.js          ← grading, sampling, shuffling (shared logic)
│   └── data/questions.cjs ← seed file (generated by build)
└── tools/
    ├── build.py        ← python3 tools/build.py → regenerates index.html + seed data
    ├── test-e2e.js     ← end-to-end suite (drives the UI against the live server + MongoDB)
    ├── seed-demo-tests.js ← idempotently seed the 15 demo tests
    ├── capture.js      ← headless-Chrome screenshot walkthrough
    └── shots/          ← the generated screenshots
```

## Run it

1. `npm install`
2. `npm start` — connects to MongoDB (URI in `.env`), seeds 146 built-in questions,
   creates the first admin (`admin` / `admin1234` by default), and serves the app on
   <http://localhost:3000>.
3. Open <http://localhost:3000> — sign in with the admin account.

Everything — questions, tests, attempts/answers, and admins — is stored in MongoDB.

## Extending

- **Add questions**: edit `src/part-questions-*.js` (or use the in-app editor), then
  `python3 tools/build.py` and restart the server (or call the "Reseed bank" button).
  Question schema:
  `{ id, cat, diff: beginner|intermediate|advanced, type: mcq|fill,
     q, code?, options[4] + answer(index) | answer[accepted variants], explain }`
- **Rebuild**: `python3 tools/build.py` from `orion/`.
- **Verify**: `NODE_PATH=/tmp/node_modules node tools/test-e2e.js` (run from `orion/`,
  with the server running).
