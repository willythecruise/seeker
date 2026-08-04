/* Orion question bank — part 21: matching & ordering (TestGorilla-style) across subjects */
  /* ── Matching pairs ───────────────────────────────────────── */
  { id: 'mo01', cat: 'system-design', diff: 'intermediate', type: 'matching',
    q: 'Match each caching strategy to its defining behaviour.',
    pairs: [
      { l: 'TTL', r: 'Entries expire after a fixed time' },
      { l: 'Write-through', r: 'Every write also updates the cache' },
      { l: 'Stale-while-revalidate', r: 'Serve stale data while refreshing in the background' },
      { l: 'Cache stampede', r: 'Many misses at once hammer the source' }
    ],
    explain: 'TTL bounds freshness, write-through keeps cache in sync, SWR serves stale-then-refresh, and stampedes are the failure mode you prevent with single-flight.' },
  { id: 'mo02', cat: 'frontend', diff: 'intermediate', type: 'matching',
    q: 'Match each React concept to its correct description.',
    pairs: [
      { l: 'useMemo', r: 'Memoizes a computed value' },
      { l: 'useCallback', r: 'Memoizes a function reference' },
      { l: 'React.memo', r: 'Skips re-renders when props are unchanged' },
      { l: 'Suspense', r: 'Shows a fallback while data loads' }
    ],
    explain: 'useMemo caches values, useCallback stabilizes functions, React.memo avoids child re-renders, and Suspense shows fallbacks during async rendering.' },
  { id: 'mo03', cat: 'backend', diff: 'intermediate', type: 'matching',
    q: 'Match each Node.js concept to its description.',
    pairs: [
      { l: 'Event loop', r: 'Processes callbacks and I/O without threads' },
      { l: 'Cluster', r: 'Forks workers sharing one port' },
      { l: 'Stream', r: 'Processes data in chunks' },
      { l: 'worker_threads', r: 'Runs CPU-bound work in parallel threads' }
    ],
    explain: 'The event loop handles async I/O, cluster scales across cores, streams chunk data, and worker threads offload CPU work.' },
  { id: 'mo04', cat: 'db-postgres', diff: 'advanced', type: 'matching',
    q: 'Match each PostgreSQL concept to its purpose.',
    pairs: [
      { l: 'EXPLAIN ANALYZE', r: 'Shows the execution plan with timings' },
      { l: 'Partial index', r: 'Indexes only rows matching a WHERE' },
      { l: 'Vacuum', r: 'Reclaims dead tuples' },
      { l: 'Logical replication', r: 'Streams decoded row changes to other databases' }
    ],
    explain: 'EXPLAIN ANALYZE debugs plans, partial indexes shrink index size, VACUUM reclaims space, and logical replication moves row changes selectively.' },
  { id: 'mo05', cat: 'dotnet', diff: 'advanced', type: 'matching',
    q: 'Match each .NET service lifetime to its behaviour.',
    pairs: [
      { l: 'Singleton', r: 'One instance for the whole app' },
      { l: 'Scoped', r: 'One instance per request' },
      { l: 'Transient', r: 'A new instance every injection' },
      { l: 'DbContext', r: 'Scoped and not thread-safe' }
    ],
    explain: 'Singleton persists app-wide, Scoped matches request scope (the DbContext default), and Transient is created fresh each time.' },
  { id: 'mo06', cat: 'springboot', diff: 'advanced', type: 'matching',
    q: 'Match each Spring annotation to its role.',
    pairs: [
      { l: '@RestController', r: 'Returns data from handler methods' },
      { l: '@Service', r: 'Marks a business-logic bean' },
      { l: '@Transactional', r: 'Wraps a method in a transaction' },
      { l: '@Scheduled', r: 'Runs a method on a timer' }
    ],
    explain: '@RestController exposes REST endpoints, @Service marks business beans, @Transactional manages transactions, @Scheduled runs jobs.' },
  { id: 'mo07', cat: 'django', diff: 'advanced', type: 'matching',
    q: 'Match each Django ORM tool to its purpose.',
    pairs: [
      { l: 'select_related', r: 'JOINs forward foreign keys in one query' },
      { l: 'prefetch_related', r: 'Batches M2M and reverse relations' },
      { l: 'F()', r: 'Updates a column atomically in SQL' },
      { l: 'select_for_update', r: 'Locks rows until commit' }
    ],
    explain: 'select_related and prefetch_related kill N+1 queries, F() gives atomic increments, and select_for_update provides pessimistic locking.' },
  { id: 'mo08', cat: 'typescript', diff: 'intermediate', type: 'matching',
    q: 'Match each TypeScript utility to its effect.',
    pairs: [
      { l: 'Partial<T>', r: 'Makes every property optional' },
      { l: 'Readonly<T>', r: 'Marks every property readonly' },
      { l: 'Pick<T, K>', r: 'Keeps only the listed keys' },
      { l: 'Exclude<T, U>', r: 'Removes union members of U' }
    ],
    explain: 'Partial, Readonly, Pick, and Exclude are the foundational mapped/conditional utilities for deriving types.' },
  { id: 'mo09', cat: 'go', diff: 'advanced', type: 'matching',
    q: 'Match each Go concurrency tool to its purpose.',
    pairs: [
      { l: 'Goroutine', r: 'Lightweight concurrent task' },
      { l: 'Channel', r: 'Communicates data between goroutines' },
      { l: 'Mutex', r: 'Serializes access to shared state' },
      { l: 'WaitGroup', r: 'Waits for a group of goroutines' }
    ],
    explain: 'Goroutines run tasks, channels pass data, mutexes guard shared state, and WaitGroups join goroutine fan-out.' },
  { id: 'mo10', cat: 'rust', diff: 'advanced', type: 'matching',
    q: 'Match each Rust ownership concept to its meaning.',
    pairs: [
      { l: 'Move', r: 'Ownership transfers; the old binding is unusable' },
      { l: 'Borrow', r: 'Use a value through & without owning it' },
      { l: 'Lifetime', r: 'Compile-time validity of references' },
      { l: 'Arc<T>', r: 'Thread-safe shared ownership with ref-counting' }
    ],
    explain: 'Moves transfer ownership, borrows avoid it, lifetimes keep references valid, and Arc enables multi-thread sharing.' },

  /* ── Ordering / ranking ───────────────────────────────────── */
  { id: 'mo11', cat: 'devops', diff: 'beginner', type: 'ordering',
    q: 'Arrange the CI/CD pipeline stages in the correct order.',
    ordered: ['Checkout source', 'Install dependencies', 'Run tests', 'Build artifact', 'Deploy to environment', 'Smoke test'],
    explain: 'A pipeline checks out code, installs deps, tests, builds, deploys, then verifies with smoke tests.' },
  { id: 'mo12', cat: 'system-design', diff: 'intermediate', type: 'ordering',
    q: 'Order the steps of serving a page from a CDN on a cache miss.',
    ordered: ['Client requests URL', 'Edge cache check (miss)', 'Request forwarded to origin', 'Origin responds with content', 'Edge caches the response', 'Edge serves content to client'],
    explain: 'On a miss the edge fetches from origin, caches, then serves — subsequent requests hit the cache directly.' },
  { id: 'mo13', cat: 'db-postgres', diff: 'intermediate', type: 'ordering',
    q: 'Order the steps of handling a database transaction with a rollback.',
    ordered: ['BEGIN transaction', 'Execute first statement', 'Execute second statement', 'Detect an error', 'ROLLBACK', 'Release locks'],
    explain: 'Transactions begin, run statements, and on error roll back to release locks and restore the prior state.' },
  { id: 'mo14', cat: 'frontend', diff: 'intermediate', type: 'ordering',
    q: 'Order the phases of a React component update from initial mount.',
    ordered: ['Render function runs', 'React reconciles the virtual DOM', 'Commit phase updates the DOM', 'Browser paints', 'useEffect runs'],
    explain: 'React renders, reconciles, commits DOM changes, the browser paints, then effects run after paint.' },
  { id: 'mo15', cat: 'backend', diff: 'advanced', type: 'ordering',
    q: 'Order the steps a Node.js server takes to handle an incoming request.',
    ordered: ['Event loop picks up the request', 'Middleware chain runs', 'Route handler executes', 'Async I/O completes on the event loop', 'Response is written to the client'],
    explain: 'The event loop dispatches, middleware and handlers run, async I/O returns to the loop, and the response is sent.' },
  { id: 'mo16', cat: 'devops', diff: 'advanced', type: 'ordering',
    q: 'Order the incident-response steps during a production outage.',
    ordered: ['Contain the issue', 'Restore service', 'Preserve evidence and logs', 'Root-cause analysis', 'Apply a permanent fix', 'Write a blameless postmortem'],
    explain: 'Recovery first: contain, restore, then analyze and fix permanently, closing with a blameless postmortem.' },
