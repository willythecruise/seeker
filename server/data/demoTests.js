/* ============================================================
   Orion — demo test seeds
   Inserted on first run (when no tests exist) or via
   tools/seed-demo-tests.js. Category ids and diffFocus match
   the question bank.
   ============================================================ */
'use strict';

const ALL_CATS = ['system-design', 'frontend', 'backend', 'db-mongodb', 'db-postgres', 'coding', 'devops', 'solutions'];

const DEMO_TESTS = [
  {
    name: 'Engineering Foundations — Screening',
    description: 'A balanced 20-question check across all eight domains. Beginner to advanced, 30 minutes, 70% to pass.',
    durationMin: 20, passPct: 75, categories: ALL_CATS,
    diffFocus: 'advanced', count: 20, shuffle: true, autoSubmit: true, showAnswers: true, published: true
  },
  {
    name: 'Frontend Engineering — React & Next.js',
    description: 'Hooks, rendering, hydration, and state management for mid-to-senior frontend candidates.',
    durationMin: 20, passPct: 75, categories: ['frontend'],
    diffFocus: 'advanced', count: 20, shuffle: true, autoSubmit: true, showAnswers: true, published: true
  },
  {
    name: 'Backend Engineering — Node.js & APIs',
    description: 'Event loop, async patterns, security, and API design for backend and full-stack candidates.',
    durationMin: 20, passPct: 75, categories: ['backend'],
    diffFocus: 'advanced', count: 20, shuffle: true, autoSubmit: true, showAnswers: true, published: true
  },
  {
    name: 'Database Mastery — MongoDB & PostgreSQL',
    description: 'Indexes, query design, transactions, and consistency across both MongoDB and PostgreSQL.',
    durationMin: 20, passPct: 75, categories: ['db-mongodb', 'db-postgres'],
    diffFocus: 'advanced', count: 20, shuffle: true, autoSubmit: true, showAnswers: true, published: true
  },
  {
    name: 'DevOps & AWS Cloud',
    description: 'CI/CD, Kubernetes, infrastructure as code, and core AWS services for platform engineers.',
    durationMin: 25, passPct: 75, categories: ['devops', 'solutions'],
    diffFocus: 'advanced', count: 25, shuffle: true, autoSubmit: true, showAnswers: true, published: true
  },
  {
    name: 'System Design & Architecture',
    description: 'Scaling, consistency, caching, and architecture trade-offs. Weighted toward advanced questions.',
    durationMin: 25, passPct: 80, categories: ['system-design', 'solutions'],
    diffFocus: 'advanced', count: 15, shuffle: true, autoSubmit: true, showAnswers: true, published: true
  },
  {
    name: 'Senior Full-Stack Gauntlet',
    description: '30 hard questions across every domain — the full pressure test for senior engineers.',
    durationMin: 35, passPct: 85, categories: ALL_CATS,
    diffFocus: 'advanced', count: 30, shuffle: true, autoSubmit: true, showAnswers: true, published: true
  },
  {
    name: 'Junior Level Assessment',
    description: 'Foundational questions across all domains, weighted toward beginners. Great first-round screen.',
    durationMin: 15, passPct: 65, categories: ALL_CATS,
    diffFocus: 'balanced', count: 20, shuffle: true, autoSubmit: true, showAnswers: true, published: true
  },
  {
    name: 'Mid-Level General Assessment',
    description: 'A well-rounded, balanced test across all eight domains for mid-level candidates.',
    durationMin: 20, passPct: 75, categories: ALL_CATS,
    diffFocus: 'advanced', count: 20, shuffle: true, autoSubmit: true, showAnswers: true, published: true
  },
  {
    name: 'Quick Screening — 10 Questions',
    description: 'A 15-minute balanced snapshot across every domain. Ideal for initial filtering.',
    durationMin: 10, passPct: 65, categories: ALL_CATS,
    diffFocus: 'advanced', count: 10, shuffle: true, autoSubmit: true, showAnswers: true, published: true
  },
  {
    name: 'Coding Practice Sprint',
    description: 'Algorithms, complexity, and clean-coding principles plus hands-on JavaScript patterns.',
    durationMin: 10, passPct: 70, categories: ['coding', 'frontend'],
    diffFocus: 'advanced', count: 15, shuffle: true, autoSubmit: true, showAnswers: true, published: true
  },
  {
    name: 'Frontend Performance & Internals (Draft)',
    description: 'Memoization, batching, virtualization, and rendering internals. Draft — edit and publish when ready.',
    durationMin: 25, passPct: 80, categories: ['frontend'],
    diffFocus: 'advanced', count: 20, shuffle: true, autoSubmit: true, showAnswers: true, published: false
  },
  {
    name: 'Database Design & Query Optimization (Draft)',
    description: 'Schema design, index planning, and query tuning for both PostgreSQL and MongoDB. Draft.',
    durationMin: 20, passPct: 80, categories: ['db-postgres', 'db-mongodb'],
    diffFocus: 'advanced', count: 15, shuffle: true, autoSubmit: true, showAnswers: true, published: false
  },
  {
    name: 'AWS Services & Architecture Quiz (Draft)',
    description: 'A deep AWS objective quiz — services, security, scaling, and DR patterns. Draft.',
    durationMin: 25, passPct: 75, categories: ['devops', 'solutions'],
    diffFocus: 'advanced', count: 30, shuffle: true, autoSubmit: true, showAnswers: true, published: false
  },
  {
    name: 'React State Management Special (Draft)',
    description: 'Context vs Redux, normalization, offline sync, and reducer design. Draft.',
    durationMin: 20, passPct: 75, categories: ['frontend'],
    diffFocus: 'advanced', count: 15, shuffle: true, autoSubmit: true, showAnswers: true, published: false
  },

  /* ── Programming languages, frameworks & backend engineering ── */
  {
    name: 'C# Fundamentals',
    description: 'Language core — types, LINQ, async, records, and memory management for C# developers.',
    durationMin: 15, passPct: 70, categories: ['cs'],
    diffFocus: 'advanced', count: 15, shuffle: true, autoSubmit: true, showAnswers: true, published: true
  },
  {
    name: 'Java Fundamentals',
    description: 'JVM, collections, streams, concurrency, and the object model for Java developers.',
    durationMin: 15, passPct: 70, categories: ['java'],
    diffFocus: 'advanced', count: 15, shuffle: true, autoSubmit: true, showAnswers: true, published: true
  },
  {
    name: 'Python Fundamentals',
    description: 'Syntax, data structures, generators, the GIL, and async for Python engineers.',
    durationMin: 15, passPct: 70, categories: ['python'],
    diffFocus: 'advanced', count: 15, shuffle: true, autoSubmit: true, showAnswers: true, published: true
  },
  {
    name: '.NET & ASP.NET Core',
    description: 'Middleware, DI, EF Core, background services, and API security on the .NET stack.',
    durationMin: 20, passPct: 75, categories: ['dotnet'],
    diffFocus: 'advanced', count: 20, shuffle: true, autoSubmit: true, showAnswers: true, published: true
  },
  {
    name: 'Spring Boot',
    description: 'IoC, beans, REST controllers, Spring Data JPA, security, and Actuator on the Java stack.',
    durationMin: 20, passPct: 75, categories: ['springboot'],
    diffFocus: 'advanced', count: 20, shuffle: true, autoSubmit: true, showAnswers: true, published: true
  },
  {
    name: 'Backend Engineering — C# & .NET',
    description: 'Language, framework, and engineering principles combined for .NET backend roles.',
    durationMin: 20, passPct: 75, categories: ['cs', 'dotnet', 'backend-eng'],
    diffFocus: 'advanced', count: 20, shuffle: true, autoSubmit: true, showAnswers: true, published: true
  },
  {
    name: 'Backend Engineering — Java & Spring',
    description: 'Language, framework, and engineering principles combined for Java backend roles.',
    durationMin: 20, passPct: 75, categories: ['java', 'springboot', 'backend-eng'],
    diffFocus: 'advanced', count: 20, shuffle: true, autoSubmit: true, showAnswers: true, published: true
  },
  {
    name: 'Backend Engineering — Python',
    description: 'Language depth plus backend engineering practice for Python backend roles.',
    durationMin: 20, passPct: 70, categories: ['python', 'backend-eng'],
    diffFocus: 'advanced', count: 18, shuffle: true, autoSubmit: true, showAnswers: true, published: true
  },
  {
    name: 'Polyglot Backend Gauntlet (Draft)',
    description: 'C#, Java, and Python across their frameworks and shared backend engineering — advanced, 60 minutes.',
    durationMin: 35, passPct: 85, categories: ['cs', 'java', 'python', 'dotnet', 'springboot', 'backend-eng'],
    diffFocus: 'advanced', count: 30, shuffle: true, autoSubmit: true, showAnswers: true, published: false
  },

  /* ── Django & Python web ───────────────────────────────────── */
  {
    name: 'Django Framework',
    description: 'MTV, ORM, migrations, templates, DRF, auth, and production deployment for Django developers.',
    durationMin: 20, passPct: 75, categories: ['django'],
    diffFocus: 'advanced', count: 18, shuffle: true, autoSubmit: true, showAnswers: true, published: true
  },
  {
    name: 'Backend Engineering — Python & Django',
    description: 'Python language depth, Django framework, and shared backend engineering principles.',
    durationMin: 20, passPct: 75, categories: ['python', 'django', 'backend-eng'],
    diffFocus: 'advanced', count: 20, shuffle: true, autoSubmit: true, showAnswers: true, published: true
  },
  {
    name: 'Advanced .NET & C#',
    description: 'Async streams, options pattern, minimal APIs, SignalR, gRPC, resilience, and rate limiting — advanced.',
    durationMin: 25, passPct: 80, categories: ['dotnet', 'cs'],
    diffFocus: 'advanced', count: 20, shuffle: true, autoSubmit: true, showAnswers: true, published: false
  },
  {
    name: 'Advanced Spring Boot & Java',
    description: 'Configuration binding, AOP, WebClient, resilience, caching, and cloud patterns — advanced.',
    durationMin: 25, passPct: 80, categories: ['springboot', 'java'],
    diffFocus: 'advanced', count: 20, shuffle: true, autoSubmit: true, showAnswers: true, published: false
  },

  /* ── TypeScript & Go ──────────────────────────────────────── */
  {
    name: 'TypeScript Fundamentals',
    description: 'Static typing, unions, generics, utility types, and tsconfig for TypeScript developers.',
    durationMin: 15, passPct: 70, categories: ['typescript'],
    diffFocus: 'advanced', count: 18, shuffle: true, autoSubmit: true, showAnswers: true, published: true
  },
  {
    name: 'Go Fundamentals',
    description: 'Goroutines, channels, structs, error handling, and the standard library for Go engineers.',
    durationMin: 15, passPct: 70, categories: ['go'],
    diffFocus: 'advanced', count: 18, shuffle: true, autoSubmit: true, showAnswers: true, published: true
  },
  {
    name: 'TypeScript Full-Stack',
    description: 'TypeScript across frontend (React typing) and backend (Node) plus shared engineering practice.',
    durationMin: 20, passPct: 75, categories: ['typescript', 'frontend', 'backend'],
    diffFocus: 'advanced', count: 20, shuffle: true, autoSubmit: true, showAnswers: true, published: true
  },
  {
    name: 'Backend Engineering — Go',
    description: 'Language depth plus shared backend engineering principles for Go backend roles.',
    durationMin: 20, passPct: 75, categories: ['go', 'backend-eng'],
    diffFocus: 'advanced', count: 20, shuffle: true, autoSubmit: true, showAnswers: true, published: true
  },
  {
    name: 'Advanced TypeScript Patterns (Draft)',
    description: 'Mapped, conditional, and template literal types, strict mode, and branding — advanced.',
    durationMin: 25, passPct: 80, categories: ['typescript', 'frontend'],
    diffFocus: 'advanced', count: 20, shuffle: true, autoSubmit: true, showAnswers: true, published: false
  },
  {
    name: 'Advanced Go & Concurrency (Draft)',
    description: 'Channels, select, context, race detection, and Go runtime internals — advanced.',
    durationMin: 25, passPct: 80, categories: ['go'],
    diffFocus: 'advanced', count: 20, shuffle: true, autoSubmit: true, showAnswers: true, published: false
  },

  /* ── Rust + mixed-type sampler ────────────────────────────── */
  {
    name: 'Rust Fundamentals',
    description: 'Ownership, borrowing, lifetimes, enums, traits, and error handling for Rust engineers.',
    durationMin: 20, passPct: 70, categories: ['rust'],
    diffFocus: 'advanced', count: 20, shuffle: true, autoSubmit: true, showAnswers: true, published: true
  },
  {
    name: 'Rust Systems Programming',
    description: 'Concurrency, unsafe, async, smart pointers, and performance — advanced Rust.',
    durationMin: 25, passPct: 80, categories: ['rust'],
    diffFocus: 'advanced', count: 20, shuffle: true, autoSubmit: true, showAnswers: true, published: true
  },
  {
    name: 'Backend Engineering — Rust',
    description: 'Language depth plus shared backend engineering principles for Rust backend roles.',
    durationMin: 20, passPct: 75, categories: ['rust', 'backend-eng'],
    diffFocus: 'advanced', count: 20, shuffle: true, autoSubmit: true, showAnswers: true, published: true
  },
  {
    name: 'Skills Sampler — All Question Types',
    description: 'One of everything: multiple choice, multi-select, fill-in-the-blank, matching pairs, and ordering.',
    durationMin: 10, passPct: 65, categories: ALL_CATS,
    diffFocus: 'advanced', count: 15, shuffle: true, autoSubmit: true, showAnswers: true, published: true
  },
  {
    name: 'Matching & Ordering Challenge (Draft)',
    description: 'A focused drill on matching pairs and ordering questions across all domains. Draft.',
    durationMin: 10, passPct: 75, categories: ALL_CATS,
    diffFocus: 'advanced', count: 12, shuffle: true, autoSubmit: true, showAnswers: true, published: false
  },

  /* ── Data structures & algorithms ─────────────────────────── */
  {
    name: 'Data Structures & Algorithms — Fundamentals',
    description: 'Stacks, queues, maps, trees, and complexity analysis for every developer.',
    durationMin: 25, passPct: 65, categories: ['dsa'],
    diffFocus: 'balanced', count: 15, shuffle: true, autoSubmit: true, showAnswers: true, published: true
  },
  {
    name: 'DSA Coding Challenge',
    description: 'Write real code: two-sum, binary search, sliding window, Kadane, and more — graded by hidden test cases.',
    durationMin: 45, passPct: 60, categories: ['dsa'], types: ['code'],
    diffFocus: 'balanced', count: 12, shuffle: true, autoSubmit: true, showAnswers: true, published: true
  },
  {
    name: 'DSA Marathon (Draft)',
    description: 'Theory plus coding challenges, weighted toward harder problems. Draft.',
    durationMin: 60, passPct: 70, categories: ['dsa', 'coding'],
    diffFocus: 'advanced', count: 20, shuffle: true, autoSubmit: true, showAnswers: true, published: false
  },
  {
    name: 'DSA — Advanced Coding Challenge',
    description: 'Harder problems: graphs, DP, trees, and interval/bit tricks. All write-code, graded by hidden tests.',
    durationMin: 60, passPct: 60, categories: ['dsa'], types: ['code'],
    diffFocus: 'advanced', count: 8, shuffle: true, autoSubmit: true, showAnswers: true, published: true
  },
  {
    name: 'DSA — Theory Sprint',
    description: 'Rapid-fire data-structures and algorithm theory. No code required.',
    durationMin: 20, passPct: 70, categories: ['dsa'], types: ['mcq', 'multi', 'fill'],
    diffFocus: 'balanced', count: 20, shuffle: true, autoSubmit: true, showAnswers: true, published: true
  },
  {
    name: 'DSA — Mixed Formats',
    description: 'A little of everything: theory, matching pairs, ordering, and a coding question or two.',
    durationMin: 30, passPct: 70, categories: ['dsa'],
    diffFocus: 'balanced', count: 15, shuffle: true, autoSubmit: true, showAnswers: true, published: true
  },
  {
    name: 'DSA — Trees, Graphs & DP Focus',
    description: 'Deep dive into the harder DSA territory, weighted toward advanced problems.',
    durationMin: 45, passPct: 75, categories: ['dsa'],
    diffFocus: 'advanced', count: 15, shuffle: true, autoSubmit: true, showAnswers: true, published: true
  },
  {
    name: 'DSA Marathon II (Draft)',
    description: 'The full gauntlet — theory, matching/ordering, and the hardest coding challenges. Draft.',
    durationMin: 90, passPct: 70, categories: ['dsa'],
    diffFocus: 'advanced', count: 30, shuffle: true, autoSubmit: true, showAnswers: true, published: false
  },
  {
    name: 'DSA — Hard Problems',
    description: 'Dijkstra, advanced DP, trees, and bit tricks. All write-code, hidden-test grading, 90 minutes.',
    durationMin: 90, passPct: 55, categories: ['dsa'], types: ['code'], tags: ['hard'],
    diffFocus: 'advanced', count: 8, shuffle: true, autoSubmit: true, showAnswers: true, published: true
  },
  {
    name: 'DSA — Coding Sprint',
    description: 'A fast coding round: 10 write-code problems across easy and medium DSA.',
    durationMin: 40, passPct: 60, categories: ['dsa'], types: ['code'],
    diffFocus: 'balanced', count: 10, shuffle: true, autoSubmit: true, showAnswers: true, published: true
  },
  {
    name: 'DSA — LeetCode Hard',
    description: 'Genuinely hard problems — median of two sorted arrays, Dijkstra, tree path sums, and design problems. All write-code.',
    durationMin: 90, passPct: 50, categories: ['dsa'], types: ['code'], tags: ['hard'],
    diffFocus: 'advanced', count: 10, shuffle: true, autoSubmit: true, showAnswers: true, published: true
  },
  {
    name: 'DSA — Design & Data Structures',
    description: 'Implement data structures from scratch: LRU Cache, Min Stack, Queue using Stacks, TimeMap, MedianFinder.',
    durationMin: 45, passPct: 50, categories: ['dsa'], types: ['code'], tags: ['design'],
    diffFocus: 'advanced', count: 5, shuffle: true, autoSubmit: true, showAnswers: true, published: true
  },
  {
    name: 'DSA — LeetCode Hard (Draft)',
    description: 'A second hard-only gauntlet for elite candidates. Draft.',
    durationMin: 120, passPct: 45, categories: ['dsa'], types: ['code'], tags: ['hard'],
    diffFocus: 'advanced', count: 12, shuffle: true, autoSubmit: true, showAnswers: true, published: false
  }
];

module.exports = DEMO_TESTS;
