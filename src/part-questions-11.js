/* Orion question bank — part 11: .NET / ASP.NET Core (expanded, +30 → 54) */
  /* ── .NET & C# (TestGorilla-grade depth) ──────────────────── */
  { id: 'n25', cat: 'dotnet', diff: 'beginner', type: 'mcq',
    q: 'What is the difference between a value type and a reference type in C#?',
    options: [
      'Value types (structs) hold data directly; reference types (classes) hold a reference to data on the heap',
      'Reference types are stored on the stack',
      'Value types can never be null',
      'There is no difference in modern C#'
    ],
    answer: 0,
    explain: 'Value types (int, bool, struct) copy their data on assignment; reference types (class, string, array) copy the reference — null only applies to reference types (and nullable value types).' },
  { id: 'n26', cat: 'dotnet', diff: 'beginner', type: 'mcq',
    q: 'What does the using directive do at the top of a C# file?',
    options: [
      'Imports namespaces so types can be referenced without fully qualifying them',
      'Automatically closes database connections',
      'Declares a variable for the whole file',
      'Enables garbage collection'
    ],
    answer: 0,
    explain: 'using System; lets you write List<T> instead of System.Collections.Generic.List<T> — a namespace import, not a resource statement.' },
  { id: 'n27', cat: 'dotnet', diff: 'beginner', type: 'mcq',
    q: 'Which collection type should you use for frequent insert/remove at both ends?',
    options: ['LinkedList<T>', 'List<T>', 'Dictionary<TKey, TValue>', 'HashSet<T>'],
    answer: 0,
    explain: 'LinkedList<T> gives O(1) insertion/removal at either end; List<T> is array-backed, so head operations are O(n).' },
  { id: 'n28', cat: 'dotnet', diff: 'beginner', type: 'mcq',
    q: 'What does the ?? operator do in C#?',
    options: [
      'Returns the left operand if it is not null, otherwise the right operand',
      'Throws if the left operand is null',
      'Compares two nullable values',
      'Coalesces two lists'
    ],
    answer: 0,
    explain: 'x ?? y evaluates to x when x is not null, else y — the null-coalescing operator. ??= assigns if the left side is null.' },
  { id: 'n29', cat: 'dotnet', diff: 'intermediate', type: 'mcq',
    q: 'What is boxing and unboxing in C#?',
    options: [
      'Converting a value type to object (boxing) and back (unboxing), with allocation and casting costs',
      'Compressing large objects',
      'Copying objects across threads',
      'A database migration technique'
    ],
    answer: 0,
    explain: 'Boxing wraps a value type into a heap object (allocation); unboxing extracts it with an explicit cast. Generics avoid boxing in collections.' },
  { id: 'n30', cat: 'dotnet', diff: 'intermediate', type: 'mcq',
    q: 'What does the out keyword do when declaring a method parameter?',
    options: [
      'The method must assign the parameter before returning; the caller receives that value',
      'The parameter is read-only',
      'The parameter is optional',
      'It marks the method async'
    ],
    answer: 0,
    explain: 'out parameters must be assigned inside the method and are returned to the caller — e.g., int.TryParse("5", out int n). ref is similar but the value may be read first.' },
  { id: 'n31', cat: 'dotnet', diff: 'intermediate', type: 'mcq',
    q: 'What is a delegate in C#?',
    options: [
      'A type-safe reference to a method, allowing it to be passed and invoked later',
      'A subclass of a class',
      'A namespace alias',
      'A database event'
    ],
    answer: 0,
    explain: 'Delegates are typed function pointers — Func<>, Action<>, and custom delegate types let methods be passed as arguments (the basis of events and LINQ).' },
  { id: 'n32', cat: 'dotnet', diff: 'intermediate', type: 'mcq',
    q: 'What do async void methods do on exception?',
    options: [
      'Crash the process because the exception is unobservable',
      'Get caught by the caller',
      'Are ignored silently',
      'Return a faulted task'
    ],
    answer: 0,
    explain: 'async void has no Task to observe, so exceptions propagate to the synchronization context and can crash the app — only allowed for event handlers.' },
  { id: 'n33', cat: 'dotnet', diff: 'intermediate', type: 'mcq',
    q: 'What is the purpose of ConfigureAwait(false)?',
    options: [
      'Avoids capturing the synchronization context, preventing deadlocks in non-UI contexts',
      'Makes the method run synchronously',
      'Cancels the await',
      'Forces execution on the UI thread'
    ],
    answer: 0,
    explain: 'In library code, ConfigureAwait(false) continues on a thread-pool thread instead of the captured context — avoiding deadlocks and improving throughput.' },
  { id: 'n34', cat: 'dotnet', diff: 'advanced', type: 'mcq',
    q: 'What is a Span<T>?',
    options: [
      'A stack-allocated, ref struct view over contiguous memory with no allocation',
      'A lazy list',
      'An async stream',
      'A thread-safe queue'
    ],
    answer: 0,
    explain: 'Span<T> provides allocation-free access to contiguous memory (arrays, strings, stack). It is a ref struct, so it cannot be captured in async or stored on the heap.' },
  { id: 'n35', cat: 'dotnet', diff: 'advanced', type: 'mcq',
    q: 'What are generics primarily used for in C#?',
    options: [
      'Type-safe reusable code over different types without boxing or casts',
      'Compile-time code generation of assemblies',
      'Overloading operators',
      'Reflection-based serialization'
    ],
    answer: 0,
    explain: 'Generics parameterize types (List<T>, Dictionary<K,V>) giving compile-time type safety and avoiding boxing — the backbone of collections and LINQ.' },
  { id: 'n36', cat: 'dotnet', diff: 'advanced', type: 'mcq',
    q: 'What is the difference between Dispose and finalizers (destructors)?',
    options: [
      'Dispose is deterministic cleanup called by the developer; finalizers run nondeterministically during garbage collection',
      'They are identical',
      'Finalizers are called first by the developer',
      'Dispose only works for strings'
    ],
    answer: 0,
    explain: 'IDisposable.Dispose() releases resources deterministically (using statement); finalizers (~Class) run at GC time, so unmanaged resources wait until the GC gets around to them.' },
  { id: 'n37', cat: 'dotnet', diff: 'advanced', type: 'mcq',
    q: 'What does expression-bodied syntax () => expr provide?',
    options: [
      'Concise method and property definitions that evaluate a single expression',
      'Async execution of methods',
      'A new data type',
      'Compile-time macros'
    ],
    answer: 0,
    explain: 'Expression-bodied members (public int Sq(int x) => x * x;) are shorthand for single-expression methods/properties — widely used in modern C#.' },
  { id: 'n38', cat: 'dotnet', diff: 'advanced', type: 'mcq',
    q: 'What is reflection in .NET?',
    options: [
      'Inspecting and invoking types, members, and attributes at runtime via the metadata system',
      'Copying objects by value',
      'Mirroring a database schema',
      'Logging framework internals'
    ],
    answer: 0,
    explain: 'Reflection reads assemblies\u2019 metadata to discover types and invoke members dynamically — powerful but slow, so it powers serializers, DI, and ORMs rather than hot paths.' },
  { id: 'n39', cat: 'dotnet', diff: 'advanced', type: 'mcq',
    q: 'What does CancellationTokenSource do?',
    options: [
      'Creates and triggers CancellationTokens to signal cooperative cancellation to running work',
      'Stores exception details',
      'Manages thread pools',
      'Cancels database migrations'
    ],
    answer: 0,
    explain: 'A CTS issues tokens; code checks token.IsCancellationRequested or throws OperationCanceledException, enabling clean, cooperative cancellation of async work.' },
  { id: 'n40', cat: 'dotnet', diff: 'intermediate', type: 'mcq',
    q: 'What is the difference between FirstOrDefault and SingleOrDefault?',
    options: [
      'FirstOrDefault returns the first match (any number allowed); SingleOrDefault throws if more than one element matches',
      'SingleOrDefault is always faster',
      'FirstOrDefault throws on multiple matches',
      'They are identical'
    ],
    answer: 0,
    explain: 'FirstOrDefault is for when many matches are possible; SingleOrDefault enforces exactly one match and throws otherwise — use it only when uniqueness is guaranteed.' },
  { id: 'n41', cat: 'dotnet', diff: 'intermediate', type: 'mcq',
    q: 'What does the null-conditional operator ?. do?',
    options: [
      'Short-circuits to null if the receiver is null, instead of throwing',
      'Throws NullReferenceException',
      'Compares two objects for equality',
      'Declares a nullable field'
    ],
    answer: 0,
    explain: 'customer?.Name returns null when customer is null — chaining ?. and ?? keeps code null-safe without a wall of if checks.' },
  { id: 'n42', cat: 'dotnet', diff: 'advanced', type: 'mcq',
    q: 'What is a deadlock in async C# and a common cause?',
    options: [
      'Code waits on a blocking call (.Result/.Wait()) while the awaited work needs the captured synchronization context',
      'Two methods with the same name',
      'A recursive LINQ query',
      'A full hard drive'
    ],
    answer: 0,
    explain: 'Blocking on async (.Result) inside a context that awaits the same task can deadlock — fixed with async all the way, or ConfigureAwait(false) in libraries.' },
  { id: 'n43', cat: 'dotnet', diff: 'advanced', type: 'mcq',
    q: 'What does the Parallel class in System.Threading.Tasks do?',
    options: [
      'Runs loops (Parallel.For/ForEach) across threads for CPU-bound work',
      'Manages async/await continuations',
      'Is a database connector',
      'Serializes objects to JSON'
    ],
    answer: 0,
    explain: 'Parallel.For and Parallel.ForEach partition work across thread-pool threads — ideal for CPU-bound loops, wrong for I/O-bound work (use async instead).' },
  { id: 'n44', cat: 'dotnet', diff: 'advanced', type: 'mcq',
    q: 'What is Channel<T> used for in .NET?',
    options: [
      'A thread-safe producer/consumer queue supporting async reads and writes',
      'A database connection pool',
      'A logging sink',
      'An object pool'
    ],
    answer: 0,
    explain: 'Channel<T> (System.Threading.Channels) is a high-performance async queue — the modern building block for producer/consumer pipelines and in-process messaging.' },
  { id: 'n45', cat: 'dotnet', diff: 'advanced', type: 'mcq',
    q: 'How do you catch an exception thrown in an async method?',
    options: [
      'Await the task inside a try/catch — the exception surfaces on the await',
      'It is impossible to catch',
      'Catch it inside the task only',
      'Wrap the method in a lock'
    ],
    answer: 0,
    explain: 'An awaited task throws its exception at the await point, so try/catch around await works naturally — async void is the exception to avoid.' },
  { id: 'n46', cat: 'dotnet', diff: 'advanced', type: 'mcq',
    q: 'What is the purpose of a lock statement?',
    options: [
      'Serializes access to a shared resource using a monitor on an object',
      'Encrypts shared data',
      'Makes a method read-only',
      'Prevents two threads from starting'
    ],
    answer: 0,
    explain: 'lock (syncRoot) { ... } ensures one thread at a time enters the critical section — the basic mutual-exclusion primitive for shared state.' },
  { id: 'n47', cat: 'dotnet', diff: 'advanced', type: 'mcq',
    q: 'When would you use ConcurrentDictionary<TKey, TValue> instead of a Dictionary with locks?',
    options: [
      'For thread-safe, high-concurrency reads/writes with granular operations like GetOrAdd',
      'For single-threaded code',
      'When keys must be sorted',
      'Never — it is deprecated'
    ],
    answer: 0,
    explain: 'ConcurrentDictionary uses fine-grained locking/lock-free reads and atomic helpers (GetOrAdd, AddOrUpdate), outperforming a coarse-locked Dictionary under contention.' },
  { id: 'n48', cat: 'dotnet', diff: 'intermediate', type: 'mcq',
    q: 'What does Yield return do in an iterator method?',
    options: [
      'Produces the next value and pauses the iterator until it is requested again',
      'Stops the iterator forever',
      'Returns control to the caller immediately with no value',
      'Throws an exception'
    ],
    answer: 0,
    explain: 'yield return builds an iterator that computes values lazily, one per MoveNext call — the compiler generates the state machine behind it.' },
  { id: 'n49', cat: 'dotnet', diff: 'intermediate', type: 'mcq',
    q: 'What is the purpose of the finally block?',
    options: [
      'Always runs whether the try block succeeds or throws — the right place for cleanup',
      'Only runs on success',
      'Only runs on exceptions',
      'Runs before the try block'
    ],
    answer: 0,
    explain: 'finally executes unconditionally, so resources are released and invariants restored even when an exception propagates — safer than cleanup after catch.' },
  { id: 'n50', cat: 'dotnet', diff: 'advanced', type: 'mcq',
    q: 'What is the Middleware vs Filter distinction in ASP.NET Core?',
    options: [
      'Middleware runs on every request in the pipeline; filters wrap action execution (validation, auth, logging)',
      'They are the same thing',
      'Filters run before routing',
      'Middleware only works in minimal APIs'
    ],
    answer: 0,
    explain: 'Middleware handles cross-cutting request concerns (auth, logging, CORS) for all traffic; action filters run specifically around controller actions for per-action concerns.' },
  { id: 'n51', cat: 'dotnet', diff: 'advanced', type: 'mcq',
    q: 'How do you version a REST API in ASP.NET Core cleanly?',
    options: [
      'With the Asp.Versioning (Microsoft.AspNetCore.Mvc.Versioning) library plus route/query versioning',
      'By keeping one endpoint that guesses',
      'By deploying two apps with different ports',
      'APIs cannot be versioned'
    ],
    answer: 0,
    explain: 'API versioning middleware/attributes let clients request v1 or v2 via URL, header, or query — keeping old clients working while you evolve the contract.' },
  { id: 'n52', cat: 'dotnet', diff: 'advanced', type: 'mcq',
    q: 'Which tool would you use for API documentation with interactive testing in ASP.NET Core?',
    options: ['Swagger (Swashbuckle / NSwag)', 'Fiddler', 'SQL Server', 'Azure DevOps'],
    answer: 0,
    explain: 'Swashbuckle or NSwag generates OpenAPI (Swagger) docs and a UI from your endpoints — standard for documenting and testing ASP.NET Core APIs.' },
  { id: 'n53', cat: 'dotnet', diff: 'intermediate', type: 'mcq',
    q: 'What does app.UseStaticFiles() enable?',
    options: [
      'Serving static files (HTML, CSS, JS, images) from wwwroot',
      'Compressing responses',
      'Adding authentication',
      'Enabling HTTPS redirects'
    ],
    answer: 0,
    explain: 'UseStaticFiles maps the wwwroot folder to the web root and serves its files — usually placed early in the pipeline before endpoint routing.' },
  { id: 'n54', cat: 'dotnet', diff: 'advanced', type: 'mcq',
    q: 'How should you store secrets locally during .NET development?',
    options: [
      'dotnet user-secrets — a per-developer store outside source control, overridden by environment variables in production',
      'Hardcoded in Program.cs',
      'In appsettings.json committed to git',
      'In the public README'
    ],
    answer: 0,
    explain: 'The User Secrets tool keeps development secrets in a per-user file excluded from the repo; production overrides them with env vars or a vault — never commit secrets.' },
  /* ── .NET multi-select questions ──────────────────────────── */
  { id: 'n55', cat: 'dotnet', diff: 'intermediate', type: 'multi',
    q: 'Which statements about value types in C# are TRUE? (select all that apply)',
    options: [
      'Value types are copied on assignment',
      'Value types live on the heap by default',
      'struct is a value type',
      'Value types cannot be boxed'
    ],
    answer: [0, 2],
    explain: 'Value types (int, struct, enum) copy on assignment and live on the stack (or inline) — boxing converts them to heap objects, so option 1 and 3 are false.' },
  { id: 'n56', cat: 'dotnet', diff: 'advanced', type: 'multi',
    q: 'Which are valid ways to handle asynchronous work in C#? (select all that apply)',
    options: [
      'await Task.Run(...)',
      'async void methods for general code',
      'Task.WhenAll for concurrent awaits',
      'Blocking on .Result to wait for a task'
    ],
    answer: [0, 2],
    explain: 'await and Task.WhenAll are the proper async patterns. async void is only for event handlers, and blocking with .Result can deadlock — both are anti-patterns in library code.' },
  { id: 'n57', cat: 'dotnet', diff: 'advanced', type: 'multi',
    q: 'Which are core features of Entity Framework Core? (select all that apply)',
    options: [
      'Migrations generated from model changes',
      'LINQ queries translated to SQL',
      'Automatic thread-safety across concurrent DbContexts',
      'Change tracking with SaveChanges'
    ],
    answer: [0, 1, 3],
    explain: 'EF Core provides migrations, LINQ-to-SQL translation, and change tracking. DbContext is NOT thread-safe — one scoped instance per operation — so option 2 is false.' },
  { id: 'n58', cat: 'dotnet', diff: 'advanced', type: 'multi',
    q: 'Which practices reduce the risk of deadlocks and resource leaks in .NET? (select all that apply)',
    options: [
      'using statements (or using declarations) for IDisposable resources',
      'ConfigureAwait(false) in library code',
      'Avoiding blocking calls like .Wait() on async code',
      'Creating a new HttpClient for every request'
    ],
    answer: [0, 1, 2],
    explain: 'Dispose via using, avoid context capture with ConfigureAwait(false), and never block on async. Creating an HttpClient per request leaks sockets — use IHttpClientFactory.' },
