/* Orion question bank — part 18: Python depth + .NET depth */
  /* ── Python (depth set) ───────────────────────────────────── */
  { id: 'p13', cat: 'python', diff: 'advanced', type: 'mcq',
    q: 'What is the difference between __str__ and __repr__?',
    options: [
      '__repr__ is the unambiguous developer representation; __str__ is the human-friendly display',
      'They are identical',
      '__str__ is for debugging',
      '__repr__ must return bytes'
    ],
    answer: 0,
    explain: '__repr__ should be unambiguous (ideally evaluable), __str__ readable — str(obj) falls back to __repr__ when __str__ is missing.' },
  { id: 'p14', cat: 'python', diff: 'advanced', type: 'mcq',
    q: 'What is a decorator?',
    options: [
      'A function that wraps another function to extend its behaviour (@decorator syntax)',
      'A class attribute',
      'A type hint',
      'A loop modifier'
    ],
    answer: 0,
    explain: 'Decorators are higher-order functions applied with @ — used for caching, auth, timing, and logging without touching the wrapped function.' },
  { id: 'p15', cat: 'python', diff: 'intermediate', type: 'mcq',
    q: 'What does the with statement invoke?',
    options: [
      'A context manager\u2019s __enter__/__exit__ for guaranteed cleanup',
      'A module import',
      'A type conversion',
      'A loop'
    ],
    answer: 0,
    explain: 'with open(...) as f: calls __enter__ then __exit__ (closing the file) — deterministic resource cleanup even on exceptions.' },
  { id: 'p16', cat: 'python', diff: 'advanced', type: 'mcq',
    q: 'What is the difference between deepcopy and copy?',
    options: [
      'deepcopy clones nested objects recursively; copy shares them (shallow)',
      'copy clones everything',
      'deepcopy is always faster',
      'They are identical'
    ],
    answer: 0,
    explain: 'copy.copy makes a shallow copy (nested objects shared); copy.deepcopy recursively duplicates everything — expensive but independent.' },
  { id: 'p17', cat: 'python', diff: 'intermediate', type: 'mcq',
    q: 'What is a set comprehension?',
    options: [
      'A concise set built from an expression: {x * 2 for x in range(5)}',
      'A sorted list',
      'A dict with no values',
      'A generator'
    ],
    answer: 0,
    explain: 'Set comprehensions use {} with a single expression — {x * 2 for x in ...} yields a set of unique values.' },
  { id: 'p18', cat: 'python', diff: 'advanced', type: 'mcq',
    q: 'What is the difference between a generator and an iterator?',
    options: [
      'Generators are iterators written with yield; both produce values lazily',
      'Iterators produce all values eagerly',
      'Generators cannot be looped',
      'They are unrelated'
    ],
    answer: 0,
    explain: 'All generators are iterators (with __iter__/__next__); generators specifically use yield for lazy, resumable sequences.' },
  { id: 'p19', cat: 'python', diff: 'advanced', type: 'mcq',
    q: 'What does functools.lru_cache do?',
    options: [
      'Memoizes function results by arguments — caching repeated calls',
      'Schedules functions',
      'Limits recursion depth',
      'Caches imports'
    ],
    answer: 0,
    explain: '@lru_cache stores results keyed by arguments, with a size limit and LRU eviction — instant speedup for pure, expensive functions.' },
  { id: 'p20', cat: 'python', diff: 'advanced', type: 'mcq',
    q: 'What is the difference between a classmethod and staticmethod?',
    options: [
      'classmethod receives cls and can use class state; staticmethod receives neither',
      'staticmethod receives self',
      'They are identical',
      'classmethod cannot be inherited'
    ],
    answer: 0,
    explain: '@classmethod gets cls (alternative constructors); @staticmethod is a namespaced plain function — neither gets an instance.' },
  { id: 'p21', cat: 'python', diff: 'intermediate', type: 'mcq',
    q: 'What does dict.get(key, default) do?',
    options: [
      'Returns the value or the default without raising KeyError',
      'Removes the key',
      'Adds the default to the dict',
      'Raises on missing keys'
    ],
    answer: 0,
    explain: 'get() is the safe read — no exception on missing keys; setdefault() adds the default only if absent.' },
  { id: 'p22', cat: 'python', diff: 'advanced', type: 'mcq',
    q: 'What is multiple inheritance and a pitfall?',
    options: [
      'A class inheriting from several bases — MRO order decides resolution, diamond issues need care',
      'Inheriting from a module',
      'Overloading constructors',
      'A deprecated feature'
    ],
    answer: 0,
    explain: 'Python supports multiple inheritance via C3 linearization (MRO); mixins are the common safe use, deep diamonds get confusing.' },
  { id: 'p23', cat: 'python', diff: 'advanced', type: 'mcq',
    q: 'What does the __slots__ declaration do?',
    options: [
      'Prevents per-instance __dict__, saving memory for many instances',
      'Adds more attributes',
      'Enables dynamic attributes',
      'Speeds up imports'
    ],
    answer: 0,
    explain: '__slots__ fixes the attribute set, removing the instance dictionary — significant memory savings for millions of objects.' },
  { id: 'p24', cat: 'python', diff: 'intermediate', type: 'mcq',
    q: 'What is the difference between is and ==?',
    options: [
      'is compares identity (same object); == compares values via __eq__',
      'They are identical',
      'is compares values',
      '== compares identity'
    ],
    answer: 0,
    explain: 'x is None checks identity; x == 5 checks equality. Small integers are interned, which makes is on them accidentally true.' },
  { id: 'p25', cat: 'python', diff: 'advanced', type: 'mcq',
    q: 'What is the Global Interpreter Lock limitation?',
    options: [
      'Only one thread executes Python bytecode at a time — CPU-bound threads do not parallelize',
      'Threads cannot share memory',
      'Only one process may run',
      'It limits memory to 4GB'
    ],
    answer: 0,
    explain: 'The GIL serializes bytecode execution, so CPU-bound work needs multiprocessing; I/O-bound async/threads still benefit.' },
  { id: 'p26', cat: 'python', diff: 'advanced', type: 'mcq',
    q: 'What does asyncio.gather do?',
    options: [
      'Runs multiple coroutines concurrently and waits for all results',
      'Runs them sequentially',
      'Cancels coroutines',
      'Creates threads'
    ],
    answer: 0,
    explain: 'await asyncio.gather(a(), b(), c()) schedules the coroutines together and collects results — the asyncio parallel pattern.' },
  { id: 'p27', cat: 'python', diff: 'advanced', type: 'mcq',
    q: 'What is the difference between a coroutine and a thread?',
    options: [
      'Coroutines are cooperative single-threaded tasks; threads are preemptively scheduled by the OS',
      'Coroutines use more memory',
      'Threads cannot be suspended',
      'They are identical'
    ],
    answer: 0,
    explain: 'Async coroutines yield control explicitly on await (cooperative); threads are switched by the OS (preemptive) with more overhead.' },
  { id: 'p28', cat: 'python', diff: 'intermediate', type: 'mcq',
    q: 'What does the typing module provide?',
    options: [
      'Type hints (List[int], Optional[str]) checked by tools like mypy',
      'Runtime type enforcement always',
      'A dynamic typing switch',
      'Serialization'
    ],
    answer: 0,
    explain: 'typing declares annotations for static checkers — hints do not change runtime behaviour but catch bugs at analysis time.' },

  /* ── .NET (depth set) ─────────────────────────────────────── */
  { id: 'n59', cat: 'dotnet', diff: 'advanced', type: 'mcq',
    q: 'What is the difference between AddScoped and AddTransient?',
    options: [
      'Scoped resolves once per request scope; Transient resolves a new instance every time',
      'They are identical',
      'Transient lives for the app lifetime',
      'Scoped never disposes'
    ],
    answer: 0,
    explain: 'Scoped (DbContext default) shares one instance per request; Transient creates fresh instances per resolution — Singleton lives forever.' },
  { id: 'n60', cat: 'dotnet', diff: 'advanced', type: 'mcq',
    q: 'Why register a DbContext as Scoped and not Singleton?',
    options: [
      'DbContext is not thread-safe — a per-request scoped instance avoids concurrent use',
      'Singleton is faster',
      'DbContext cannot be disposed',
      'Scoped prevents migrations'
    ],
    answer: 0,
    explain: 'Concurrent operations on one DbContext corrupt state; scoped registration gives each request its own instance — the EF Core rule.' },
  { id: 'n61', cat: 'dotnet', diff: 'advanced', type: 'mcq',
    q: 'What does the options pattern validate?',
    options: [
      'Configuration sections bound to typed classes, with data annotations validated on startup',
      'Database schemas',
      'HTTP requests',
      'Log formats'
    ],
    answer: 0,
    explain: 'IOptions<T> + [ValidateOnStart] validates bound config at startup — failing fast beats runtime surprises.' },
  { id: 'n62', cat: 'dotnet', diff: 'advanced', type: 'mcq',
    q: 'What is the purpose of AddDbContextPool?',
    options: [
      'Reuses DbContext instances across requests to reduce construction cost',
      'Prevents database access',
      'Creates multiple databases',
      'Caches queries'
    ],
    answer: 0,
    explain: 'DbContext pooling reuses instances with reset — a throughput win for web apps, at the cost of not holding state between requests.' },
  { id: 'n63', cat: 'dotnet', diff: 'advanced', type: 'mcq',
    q: 'What does AsNoTracking() do in EF Core?',
    options: [
      'Skips change tracking for read-only queries — faster, no memory cost for the state cache',
      'Disables the database',
      'Locks the table',
      'Enables lazy loading'
    ],
    answer: 0,
    explain: 'Read-only queries use AsNoTracking() to avoid the change-tracker overhead; tracked queries are needed only when you will SaveChanges.' },
  { id: 'n64', cat: 'dotnet', diff: 'advanced', type: 'mcq',
    q: 'How do you run EF Core migrations in a pipeline?',
    options: [
      'dotnet ef database update, or apply pending migrations at startup carefully',
      'Drop and recreate the schema',
      'Manual SQL scripts only',
      'EF Core has no migrations'
    ],
    answer: 0,
    explain: 'dotnet ef migrations add/update manage schema; in CI, bundle or generate idempotent scripts for controlled rollouts.' },
  { id: 'n65', cat: 'dotnet', diff: 'advanced', type: 'mcq',
    q: 'What is the correct way to call an external API with retries in ASP.NET Core?',
    options: [
      'Typed HttpClient via IHttpClientFactory with Polly retry policies',
      'new HttpClient() per call',
      'RestSharp static calls',
      'WebClient in a loop'
    ],
    answer: 0,
    explain: 'IHttpClientFactory + AddPolicyHandler (Polly) gives pooled handlers and resilient retries — new HttpClient per call leaks sockets.' },
  { id: 'n66', cat: 'dotnet', diff: 'intermediate', type: 'mcq',
    q: 'What does the [ApiController] attribute add?',
    options: [
      'Automatic model validation with 400 responses, attribute routing, and problem details',
      'Database access',
      'Authentication',
      'Rate limiting'
    ],
    answer: 0,
    explain: '[ApiController] enables automatic 400s for invalid models, [FromBody] inference, and standard problem details — less boilerplate.' },
  { id: 'n67', cat: 'dotnet', diff: 'advanced', type: 'mcq',
    q: 'What is the Problem Details response format?',
    options: [
      'A standardized RFC 7807 JSON shape for API errors (type, title, status, detail)',
      'A log line',
      'An XML schema',
      'An exception stack trace'
    ],
    answer: 0,
    explain: 'RFC 7807 problem+json normalizes error responses across APIs — machines and clients can parse them consistently.' },
  { id: 'n68', cat: 'dotnet', diff: 'intermediate', type: 'mcq',
    q: 'How do you enable OpenAPI (Swagger) documentation?',
    options: [
      'AddSwaggerGen() + UseSwagger()/UseSwaggerUI() in the pipeline',
      'Install a browser extension',
      'Write a markdown file',
      'Swagger is automatic in all apps'
    ],
    answer: 0,
    explain: 'AddSwaggerGen registers the generator; UseSwagger serves the spec; SwaggerUI gives the interactive explorer — standard for APIs.' },
  { id: 'n69', cat: 'dotnet', diff: 'advanced', type: 'mcq',
    q: 'What does the [Authorize] attribute do?',
    options: [
      'Requires an authenticated user (with optional roles/policies) on the endpoint',
      'Encrypts responses',
      'Adds CORS',
      'Limits request rate'
    ],
    answer: 0,
    explain: '[Authorize] short-circuits unauthenticated requests; [Authorize(Roles = "Admin")] or policies add role/claim checks.' },
  { id: 'n70', cat: 'dotnet', diff: 'advanced', type: 'mcq',
    q: 'What is the JWT bearer validation pipeline in ASP.NET Core?',
    options: [
      'AddAuthentication().AddJwtBearer(options) with TokenValidationParameters',
      'Manual header parsing per request',
      'A shared secret in appsettings',
      'Basic auth only'
    ],
    answer: 0,
    explain: 'AddJwtBearer validates signature, issuer, audience, and lifetime centrally, then populates User — standard for token auth.' },
  { id: 'n71', cat: 'dotnet', diff: 'advanced', type: 'mcq',
    q: 'What is SignalR used for?',
    options: [
      'Real-time bidirectional messaging over WebSockets with hubs',
      'Database queries',
      'Static file serving',
      'Background jobs'
    ],
    answer: 0,
    explain: 'SignalR abstracts WebSockets with hubs and groups — chat, live dashboards, and notifications with automatic reconnection.' },
  { id: 'n72', cat: 'dotnet', diff: 'advanced', type: 'mcq',
    q: 'What is a hosted service (BackgroundService)?',
    options: [
      'A long-running service started with the app for queues, workers, and scheduled jobs',
      'A web API controller',
      'A database migration',
      'A logging provider'
    ],
    answer: 0,
    explain: 'IHostedService/BackgroundService runs alongside the host — the standard pattern for background processing in ASP.NET Core.' },
  { id: 'n73', cat: 'dotnet', diff: 'intermediate', type: 'mcq',
    q: 'What does app.UseHttpsRedirection() do?',
    options: [
      'Redirects HTTP requests to HTTPS',
      'Encrypts the database',
      'Adds authentication',
      'Compresses responses'
    ],
    answer: 0,
    explain: 'UseHttpsRedirection returns 307/308 redirects to the HTTPS endpoint — combined with HSTS for production enforcement.' },
  { id: 'n74', cat: 'dotnet', diff: 'advanced', type: 'mcq',
    q: 'How do you measure endpoint latency in ASP.NET Core?',
    options: [
      'Middleware timing + metrics via OpenTelemetry or Application Insights',
      'Stopwatch logs in every method',
      'Asking the user',
      'Guessing from load tests'
    ],
    answer: 0,
    explain: 'A timing middleware records per-endpoint durations and emits them as metrics/traces — the observability baseline for performance work.' },
