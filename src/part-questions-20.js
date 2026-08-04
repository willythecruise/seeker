/* Orion question bank — part 20: TypeScript depth + Go depth */
  /* ── TypeScript (depth set) ───────────────────────────────── */
  { id: 'ts41', cat: 'typescript', diff: 'advanced', type: 'mcq',
    q: 'What does Omit<T, K> do?',
    options: [
      'Returns a type with the listed keys removed',
      'Keeps only the listed keys',
      'Makes keys optional',
      'Reads from a database'
    ],
    answer: 0,
    explain: 'Omit<T, K> removes keys (Omit<User, "id">); Pick keeps them — together the workhorses for derived types.' },
  { id: 'ts42', cat: 'typescript', diff: 'advanced', type: 'mcq',
    q: 'What is a conditional type used for?',
    options: [
      'Choosing types based on assignability, enabling type-level logic',
      'Runtime if/else',
      'CSS styling',
      'Database queries'
    ],
    answer: 0,
    explain: 'T extends U ? X : Y makes types programmable — the engine behind Exclude, Extract, and advanced inference utilities.' },
  { id: 'ts43', cat: 'typescript', diff: 'advanced', type: 'mcq',
    q: 'What is an index signature?',
    options: [
      'Allows any string key with a given value type: { [key: string]: number }',
      'A numbered property',
      'An array type',
      'A tuple'
    ],
    answer: 0,
    explain: 'Index signatures describe dictionary-like types — commonly used for maps, lookup tables, and loosely typed configs.' },
  { id: 'ts44', cat: 'typescript', diff: 'advanced', type: 'mcq',
    q: 'What does the infer keyword do in conditional types?',
    options: [
      'Extracts a type from within another, e.g., infer R from Promise<R>',
      'Creates a runtime value',
      'Declares a generic',
      'Casts to any'
    ],
    answer: 0,
    explain: 'infer introduces a type variable inside extends — the mechanism behind ReturnType, Parameters, and Awaited.' },
  { id: 'ts45', cat: 'typescript', diff: 'intermediate', type: 'mcq',
    q: 'What is the Awaited<T> utility?',
    options: [
      'Unwraps Promise<T> (and nested promises) to the underlying type',
      'Runs the promise',
      'Makes types lazy',
      'A runtime await'
    ],
    answer: 0,
    explain: 'Awaited<Promise<User>> is User — especially useful for typing async function results in generic code.' },
  { id: 'ts46', cat: 'typescript', diff: 'advanced', type: 'mcq',
    q: 'What does a type predicate (x is T) do?',
    options: [
      'Tells the compiler a custom guard narrows the parameter to T',
      'Creates a new type',
      'Checks equality at runtime',
      'Adds a runtime assertion'
    ],
    answer: 0,
    explain: 'function isUser(x: any): x is User makes custom type guards — if the function returns true, TS narrows x to User afterwards.' },
  { id: 'ts47', cat: 'typescript', diff: 'intermediate', type: 'mcq',
    q: 'What is the non-null assertion operator !?',
    options: [
      'Tells the compiler a value is not null/undefined, skipping null checks',
      'Throws at runtime when null',
      'Adds a null check',
      'Makes a value nullable'
    ],
    answer: 0,
    explain: 'x!.name asserts x is non-null — a compile-time promise. Prefer real narrowing; ! hides bugs when overused.' },
  { id: 'ts48', cat: 'typescript', diff: 'advanced', type: 'mcq',
    q: 'What are ambient declarations?',
    options: [
      'declare statements describing types of untyped JavaScript code',
      'Runtime variables',
      'CSS classes',
      'Compile options'
    ],
    answer: 0,
    explain: 'declare module "x" or declare const tells TS about external JS without implementations — the basis of .d.ts typings.' },
  { id: 'ts49', cat: 'typescript', diff: 'advanced', type: 'mcq',
    q: 'What is the difference between a namespace and a module?',
    options: [
      'Modules are file-scoped imports/exports; namespaces are legacy internal organization within a file',
      'They are identical',
      'Namespaces handle async',
      'Modules cannot be imported'
    ],
    answer: 0,
    explain: 'ES modules (import/export) are the modern standard; namespaces predate them and are mostly used for .d.ts organization.' },
  { id: 'ts50', cat: 'typescript', diff: 'advanced', type: 'mcq',
    q: 'What does esModuleInterop fix?',
    options: [
      'Default imports from CommonJS modules work cleanly with ES module semantics',
      'Type errors in async code',
      'Path aliases',
      'Circular imports'
    ],
    answer: 0,
    explain: 'esModuleInterop synthesizes default imports for CJS modules — without it, import express from "express" misbehaves in type-checking.' },
  { id: 'ts51', cat: 'typescript', diff: 'intermediate', type: 'mcq',
    q: 'What is the union-to-intersection trick with conditional types?',
    options: [
      'Distributing a union across a conditional and inferring builds an intersection of members',
      'A runtime concatenation',
      'A type cast',
      'A generic alias'
    ],
    answer: 0,
    explain: 'Advanced utilities (e.g., UnionToIntersection) use conditional distribution plus infer to combine union members — the level of type gymnastics used in libraries.' },
  { id: 'ts52', cat: 'typescript', diff: 'intermediate', type: 'mcq',
    q: 'What does the array .reduce type signature demonstrate?',
    options: [
      'Generic inference from an initial value — the accumulator type flows through the reducer',
      'A runtime reducer',
      'A CSS property',
      'A build step'
    ],
    answer: 0,
    explain: 'reduce<U>(fn, init) infers the accumulator type U from the initial value — showing how generics keep data-flow types precise.' },
  { id: 'ts53', cat: 'typescript', diff: 'advanced', type: 'mcq',
    q: 'What is declaration merging in interfaces?',
    options: [
      'Two interfaces with the same name merge members — enabling safe augmentation',
      'Combining two classes',
      'Merging files at build time',
      'A runtime feature'
    ],
    answer: 0,
    explain: 'Multiple interface declarations with the same name combine — how libraries augment globals (e.g., window, process.env) safely.' },
  { id: 'ts54', cat: 'typescript', diff: 'advanced', type: 'mcq',
    q: 'What does a generic constraint (extends) prevent?',
    options: [
      'Using a type that lacks the required members — keeping generic code type-safe',
      'Runtime type errors only',
      'Infinite loops',
      'Bundling failures'
    ],
    answer: 0,
    explain: 'function get<T extends HasId>(x: T) guarantees T has id — constraints are the contract generic code relies on.' },
  { id: 'ts55', cat: 'typescript', diff: 'intermediate', type: 'mcq',
    q: 'What is the void return type for?',
    options: [
      'Functions that deliberately return nothing — callbacks and event handlers',
      'Nullable values',
      'Undefined variables',
      'A fallback type'
    ],
    answer: 0,
    explain: 'void marks no return value — essential for assigning callbacks like (e) => void in typed event APIs.' },
  { id: 'ts56', cat: 'typescript', diff: 'advanced', type: 'mcq',
    q: 'What is the bigint type?',
    options: [
      'Arbitrary-precision integers via the bigint primitive — distinct from number',
      'A large number type alias',
      'A string of digits',
      'A deprecated number'
    ],
    answer: 0,
    explain: 'bigint (123n) supports arbitrarily large integers; number is IEEE-754 double — mixing them requires explicit conversion.' },

  /* ── Go (depth set) ───────────────────────────────────────── */
  { id: 'go43', cat: 'go', diff: 'advanced', type: 'mcq',
    q: 'What is the purpose of context.WithTimeout?',
    options: [
      'Creates a context that cancels after a deadline, propagating to downstream calls',
      'Sets a sleep timer',
      'Limits goroutine count',
      'Measures latency'
    ],
    answer: 0,
    explain: 'ctx, cancel := context.WithTimeout(parent, 5*time.Second) auto-cancels at the deadline — the standard way to bound operations.' },
  { id: 'go44', cat: 'go', diff: 'advanced', type: 'mcq',
    q: 'How do you handle timeouts on an HTTP request in Go?',
    options: [
      'http.Client{Timeout: ...} and a context deadline',
      'Setting the port',
      'A retry loop',
      'Sleeping between calls'
    ],
    answer: 0,
    explain: 'Set http.Client.Timeout and pass a context with deadline to requests — both bound the request duration.' },
  { id: 'go45', cat: 'go', diff: 'advanced', type: 'mcq',
    q: 'What is the net/http mux?',
    options: [
      'The built-in router matching paths to handlers (http.ServeMux)',
      'A database driver',
      'A logging package',
      'A JSON encoder'
    ],
    answer: 0,
    explain: 'ServeMux routes requests (mux.HandleFunc("/api", h)); patterns with methods come from routers like chi or gin.' },
  { id: 'go46', cat: 'go', diff: 'advanced', type: 'mcq',
    q: 'What does http.Server{ReadTimeout: ...} protect against?',
    options: [
      'Slowloris-style attacks and resource exhaustion from slow clients',
      'SQL injection',
      'DNS poisoning',
      'Cache pollution'
    ],
    answer: 0,
    explain: 'Read/Write timeouts bound how long the server waits for clients — essential hardening for production HTTP servers.' },
  { id: 'go47', cat: 'go', diff: 'advanced', type: 'mcq',
    q: 'What is middleware in Go web servers?',
    options: [
      'Functions wrapping handlers to add logging, auth, and recovery',
      'A database layer',
      'A config file',
      'A template engine'
    ],
    answer: 0,
    explain: 'Middleware decorates handlers (func(http.Handler) http.Handler) — composing logging, auth, and panic recovery around routes.' },
  { id: 'go48', cat: 'go', diff: 'intermediate', type: 'mcq',
    q: 'How do you write tests in Go?',
    options: [
      'Test functions starting with Test in *_test.go files, run by go test',
      'A special test main',
      'External test frameworks only',
      'go run --test'
    ],
    answer: 0,
    explain: 'func TestX(t *testing.T) in the same package, *_test.go files, assert with t.Errorf — go test discovers and runs them.' },
  { id: 'go49', cat: 'go', diff: 'intermediate', type: 'mcq',
    q: 'What are table-driven tests?',
    options: [
      'A slice of test cases iterated in one test function — data and expectations together',
      'Tests with SQL tables',
      'Database fixture tests',
      'Randomized tests'
    ],
    answer: 0,
    explain: 'Table-driven tests define cases as structs {name, input, want} and loop — the idiomatic Go testing style.' },
  { id: 'go50', cat: 'go', diff: 'advanced', type: 'mcq',
    q: 'What is benchmarking in Go?',
    options: [
      'Benchmark functions (BenchmarkX) measuring execution time and allocations via go test -bench',
      'A CI comparison tool',
      'Profiling memory',
      'A load test framework'
    ],
    answer: 0,
    explain: 'Benchmarks run the function repeatedly and report ns/op and allocations — the built-in way to compare implementations.' },
  { id: 'go51', cat: 'go', diff: 'advanced', type: 'mcq',
    q: 'What is a panic and how is it recovered?',
    options: [
      'A runtime error unwinding the stack — recover() in a deferred function can catch it',
      'A compile error',
      'An OS signal',
      'A log warning'
    ],
    answer: 0,
    explain: 'Panics crash the goroutine unless a deferred recover() catches them — typically used at request boundaries to convert to 500s.' },
  { id: 'go52', cat: 'go', diff: 'advanced', type: 'mcq',
    q: 'What is the purpose of the http.Error helper?',
    options: [
      'Writes an error response with a status code',
      'Logs errors',
      'Redirects to an error page',
      'Panics'
    ],
    answer: 0,
    explain: 'http.Error(w, "not found", http.StatusNotFound) sends a plain-text error body — the basic error-response primitive.' },
  { id: 'go53', cat: 'go', diff: 'intermediate', type: 'mcq',
    q: 'How do you parse a JSON request body into a struct?',
    options: [
      'json.NewDecoder(r.Body).Decode(&payload)',
      'Reading the body as a string and concatenating',
      'fmt.Scan',
      'A web framework macro'
    ],
    answer: 0,
    explain: 'Decoder streams JSON into the struct directly — the standard for API handlers; validate afterward.' },
  { id: 'go54', cat: 'go', diff: 'intermediate', type: 'mcq',
    q: 'How do you write a JSON response with a status code?',
    options: [
      'Set the header/status, then json.NewEncoder(w).Encode(data)',
      'fmt.Println(data)',
      'Return the struct directly',
      'os.WriteFile'
    ],
    answer: 0,
    explain: 'w.Header().Set("Content-Type", "application/json"); w.WriteHeader(200); json.NewEncoder(w).Encode(v) — the manual API response pattern.' },
  { id: 'go55', cat: 'go', diff: 'advanced', type: 'mcq',
    q: 'What is graceful shutdown in Go?',
    options: [
      'Listening for SIGTERM and draining in-flight requests before exiting',
      'Restarting automatically',
      'Ignoring signals',
      'Killing connections immediately'
    ],
    answer: 0,
    explain: 'signal.NotifyContext + server.Shutdown(ctx) lets the server finish active requests before stopping — zero-downtime deploys.' },
  { id: 'go56', cat: 'go', diff: 'advanced', type: 'mcq',
    q: 'What is an interface assertion (type switch)?',
    options: [
      'switch v := x.(type) — inspecting the concrete type of an interface value',
      'A type conversion',
      'A compile-time check',
      'An error assertion'
    ],
    answer: 0,
    explain: 'Type switches branch on the concrete type behind an interface — used when behaviour genuinely differs by type.' },
  { id: 'go57', cat: 'go', diff: 'advanced', type: 'mcq',
    q: 'What does the interface{} (any) empty interface imply?',
    options: [
      'It can hold any value — type assertions are required to use the value concretely',
      'It is always nil',
      'It cannot be assigned',
      'It only holds numbers'
    ],
    answer: 0,
    explain: 'any accepts every type but loses type info — assert (x.(string)) or type-switch before use; prefer generics for real code.' },
  { id: 'go58', cat: 'go', diff: 'advanced', type: 'mcq',
    q: 'What is the difference between a value receiver and pointer receiver?',
    options: [
      'Pointer receivers mutate the original and avoid copies; value receivers copy the value',
      'They are identical',
      'Value receivers can mutate',
      'Pointers cannot be methods'
    ],
    answer: 0,
    explain: 'func (u *User) SetName(...) modifies the caller\u2019s struct; func (u User) GetName() copies — choose by mutation and size.' },
