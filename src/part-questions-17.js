/* Orion question bank — part 17: C# depth + Java depth */
  /* ── C# (depth set) ───────────────────────────────────────── */
  { id: 'cs13', cat: 'cs', diff: 'advanced', type: 'mcq',
    q: 'What is the difference between IEnumerable<T> and IQueryable<T>?',
    options: [
      'IEnumerable executes in memory; IQueryable builds a query tree executed by a provider (e.g., EF Core translates to SQL)',
      'They are identical',
      'IQueryable is always faster in memory',
      'IEnumerable cannot be iterated'
    ],
    answer: 0,
    explain: 'IQueryable defers to an expression provider — LINQ-to-SQL only happens for IQueryable; IEnumerable materializes in memory.' },
  { id: 'cs14', cat: 'cs', diff: 'advanced', type: 'mcq',
    q: 'What is deferred execution in LINQ?',
    options: [
      'Queries run when enumerated, not when defined — evaluation is lazy',
      'Queries run on another thread',
      'Queries never run',
      'Results are cached forever'
    ],
    answer: 0,
    explain: 'LINQ operators build a lazy pipeline; each enumeration re-executes it. Use .ToList() to materialize once when needed.' },
  { id: 'cs15', cat: 'cs', diff: 'advanced', type: 'mcq',
    q: 'What does the yield keyword generate?',
    options: [
      'A state machine iterator that produces values lazily',
      'A delegate',
      'A Task',
      'An event'
    ],
    answer: 0,
    explain: 'The compiler turns a yield-based iterator into a state machine — the basis of IEnumerable<T> custom sequences.' },
  { id: 'cs16', cat: 'cs', diff: 'intermediate', type: 'mcq',
    q: 'How do you concatenate strings efficiently in a loop?',
    options: [
      'StringBuilder.Append',
      'string + operator',
      'string.Format',
      'char[] manually'
    ],
    answer: 0,
    explain: 'StringBuilder mutates one buffer instead of allocating a new string per concatenation — the standard for loop builds.' },
  { id: 'cs17', cat: 'cs', diff: 'advanced', type: 'mcq',
    q: 'What does the ref keyword do when passing a value type?',
    options: [
      'Passes the variable by reference so the method can modify the caller\u2019s variable',
      'Copies the value',
      'Makes the parameter read-only',
      'Boxes the value'
    ],
    answer: 0,
    explain: 'ref passes a reference to the caller\u2019s storage (no copy); in/out add read-only and must-assign contracts.' },
  { id: 'cs18', cat: 'cs', diff: 'advanced', type: 'mcq',
    q: 'What is a static class?',
    options: [
      'A class that cannot be instantiated and holds only static members',
      'A class with one instance',
      'A base class',
      'A sealed class'
    ],
    answer: 0,
    explain: 'Static classes (Math, File) group stateless utility methods; they cannot be instantiated or extended.' },
  { id: 'cs19', cat: 'cs', diff: 'intermediate', type: 'mcq',
    q: 'What does the as operator do?',
    options: [
      'Tries a reference conversion, returning null instead of throwing on failure',
      'Performs an explicit cast that always throws',
      'Aliases a type',
      'Compares references'
    ],
    answer: 0,
    explain: 'as returns null when the conversion fails — safer than (Type)obj casts; pattern matching (obj is Type t) is the modern alternative.' },
  { id: 'cs20', cat: 'cs', diff: 'intermediate', type: 'mcq',
    q: 'What is an extension method?',
    options: [
      'A static method in a static class that appears as an instance method via this-parameter syntax',
      'A virtual method',
      'A method on a base class',
      'A LINQ query'
    ],
    answer: 0,
    explain: 'public static int Words(this string s) lets you call s.Words() — LINQ is built entirely on extension methods.' },
  { id: 'cs21', cat: 'cs', diff: 'advanced', type: 'mcq',
    q: 'What is pattern matching in C#?',
    options: [
      'Declarative checks on types, properties, and values, e.g., if (x is int i and > 5)',
      'Regex matching',
      'String interpolation',
      'An XML parser'
    ],
    answer: 0,
    explain: 'Patterns (is, switch expressions with type/property/relational patterns) make branching concise and exhaustive.' },
  { id: 'cs22', cat: 'cs', diff: 'intermediate', type: 'mcq',
    q: 'What does the null-coalescing assignment ??= do?',
    options: [
      'Assigns the right side only when the left side is null',
      'Always assigns',
      'Compares for equality',
      'Throws on null'
    ],
    answer: 0,
    explain: 'list ??= new() assigns only if list is null — concise lazy initialization of fields and locals.' },
  { id: 'cs23', cat: 'cs', diff: 'advanced', type: 'mcq',
    q: 'What is an async iterator (IAsyncEnumerable)?',
    options: [
      'A lazy async sequence consumed with await foreach',
      'A Task returning a list',
      'A blocking collection',
      'A channel consumer'
    ],
    answer: 0,
    explain: 'IAsyncEnumerable<T> streams items asynchronously — pages of data or live updates without blocking or buffering everything.' },
  { id: 'cs24', cat: 'cs', diff: 'intermediate', type: 'mcq',
    q: 'What does the default keyword produce for a reference type?',
    options: ['null', 'The type\u2019s constructor result', 'undefined', 'A compile error'],
    answer: 0,
    explain: 'default(T) is null for reference types and the zero/empty value for value types — used in generics where T is unknown.' },
  { id: 'cs25', cat: 'cs', diff: 'advanced', type: 'mcq',
    q: 'What is a primary constructor (C# 12)?',
    options: [
      'Constructor parameters declared on the type itself, captured for use in members',
      'A constructor that runs first among several',
      'A static constructor',
      'A copy constructor'
    ],
    answer: 0,
    explain: 'class Point(int x, int y) captures x and y for members — concise for records and simple classes (C# 12+).' },
  { id: 'cs26', cat: 'cs', diff: 'advanced', type: 'mcq',
    q: 'How does the garbage collector handle large objects?',
    options: [
      'Large objects (85KB+) go to a separate LOH that is collected less frequently',
      'They are never collected',
      'They are stack-allocated',
      'They require manual disposal'
    ],
    answer: 0,
    explain: 'The Large Object Heap avoids costly moves, so big arrays live longer between collections — pool them for high churn.' },
  { id: 'cs27', cat: 'cs', diff: 'intermediate', type: 'mcq',
    q: 'What does ObjectPool<T> (Microsoft.Extensions.ObjectPool) help with?',
    options: [
      'Reusing expensive objects (buffers, clients) to reduce allocations',
      'Storing database rows',
      'Managing threads',
      'Logging'
    ],
    answer: 0,
    explain: 'Object pooling recycles short-lived expensive objects — the standard answer for high-allocation hot paths.' },
  { id: 'cs28', cat: 'cs', diff: 'intermediate', type: 'mcq',
    q: 'What is the correct exception-handling pattern for cleanup?',
    options: [
      'try/finally or using — cleanup runs unconditionally',
      'catch and ignore',
      'finally only on success',
      'A custom destructor'
    ],
    answer: 0,
    explain: 'try/finally (or using) guarantees cleanup runs whether or not an exception occurs.' },

  /* ── Java (depth set) ─────────────────────────────────────── */
  { id: 'j13', cat: 'java', diff: 'advanced', type: 'mcq',
    q: 'What is the difference between checked and unchecked exceptions?',
    options: [
      'Checked exceptions must be declared or caught; unchecked (RuntimeException) need not',
      'Unchecked must be declared',
      'Checked ones are always fatal',
      'They are identical'
    ],
    answer: 0,
    explain: 'Checked exceptions (IOException) force handling at compile time; RuntimeExceptions (NullPointer, IllegalArgument) do not.' },
  { id: 'j14', cat: 'java', diff: 'advanced', type: 'mcq',
    q: 'What does the try-with-resources statement do?',
    options: [
      'Automatically closes resources implementing AutoCloseable when the block exits',
      'Retries the block',
      'Runs cleanup only on exceptions',
      'Creates a sandbox'
    ],
    answer: 0,
    explain: 'try (var r = open()) { } guarantees r.close() — the safe modern replacement for manual finally cleanup.' },
  { id: 'j15', cat: 'java', diff: 'intermediate', type: 'mcq',
    q: 'What is the difference between ArrayList and LinkedList?',
    options: [
      'ArrayList is array-backed with fast random access; LinkedList is node-based with fast head/tail inserts',
      'LinkedList is always faster',
      'ArrayList cannot grow',
      'They are identical'
    ],
    answer: 0,
    explain: 'ArrayList gives O(1) get by index; LinkedList gives O(1) add/remove at ends. ArrayLists dominate most real usage.' },
  { id: 'j16', cat: 'java', diff: 'advanced', type: 'mcq',
    q: 'What is autoboxing?',
    options: [
      'Automatic conversion between primitives and their wrapper types',
      'Compressing objects',
      'Serialization of objects',
      'A classloader feature'
    ],
    answer: 0,
    explain: 'Autoboxing turns int into Integer where needed (collections, generics) — with a small allocation cost and subtle equality pitfalls (== on wrappers).' },
  { id: 'j17', cat: 'java', diff: 'intermediate', type: 'mcq',
    q: 'How does a HashSet guarantee uniqueness?',
    options: [
      'Via equals() and hashCode() — duplicates are rejected on insert',
      'By comparing memory addresses',
      'By sorting elements',
      'It does not guarantee uniqueness'
    ],
    answer: 0,
    explain: 'HashSet uses hashCode to bucket and equals to confirm — which is why overriding equals without hashCode breaks the set contract.' },
  { id: 'j18', cat: 'java', diff: 'advanced', type: 'mcq',
    q: 'What is the Comparator vs Comparable difference?',
    options: [
      'Comparable defines natural order inside the class; Comparator defines external, multiple orderings',
      'Comparator is a subclass of Comparable',
      'Comparable sorts strings only',
      'They are the same'
    ],
    answer: 0,
    explain: 'Comparable.compareTo gives one natural order; Comparator lets you sort by many keys without touching the class.' },
  { id: 'j19', cat: 'java', diff: 'intermediate', type: 'mcq',
    q: 'What does Optional<T> represent?',
    options: [
      'A container that may hold a value or be empty — forcing explicit handling of absence',
      'A nullable primitive',
      'A list with one element',
      'A default value'
    ],
    answer: 0,
    explain: 'Optional replaces null-returning methods; map/flatMap/orElse chain presence-handling without NPEs.' },
  { id: 'j20', cat: 'java', diff: 'advanced', type: 'mcq',
    q: 'What is the Stream pipeline order for efficiency?',
    options: [
      'Filter early, then map, then limit — reducing work and memory',
      'Map first always',
      'Collect before filter',
      'Order does not matter'
    ],
    answer: 0,
    explain: 'Early filters shrink the stream before expensive mapping — pipelines are lazy, so order directly affects work done.' },
  { id: 'j21', cat: 'java', diff: 'advanced', type: 'mcq',
    q: 'What is the difference between map and flatMap on an Optional?',
    options: [
      'map wraps results in Optional; flatMap expects the function to already return Optional',
      'flatMap wraps results',
      'They are identical',
      'map flattens nested optionals'
    ],
    answer: 0,
    explain: 'opt.map(x -> Integer.parseInt(x)) yields Optional<Integer>; flatMap(x -> lookup(x)) avoids Optional<Optional<T>>.' },
  { id: 'j22', cat: 'java', diff: 'advanced', type: 'mcq',
    q: 'What is a record in Java?',
    options: [
      'A concise immutable data carrier with equals/hashCode/toString generated',
      'A database table',
      'A file type',
      'An annotation'
    ],
    answer: 0,
    explain: 'Records (Java 16+) declare a class with final fields, constructor, accessors, equals, hashCode, and toString in one line.' },
  { id: 'j23', cat: 'java', diff: 'advanced', type: 'mcq',
    q: 'What is a sealed class?',
    options: [
      'A class restricted to a known set of permitted subclasses',
      'A class that cannot be instantiated',
      'A final class',
      'A private class'
    ],
    answer: 0,
    explain: 'sealed classes with permits limit the inheritance hierarchy — enabling exhaustive switch over subclasses (pattern matching).' },
  { id: 'j24', cat: 'java', diff: 'advanced', type: 'mcq',
    q: 'What does the synchronized keyword guarantee?',
    options: [
      'Mutual exclusion on the locked object — one thread in the block at a time',
      'Faster execution',
      'Thread creation',
      'Memory visibility only'
    ],
    answer: 0,
    explain: 'synchronized serializes access to a monitor, also establishing happens-before visibility — the basic Java locking primitive.' },
  { id: 'j25', cat: 'java', diff: 'advanced', type: 'mcq',
    q: 'What is the difference between synchronized and volatile?',
    options: [
      'volatile guarantees visibility of a single field; synchronized provides mutual exclusion plus visibility',
      'volatile locks whole objects',
      'They are identical',
      'synchronized only works on statics'
    ],
    answer: 0,
    explain: 'volatile ensures writes are seen across threads but does not make compound operations atomic; synchronized does both via a monitor.' },
  { id: 'j26', cat: 'java', diff: 'intermediate', type: 'mcq',
    q: 'What is the ConcurrentHashMap benefit over a synchronized HashMap?',
    options: [
      'Fine-grained locking allows concurrent reads and partial writes — far better throughput',
      'It blocks all operations',
      'It sorts entries',
      'It is the only thread-safe map'
    ],
    answer: 0,
    explain: 'ConcurrentHashMap partitions its table into segments/bins with lock-free reads — the go-to for high-concurrency maps.' },
  { id: 'j27', cat: 'java', diff: 'intermediate', type: 'mcq',
    q: 'What does StringBuilder offer over String concatenation?',
    options: [
      'A mutable buffer — efficient repeated appends',
      'Immutable storage',
      'Thread safety by default',
      'Compressed storage'
    ],
    answer: 0,
    explain: 'StringBuilder mutates one char buffer; String immutability makes repeated + allocation-heavy. Use it in loops.' },
  { id: 'j28', cat: 'java', diff: 'intermediate', type: 'mcq',
    q: 'What is a lambda expression?',
    options: [
      'A concise anonymous function implementing a functional interface',
      'A named class method',
      'A stream',
      'A generic class'
    ],
    answer: 0,
    explain: 'Lambdas (x -> x * 2) are shorthand for functional interfaces — the building block of the Streams API and method references.' },
