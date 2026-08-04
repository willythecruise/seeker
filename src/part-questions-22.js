/* Orion question bank — part 22: more matching & ordering across categories */
  /* ── Matching pairs (batch 2) ─────────────────────────────── */
  { id: 'mo17', cat: 'backend', diff: 'beginner', type: 'matching',
    q: 'Match each HTTP method to its conventional purpose in a REST API.',
    pairs: [
      { l: 'GET', r: 'Retrieve a resource' },
      { l: 'POST', r: 'Create a new resource' },
      { l: 'PUT', r: 'Replace a resource entirely' },
      { l: 'DELETE', r: 'Remove a resource' }
    ],
    explain: 'GET reads, POST creates, PUT replaces, DELETE removes — the standard REST verb mapping, with PATCH for partial updates.' },
  { id: 'mo18', cat: 'devops', diff: 'intermediate', type: 'matching',
    q: 'Match each Kubernetes object to its purpose.',
    pairs: [
      { l: 'Deployment', r: 'Manages a set of identical pods with rolling updates' },
      { l: 'Service', r: 'Stable network endpoint for a set of pods' },
      { l: 'Ingress', r: 'HTTP/HTTPS routing into the cluster' },
      { l: 'ConfigMap', r: 'Non-secret configuration data for pods' }
    ],
    explain: 'Deployments manage replicas, Services expose stable endpoints, Ingress routes HTTP, and ConfigMaps hold config data.' },
  { id: 'mo19', cat: 'frontend', diff: 'advanced', type: 'matching',
    q: 'Match each Next.js rendering strategy to when it runs.',
    pairs: [
      { l: 'CSR', r: 'Browser renders at runtime' },
      { l: 'SSR', r: 'Server renders on every request' },
      { l: 'SSG', r: 'Built once at build time' },
      { l: 'ISR', r: 'Static, regenerated in the background on a schedule' }
    ],
    explain: 'CSR runs in the browser, SSR per request, SSG at build, and ISR combines static caching with background regeneration.' },
  { id: 'mo20', cat: 'db-mongodb', diff: 'intermediate', type: 'matching',
    q: 'Match each MongoDB aggregation stage to its job.',
    pairs: [
      { l: '$match', r: 'Filters documents early' },
      { l: '$group', r: 'Buckets documents by a key' },
      { l: '$lookup', r: 'Joins another collection' },
      { l: '$sort', r: 'Orders the documents' }
    ],
    explain: '$match filters, $group aggregates by key, $lookup joins, and $sort orders — order them to minimize work early.' },
  { id: 'mo21', cat: 'python', diff: 'beginner', type: 'matching',
    q: 'Match each Python built-in to its defining property.',
    pairs: [
      { l: 'dict', r: 'Key-value pairs with fast lookup' },
      { l: 'set', r: 'Unique elements, no duplicates' },
      { l: 'tuple', r: 'Immutable ordered sequence' },
      { l: 'list', r: 'Mutable ordered sequence' }
    ],
    explain: 'dicts map keys to values, sets enforce uniqueness, tuples are immutable, and lists are mutable ordered sequences.' },
  { id: 'mo22', cat: 'java', diff: 'intermediate', type: 'matching',
    q: 'Match each Java collection to its behaviour.',
    pairs: [
      { l: 'ArrayList', r: 'Indexed dynamic array' },
      { l: 'LinkedList', r: 'Node-based with fast head/tail inserts' },
      { l: 'HashMap', r: 'Key-value lookup by hash' },
      { l: 'TreeSet', r: 'Sorted unique elements' }
    ],
    explain: 'ArrayList is an indexed array, LinkedList is node-based, HashMap does hash lookups, and TreeSet keeps sorted unique values.' },
  { id: 'mo23', cat: 'cs', diff: 'advanced', type: 'matching',
    q: 'Match each C# LINQ operator to its purpose.',
    pairs: [
      { l: 'Where', r: 'Filters the sequence' },
      { l: 'Select', r: 'Projects each element' },
      { l: 'GroupBy', r: 'Groups elements by a key' },
      { l: 'OrderBy', r: 'Sorts the sequence' }
    ],
    explain: 'Where filters, Select projects, GroupBy buckets by key, and OrderBy sorts — the four most common LINQ operators.' },
  { id: 'mo24', cat: 'typescript', diff: 'advanced', type: 'matching',
    q: 'Match each TypeScript utility to its effect.',
    pairs: [
      { l: 'Omit<T, K>', r: 'Removes the listed keys' },
      { l: 'Required<T>', r: 'Makes every property required' },
      { l: 'ReturnType<T>', r: 'Extracts a function\u2019s return type' },
      { l: 'Awaited<T>', r: 'Unwraps a Promise\u2019s value type' }
    ],
    explain: 'Omit strips keys, Required removes optionality, ReturnType reads return types, and Awaited unwraps promises.' },
  { id: 'mo25', cat: 'go', diff: 'intermediate', type: 'matching',
    q: 'Match each Go standard-library package to its purpose.',
    pairs: [
      { l: 'fmt', r: 'Formatted I/O (Printf, Sprint)' },
      { l: 'net/http', r: 'HTTP clients and servers' },
      { l: 'encoding/json', r: 'JSON serialization' },
      { l: 'sync', r: 'Mutexes and wait groups' }
    ],
    explain: 'fmt handles formatting, net/http builds web servers, encoding/json serializes JSON, and sync provides concurrency primitives.' },
  { id: 'mo26', cat: 'rust', diff: 'advanced', type: 'matching',
    q: 'Match each Rust smart pointer to its role.',
    pairs: [
      { l: 'Box<T>', r: 'Single-owner heap allocation' },
      { l: 'Rc<T>', r: 'Shared ownership within one thread' },
      { l: 'Arc<T>', r: 'Thread-safe shared ownership' },
      { l: 'RefCell<T>', r: 'Interior mutability with runtime checks' }
    ],
    explain: 'Box owns heap data, Rc ref-counts in a thread, Arc is atomic across threads, and RefCell enables interior mutability.' },
  { id: 'mo27', cat: 'solutions', diff: 'advanced', type: 'matching',
    q: 'Match each deployment pattern to its description.',
    pairs: [
      { l: 'Blue-green', r: 'Two full environments, instant switch' },
      { l: 'Canary', r: 'Roll out to a small subset first' },
      { l: 'Strangler fig', r: 'Gradually replace a monolith piece by piece' },
      { l: 'Rolling', r: 'Update instances in batches' }
    ],
    explain: 'Blue-green flips between environments, canary shadows a subset, strangler migrates incrementally, and rolling updates in batches.' },
  { id: 'mo28', cat: 'db-postgres', diff: 'beginner', type: 'matching',
    q: 'Match each SQL clause to its role in a query.',
    pairs: [
      { l: 'WHERE', r: 'Filters rows before grouping' },
      { l: 'GROUP BY', r: 'Buckets rows by a column' },
      { l: 'HAVING', r: 'Filters grouped results' },
      { l: 'ORDER BY', r: 'Sorts the output' }
    ],
    explain: 'WHERE filters raw rows, GROUP BY buckets them, HAVING filters those buckets, and ORDER BY sorts the result.' },
  { id: 'mo29', cat: 'system-design', diff: 'advanced', type: 'matching',
    q: 'Match each consistency model to the scenario where it fits best.',
    pairs: [
      { l: 'Strong consistency', r: 'Bank account balance reads' },
      { l: 'Eventual consistency', r: 'Social media like counts' },
      { l: 'Read-your-writes', r: 'User updates their own profile' },
      { l: 'Monotonic reads', r: 'A feed must never move backward' }
    ],
    explain: 'Payments need strong consistency; likes tolerate eventual; profiles want read-your-writes; feeds need monotonic reads.' },
  { id: 'mo30', cat: 'devops', diff: 'intermediate', type: 'matching',
    q: 'Match each CI/CD term to its meaning.',
    pairs: [
      { l: 'Continuous Integration', r: 'Frequently merge and auto-test code' },
      { l: 'Continuous Delivery', r: 'Keep code always deployable' },
      { l: 'Continuous Deployment', r: 'Auto-deploy every passing change' },
      { l: 'Pipeline', r: 'Automated stages from commit to deploy' }
    ],
    explain: 'CI integrates and tests often, CD keeps builds deployable, CD fully automates deploys, and pipelines tie stages together.' },

  /* ── Ordering (batch 2) ───────────────────────────────────── */
  { id: 'mo32', cat: 'frontend', diff: 'intermediate', type: 'ordering',
    q: 'Order the lifecycle steps of a React component\u2019s first render.',
    ordered: ['Component function runs', 'React reconciles the virtual DOM', 'Commit applies DOM changes', 'Browser paints to screen', 'useEffect runs after paint'],
    explain: 'React renders, reconciles, commits, the browser paints, then effects run after paint.' },
  { id: 'mo33', cat: 'backend', diff: 'intermediate', type: 'ordering',
    q: 'Order the steps of a JWT authentication flow.',
    ordered: ['User submits credentials', 'Server verifies credentials', 'Server signs and issues a JWT', 'Client stores the token', 'Client sends it in the Authorization header', 'Server validates the token on each request'],
    explain: 'Credentials are verified, a token is signed and issued, the client stores and sends it, and the server validates it per request.' },
  { id: 'mo34', cat: 'db-mongodb', diff: 'intermediate', type: 'ordering',
    q: 'Order the stages of an efficient aggregation pipeline.',
    ordered: ['$match filters early', '$group aggregates by key', '$sort orders results', '$limit keeps the top rows'],
    explain: 'Filter first to shrink the dataset, then group, sort, and limit — early stages minimize work in later ones.' },
  { id: 'mo35', cat: 'devops', diff: 'beginner', type: 'ordering',
    q: 'Order the steps to ship a Docker image.',
    ordered: ['Write a Dockerfile', 'docker build the image', 'Tag the image', 'Push to a registry', 'Deploy and run the container'],
    explain: 'Author the Dockerfile, build, tag, push to a registry, then run the container from it.' },
  { id: 'mo36', cat: 'solutions', diff: 'advanced', type: 'ordering',
    q: 'Order the steps of a disaster-recovery failover to a standby region.',
    ordered: ['Detect the primary region outage', 'Promote the standby database', 'Switch DNS traffic to the standby region', 'Scale up the standby compute', 'Verify traffic and health'],
    explain: 'Detect the outage, promote the replica, switch DNS, scale up resources, then verify everything is serving.' },
  { id: 'mo37', cat: 'system-design', diff: 'advanced', type: 'ordering',
    q: 'Order the steps of a TLS handshake.',
    ordered: ['Client sends ClientHello', 'Server responds with certificate', 'Client verifies the certificate', 'Keys are exchanged to derive a session secret', 'Secure encrypted communication begins'],
    explain: 'ClientHello opens the handshake, the server presents its certificate, the client verifies it, keys are exchanged, and encryption begins.' },
  { id: 'mo38', cat: 'devops', diff: 'intermediate', type: 'ordering',
    q: 'Order the steps a load balancer takes for a request.',
    ordered: ['Request arrives at the load balancer', 'Health check picks a healthy backend', 'Request is routed to that backend', 'Backend processes and responds', 'Response is returned to the client'],
    explain: 'The LB receives the request, selects a healthy backend, routes, the backend responds, and the LB relays the response.' },
  { id: 'mo39', cat: 'coding', diff: 'beginner', type: 'ordering',
    q: 'Order the steps of a typical code review workflow.',
    ordered: ['Author opens a pull request', 'CI runs automated checks', 'Reviewer comments on the diff', 'Author addresses feedback', 'Reviewer approves', 'Change is merged'],
    explain: 'PRs open with CI checks, reviewers comment, authors revise, approval follows, then the change merges.' },
  { id: 'mo40', cat: 'devops', diff: 'advanced', type: 'ordering',
    q: 'Order the steps of scheduling a pod in Kubernetes.',
    ordered: ['Deployment is created', 'Scheduler picks a node with capacity', 'Kubelet pulls the container image', 'Pod is created on the node', 'Readiness probe passes', 'Pod receives traffic']
  ,
    explain: 'The scheduler assigns a node, kubelet pulls and starts the container, readiness passes, and the pod joins the service endpoints.' },
