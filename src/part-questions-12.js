/* Orion question bank — part 12: Spring Boot (expanded, +30 → 54) */
  /* ── Spring Boot & Java (TestGorilla-grade depth) ─────────── */
  { id: 's25', cat: 'springboot', diff: 'beginner', type: 'mcq',
    q: 'What does @SpringBootApplication scan automatically?',
    options: [
      'The package it belongs to and sub-packages, discovering components, services, and repositories',
      'The entire filesystem',
      'Only the main class',
      'Only XML configuration files'
    ],
    answer: 0,
    explain: '@SpringBootApplication\u2019s @ComponentScan starts from its package, so controllers/services/repositories in sub-packages are auto-registered — a common gotcha when classes sit outside.' },
  { id: 's26', cat: 'springboot', diff: 'beginner', type: 'mcq',
    q: 'What is application.properties (or application.yml) used for?',
    options: [
      'Centralized configuration: server port, datasource URL, logging, and custom properties',
      'Storing compiled classes',
      'Writing database queries',
      'A build script'
    ],
    answer: 0,
    explain: 'Configuration properties live in application.properties/yml — externalized, profile-specific, and overridable by environment variables.' },
  { id: 's27', cat: 'springboot', diff: 'beginner', type: 'mcq',
    q: 'How do you run a Spring Boot application during development?',
    options: [
      'mvn spring-boot:run or via the main method in an IDE',
      'javac on every class manually',
      'Deploying a WAR to Tomcat manually',
      'Writing a shell script with java -cp'
    ],
    answer: 0,
    explain: 'spring-boot:run (Maven) or running the main class starts the embedded server instantly — no external container needed in development.' },
  { id: 's28', cat: 'springboot', diff: 'intermediate', type: 'mcq',
    q: 'What does @RequestMapping("/api") on a controller do?',
    options: [
      'Sets a base path shared by all handler methods in that controller',
      'Creates a database table',
      'Enables logging',
      'Declares a bean'
    ],
    answer: 0,
    explain: 'Type-level @RequestMapping narrows every method\u2019s path — @GetMapping("/users") on a method under @RequestMapping("/api") maps to /api/users.' },
  { id: 's29', cat: 'springboot', diff: 'intermediate', type: 'mcq',
    q: 'What is the difference between @RequestParam and @PathVariable?',
    options: [
      'PathVariable reads URL segments; RequestParam reads query strings and form values',
      'They are interchangeable',
      'RequestParam only works for POST',
      'PathVariable only works for GET'
    ],
    answer: 0,
    explain: '/users/{id} with @PathVariable("id") captures the segment; ?page=2 with @RequestParam captures the query parameter.' },
  { id: 's30', cat: 'springboot', diff: 'intermediate', type: 'mcq',
    q: 'What does @RequestBody do?',
    options: [
      'Deserializes the HTTP request body (usually JSON) into a Java object',
      'Writes the response body',
      'Validates the URL',
      'Reads the request headers only'
    ],
    answer: 0,
    explain: '@RequestBody binds the JSON body to a POJO using Jackson — the standard way to accept payloads in Spring MVC, with validation via @Valid.' },
  { id: 's31', cat: 'springboot', diff: 'intermediate', type: 'mcq',
    q: 'What is the repository pattern in Spring Data JPA?',
    options: [
      'An interface extending JpaRepository that gets a concrete CRUD implementation generated automatically',
      'A class that must be hand-written per entity',
      'A stored procedure wrapper',
      'A caching layer'
    ],
    answer: 0,
    explain: 'Spring Data generates implementations for repository interfaces at runtime — findByName, derived queries, pagination, and custom @Query methods included.' },
  { id: 's32', cat: 'springboot', diff: 'advanced', type: 'mcq',
    q: 'What is N+1 in JPA and how do you fix it?',
    options: [
      'Fetching an entity plus one query per related row — fix with JOIN FETCH, @EntityGraph, or batch fetching',
      'Using too many repositories',
      'A pagination off-by-one error',
      'A lazy-loading security bug'
    ],
    answer: 0,
    explain: 'Lazy relations trigger a query per child (N+1). JOIN FETCH or @EntityGraph loads them in one query; Hibernate batch fetching helps too.' },
  { id: 's33', cat: 'springboot', diff: 'advanced', type: 'mcq',
    q: 'What is the purpose of @ManyToOne with fetch = FetchType.LAZY?',
    options: [
      'Defers loading the related entity until it is accessed, avoiding unnecessary queries',
      'Loads everything eagerly always',
      'Deletes the relation',
      'Creates a join table'
    ],
    answer: 0,
    explain: 'LAZY proxies load associations only when accessed. ManyToOne is EAGER by default, which can pull in parents you do not need — set LAZY and fetch explicitly when required.' },
  { id: 's34', cat: 'springboot', diff: 'advanced', type: 'mcq',
    q: 'What is Hibernate\u2019s first-level cache?',
    options: [
      'The per-session (per-transaction) cache that avoids duplicate queries for the same entity',
      'A global distributed cache',
      'A Redis cache',
      'A query plan cache'
    ],
    answer: 0,
    explain: 'The persistence context caches entities for the duration of a session/transaction — repeated loads within it return the same instance without hitting the DB.' },
  { id: 's35', cat: 'springboot', diff: 'advanced', type: 'mcq',
    q: 'How do you handle optimistic locking with JPA?',
    options: [
      'A @Version annotated field, incremented on update, causing OptimisticLockException on conflict',
      'A synchronized block',
      'A unique constraint',
      'A read-only transaction'
    ],
    answer: 0,
    explain: '@Version (integer or timestamp) lets Hibernate include it in UPDATE ... WHERE version = ? — zero rows updated means a concurrent change, and the app retries or reports the conflict.' },
  { id: 's36', cat: 'springboot', diff: 'advanced', type: 'mcq',
    q: 'What does @Transactional(readOnly = true) optimize?',
    options: [
      'Lets the database skip write locking and Hibernate skip dirty checks — faster reads',
      'Makes reads asynchronous',
      'Caches the result forever',
      'Disables SQL generation'
    ],
    answer: 0,
    explain: 'readOnly hints the DB and ORM to avoid write overhead; it is not a security control — write access still depends on the transaction\u2019s own guarantees.' },
  { id: 's37', cat: 'springboot', diff: 'intermediate', type: 'mcq',
    q: 'What is Flyway used for in Spring Boot?',
    options: [
      'Versioned database migrations applied automatically on startup',
      'An alternative web server',
      'A REST client',
      'A caching solution'
    ],
    answer: 0,
    explain: 'Flyway (and Liquibase) applies ordered SQL migrations (V1__init.sql, V2__x.sql) and records them — schema changes become code, repeatable across environments.' },
  { id: 's38', cat: 'springboot', diff: 'advanced', type: 'mcq',
    q: 'What is the DataSource connection pool used by default in Spring Boot?',
    options: [
      'HikariCP — a fast, lightweight pool configured via spring.datasource.hikari.*',
      'Tomcat JDBC pool only',
      'Apache Commons DBCP',
      'A single shared connection'
    ],
    answer: 0,
    explain: 'Spring Boot defaults to HikariCP; its maximum-pool-size, connection-timeout, and leak-detection settings are the first knobs to tune under load.' },
  { id: 's39', cat: 'springboot', diff: 'intermediate', type: 'mcq',
    q: 'How do you log messages in a Spring Boot service?',
    options: [
      'SLF4J LoggerFactory.getLogger(...) with Lombok @Slf4j as shorthand',
      'System.out.println in controllers',
      'The Log4j.xml file only',
      'A debugger'
    ],
    answer: 0,
    explain: 'SLF4J is the logging facade (Logback default); @Slf4j generates the logger field — structured, leveled, and configurable, unlike println.' },
  { id: 's40', cat: 'springboot', diff: 'advanced', type: 'mcq',
    q: 'What does @Profile("prod") do?',
    options: [
      'Registers the bean or configuration only when the prod profile is active',
      'Marks the class for deletion',
      'Adds production monitoring',
      'Locks the bean for editing'
    ],
    answer: 0,
    explain: '@Profile gates beans by active profile (application-{profile}.yml), enabling environment-specific beans like different datasources or mock services.' },
  { id: 's41', cat: 'springboot', diff: 'advanced', type: 'mcq',
    q: 'How do you make an HTTP call to another service in a Spring Boot app?',
    options: [
      'RestClient (or WebClient/Feign) injected as a bean',
      'Opening a raw socket per request',
      'Shelling out to curl',
      'A database join'
    ],
    answer: 0,
    explain: 'Spring\u2019s RestClient (synchronous), WebClient (reactive), or OpenFeign (declarative) are the standard HTTP clients — with timeouts and resilience configured.' },
  { id: 's42', cat: 'springboot', diff: 'advanced', type: 'mcq',
    q: 'What is a Feign client?',
    options: [
      'A declarative HTTP client defined by an interface with annotations',
      'A circuit breaker',
      'A message queue',
      'A database driver'
    ],
    answer: 0,
    explain: 'OpenFeign turns a Java interface into a REST client — @FeignClient(name="orders", url="...") with @GetMapping methods; common in Spring Cloud microservices.' },
  { id: 's43', cat: 'springboot', diff: 'advanced', type: 'mcq',
    q: 'How do you schedule tasks at a fixed interval in Spring?',
    options: [
      'Annotate a method with @Scheduled(fixedDelay = 5000) and enable @EnableScheduling',
      'A while(true) loop in the controller',
      'A cron expression in the database',
      'Sleeping threads in the main method'
    ],
    answer: 0,
    explain: '@Scheduled + @EnableScheduling runs methods on the scheduler thread pool — fixedDelay, fixedRate, and cron forms are available.' },
  { id: 's44', cat: 'springboot', diff: 'advanced', type: 'mcq',
    q: 'What is @Async used for?',
    options: [
      'Runs a method on a separate thread so the caller continues without waiting',
      'Makes a method non-blocking I/O',
      'Starts a new JVM',
      'Parallelizes database writes'
    ],
    answer: 0,
    explain: '@Async (with @EnableAsync) executes a method on a configured executor and returns immediately — for fire-and-forget work like emails and notifications.' },
  { id: 's45', cat: 'springboot', diff: 'advanced', type: 'mcq',
    q: 'What is the danger of calling @Async methods from within the same class?',
    options: [
      'Self-invocation bypasses the proxy, so the method runs synchronously',
      'It always deadlocks',
      'The method is never called',
      'It creates infinite recursion'
    ],
    answer: 0,
    explain: 'Spring AOP proxying only applies to calls through the injected proxy — internal self-calls hit this directly and skip the async behavior. Inject a self-reference or move to another bean.' },
  { id: 's46', cat: 'springboot', diff: 'intermediate', type: 'mcq',
    q: 'What does @EnableScheduling do?',
    options: [
      'Turns on the infrastructure that runs @Scheduled methods',
      'Starts the embedded web server',
      'Enables database migrations',
      'Activates profiling'
    ],
    answer: 0,
    explain: '@EnableScheduling registers the scheduling infrastructure (TaskScheduler) — usually placed on a @Configuration or the main class.' },
  { id: 's47', cat: 'springboot', diff: 'intermediate', type: 'mcq',
    q: 'What is Spring Boot DevTools?',
    options: [
      'A dependency adding automatic restart on code changes plus a live-reload bridge for development',
      'A production monitoring agent',
      'A SQL client',
      'A build tool'
    ],
    answer: 0,
    explain: 'DevTools watches the classpath and restarts the app quickly on changes, plus LiveReload for the browser — development-only, excluded from production images.' },
  { id: 's48', cat: 'springboot', diff: 'advanced', type: 'mcq',
    q: 'How do you validate an email field in a DTO?',
    options: [
      '@Email and @NotBlank constraints from Bean Validation, checked when @Valid is used',
      'A regex in the controller',
      'Checking the email in the database',
      'A custom exception'
    ],
    answer: 0,
    explain: 'Bean Validation annotations (@NotNull, @NotBlank, @Email, @Size) on DTO fields run when the parameter is @Valid/@Validated — returning 400 on failure.' },
  { id: 's49', cat: 'springboot', diff: 'advanced', type: 'mcq',
    q: 'What is the difference between @Transactional(propagation = REQUIRED) and REQUIRES_NEW?',
    options: [
      'REQUIRED joins an existing transaction; REQUIRES_NEW always suspends it and starts a fresh one',
      'REQUIRES_NEW joins the existing one',
      'They are identical',
      'REQUIRED always starts a new transaction'
    ],
    answer: 0,
    explain: 'With REQUIRED, a call inside a transaction participates in it (one commit/rollback); REQUIRES_NEW commits independently — useful when a sub-operation must not roll back with the parent.' },
  { id: 's50', cat: 'springboot', diff: 'advanced', type: 'mcq',
    q: 'What does @Rollback annotation do in tests?',
    options: [
      'Reverts the test transaction after each test, keeping the database clean',
      'Commits test data permanently',
      'Drops all tables',
      'Runs tests in parallel'
    ],
    answer: 0,
    explain: 'Spring Test rolls back test transactions by default, so test data never pollutes the database — @Rollback(false) or @Commit opt out.' },
  { id: 's51', cat: 'springboot', diff: 'advanced', type: 'mcq',
    q: 'How do you create a Docker image of a Spring Boot app efficiently?',
    options: [
      'A multi-stage build using spring-boot:build-image or a slim JRE layer with only the fat jar',
      'Copying the whole build directory including sources',
      'Installing Maven inside the runtime image',
      'Exporting the IDE workspace'
    ],
    answer: 0,
    explain: 'Build once, ship a small runtime image (JRE + layered jar) — spring-boot:build-image (Cloud Native Buildpacks) or a two-stage Dockerfile with a distroless JRE.' },
  { id: 's52', cat: 'springboot', diff: 'advanced', type: 'mcq',
    q: 'What is Spring Cloud Config used for?',
    options: [
      'Centralizing configuration for many services in a versioned config server',
      'Local configuration files only',
      'Encrypting source code',
      'A build tool for microservices'
    ],
    answer: 0,
    explain: 'Spring Cloud Config serves application configuration from a git-backed server to all services — with profiles, refresh, and encryption support.' },
  { id: 's53', cat: 'springboot', diff: 'advanced', type: 'mcq',
    q: 'How do you expose custom application metrics to Prometheus?',
    options: [
      'Micrometer with micrometer-registry-prometheus, plus a /actuator/prometheus endpoint',
      'Writing metrics to a log file',
      'A REST call to Grafana',
      'Printing to stdout'
    ],
    answer: 0,
    explain: 'Micrometer is the metrics facade; adding the Prometheus registry and actuator exposes /actuator/prometheus that Prometheus scrapes.' },
  { id: 's54', cat: 'springboot', diff: 'advanced', type: 'mcq',
    q: 'What is the recommended way to handle pagination in a Spring Data JPA query?',
    options: [
      'Accept a Pageable parameter and return Page<T> — Spring Data derives limit/offset',
      'Query all rows and slice in Java',
      'Hardcode LIMIT 10 in @Query',
      'Return the full list every time'
    ],
    answer: 0,
    explain: 'Passing Pageable into a repository method returns Page<T> with content, total, and page info — the standard scalable way to paginate.' },
  /* ── Spring Boot multi-select questions ───────────────────── */
  { id: 's55', cat: 'springboot', diff: 'advanced', type: 'multi',
    q: 'Which are benefits of dependency injection in Spring? (select all that apply)',
    options: [
      'Loose coupling between classes',
      'Easier unit testing with mocks',
      'Automatic database backups',
      'Centralized bean lifecycle management'
    ],
    answer: [0, 1, 3],
    explain: 'DI decouples classes, enables mocking in tests, and lets the container manage lifecycles. It does not back up databases — option 2 is false.' },
  { id: 's56', cat: 'springboot', diff: 'advanced', type: 'multi',
    q: 'Which annotations belong to the Spring Web layer? (select all that apply)',
    options: [
      '@RestController',
      '@GetMapping',
      '@Repository',
      '@RequestBody'
    ],
    answer: [0, 1, 3],
    explain: '@RestController, @GetMapping, and @RequestBody are web-layer annotations. @Repository marks data-access beans — a different layer.' },
  { id: 's57', cat: 'springboot', diff: 'advanced', type: 'multi',
    q: 'Which approaches help diagnose a slow Spring Boot API in production? (select all that apply)',
    options: [
      'Actuator metrics for latency and error rates',
      'Slow-query logs and EXPLAIN on the database',
      'Randomly removing @Transactional',
      'Distributed tracing (Micrometer Tracing, Zipkin)'
    ],
    answer: [0, 1, 3],
    explain: 'Metrics, slow-query analysis, and tracing pinpoint bottlenecks. Removing transactions at random will corrupt consistency, not fix performance — option 2 is false.' },
  { id: 's58', cat: 'springboot', diff: 'advanced', type: 'multi',
    q: 'Which are standard ways to secure a Spring Boot API? (select all that apply)',
    options: [
      'Spring Security with a SecurityFilterChain',
      'JWT or OAuth2 resource-server configuration',
      'Relying on CORS alone',
      'Method security with @PreAuthorize'
    ],
    answer: [0, 1, 3],
    explain: 'Security filter chains, JWT/OAuth2, and @PreAuthorize are real security controls. CORS is a browser policy, not authentication — option 2 is false.' },
