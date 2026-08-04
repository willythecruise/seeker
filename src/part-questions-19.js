/* Orion question bank — part 19: Spring Boot depth + Django depth */
  /* ── Spring Boot (depth set) ──────────────────────────────── */
  { id: 's59', cat: 'springboot', diff: 'advanced', type: 'mcq',
    q: 'What does @ConfigurationProperties do differently from @Value?',
    options: [
      'Binds a whole property prefix to a typed, validated class — no scattered @Value strings',
      'It is the same as @Value',
      'It reads the database',
      'It creates beans automatically'
    ],
    answer: 0,
    explain: '@ConfigurationProperties maps app.foo.* to a POJO\u2019s fields with validation — cleaner and type-safe versus individual @Value annotations.' },
  { id: 's60', cat: 'springboot', diff: 'advanced', type: 'mcq',
    q: 'What is the Spring bean scope for HTTP requests?',
    options: [
      '@Scope("request") — one instance per HTTP request',
      'Singleton by default',
      'Prototype per call',
      'Session across all users'
    ],
    answer: 0,
    explain: 'Request scope creates a bean per HTTP request; session scope per user session — used for stateful, request-bound collaborators.' },
  { id: 's61', cat: 'springboot', diff: 'advanced', type: 'mcq',
    q: 'What does @Lazy do on a bean?',
    options: [
      'Defers creation until first use, shortening startup',
      'Removes the bean',
      'Makes the bean read-only',
      'Adds caching'
    ],
    answer: 0,
    explain: '@Lazy postpones bean instantiation until first reference — useful for heavy beans or circular dependencies.' },
  { id: 's62', cat: 'springboot', diff: 'advanced', type: 'mcq',
    q: 'What is the standard way to define custom application properties with defaults?',
    options: [
      'application.yml plus @ConfigurationProperties with defaults and validation',
      'Hardcoded constants',
      'A JSON config file',
      'System properties only'
    ],
    answer: 0,
    explain: 'YAML/properties files feed @ConfigurationProperties classes; defaults live in the class or fallback profiles.' },
  { id: 's63', cat: 'springboot', diff: 'advanced', type: 'mcq',
    q: 'What does @Scheduled(cron = "0 0 3 * * *") do?',
    options: [
      'Runs the method at 3 AM daily via cron expression',
      'Runs every 3 minutes',
      'Is invalid syntax',
      'Pauses the app at 3 AM'
    ],
    answer: 0,
    explain: 'Cron expressions give precise schedules (0 0 3 * * * = daily at 03:00); fixedDelay/fixedRate cover simpler intervals.' },
  { id: 's64', cat: 'springboot', diff: 'advanced', type: 'mcq',
    q: 'What is the difference between @Cacheable and @CacheEvict?',
    options: [
      '@Cacheable stores results; @CacheEvict clears entries to invalidate stale data',
      'They are synonyms',
      '@CacheEvict stores results',
      '@Cacheable clears entries'
    ],
    answer: 0,
    explain: '@Cacheable caches method results by key; @CacheEvict (on writes) removes entries so the next read is fresh — cache coherence 101.' },
  { id: 's65', cat: 'springboot', diff: 'advanced', type: 'mcq',
    q: 'How do you enable caching in Spring Boot?',
    options: [
      '@EnableCaching plus a CacheManager (ConcurrentMap, Redis, Caffeine)',
      'It is always on',
      'A Maven plugin',
      'By adding a database'
    ],
    answer: 0,
    explain: '@EnableCaching activates the infrastructure; the CacheManager (Redis/Caffeine default ConcurrentMap) stores the entries.' },
  { id: 's66', cat: 'springboot', diff: 'advanced', type: 'mcq',
    q: 'What does Resilience4j CircuitBreaker do?',
    options: [
      'Opens after repeated failures and fails fast during the cooldown, then half-opens to probe',
      'Always retries',
      'Load balances requests',
      'Caches responses'
    ],
    answer: 0,
    explain: 'The circuit breaker protects dependencies: OPEN (fail fast) → HALF_OPEN (probe) → CLOSED (normal), preventing cascade failures.' },
  { id: 's67', cat: 'springboot', diff: 'advanced', type: 'mcq',
    q: 'What does the @Async return for fire-and-forget calls?',
    options: [
      'void or CompletableFuture — the caller continues immediately',
      'The result directly',
      'A blocking promise',
      'An error'
    ],
    answer: 0,
    explain: '@Async methods return void or Future; exceptions are handled via the configured AsyncUncaughtExceptionHandler or the future.' },
  { id: 's68', cat: 'springboot', diff: 'intermediate', type: 'mcq',
    q: 'What is the Actuator /health endpoint used for?',
    options: [
      'Liveness checks for orchestrators and load balancers',
      'User registration',
      'Database backup',
      'Log viewing'
    ],
    answer: 0,
    explain: '/actuator/health reports service and dependency status — orchestration platforms probe it to restart or de-register unhealthy instances.' },
  { id: 's69', cat: 'springboot', diff: 'advanced', type: 'mcq',
    q: 'How do you expose only selected Actuator endpoints?',
    options: [
      'management.endpoints.web.exposure.include=health,metrics',
      'It is not configurable',
      'By deleting the jar',
      'By adding a firewall'
    ],
    answer: 0,
    explain: 'Spring Boot\u2019s Actuator defaults to exposing only health — configure include/exclude to selectively expose metrics, env, and others.' },
  { id: 's70', cat: 'springboot', diff: 'advanced', type: 'mcq',
    q: 'What is Spring Boot\u2019s default embedded server?',
    options: ['Apache Tomcat', 'Jetty', 'Netty', 'Gunicorn'],
    answer: 0,
    explain: 'spring-boot-starter-web bundles embedded Tomcat; WebFlux uses Netty, and Jetty/Undertow are optional swaps.' },
  { id: 's71', cat: 'springboot', diff: 'advanced', type: 'mcq',
    q: 'What does the spring.profiles.active environment variable do?',
    options: [
      'Selects which application-{profile} configuration file is active',
      'Starts the app',
      'Sets the port',
      'Enables debugging'
    ],
    answer: 0,
    explain: 'SPRING_PROFILES_ACTIVE=prod loads application-prod.yml — the standard per-environment configuration switch.' },
  { id: 's72', cat: 'springboot', diff: 'advanced', type: 'mcq',
    q: 'What is the recommended way to handle database credentials in Spring Boot?',
    options: [
      'Environment variables or a secrets manager referenced by property placeholders — never commit secrets',
      'Hardcode them in application.yml',
      'Put them in the JAR',
      'A shared config server with plaintext'
    ],
    answer: 0,
    explain: 'Secrets come from env vars, AWS Secrets Manager, or Vault — Spring resolves ${DB_PASSWORD} at runtime, keeping repos clean.' },
  { id: 's73', cat: 'springboot', diff: 'advanced', type: 'mcq',
    q: 'What is the HikariCP maximum-pool-size default and why tune it?',
    options: [
      '10 — tune to database capacity, not request concurrency, to avoid overwhelming the DB',
      'Unlimited',
      '1',
      'It cannot be tuned'
    ],
    answer: 0,
    explain: 'A pool too large just queues behind the database; size it to the DB\u2019s max connections and workload (often 10–50).' },
  { id: 's74', cat: 'springboot', diff: 'advanced', type: 'mcq',
    q: 'How do you run Spring Boot tests against a real database?',
    options: [
      'Testcontainers spins up disposable PostgreSQL/Mongo containers per test',
      'Run tests against production',
      'H2 in-memory is always equivalent',
      'Tests cannot use databases'
    ],
    answer: 0,
    explain: 'Testcontainers provides throwaway real databases in tests — closer to production than H2, with @SpringBootTest and @DataJpaTest.' },

  /* ── Django (depth set) ───────────────────────────────────── */
  { id: 'dj46', cat: 'django', diff: 'advanced', type: 'mcq',
    q: 'What does select_related do at the SQL level?',
    options: [
      'Adds JOINs so forward foreign keys load in one query',
      'Runs one query per row',
      'Caches results in Redis',
      'Denormalizes tables'
    ],
    answer: 0,
    explain: 'select_related translates to SQL JOINs for forward relations — killing the N+1 query problem for FK chains.' },
  { id: 'dj47', cat: 'django', diff: 'advanced', type: 'mcq',
    q: 'What does prefetch_related do differently?',
    options: [
      'Issues a second query for many-to-many and reverse relations, then joins in Python',
      'Adds SQL JOINs like select_related',
      'Loads everything in one query always',
      'Skips the database'
    ],
    answer: 0,
    explain: 'prefetch_related batches related-object queries (M2M, reverse FK) into a couple of IN queries — the right tool for those relation types.' },
  { id: 'dj48', cat: 'django', diff: 'advanced', type: 'mcq',
    q: 'What is the purpose of db_index=True on a field?',
    options: [
      'Creates a database index to speed up filters and lookups on that column',
      'Makes the field required',
      'Encrypts the column',
      'Adds a foreign key'
    ],
    answer: 0,
    explain: 'Indexes accelerate WHERE/ORDER BY on hot columns — add them after identifying slow filters (or use Meta.indexes for composite).' },
  { id: 'dj49', cat: 'django', diff: 'advanced', type: 'mcq',
    q: 'How do you filter across a foreign key in the ORM?',
    options: [
      'Order.objects.filter(customer__email="a@b.com") — the __ lookup traverses relations',
      'Write raw SQL',
      'Load all orders and filter in Python',
      'It is not possible'
    ],
    answer: 0,
    explain: 'Double-underscore lookups traverse relations and fields (customer__email, created_at__year) — the ORM\u2019s expressive query syntax.' },
  { id: 'dj50', cat: 'django', diff: 'intermediate', type: 'mcq',
    q: 'What is the difference between filter() and exclude()?',
    options: [
      'filter() keeps matching rows; exclude() drops matching rows',
      'They are identical',
      'exclude() keeps matching rows',
      'filter() is for updates'
    ],
    answer: 0,
    explain: 'QuerySet.filter(...) selects rows that match; .exclude(...) removes them — both are lazy and chainable.' },
  { id: 'dj51', cat: 'django', diff: 'advanced', type: 'mcq',
    q: 'What is the select_for_update() purpose?',
    options: [
      'Locks rows until the transaction ends — preventing lost updates in concurrent flows',
      'Fetches only the fields you need',
      'Prevents SQL injection',
      'Caches the query'
    ],
    answer: 0,
    explain: 'SELECT ... FOR UPDATE locks matching rows within the transaction; concurrent transactions block — pessimistic locking for money-like operations.' },
  { id: 'dj52', cat: 'django', diff: 'advanced', type: 'mcq',
    q: 'What does the F() expression solve?',
    options: [
      'Race-free counters: update(count=F("count") + 1) runs atomically in SQL',
      'Foreign key joins',
      'Fast full-text search',
      'Field renaming'
    ],
    answer: 0,
    explain: 'F() references a column inside the UPDATE, so the increment happens in the database atomically — no read-modify-write race.' },
  { id: 'dj53', cat: 'django', diff: 'intermediate', type: 'mcq',
    q: 'What does .values("name") return?',
    options: [
      'A QuerySet of dictionaries with only the chosen fields',
      'A list of model instances',
      'A SQL dump',
      'An aggregate'
    ],
    answer: 0,
    explain: '.values() projects rows into dicts of selected fields — lighter than full model instances for reporting.' },
  { id: 'dj54', cat: 'django', diff: 'advanced', type: 'mcq',
    q: 'How do you aggregate totals per group in the ORM?',
    options: [
      'values("cat").annotate(total=Count("id"), avg=Avg("score"))',
      'A for loop summing in Python',
      'Raw SQL only',
      'GROUP BY is not supported'
    ],
    answer: 0,
    explain: 'annotate() with Count/Avg/Sum after values() produces the SQL GROUP BY — the idiomatic aggregation.' },
  { id: 'dj55', cat: 'django', diff: 'advanced', type: 'mcq',
    q: 'What is the purpose of Meta ordering on a model?',
    options: [
      'Sets a default ORDER BY for queries on that model',
      'Creates a unique constraint',
      'Adds permissions',
      'Names the table'
    ],
    answer: 0,
    explain: 'class Meta: ordering = ["-created_at"] applies a default sort — consistent ordering without repeating it in every query.' },
  { id: 'dj56', cat: 'django', diff: 'advanced', type: 'mcq',
    q: 'How do you add a UNIQUE constraint across two columns?',
    options: [
      'Meta.unique_together (or UniqueConstraint) on the fields',
      'db_index=True',
      'A ForeignKey',
      'It is impossible'
    ],
    answer: 0,
    explain: 'UniqueConstraint(fields=["student", "course"]) enforces uniqueness per pair at the DB level — the correct guard against duplicates.' },
  { id: 'dj57', cat: 'django', diff: 'intermediate', type: 'mcq',
    q: 'What does {% csrf_token %} render in a form?',
    options: [
      'A hidden input with the CSRF token required for POST validation',
      'A captcha',
      'An encryption key',
      'A session id'
    ],
    answer: 0,
    explain: 'The template tag emits the hidden CSRF field Django\u2019s middleware verifies on unsafe methods — blocking cross-site forgeries.' },
  { id: 'dj58', cat: 'django', diff: 'advanced', type: 'mcq',
    q: 'How do you protect a DRF endpoint with permissions?',
    options: [
      'DEFAULT_PERMISSION_CLASSES or @permission_classes([IsAuthenticated])',
      'Hiding the button in the UI',
      'Checking the Referer header',
      'A shared API token in the frontend'
    ],
    answer: 0,
    explain: 'DRF permission classes enforce server-side access control; client-side hiding is cosmetic, not security.' },
  { id: 'dj59', cat: 'django', diff: 'advanced', type: 'mcq',
    q: 'What does DRF\u2019s ModelSerializer automate?',
    options: [
      'Field declarations, validation, and create/update from a model',
      'Database migrations',
      'Authentication',
      'Background tasks'
    ],
    answer: 0,
    explain: 'ModelSerializer infers fields from the model and generates validated create/update logic — the DRF workhorse for CRUD APIs.' },
  { id: 'dj60', cat: 'django', diff: 'advanced', type: 'mcq',
    q: 'What is the purpose of Django\u2019s EAGER vs LAZY relation loading?',
    options: [
      'Eager (select_related/prefetch_related) loads related data up front; lazy loads on access — choose by access pattern',
      'Lazy is always better',
      'Eager is always better',
      'Relations cannot be loaded eagerly'
    ],
    answer: 0,
    explain: 'Eager loading avoids N+1 when you will access relations; lazy is fine when you rarely do. The choice is about your query patterns.' },
  { id: 'dj61', cat: 'django', diff: 'advanced', type: 'mcq',
    q: 'How do you run a Django task asynchronously in production?',
    options: [
      'Celery with a broker (Redis/RabbitMQ) and workers',
      'Sleeping in the view',
      'A while loop in the server process',
      'Spawn OS processes per task'
    ],
    answer: 0,
    explain: 'Celery queues tasks to workers via a broker — the standard for emails, processing, and scheduled jobs in Django apps.' },
