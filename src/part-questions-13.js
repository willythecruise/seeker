/* Orion question bank — part 13: Django (expanded, +30 → 45) */
  /* ── Django (TestGorilla-grade depth) ─────────────────────── */
  { id: 'dj16', cat: 'django', diff: 'beginner', type: 'mcq',
    q: 'What is a Django project versus an app?',
    options: [
      'A project is the whole site (settings, urls, wsgi); an app is a modular feature within it',
      'An app is the whole site and a project is one feature',
      'They are the same thing',
      'Apps cannot have models'
    ],
    answer: 0,
    explain: 'A project contains settings and URL configuration; apps are self-contained modules (users, orders) each with models, views, and templates.' },
  { id: 'dj17', cat: 'django', diff: 'beginner', type: 'mcq',
    q: 'Which command creates a new Django app?',
    options: [
      'python manage.py startapp <name>',
      'python manage.py createapp',
      'django-admin init app',
      'pip install <name>'
    ],
    answer: 0,
    explain: 'startapp scaffolds an app directory with models.py, views.py, migrations/, and admin registration.' },
  { id: 'dj18', cat: 'django', diff: 'intermediate', type: 'mcq',
    q: 'What does a ForeignKey field represent?',
    options: [
      'A many-to-one relationship to another model (one book, many chapters)',
      'A many-to-many relationship',
      'A one-to-one relationship',
      'A text field with constraints'
    ],
    answer: 0,
    explain: 'ForeignKey is a many-to-one link storing the referenced model\u2019s id — e.g., Order.customer points at one User, while a User has many Orders.' },
  { id: 'dj19', cat: 'django', diff: 'intermediate', type: 'mcq',
    q: 'How do you define a many-to-many relationship between Student and Course?',
    options: [
      'A ManyToManyField on one of the models, creating an intermediary table',
      'Two ForeignKey fields on the same model',
      'An IntegerField storing a list of ids',
      'A JSONField of course names'
    ],
    answer: 0,
    explain: 'ManyToManyField creates a join table automatically (with through= for extra attributes like enrollment status or grade).' },
  { id: 'dj20', cat: 'django', diff: 'intermediate', type: 'fill',
    q: 'The method on a QuerySet that returns one object or raises DoesNotExist is ___.',
    answer: ['get', 'get()'],
    explain: 'Model.objects.get(pk=1) returns a single instance and raises DoesNotExist/ MultipleObjectsReturned when the match is not exactly one — use filter() when results may be many.' },
  { id: 'dj21', cat: 'django', diff: 'intermediate', type: 'mcq',
    q: 'How do you paginate a QuerySet?',
    options: [
      'from django.core.paginator import Paginator; Paginator(qs, per_page)',
      'qs.slice(0, 10)',
      'qs.limit(10)',
      'A for loop over all objects'
    ],
    answer: 0,
    explain: 'Django\u2019s Paginator splits a QuerySet into pages with page(), previous/next, and range — the built-in pagination utility.' },
  { id: 'dj22', cat: 'django', diff: 'intermediate', type: 'mcq',
    q: 'What is a Django Form (or ModelForm) used for?',
    options: [
      'Validating and rendering user input, and mapping form fields to model fields in ModelForm',
      'Styling HTML pages',
      'Running database migrations',
      'Sending emails'
    ],
    answer: 0,
    explain: 'Forms validate submitted data, render fields, and redisplay errors; ModelForm auto-generates fields and validation from a model.' },
  { id: 'dj23', cat: 'django', diff: 'advanced', type: 'mcq',
    q: 'What is the purpose of Django\u2019s transaction.atomic()?',
    options: [
      'Groups database operations so they commit together or roll back together',
      'Makes queries run in parallel',
      'Caches the query results',
      'Prevents SQL injection'
    ],
    answer: 0,
    explain: 'atomic() opens a transaction: if any operation inside fails, the whole block rolls back — the foundation of consistent multi-step writes.' },
  { id: 'dj24', cat: 'django', diff: 'advanced', type: 'mcq',
    q: 'What does select_for_update() do?',
    options: [
      'Locks the selected rows until the transaction ends, preventing concurrent modification',
      'Fetches all rows eagerly',
      'Updates rows in bulk',
      'Disables row caching'
    ],
    answer: 0,
    explain: 'SELECT ... FOR UPDATE locks rows within the transaction, so concurrent transactions wait — the pessimistic-locking tool for money-like updates.' },
  { id: 'dj25', cat: 'django', diff: 'advanced', type: 'mcq',
    q: 'What does F() allow in Django ORM?',
    options: [
      'Atomic database-side updates like Counter.objects.filter(pk=1).update(count=F("count") + 1)',
      'Foreign key lookups',
      'Fast filtering by primary key',
      'Field name shorthand'
    ],
    answer: 0,
    explain: 'F() references a column inside the query, so updates happen in SQL — avoiding the read-modify-write race of fetching, incrementing in Python, and saving.' },
  { id: 'dj26', cat: 'django', diff: 'advanced', type: 'mcq',
    q: 'What is the purpose of a Django signal?',
    options: [
      'Running code when events like post_save occur (decoupled hooks)',
      'A database index',
      'A WebSocket channel',
      'A logging level'
    ],
    answer: 0,
    explain: 'Signals (post_save, pre_delete) notify listeners of model lifecycle events — useful for audit logs and derived data, though they can hide logic; use sparingly.' },
  { id: 'dj27', cat: 'django', diff: 'advanced', type: 'mcq',
    q: 'What does a Django management command provide?',
    options: [
      'Custom python manage.py commands for scripts, cleanup, and imports',
      'A way to run the dev server',
      'Automatic code formatting',
      'A task scheduler'
    ],
    answer: 0,
    explain: 'Management commands (management/commands/*.py with a Command class) extend manage.py — ideal for one-off data operations and scheduled jobs.' },
  { id: 'dj28', cat: 'django', diff: 'advanced', type: 'mcq',
    q: 'What is Django Channels?',
    options: [
      'An extension for WebSockets and long-lived connections (async consumers)',
      'A payment gateway',
      'A caching backend',
      'A pagination helper'
    ],
    answer: 0,
    explain: 'Channels brings ASGI support: WebSocket consumers, background chat, and real-time features beyond the request/response cycle.' },
  { id: 'dj29', cat: 'django', diff: 'advanced', type: 'mcq',
    q: 'Which authentication approach is typical for a Django REST Framework API consumed by an SPA?',
    options: [
      'Token-based or JWT authentication (e.g., djangorestframework-simplejwt)',
      'HTTP Basic with plaintext passwords',
      'No authentication for public endpoints',
      'A shared API key stored in the frontend'
    ],
    answer: 0,
    explain: 'DRF with TokenAuth or SimpleJWT issues tokens the SPA sends as Authorization headers — avoiding CSRF for API calls and enabling expiration/refresh.' },
  { id: 'dj30', cat: 'django', diff: 'advanced', type: 'mcq',
    q: 'How do you make a DRF endpoint only usable by authenticated users?',
    options: [
      'Set IsAuthenticated in DEFAULT_PERMISSION_CLASSES or decorate the view',
      'Hide the URL in the frontend',
      'Check the IP address',
      'Require the Referer header'
    ],
    answer: 0,
    explain: 'Permission classes (IsAuthenticated, IsAdminUser) or @permission_classes enforce server-side access control — client-side hiding is not security.' },
  { id: 'dj31', cat: 'django', diff: 'advanced', type: 'mcq',
    q: 'What does DRF\u2019s @action decorator do on a ViewSet?',
    options: [
      'Adds custom endpoints like /orders/{id}/cancel/ beyond default CRUD',
      'Runs background tasks',
      'Adds query parameters',
      'Creates a model'
    ],
    answer: 0,
    explain: '@action(detail=True) adds custom routes to a ViewSet (e.g., POST /orders/5/cancel/), with methods = [\u201Cpost\u201D] to limit verbs.' },
  { id: 'dj32', cat: 'django', diff: 'advanced', type: 'mcq',
    q: 'What is throttling in DRF?',
    options: [
      'Limiting how often clients can call an API (rate limiting)',
      'Reducing server CPU usage',
      'Slowing down database queries',
      'A cache eviction policy'
    ],
    answer: 0,
    explain: 'DRF throttle classes (AnonRateThrottle, UserRateThrottle, ScopedRateThrottle) enforce per-client request rates — protecting the API from abuse.' },
  { id: 'dj33', cat: 'django', diff: 'advanced', type: 'mcq',
    q: 'How do you serve Django media files (uploads) in production?',
    options: [
      'Upload to object storage (S3) or serve via a dedicated static/media server — Django\u2019s dev server is not for production media',
      'Store them in the database',
      'Keep them in the templates folder',
      'They cannot be uploaded in production'
    ],
    answer: 0,
    explain: 'Production uploads go to object storage (django-storages S3) or a CDN/web server; the runserver dev media handler is unsuitable for production traffic.' },
  { id: 'dj34', cat: 'django', diff: 'intermediate', type: 'mcq',
    q: 'What does {% url \u201Cname\u201D %} do in a template?',
    options: [
      'Resolves the named URL pattern into a path, keeping links consistent when URLs change',
      'Redirects the user',
      'Defines a URL pattern',
      'Encodes the query string'
    ],
    answer: 0,
    explain: '{% url %} looks up a path by its URL name (name= in path()) — so renaming a route\u2019s pattern does not break templates.' },
  { id: 'dj35', cat: 'django', diff: 'intermediate', type: 'mcq',
    q: 'What is template inheritance?',
    options: [
      'A base template with {% block %} regions that child templates override',
      'Copying HTML between pages',
      'A form of caching',
      'A Jinja feature Django lacks'
    ],
    answer: 0,
    explain: '{% extends "base.html" %} plus {% block content %} lets pages share layout and override sections — DRY for templates.' },
  { id: 'dj36', cat: 'django', diff: 'advanced', type: 'mcq',
    q: 'Why use {{ value|date:"Y-m-d" }} filters?',
    options: [
      'Template filters transform values for display (dates, numbers, strings) without cluttering views',
      'They update the database',
      'They are required for every variable',
      'They cache the value'
    ],
    answer: 0,
    explain: 'Filters are display transformations — date, upper, default, length — keeping formatting concerns out of Python views.' },
  { id: 'dj37', cat: 'django', diff: 'advanced', type: 'mcq',
    q: 'What is Django\u2019s ATOMIC_REQUESTS setting?',
    options: [
      'Wraps each request in a transaction that rolls back on 5xx errors',
      'Makes every query atomic',
      'Enables parallel requests',
      'Caches all responses'
    ],
    answer: 0,
    explain: 'ATOMIC_REQUESTS wraps every request in a transaction committed on success and rolled back on exception — convenient but coarse; explicit atomic() is more precise.' },
  { id: 'dj38', cat: 'django', diff: 'advanced', type: 'mcq',
    q: 'How do you enable caching in Django?',
    options: [
      'Set CACHES to a backend (Redis/Memcached) and use cache.set/get or the per-view cache_page decorator',
      'By writing faster SQL',
      'By installing more RAM',
      'Caching requires a third-party framework'
    ],
    answer: 0,
    explain: 'CACHES config selects the backend; cache_page and cache.set/get put the built-in caching to work — Redis/Memcached for multi-server setups.' },
  { id: 'dj39', cat: 'django', diff: 'advanced', type: 'mcq',
    q: 'What is Django\u2019s reverse() function?',
    options: [
      'Builds a URL from a route name (and args) instead of hardcoding paths',
      'Sorts a QuerySet descending',
      'Rolls back the last migration',
      'Reverses a string'
    ],
    answer: 0,
    explain: 'reverse("order-detail", args=[pk]) produces the URL from the URLconf — the Python counterpart of the {% url %} tag.' },
  { id: 'dj40', cat: 'django', diff: 'advanced', type: 'mcq',
    q: 'What does the DEBUG = False requirement in production prevent?',
    options: [
      'Exposing stack traces, settings, and sensitive configuration to visitors',
      'Database errors',
      'Static file collection',
      'HTTPS redirects'
    ],
    answer: 0,
    explain: 'With DEBUG=True, unhandled exceptions render detailed tracebacks including settings — a severe information leak; production must run with DEBUG=False and proper error pages.' },
  { id: 'dj41', cat: 'django', diff: 'advanced', type: 'mcq',
    q: 'What is the purpose of collectstatic?',
    options: [
      'Copies all app static files into a single directory for the production web server to serve',
      'Collects user feedback',
      'Compresses JavaScript',
      'Downloads dependencies'
    ],
    answer: 0,
    explain: 'python manage.py collectstatic gathers CSS/JS/images from every app into STATIC_ROOT — where Nginx (or similar) serves them.' },
  { id: 'dj42', cat: 'django', diff: 'advanced', type: 'mcq',
    q: 'Which database features does Django ORM leverage for performance at scale?',
    options: [
      'Indexes, select_related/prefetch_related, QuerySet.values(), and raw SQL escape hatches',
      'A global mutex on queries',
      'Stored procedures only',
      'Automatic denormalization'
    ],
    answer: 0,
    explain: 'Composite indexes (db_index), eager loading, lightweight .values() projections, and targeted RawSQL keep Django queries fast on big datasets.' },
  { id: 'dj43', cat: 'django', diff: 'advanced', type: 'mcq',
    q: 'How do you run Django with PostgreSQL in production?',
    options: [
      'Install psycopg (psycopg2), set the PostgreSQL ENGINE/DATABASES, and run migrations',
      'Django only supports SQLite',
      'Use MySQL by default',
      'It requires an ORM plugin'
    ],
    answer: 0,
    explain: 'Configure DATABASES with django.db.backends.postgresql and the psycopg driver — then makemigrations/migrate manage the schema.' },
  { id: 'dj44', cat: 'django', diff: 'advanced', type: 'multi',
    q: 'Which are built-in Django security protections? (select all that apply)',
    options: [
      'CSRF protection for forms',
      'XSS escaping in templates',
      'SQL-injection-safe ORM queries',
      'Automatic rate limiting on every view'
    ],
    answer: [0, 1, 2],
    explain: 'Django ships CSRF middleware, auto-escapes template output, and parameterizes ORM queries. It does NOT rate-limit by default — use DRF throttling or a gateway.' },
  { id: 'dj45', cat: 'django', diff: 'advanced', type: 'multi',
    q: 'Which are valid ways to improve Django ORM performance? (select all that apply)',
    options: [
      'select_related() for forward foreign keys',
      'prefetch_related() for many-to-many and reverse relations',
      'Loading every object into Python and filtering there',
      'Adding db_index to frequently filtered columns'
    ],
    answer: [0, 1, 3],
    explain: 'select_related and prefetch_related eliminate N+1 queries, and indexes speed filters. Fetching everything into Python to filter is the anti-pattern — option 2 is false.' },
