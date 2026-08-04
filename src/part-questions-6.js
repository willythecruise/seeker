/* Orion question bank — part 6: senior topics from interview conversations
   (React internals, production debugging, caching, DB deep-dives, scaling) */
  /* ── React internals ──────────────────────────────────────── */
  { id: 'c28', cat: 'frontend', diff: 'advanced', type: 'mcq',
    q: 'Which statement about useLayoutEffect is correct?',
    options: [
      'It runs asynchronously after the browser paints',
      'It runs synchronously after DOM mutations but before the browser paints',
      'It is identical to useEffect in every way',
      'It only runs when a component unmounts'
    ],
    answer: 1,
    explain: 'useLayoutEffect fires synchronously after DOM mutations and before paint, blocking rendering — useful for measurements and animations. useEffect runs after paint and is non-blocking.' },
  { id: 'c29', cat: 'frontend', diff: 'advanced', type: 'mcq',
    q: 'What is the exact relationship between useCallback and useMemo?',
    options: [
      'useMemo caches functions and useCallback caches values',
      'useCallback(fn, deps) is equivalent to useMemo(() => fn, deps)',
      'They are unrelated hooks that cannot be combined',
      'useCallback is a React 19-only replacement for useMemo'
    ],
    answer: 1,
    explain: 'useCallback(fn, deps) is literally useMemo(() => fn, deps): both exist for referential equality. useMemo returns the computed value, useCallback returns the function itself.' },
  { id: 'c30', cat: 'frontend', diff: 'advanced', type: 'mcq',
    q: 'Which statement about state-update batching in React 18 is true?',
    options: [
      'Updates are only batched inside React event handlers',
      'Automatic batching also covers promises, setTimeout, and native event handlers',
      'Every setState call always triggers its own render',
      'Batching was removed in React 18'
    ],
    answer: 1,
    explain: 'React 18 introduced automatic batching: multiple setState calls inside promises, timeouts, and native handlers are merged into a single re-render.' },
  { id: 'c31', cat: 'frontend', diff: 'advanced', type: 'mcq',
    q: 'Why does every consumer re-render when a React Context value changes?',
    options: [
      'React re-renders the entire app on any change',
      'Context propagates by reference — consumers cannot subscribe to a slice of the value',
      'Consumers are never re-rendered when context changes',
      'Context values must always be primitives'
    ],
    answer: 1,
    explain: 'When a context value changes, React re-renders every component consuming it. Split contexts into smaller pieces or memoize the value (useMemo) to limit the blast radius.' },
  { id: 'c32', cat: 'frontend', diff: 'advanced', type: 'mcq',
    q: 'Which of these most commonly causes a React hydration mismatch?',
    options: [
      'Using too many useState hooks',
      'Rendering content that differs between server and client (Math.random(), Date, browser-only data)',
      'Missing a key prop on list items',
      'Importing components with dynamic import'
    ],
    answer: 1,
    explain: 'Hydration mismatches occur when server HTML differs from the client render — random values, date/time differences, and browser-only APIs are the classic culprits.' },
  { id: 'c33', cat: 'frontend', diff: 'intermediate', type: 'mcq',
    q: 'Why is using the array index as a React key problematic?',
    options: [
      'Indexes are not allowed as keys at all',
      'When the order changes, React may reuse the wrong component instance and its state',
      'Indexes cause infinite re-renders',
      'Indexes are slower than string keys'
    ],
    answer: 1,
    explain: 'Index keys couple identity to position: inserting or reordering items makes React reuse the wrong instances, corrupting component state. Stable IDs fix this.' },
  { id: 'c34', cat: 'frontend', diff: 'advanced', type: 'mcq',
    q: 'Which statement about React\u2019s render and commit phases is correct?',
    options: [
      'The commit phase can be paused and resumed by the browser',
      'The render phase can be interrupted; the commit phase runs synchronously',
      'Both phases can be interrupted at any time',
      'Side effects run during the render phase'
    ],
    answer: 1,
    explain: 'In React Fiber, the render (reconciliation) phase can be paused or aborted for concurrent features, while the commit phase applies DOM changes synchronously and cannot be interrupted.' },
  { id: 'c35', cat: 'frontend', diff: 'advanced', type: 'fill',
    q: 'Rendering only the items currently visible in a scroll viewport is called list ___.',
    answer: ['virtualization', 'windowing', 'list virtualization', 'virtualisation'],
    explain: 'Virtualization (react-window, react-virtualized) renders only visible rows, keeping huge lists fast and memory-light.' },
  { id: 'c36', cat: 'frontend', diff: 'advanced', type: 'mcq',
    q: 'Which change fixes the stale closure below?',
    code: 'useEffect(() => {\n  const id = setInterval(() => setCount(count + 1), 1000);\n  return () => clearInterval(id);\n}, []);',
    options: [
      'Increase the interval to 2000ms',
      'Use the functional update setCount(c => c + 1)',
      'Remove the cleanup function',
      'Move setInterval outside the component'
    ],
    answer: 1,
    explain: 'The effect closes over the initial count (a stale closure). A functional update reads the latest state instead of the captured value, so the counter advances correctly.' },
  { id: 'c37', cat: 'frontend', diff: 'advanced', type: 'mcq',
    q: 'For a public product catalog that changes a few times a day, which Next.js rendering strategy fits best?',
    options: [
      'CSR with a spinner on every visit',
      'ISR with revalidate: 3600',
      'SSR on every request',
      'A static build with no regeneration at all'
    ],
    answer: 1,
    explain: 'ISR gives static speed with periodic background regeneration — ideal for catalogs that change infrequently. Pure SSG would go stale; per-request SSR is slower than needed.' },
  { id: 'c38', cat: 'frontend', diff: 'advanced', type: 'mcq',
    q: 'What makes a side effect in the render phase dangerous?',
    options: [
      'It runs too slowly to notice',
      'The render phase can be aborted and restarted, so side effects may run multiple times',
      'It cannot access any state',
      'It only runs in development mode'
    ],
    answer: 1,
    explain: 'Render must stay pure: concurrent rendering can pause and restart it, duplicating side effects. Effects belong in the commit phase (useEffect / useLayoutEffect).' },
  { id: 'c39', cat: 'frontend', diff: 'intermediate', type: 'mcq',
    q: 'Why does state.count++ fail to update the UI?',
    options: [
      'Numbers cannot be stored in state',
      'React compares by reference — mutating the same object does not signal a change',
      'React disallows increment operators in JSX',
      'State is frozen in production builds'
    ],
    answer: 1,
    explain: 'React detects changes by reference equality. Mutating the existing object keeps the same reference, so React skips the re-render — always return a new object or array.' },
  { id: 'c40', cat: 'frontend', diff: 'intermediate', type: 'mcq',
    q: 'Why does React use a synthetic event system?',
    options: [
      'To replace the browser DOM entirely',
      'For cross-browser consistency, pooling, and event delegation at the root',
      'To make events run on the server',
      'To avoid using addEventListener anywhere'
    ],
    answer: 1,
    explain: 'SyntheticEvent normalizes browser differences and delegates events at the root node, improving consistency and reducing per-element listeners.' },
  { id: 'c41', cat: 'frontend', diff: 'advanced', type: 'mcq',
    q: 'Which hooks expose imperative methods of a child component to a parent via ref?',
    options: [
      'useRef alone',
      'useImperativeHandle (with forwardRef)',
      'useState',
      'useSyncExternalStore'
    ],
    answer: 1,
    explain: 'forwardRef passes the ref down to the child; useImperativeHandle lets the child choose which methods the parent can call (e.g., focus, scrollTo) without exposing internals.' },
  { id: 'c42', cat: 'frontend', diff: 'advanced', type: 'mcq',
    q: 'What does React.lazy add beyond a plain dynamic import()?',
    options: [
      'It eagerly preloads every chunk',
      'It integrates the loaded component with Suspense fallbacks and code splitting',
      'It works only on the server',
      'It minifies the imported code'
    ],
    answer: 1,
    explain: 'React.lazy wraps dynamic import() so the component suspends until loaded, letting <Suspense> show a fallback — plain import() has no Suspense integration.' },
  { id: 'c43', cat: 'frontend', diff: 'intermediate', type: 'mcq',
    q: 'How do you avoid a setInterval leak when a React component unmounts?',
    code: 'useEffect(() => {\n  const id = setInterval(/* ... */, 1000);\n  // ???\n}, []);',
    options: [
      'Nothing — the browser cleans it up automatically',
      'return () => clearInterval(id);',
      'Set the interval to null when unmounting',
      'Store the interval id in a global variable'
    ],
    answer: 1,
    explain: 'The cleanup function returned from useEffect runs on unmount, clearing the interval — the standard pattern for subscriptions, timers, and listeners.' },
  { id: 'c44', cat: 'frontend', diff: 'advanced', type: 'mcq',
    q: 'Why prefer TanStack Query over Redux for server state?',
    options: [
      'It replaces React entirely',
      'It provides caching, deduplication, and background refetching for API data out of the box',
      'It stores all data in the URL',
      'It is required by Next.js'
    ],
    answer: 1,
    explain: 'TanStack Query manages async server state — caching, dedup, refetching, and invalidation — leaving Redux or Zustand for client UI state that needs global access.' },
  { id: 'c45', cat: 'frontend', diff: 'intermediate', type: 'mcq',
    q: 'Which approach best reduces prop drilling for shared UI state?',
    options: [
      'Passing props through every intermediate component',
      'Using Context API (or a store like Zustand) for the shared state',
      'Storing data in global window variables',
      'Writing the same state to the URL'
    ],
    answer: 1,
    explain: 'Context or a lightweight store lets components read shared state directly, avoiding threading props through unrelated intermediate components.' },
  { id: 'c46', cat: 'frontend', diff: 'intermediate', type: 'fill',
    q: 'The browser API commonly used to detect when an element enters the viewport (for infinite scroll) is the ___ Observer.',
    answer: ['intersection', 'intersectionobserver', 'intersection observer'],
    explain: 'IntersectionObserver fires a callback when a sentinel element becomes visible, triggering the next page of results without scroll-event listeners.' },
  { id: 'c47', cat: 'frontend', diff: 'advanced', type: 'mcq',
    q: 'A search input lags while the user types. What is the recommended fix?',
    options: [
      'Store every keystroke in global state',
      'Debounce the expensive work and keep the input\u2019s state local',
      'Use a fully uncontrolled input with no onChange',
      'Re-render the entire result list on each keystroke'
    ],
    answer: 1,
    explain: 'Debouncing defers expensive filtering or searching until the user pauses typing, and local state keeps keystrokes cheap — both prevent per-keystroke render storms.' },
  { id: 'c48', cat: 'frontend', diff: 'advanced', type: 'mcq',
    q: 'Why does this effect loop forever?',
    code: 'useEffect(() => {\n  const data = fetchData();\n  setData(data);\n}, [data]);',
    options: [
      'fetchData is undefined',
      'setData updates data, which is a dependency of the same effect',
      'Effects always run twice in production',
      'The dependency array must be empty'
    ],
    answer: 1,
    explain: 'The effect depends on data and also updates it — every update re-triggers the effect, creating an infinite loop. Fix the dependency array or the data flow.' },
  { id: 'c49', cat: 'backend', diff: 'advanced', type: 'mcq',
    q: 'Your Node.js service crashes after about 12 hours in production. What is the best first diagnostic step?',
    options: [
      'Restart the server on a cron every hour',
      'Capture and compare heap snapshots over time (e.g., with node --inspect)',
      'Delete node_modules and reinstall',
      'Add more RAM and ignore the pattern'
    ],
    answer: 1,
    explain: 'Comparing heap snapshots reveals what keeps growing — retained listeners, cached data, or unbounded arrays — which pinpoints the memory leak.' },
  { id: 'c50', cat: 'backend', diff: 'advanced', type: 'mcq',
    q: 'When is adding a message queue (Kafka, RabbitMQ, Bull) most likely overkill?',
    options: [
      'Processing millions of events per day',
      'A low-traffic app where a simple in-process job or cron suffices',
      'Decoupling microservices with traffic bursts',
      'Replaying events for analytics'
    ],
    answer: 1,
    explain: 'Queues add infrastructure and operational complexity. For low volume, a cron or in-process queue is simpler and cheaper — adopt a broker when scale or durability demands it.' },
  { id: 'c51', cat: 'backend', diff: 'advanced', type: 'mcq',
    q: 'For a shared-collection multi-tenant MongoDB app, which pattern is essential for correct and fast tenant isolation?',
    options: [
      'A tenantId field on every document plus compound indexes starting with tenantId',
      'One document holding all tenants\u2019 data',
      'Client-side filtering with no server awareness',
      'A random field per tenant'
    ],
    answer: 0,
    explain: 'A tenantId field with compound indexes on (tenantId, ...) both isolates data and keeps queries efficient — the standard shared-collection multi-tenancy approach.' },
  { id: 'c52', cat: 'backend', diff: 'intermediate', type: 'fill',
    q: 'The Node.js flag that opens the built-in inspector for heap snapshots and CPU profiling is ___.',
    answer: ['--inspect', 'inspect', 'node --inspect', '--inspect-brk'],
    explain: 'node --inspect (or --inspect-brk) exposes the DevTools protocol so you can capture heap snapshots and CPU profiles from a running process.' },

  /* ── Production debugging ─────────────────────────────────── */
  { id: 'c53', cat: 'db-postgres', diff: 'advanced', type: 'mcq',
    q: 'Why does PostgreSQL ignore your index on email for this query?',
    code: 'SELECT * FROM users WHERE LOWER(email) = \'a@b.com\';',
    options: [
      'Indexes cannot be used on text columns',
      'The LOWER() function prevents a plain B-tree index from being used',
      'The column name is too short',
      'SELECT * always skips indexes'
    ],
    answer: 1,
    explain: 'Applying a function to the indexed column defeats a plain B-tree lookup — create an expression index on LOWER(email) instead.' },
  { id: 'c54', cat: 'db-postgres', diff: 'advanced', type: 'mcq',
    q: 'Two concurrent requests created duplicate user rows. What is the robust fix?',
    options: [
      'Check existence before insert in application code',
      'A unique constraint (or unique index) at the database level',
      'Deploy more server instances',
      'Increase request timeouts'
    ],
    answer: 1,
    explain: 'App-level check-then-insert races under concurrency. A database unique constraint rejects the duplicate atomically, regardless of how many requests arrive.' },
  { id: 'c55', cat: 'db-postgres', diff: 'intermediate', type: 'mcq',
    q: 'Debiting one account and crediting another, so both succeed or both fail, is the classic example of:',
    options: [
      'A database transaction (atomicity, the A in ACID)',
      'A stored procedure requirement',
      'A denormalization problem',
      'A foreign key violation'
    ],
    answer: 0,
    explain: 'Money transfer is the textbook transaction: both operations must commit together or roll back together — atomicity.' },
  { id: 'c56', cat: 'db-postgres', diff: 'advanced', type: 'mcq',
    q: 'Which anomaly is prevented by the REPEATABLE READ isolation level?',
    options: [
      'Dirty writes',
      'Non-repeatable reads — a row changing between two reads in the same transaction',
      'Phantom reads under all conditions in every database',
      'Lost updates in PostgreSQL'
    ],
    answer: 1,
    explain: 'REPEATABLE READ prevents dirty and non-repeatable reads (PostgreSQL\u2019s snapshot isolation also handles phantoms); SERIALIZABLE adds strict anomaly prevention.' },
  { id: 'c57', cat: 'db-postgres', diff: 'advanced', type: 'mcq',
    q: 'Optimistic locking typically detects concurrent modification using:',
    options: [
      'A version column checked in the UPDATE (e.g., WHERE version = old)',
      'A global mutex around every query',
      'A read-only transaction',
      'A materialized view refresh'
    ],
    answer: 0,
    explain: 'A version column lets UPDATE ... WHERE version = ? return zero rows if someone else modified the record — the app then retries or surfaces a conflict.' },
  { id: 'c58', cat: 'db-postgres', diff: 'advanced', type: 'fill',
    q: 'Fetching 100 parent rows and then issuing 100 extra queries for their children is the classic ___ problem.',
    answer: ['n+1', 'n1', 'n plus 1'],
    explain: 'The N+1 problem — one query plus N per-row queries — is fixed with JOINs, batch queries, or data loaders.' },
  { id: 'c59', cat: 'db-postgres', diff: 'intermediate', type: 'mcq',
    q: 'Which is a real downside of SELECT * in production queries?',
    options: [
      'It returns columns the client may not need, wasting I/O and memory',
      'It is slower to type than listing columns',
      'It is illegal in PostgreSQL',
      'It permanently disables all caching'
    ],
    answer: 0,
    explain: 'SELECT * over-fetches columns (large text, blobs) and can break covering-index plans — list only the columns you actually need.' },
  { id: 'c60', cat: 'db-postgres', diff: 'advanced', type: 'mcq',
    q: 'Why does LIMIT/OFFSET pagination degrade on very large datasets?',
    options: [
      'OFFSET forces the database to scan and discard all the skipped rows',
      'LIMIT is not supported by PostgreSQL',
      'It consumes too much disk space',
      'It permanently disables indexes'
    ],
    answer: 0,
    explain: 'Large offsets still read and discard every preceding row. Keyset (cursor) pagination — WHERE id > last_seen ORDER BY id LIMIT n — is O(index) and constant-time.' },
  { id: 'c61', cat: 'db-postgres', diff: 'advanced', type: 'mcq',
    q: 'When would you choose logical replication over physical replication in PostgreSQL?',
    options: [
      'When replicating a subset of tables, possibly across different major versions',
      'When you need byte-identical block-level copies only',
      'When you cannot filter any rows',
      'Logical replication cannot be used for failover'
    ],
    answer: 0,
    explain: 'Logical replication streams decoded row changes, allowing selective tables and version differences; physical replication copies blocks and requires matching major versions.' },
  { id: 'c62', cat: 'db-mongodb', diff: 'advanced', type: 'mcq',
    q: 'In which scenario would you avoid MongoDB even in a MERN stack?',
    options: [
      'Heavy multi-document transactions and complex relational joins for financial accounting',
      'Flexible schemas with rapidly changing fields',
      'High write throughput of JSON documents',
      'Horizontal scaling with sharding'
    ],
    answer: 0,
    explain: 'When relational integrity, complex joins, and strict transactions dominate, a relational database fits better — even when the rest of the stack is MERN.' },
  { id: 'c63', cat: 'db-mongodb', diff: 'advanced', type: 'mcq',
    q: 'Your MongoDB aggregation pipeline takes 4 seconds. Which optimization helps most?',
    options: [
      'Add indexes matching the $match/$sort stages and push $match as early as possible',
      'Remove all indexes to speed up writes',
      'Put $lookup before $match',
      'Increase the application timeout'
    ],
    answer: 0,
    explain: 'Pipeline order matters: filter early with an indexed $match, sort with an indexed $sort, then $lookup/$group — minimizing the rows that flow through later stages.' },
  { id: 'c64', cat: 'db-postgres', diff: 'advanced', type: 'mcq',
    q: 'Which PostgreSQL strategy splits a table into pieces by ranges of a column such as created_at?',
    options: [
      'Range partitioning',
      'Row-level security',
      'Logical decoding',
      'Autovacuum tuning'
    ],
    answer: 0,
    explain: 'Range partitioning splits rows into partitions by value ranges — the classic fit for time-series tables — with partition pruning on queries.' },
  { id: 'c65', cat: 'system-design', diff: 'advanced', type: 'mcq',
    q: 'For a product-search API at 10k requests/sec, which combination is most impactful?',
    options: [
      'Horizontal Node.js scaling behind a load balancer, caching hot queries, and indexing the search field',
      'Adding more RAM to a single Node process',
      'Using synchronous database calls everywhere',
      'Removing the load balancer'
    ],
    answer: 0,
    explain: 'Horizontal scaling distributes load, caching (Redis/CDN) absorbs repeat queries, and proper indexes keep the database from becoming the bottleneck.' },
  { id: 'c66', cat: 'devops', diff: 'advanced', type: 'mcq',
    q: 'A React app works locally but fails in production with random API errors. What is the most common root cause to check first?',
    options: [
      'Environment variables and API base URLs differ between dev and prod',
      'The production browser is too old',
      'CSS colors render differently',
      'The development server is faster'
    ],
    answer: 0,
    explain: 'Dev/prod divergence — missing env vars, wrong base URLs, CORS — is the classic cause. Verify env, the network tab, and build-time config before anything else.' },
  { id: 'c67', cat: 'solutions', diff: 'advanced', type: 'mcq',
    q: 'Scaling an app from 1k to 1M users, which component typically becomes the bottleneck first?',
    options: [
      'The database',
      'The CSS bundle',
      'The favicon',
      'The git repository'
    ],
    answer: 0,
    explain: 'The database saturates first — connections and query load. Mitigations: connection pooling, indexes, read replicas, caching, and a CDN for static assets.' },
  { id: 'c68', cat: 'backend', diff: 'advanced', type: 'mcq',
    q: 'Which pattern prevents repeated calls to a failing third-party API from piling up?',
    options: [
      'A circuit breaker — open after repeated failures and fail fast for a cooldown window',
      'Infinite synchronous retries',
      'Spawning more threads',
      'A longer HTTP timeout'
    ],
    answer: 0,
    explain: 'A circuit breaker trips to OPEN after N failures, failing fast during cooldown, then half-opens to probe recovery — protecting both your service and the dependency.' },
  { id: 'c69', cat: 'devops', diff: 'advanced', type: 'mcq',
    q: 'A fresh deployment starts returning 500s. What is the recommended first action?',
    options: [
      'Rewrite the codebase',
      'Roll back to the last known-good release, then investigate logs',
      'Delete the database',
      'Add more server instances'
    ],
    answer: 1,
    explain: 'Restore service first (rollback), then debug — logs, migrations, config diffs. Never debug forward during a production outage without a recovery plan.' },
  { id: 'c70', cat: 'db-postgres', diff: 'advanced', type: 'mcq',
    q: 'Database CPU is pinned at 100%. What is the correct first investigation step?',
    options: [
      'Enable slow-query logging and inspect the top offenders with EXPLAIN ANALYZE',
      'Restart the database immediately',
      'Buy a bigger instance without diagnosis',
      'Disable all indexes'
    ],
    answer: 0,
    explain: 'Find the hot queries first — slow-query logs, pg_stat_statements, EXPLAIN ANALYZE — then fix them with indexes, caching, or query rewrites.' },
  { id: 'c71', cat: 'frontend', diff: 'advanced', type: 'mcq',
    q: 'A dashboard has 50 widgets fetching data every few seconds. What best avoids overloading the backend and the browser?',
    options: [
      'One multiplexed WebSocket (or batched polling) delivering all widget updates',
      '50 independent setInterval fetches',
      'A full page reload every 5 seconds',
      'No caching — always fetch fresh'
    ],
    answer: 0,
    explain: 'Multiplexing updates over a single connection and batching payloads cuts request volume dramatically; add query caching and deduplication on top.' },
  { id: 'c72', cat: 'coding', diff: 'intermediate', type: 'mcq',
    q: 'Your app crashes with \u201Cundefined is not a function\u201D. The most likely cause is:',
    options: [
      'The API returned a different shape than the code expects',
      'JavaScript cannot call functions',
      'The browser is outdated',
      'A missing CSS import'
    ],
    answer: 0,
    explain: 'A shape mismatch — a renamed or missing API field — makes the code call undefined as a function. Guard with optional chaining and validate API payloads.' },
  { id: 'c73', cat: 'db-postgres', diff: 'advanced', type: 'mcq',
    q: 'Two users see different versions of the same data because one request hit a read replica. This is explained by:',
    options: [
      'Replication lag between the primary and its replicas',
      'A CDN misconfiguration',
      'Corrupted database files',
      'An invalid index'
    ],
    answer: 0,
    explain: 'Replicas lag behind the primary for a short window, so reads routed to them can serve slightly stale data — eventual consistency. Route critical reads to the primary.' },
  { id: 'c74', cat: 'db-postgres', diff: 'advanced', type: 'mcq',
    q: 'To prevent double-booking the same property with overlapping dates in PostgreSQL, which constraint enforces it at the database level?',
    options: [
      'An EXCLUDE constraint using GiST (e.g., period WITH &&)',
      'A NOT NULL constraint',
      'A CHECK constraint on the price',
      'A serial primary key'
    ],
    answer: 0,
    explain: 'EXCLUDE USING gist (property WITH =, period WITH &&) rejects overlapping bookings atomically — the bulletproof answer to double-booking race conditions.' },

  /* ── Caching ──────────────────────────────────────────────── */
  { id: 'c75', cat: 'backend', diff: 'intermediate', type: 'mcq',
    q: 'What does the Node.js cluster module do?',
    options: [
      'Spreads incoming connections across multiple worker processes sharing the same port',
      'Runs Node inside a Docker container',
      'Load-balances databases',
      'Caches HTTP responses'
    ],
    answer: 0,
    explain: 'cluster forks worker processes that share the server port, letting multi-core machines handle more concurrent connections.' },
  { id: 'c76', cat: 'frontend', diff: 'intermediate', type: 'mcq',
    q: 'In Next.js, navigating with next/link performs:',
    options: [
      'Client-side navigation — no full page reload, and app state is preserved',
      'A full browser reload on every click',
      'A server-side redirect only',
      'A WebSocket request'
    ],
    answer: 0,
    explain: 'next/link uses the router for client-side transitions (with prefetching), keeping the SPA experience — full reloads only happen on hard navigation.' },
  { id: 'c77', cat: 'system-design', diff: 'advanced', type: 'mcq',
    q: 'A popular cache key expires and every request misses at once, hammering the database. Which mitigation helps?',
    options: [
      'Request coalescing / single-flight: only one caller rebuilds while others wait or get the stale value',
      'Deleting the cache entirely',
      'Setting the TTL to zero',
      'Adding more load balancers'
    ],
    answer: 0,
    explain: 'A cache stampede happens when a hot key expires and everyone recomputes. Coalescing (single-flight) lets one request rebuild the cache while the rest wait.' },
  { id: 'c78', cat: 'system-design', diff: 'intermediate', type: 'fill',
    q: '\u201CThere are only two hard things in computer science: cache invalidation and ___.\u201D',
    answer: ['naming things', 'naming', 'naming things and off-by-one errors', 'off by one errors'],
    explain: 'The famous quote captures that keeping cached data consistent with the source of truth — TTLs, manual invalidation, write-through strategies — is genuinely hard.' },
  { id: 'c79', cat: 'coding', diff: 'intermediate', type: 'mcq',
    q: 'When is a NoSQL document store (MongoDB) a better fit than PostgreSQL?',
    options: [
      'Flexible schemas and very high write throughput at horizontal scale',
      'Complex relational integrity with strict multi-row transactions',
      'When window functions dominate the workload',
      'When joins are the core of the workload'
    ],
    answer: 0,
    explain: 'NoSQL shines with evolving schemas and horizontal write scale; relational databases win on integrity, joins, and rich SQL.' },
  { id: 'c80', cat: 'system-design', diff: 'advanced', type: 'mcq',
    q: 'Designing a store for millions of append-only activity-log records per day, the best fit is:',
    options: [
      'An append-friendly, time-indexed store (e.g., MongoDB with TTL indexes or a partitioned time-series table)',
      'A heavily normalized OLTP schema with many joins',
      'A single spreadsheet',
      'Application memory'
    ],
    answer: 0,
    explain: 'Logs are append-heavy, rarely updated, and queried by time — TTL-indexed collections or partitioned time-series tables fit naturally and age out old rows.' },
  { id: 'c81', cat: 'solutions', diff: 'advanced', type: 'mcq',
    q: 'Logs show unauthorized data access. What is the correct sequence of actions?',
    options: [
      'Contain (revoke tokens, disable entry points) → identify the vulnerability → patch → audit → notify',
      'Notify users before containing the breach',
      'Ignore it until business hours',
      'Rewrite all code from scratch immediately'
    ],
    answer: 0,
    explain: 'Incident response order matters: stop the bleeding first, then root-cause, patch, audit the scope, and communicate — in that order.' },
  { id: 'c82', cat: 'frontend', diff: 'advanced', type: 'mcq',
    q: 'For a private admin dashboard used by logged-in employees, which rendering approach is usually best?',
    options: [
      'CSR with token-protected APIs — fast interactions, no SEO needed',
      'Public SSG published to everyone',
      'ISR with revalidate: 5',
      'Static HTML without JavaScript'
    ],
    answer: 0,
    explain: 'Admin UIs need interactive, stateful UX and do not need SEO — client-side rendering with protected APIs is the pragmatic default.' },
  { id: 'c83', cat: 'frontend', diff: 'intermediate', type: 'mcq',
    q: 'When is useReducer preferable to useState?',
    options: [
      'When state transitions are complex and the next state depends on previous state',
      'When there is only a single boolean',
      'When you need synchronous rendering',
      'Never — useState is always better'
    ],
    answer: 0,
    explain: 'useReducer centralizes complex transition logic (multiple sub-values, dependent updates) in a pure reducer — easier to test and reason about.' },
  { id: 'c84', cat: 'system-design', diff: 'advanced', type: 'mcq',
    q: 'In a stale-while-revalidate cache strategy, what does the client receive first?',
    options: [
      'The stale cached value, while fresh data is fetched in the background',
      'A 503 until the cache rebuilds',
      'Only fresh data, never stale',
      'An error whenever the cache expires'
    ],
    answer: 0,
    explain: 'SWR returns the stale value immediately, then refreshes in the background — the strategy behind SWR and TanStack Query defaults.' },
  { id: 'c85', cat: 'system-design', diff: 'intermediate', type: 'mcq',
    q: 'Which cache eviction policy removes the entries that have not been used for the longest time?',
    options: ['LRU — Least Recently Used', 'LFU — Least Frequently Used', 'FIFO — First In First Out', 'Random eviction'],
    answer: 0,
    explain: 'LRU evicts entries untouched the longest; LFU tracks access frequency and FIFO evicts by insertion order.' },
  { id: 'c86', cat: 'backend', diff: 'advanced', type: 'mcq',
    q: 'Intermittent 500s point to PostgreSQL connection timeouts under high load. What do you tune first?',
    options: [
      'Connection pool size and timeouts — look for pool exhaustion and leaked connections',
      'Increase HTTP timeouts to 10 minutes',
      'Disable connection pooling entirely',
      'Convert every query to SELECT *'
    ],
    answer: 0,
    explain: 'Pool exhaustion (too-small pool, acquire timeouts, unclosed clients) is the classic cause — tune the pool, enable slow-query logs, and monitor active connections.' },
