/* Orion question bank — part 8: coding challenges, full-stack & security,
   DevOps & Kubernetes, and AWS cloud (from interview conversations) */
  /* ── Frontend coding challenges ───────────────────────────── */
  { id: 'e01', cat: 'frontend', diff: 'intermediate', type: 'mcq',
    q: 'Which pair of APIs is the foundation of a debounce implementation?',
    options: [
      'clearTimeout and setTimeout',
      'addEventListener and removeEventListener',
      'Promise.resolve and Promise.all',
      'requestAnimationFrame and cancelAnimationFrame'
    ],
    answer: 0,
    explain: 'Debounce clears the previous timer and starts a new one on every call — clearTimeout/setTimeout are exactly the APIs needed.' },
  { id: 'e02', cat: 'frontend', diff: 'intermediate', type: 'mcq',
    q: 'For a shopping cart with add, remove, and quantity-update actions, which state approach is cleanest?',
    options: [
      'useReducer with typed actions for add/remove/updateQuantity',
      'A single boolean state',
      'Storing the cart in a module-level global variable',
      'Recreating the cart array on every render without state'
    ],
    answer: 0,
    explain: 'A cart has distinct, multi-step transitions — useReducer centralizes each action (add/remove/quantity) in one pure reducer, ideal for testing.' },
  { id: 'e03', cat: 'frontend', diff: 'intermediate', type: 'mcq',
    q: 'For paginating a 1M-row dataset, why is server-side pagination preferable to fetching everything?',
    options: [
      'It transfers only the requested page, keeping memory and network low',
      'It is easier to write than client-side code',
      'The server is always faster than the browser',
      'It removes the need for a database'
    ],
    answer: 0,
    explain: 'Fetching 1M rows to page through them wastes memory and bandwidth. Server-side pagination (page/size or cursor) moves only the needed slice.' },
  { id: 'e04', cat: 'frontend', diff: 'advanced', type: 'mcq',
    q: 'How should a custom useFetch hook cancel an in-flight request when the component unmounts?',
    options: [
      'With an AbortController aborted in the effect cleanup',
      'By ignoring the promise entirely',
      'With a second fetch that overrides the first',
      'By setting state to null in finally'
    ],
    answer: 0,
    explain: 'AbortController aborts the fetch in the cleanup function, preventing state updates on unmounted components and wasted network work.' },
  { id: 'e05', cat: 'frontend', diff: 'intermediate', type: 'mcq',
    q: 'Which interactions should close a modal dialog?',
    options: [
      'Escape key and clicking outside the dialog (with an accessible focus trap)',
      'Only the close button',
      'Any mouse movement',
      'Only pressing Enter'
    ],
    answer: 0,
    explain: 'Escape and outside-click are the standard dismissals; add aria-modal, focus management, and a focus trap for accessibility.' },
  { id: 'e06', cat: 'frontend', diff: 'beginner', type: 'mcq',
    q: 'Which HTML attribute defers off-screen images until they approach the viewport?',
    options: [
      'loading="lazy"',
      'defer="true"',
      'async',
      'preload="never"'
    ],
    answer: 0,
    explain: 'loading="lazy" tells the browser to fetch images only as they scroll near the viewport, cutting initial page weight.' },
  { id: 'e07', cat: 'frontend', diff: 'intermediate', type: 'mcq',
    q: 'Which CSS Grid feature lets a gallery auto-fit columns (3 large, 2 medium, 1 small) without media queries?',
    options: [
      'grid-template-columns: repeat(auto-fill, minmax(220px, 1fr))',
      'display: table-cell',
      'float: left; width: 33.33%',
      'position: absolute per item'
    ],
    answer: 0,
    explain: 'auto-fill/auto-fit with minmax lets the grid compute how many columns fit the current width — responsive by default.' },
  { id: 'e08', cat: 'frontend', diff: 'advanced', type: 'mcq',
    q: 'A to-do app must persist offline and sync later. Which storage is most appropriate?',
    options: [
      'IndexedDB with a sync queue (often via a library like PouchDB)',
      'localStorage with no sync mechanism',
      'sessionStorage cleared on tab close',
      'In-memory state only'
    ],
    answer: 0,
    explain: 'IndexedDB stores structured data at scale offline; a sync queue replays mutations when connectivity returns — localStorage is too small and has no sync.' },
  { id: 'e09', cat: 'db-mongodb', diff: 'intermediate', type: 'fill',
    q: 'The MongoDB method that inserts many documents in one round trip is ___.',
    answer: ['insertmany', 'insert many', 'insertmany()', 'bulkwrite'],
    explain: 'insertMany (or bulkWrite) sends an array of documents in a single call — far faster than one insert per document.' },
  { id: 'e10', cat: 'backend', diff: 'advanced', type: 'mcq',
    q: 'What is the recommended way for a browser client to present a JWT to the API?',
    options: [
      'Authorization: Bearer <token> header',
      'In the URL query string',
      'In a meta tag',
      'As a second password field'
    ],
    answer: 0,
    explain: 'The Authorization: Bearer header is the standard transport. Tokens in URLs leak into logs and history — never do that.' },
  { id: 'e11', cat: 'frontend', diff: 'intermediate', type: 'mcq',
    q: 'How do you show an upload progress bar with XMLHttpRequest?',
    options: [
      'Listen to xhr.upload.onprogress and read e.loaded / e.total',
      'Poll the server until the file arrives',
      'Read the response headers',
      'Watch the network tab'
    ],
    answer: 0,
    explain: 'The upload object fires progress events with loaded and total bytes — the basis of progress bars.' },
  { id: 'e12', cat: 'system-design', diff: 'advanced', type: 'mcq',
    q: 'Two devices edit the same note offline and both sync later. How do you resolve the conflict?',
    options: [
      'Detect it via version numbers or hashes, then merge or let the user pick',
      'Always keep the newest timestamp without checking',
      'Silently drop one edit',
      'Block the note after the first sync'
    ],
    answer: 0,
    explain: 'Track versions/hashes per document; on conflict use a merge strategy (CRDT, field-level merge) or surface a resolution choice to the user.' },
  { id: 'e13', cat: 'frontend', diff: 'intermediate', type: 'mcq',
    q: 'How should a frontend warn users they are nearing an API rate limit?',
    options: [
      'Read the X-RateLimit-Remaining header and show a progress indicator',
      'Count requests in a file on the server',
      'Wait for a 429 before saying anything',
      'Show a generic network error'
    ],
    answer: 0,
    explain: 'Rate-limit headers (X-RateLimit-Limit/Remaining/Reset) let the client display remaining quota proactively instead of reacting to 429s.' },

  /* ── Backend & security ───────────────────────────────────── */
  { id: 'e14', cat: 'backend', diff: 'intermediate', type: 'mcq',
    q: 'Which practice prevents SQL injection in user-supplied input?',
    options: [
      'Parameterized queries / prepared statements',
      'Escaping input with string concatenation',
      'Removing the word SELECT from input',
      'Storing passwords in plaintext'
    ],
    answer: 0,
    explain: 'Parameterized queries send values separately from SQL text, so injected payloads cannot alter the statement — the definitive defense.' },
  { id: 'e15', cat: 'backend', diff: 'intermediate', type: 'mcq',
    q: 'Which combination best defends against stored XSS?',
    options: [
      'Encode output, sanitize untrusted input, and use a Content-Security-Policy',
      'Remove all quotes from user input',
      'Only validate input on the frontend',
      'Disable JavaScript for logged-in users'
    ],
    answer: 0,
    explain: 'Stored XSS needs defense in depth: escape on output, sanitize on input, and a CSP that blocks injected script execution.' },
  { id: 'e16', cat: 'backend', diff: 'intermediate', type: 'mcq',
    q: 'Who enforces CORS?',
    options: [
      'The browser, based on the Access-Control-Allow-Origin response header',
      'The server\u2019s firewall',
      'The database',
      'The DNS resolver'
    ],
    answer: 0,
    explain: 'CORS is a browser security mechanism: the server declares allowed origins, and the browser blocks cross-origin reads unless the header matches.' },
  { id: 'e17', cat: 'backend', diff: 'advanced', type: 'mcq',
    q: 'Which security header tells the browser the site may only be loaded over HTTPS?',
    options: [
      'Strict-Transport-Security (HSTS)',
      'X-Powered-By',
      'Server',
      'Content-Length'
    ],
    answer: 0,
    explain: 'HSTS instructs browsers to force HTTPS connections, preventing downgrade and protocol-removal attacks.' },
  { id: 'e18', cat: 'backend', diff: 'intermediate', type: 'mcq',
    q: 'Which HTTP status should an API return when a client exceeds its rate limit?',
    options: [
      '429 Too Many Requests (with a Retry-After header)',
      '404 Not Found',
      '200 OK',
      '301 Moved Permanently'
    ],
    answer: 0,
    explain: '429 tells the client it hit the quota and Retry-After says when to try again — the conventional rate-limit contract.' },
  { id: 'e19', cat: 'coding', diff: 'advanced', type: 'mcq',
    q: 'A password reset link should expire. Which approach is correct?',
    options: [
      'Issue a signed token with a short expiry stored server-side',
      'Email the password itself',
      'Issue a token that never expires',
      'Accept any code the user guesses'
    ],
    answer: 0,
    explain: 'Short-lived, single-use signed tokens (with server-side invalidation) limit the window in which a stolen reset link works.' },
  { id: 'e20', cat: 'system-design', diff: 'advanced', type: 'mcq',
    q: 'A service must send a webhook reliably even if the receiver is down. Which pattern fits?',
    options: [
      'Persist the event in a queue with retries and exponential backoff',
      'Send the webhook in a fire-and-forget request',
      'Retry forever every second',
      'Store the payload in a log file'
    ],
    answer: 0,
    explain: 'Durable queues with retry/backoff and dead-letter handling guarantee delivery without flooding the receiver.' },

  /* ── DevOps: pipelines, config, observability ─────────────── */
  { id: 'e21', cat: 'devops', diff: 'intermediate', type: 'mcq',
    q: 'A CI pipeline keeps failing at the same stage. What is the correct first step?',
    options: [
      'Read the failure logs from that exact stage',
      'Delete the pipeline and start over',
      'Blindly retry the whole pipeline',
      'Ship the code anyway'
    ],
    answer: 0,
    explain: 'Logs from the failing stage reveal the root cause — environment differences, dependency conflicts, or config drift — before any fix.' },
  { id: 'e22', cat: 'devops', diff: 'intermediate', type: 'mcq',
    q: 'Where should CI/CD pipeline secrets (deploy keys, tokens) live?',
    options: [
      'In the CI platform\u2019s encrypted secret store, referenced by name',
      'Committed to the repository',
      'In a public environment variable file',
      'In the pipeline logs'
    ],
    answer: 0,
    explain: 'Encrypted secrets stored in the CI platform (or a vault) keep credentials out of git and logs; mask them when displayed.' },
  { id: 'e23', cat: 'devops', diff: 'intermediate', type: 'fill',
    q: 'When servers slowly diverge from the desired, documented configuration over time, that is configuration ___.',
    answer: ['drift', 'configuration drift'],
    explain: 'Configuration drift is fixed with idempotent configuration management, IaC, and drift-detection tooling that converges systems back to the desired state.' },
  { id: 'e24', cat: 'devops', diff: 'intermediate', type: 'mcq',
    q: 'Which stack is the classic choice for centralizing and searching logs from many services?',
    options: [
      'ELK — Elasticsearch, Logstash, Kibana (or Loki + Grafana)',
      'Node.js only',
      'Docker only',
      'A shared CSV file'
    ],
    answer: 0,
    explain: 'ELK ingests, indexes, and visualizes logs in one place; Loki+Grafana is a lighter-weight alternative for Kubernetes-native logs.' },
  { id: 'e25', cat: 'devops', diff: 'intermediate', type: 'mcq',
    q: 'How do you catch vulnerable dependencies before they reach production?',
    options: [
      'Automated scanners (Trivy, Snyk, Dependabot) in CI, with a patching policy',
      'A yearly manual review',
      'Never updating dependencies',
      'Reading the dependency source code by hand'
    ],
    answer: 0,
    explain: 'Continuous vulnerability scanning in the pipeline surfaces known CVEs early, and a patching policy keeps exposure windows short.' },
  { id: 'e26', cat: 'devops', diff: 'intermediate', type: 'mcq',
    q: 'During a major production outage, what is the priority order?',
    options: [
      'Restore service (rollback/mitigation) first, then root-cause analysis',
      'Write a postmortem before restoring anything',
      'Assign blame immediately',
      'Wait for the weekend'
    ],
    answer: 0,
    explain: 'Recovery first, analysis second. A good incident process restores service, preserves evidence, then runs a blameless RCA.' },
  { id: 'e27', cat: 'devops', diff: 'advanced', type: 'mcq',
    q: 'Which requirement is a core part of GDPR data protection?',
    options: [
      'Data minimization, consent, erasure rights, and encryption of personal data',
      'Storing all data forever',
      'Sharing data freely with advertisers',
      'Removing all authentication'
    ],
    answer: 0,
    explain: 'GDPR centers on privacy by design: minimize what you collect, get consent, honor erasure requests, and protect data at rest and in transit.' },
  { id: 'e28', cat: 'devops', diff: 'intermediate', type: 'fill',
    q: 'Encryption protecting data while it is stored on disk or in a database is encryption at ___.',
    answer: ['rest', 'at rest'],
    explain: 'Encryption at rest (AES-256, KMS-managed keys) protects stored data; encryption in transit (TLS) protects it while moving.' },
  { id: 'e29', cat: 'devops', diff: 'intermediate', type: 'mcq',
    q: 'Which GitHub feature defines repeatable CI/CD jobs in the repository?',
    options: [
      'GitHub Actions workflows in .github/workflows/*.yml',
      'GitHub Pages',
      'GitHub Issues',
      'GitHub Discussions'
    ],
    answer: 0,
    explain: 'Workflow YAML files under .github/workflows declare triggers, jobs, and steps — version-controlled alongside the code.' },
  { id: 'e30', cat: 'devops', diff: 'advanced', type: 'mcq',
    q: 'In Kubernetes, what does the HorizontalPodAutoscaler scale?',
    options: [
      'The number of pod replicas, based on CPU/memory or custom metrics',
      'The number of nodes in the cluster',
      'The size of the container images',
      'The number of namespaces'
    ],
    answer: 0,
    explain: 'HPA adjusts replica counts from observed metrics; scaling the node pool itself is the Cluster Autoscaler\u2019s job.' },
  { id: 'e31', cat: 'devops', diff: 'advanced', type: 'mcq',
    q: 'Which practice most directly shrinks a container\u2019s attack surface?',
    options: [
      'Run as a non-root user, use a minimal base image, and scan for vulnerabilities',
      'Install every package just in case',
      'Keep SSH enabled inside the image',
      'Use the latest tag with no pinning'
    ],
    answer: 0,
    explain: 'Least privilege (non-root), smaller bases (distroless/alpine), and image scanning reduce both the surface and the risk of known CVEs.' },
  { id: 'e32', cat: 'devops', diff: 'intermediate', type: 'mcq',
    q: 'What is a service mesh (Istio, Linkerd) primarily used for?',
    options: [
      'Service-to-service traffic management, mTLS encryption, and observability via sidecars',
      'Storing application logs',
      'Building container images',
      'Managing DNS records'
    ],
    answer: 0,
    explain: 'Sidecar proxies intercept service traffic to add routing, retries, mutual TLS, and telemetry without changing application code.' },
  { id: 'e33', cat: 'devops', diff: 'advanced', type: 'fill',
    q: 'Grafana\u2019s primary role in an observability stack is building ___ from Prometheus or other metrics sources.',
    answer: ['dashboards', 'dashboard', 'visualizations'],
    explain: 'Prometheus collects metrics; Grafana visualizes them in dashboards and sends alerts — the standard Kubernetes monitoring pairing.' },
  { id: 'e34', cat: 'devops', diff: 'intermediate', type: 'mcq',
    q: 'A security scanner flags that a service answers requests on plain HTTP. The fix is to:',
    options: [
      'Terminate TLS (redirect HTTP to HTTPS) and enforce HSTS',
      'Remove the load balancer',
      'Disable the firewall',
      'Ignore the finding'
    ],
    answer: 0,
    explain: 'Enforce HTTPS at the edge — TLS termination with redirects and HSTS — so traffic is never transmitted in the clear.' },

  /* ── AWS ──────────────────────────────────────────────────── */
  { id: 'e35', cat: 'devops', diff: 'advanced', type: 'mcq',
    q: 'Which AWS service routes traffic to the nearest healthy region/endpoint via static anycast IPs?',
    options: [
      'AWS Global Accelerator',
      'Amazon CloudWatch',
      'AWS Secrets Manager',
      'Amazon S3'
    ],
    answer: 0,
    explain: 'Global Accelerator uses static anycast IPs to direct users to the closest healthy endpoint, improving latency and failover.' },
  { id: 'e36', cat: 'devops', diff: 'intermediate', type: 'fill',
    q: 'AWS\u2019s managed DNS and domain service is Route ___.',
    answer: ['53', 'route 53', 'route53'],
    explain: 'Route 53 provides DNS resolution, health checks, and traffic routing (latency-based, failover, weighted) to AWS endpoints.' },
  { id: 'e37', cat: 'devops', diff: 'advanced', type: 'mcq',
    q: 'For a database that serves low-latency reads worldwide with cross-region failover, which AWS combination is designed for it?',
    options: [
      'Aurora Global Database or DynamoDB Global Tables',
      'A single EC2 instance in one region',
      'Amazon S3 with HTTP endpoints',
      'AWS CloudFormation'
    ],
    answer: 0,
    explain: 'Aurora Global Database and DynamoDB Global Tables replicate across regions with fast failover and low-latency local reads.' },
  { id: 'e38', cat: 'devops', diff: 'advanced', type: 'mcq',
    q: 'Which AWS service filters traffic at the edge against SQL injection, XSS, and common web exploits?',
    options: [
      'AWS WAF',
      'Amazon Route 53',
      'AWS CloudTrail',
      'Amazon Inspector'
    ],
    answer: 0,
    explain: 'WAF sits in front of CloudFront/ALB/API Gateway and blocks common web attacks with managed rule sets.' },
  { id: 'e39', cat: 'devops', diff: 'intermediate', type: 'mcq',
    q: 'How should an EC2 application access S3 without embedding credentials in code?',
    options: [
      'Attach an IAM role to the EC2 instance (instance profile)',
      'Hardcode the access key in the repository',
      'Put the access key in environment variables committed to git',
      'Open the S3 bucket to the public'
    ],
    answer: 0,
    explain: 'IAM roles assume temporary credentials via the instance metadata service — no long-lived keys in code or configuration.' },
  { id: 'e40', cat: 'devops', diff: 'advanced', type: 'mcq',
    q: 'Which AWS feature enforces permission limits across every account in an organization?',
    options: [
      'Service Control Policies (SCPs) in AWS Organizations',
      'IAM users in each account',
      'Amazon CloudFront',
      'AWS Trusted Advisor'
    ],
    answer: 0,
    explain: 'SCPs cap what accounts may do — even account administrators cannot exceed them — making them the backbone of multi-account governance.' },
  { id: 'e41', cat: 'devops', diff: 'advanced', type: 'mcq',
    q: 'AWS GuardDuty detects threats primarily by analyzing:',
    options: [
      'CloudTrail logs, VPC Flow Logs, and DNS logs',
      'S3 object contents',
      'EC2 instance CPU usage',
      'CloudFormation templates'
    ],
    answer: 0,
    explain: 'GuardDuty runs threat detection over CloudTrail, VPC Flow, and DNS telemetry to spot compromised credentials and suspicious activity.' },
  { id: 'e42', cat: 'devops', diff: 'intermediate', type: 'mcq',
    q: 'For a predictable, always-on EC2 workload, which pricing option is most cost-effective?',
    options: [
      'Reserved Instances or Savings Plans',
      'Spot Instances',
      'On-demand at full price',
      'A single oversized instance running 24/7 on demand'
    ],
    answer: 0,
    explain: 'Committed-use discounts (RIs/Savings Plans) cut costs for steady workloads; Spot suits interruptible batch jobs.' },
  { id: 'e43', cat: 'devops', diff: 'intermediate', type: 'mcq',
    q: 'Spot Instances are best suited for:',
    options: [
      'Fault-tolerant or batch workloads that can tolerate interruption',
      'The production database',
      'Long-running stateful sessions',
      'Any workload with zero tolerance for downtime'
    ],
    answer: 0,
    explain: 'Spot offers big discounts on spare capacity but instances can be reclaimed — ideal for stateless and resumable jobs, wrong for critical state.' },
  { id: 'e44', cat: 'devops', diff: 'intermediate', type: 'mcq',
    q: 'Which S3 storage class automatically moves objects between tiers based on access patterns?',
    options: [
      'S3 Intelligent-Tiering',
      'S3 Standard',
      'S3 Glacier Deep Archive',
      'S3 One Zone-IA'
    ],
    answer: 0,
    explain: 'Intelligent-Tiering monitors access and shifts objects between frequent/infrequent/archive tiers automatically — no lifecycle rules required.' },
  { id: 'e45', cat: 'devops', diff: 'advanced', type: 'mcq',
    q: 'For a DynamoDB workload with unpredictable traffic spikes, which capacity mode is best?',
    options: [
      'On-demand capacity mode',
      'Provisioned with a fixed low capacity',
      'A single read unit',
      'Capacity disabled'
    ],
    answer: 0,
    explain: 'On-demand scales automatically with traffic and you pay per request — ideal when usage is hard to forecast; provisioned+auto-scaling suits stable patterns.' },
  { id: 'e46', cat: 'devops', diff: 'advanced', type: 'mcq',
    q: 'Which service caches DynamoDB reads to deliver microsecond latency?',
    options: [
      'DynamoDB Accelerator (DAX)',
      'Amazon S3',
      'AWS Glue',
      'Amazon EFS'
    ],
    answer: 0,
    explain: 'DAX is an in-memory cache for DynamoDB that serves repeated reads with microsecond latency, reducing read-unit cost.' },
  { id: 'e47', cat: 'devops', diff: 'advanced', type: 'mcq',
    q: 'Which Lambda feature eliminates cold starts for hot functions?',
    options: [
      'Provisioned Concurrency',
      'Larger function names',
      'More environment variables',
      'Deleting old versions'
    ],
    answer: 0,
    explain: 'Provisioned Concurrency keeps containers warm and ready, trading cost for predictable latency on critical functions.' },
  { id: 'e48', cat: 'devops', diff: 'advanced', type: 'fill',
    q: 'Amazon ___ is the managed service for running Apache Kafka streaming clusters.',
    answer: ['msk', 'amazon msk', 'managed streaming for apache kafka'],
    explain: 'MSK (Managed Streaming for Apache Kafka) removes the operational burden of running Kafka, integrating with Kinesis-style consumers.' },
  { id: 'e49', cat: 'devops', diff: 'advanced', type: 'mcq',
    q: 'In EKS, which component adjusts the number of worker nodes to match pod demand?',
    options: [
      'Cluster Autoscaler (or Karpenter)',
      'HorizontalPodAutoscaler',
      'Ingress controller',
      'CoreDNS'
    ],
    answer: 0,
    explain: 'HPA scales pods; the Cluster Autoscaler (or Karpenter) scales the node pool so pending pods have a place to run.' },
  { id: 'e50', cat: 'devops', diff: 'advanced', type: 'mcq',
    q: 'To deploy the same CloudFormation stack across many accounts and regions, use:',
    options: [
      'CloudFormation StackSets',
      'AWS CloudTrail',
      'Amazon CloudFront',
      'AWS WAF'
    ],
    answer: 0,
    explain: 'StackSets provision identical stacks across chosen accounts/regions from a single template — central governance for multi-account rollouts.' },
  { id: 'e51', cat: 'devops', diff: 'advanced', type: 'mcq',
    q: 'What does AWS CDK let you do?',
    options: [
      'Define cloud infrastructure in TypeScript/Python that compiles to CloudFormation',
      'Run Kubernetes on laptops only',
      'Replace DNS entirely',
      'Build mobile apps without code'
    ],
    answer: 0,
    explain: 'CDK provides high-level constructs in real programming languages — with loops and conditionals — compiled into CloudFormation templates.' },
  { id: 'e52', cat: 'devops', diff: 'advanced', type: 'mcq',
    q: 'Which S3 encryption option uses AWS KMS with envelope encryption and an audit trail of key use?',
    options: [
      'SSE-KMS',
      'SSE-S3 (S3-managed keys)',
      'Client-side encryption',
      'No encryption'
    ],
    answer: 0,
    explain: 'SSE-KMS encrypts with a KMS customer key: envelope encryption plus CloudTrail-visible key usage and rotation control.' },
  { id: 'e53', cat: 'devops', diff: 'intermediate', type: 'mcq',
    q: 'How do instances in a private subnet reach the internet securely?',
    options: [
      'Through a NAT Gateway in a public subnet',
      'By being assigned a public IP directly',
      'Through an S3 bucket',
      'They cannot ever reach the internet'
    ],
    answer: 0,
    explain: 'A NAT gateway in a public subnet forwards outbound traffic for private instances while blocking unsolicited inbound connections.' },
  { id: 'e54', cat: 'devops', diff: 'intermediate', type: 'fill',
    q: 'A logically isolated section of the AWS cloud where you define IP ranges and subnets is a Virtual Private ___.',
    answer: ['cloud', 'vpc', 'private cloud'],
    explain: 'A VPC gives each account its own virtual network — CIDR ranges, subnets, route tables, and security groups.' },
  { id: 'e55', cat: 'devops', diff: 'intermediate', type: 'mcq',
    q: 'Which AWS service lets you run SQL-like queries over collected logs?',
    options: [
      'CloudWatch Logs Insights',
      'Amazon S3 Glacier',
      'AWS Elastic Beanstalk',
      'Amazon ECR'
    ],
    answer: 0,
    explain: 'CloudWatch Logs Insights queries log groups with a purpose-built query language — ideal for troubleshooting without exporting logs.' },
  { id: 'e56', cat: 'devops', diff: 'intermediate', type: 'mcq',
    q: 'Amazon Elastic Beanstalk is best described as:',
    options: [
      'A managed platform that deploys and scales web apps while hiding the underlying infrastructure',
      'A container registry',
      'A NoSQL database',
      'A CDN'
    ],
    answer: 0,
    explain: 'Elastic Beanstalk handles provisioning, deployment, and auto-scaling of common app stacks — a middle ground between raw EC2 and serverless.' },
  { id: 'e57', cat: 'devops', diff: 'intermediate', type: 'mcq',
    q: 'Which S3 feature automatically moves old objects to cheaper storage classes?',
    options: [
      'Lifecycle policies',
      'Versioning',
      'Multipart upload',
      'Replication rules'
    ],
    answer: 0,
    explain: 'Lifecycle rules transition objects (e.g., to Standard-IA after 30 days, Glacier after 90) and expire them — cutting storage cost automatically.' },
  { id: 'e58', cat: 'devops', diff: 'intermediate', type: 'mcq',
    q: 'Which AWS service provides end-to-end tracing of requests across services?',
    options: [
      'AWS X-Ray',
      'Amazon CloudFront',
      'AWS Budgets',
      'Amazon Route 53'
    ],
    answer: 0,
    explain: 'X-Ray traces requests as they hop between services, showing latency and errors per segment — AWS\u2019s distributed tracing.' },
  { id: 'e59', cat: 'devops', diff: 'intermediate', type: 'mcq',
    q: 'Which AWS service provides managed Redis or Memcached for caching?',
    options: [
      'Amazon ElastiCache',
      'Amazon S3',
      'Amazon EFS',
      'AWS Cloud9'
    ],
    answer: 0,
    explain: 'ElastiCache runs Redis/Memcached clusters as a service — the usual home for session stores and hot-query caching.' },
  { id: 'e60', cat: 'devops', diff: 'advanced', type: 'mcq',
    q: 'To enforce \u201Cleast privilege\u201D for a Lambda function calling only one S3 bucket, you should:',
    options: [
      'Attach an IAM role with a policy scoped to that bucket and specific actions',
      'Grant the function full admin access',
      'Make the bucket public',
      'Store the AWS key inside the function code'
    ],
    answer: 0,
    explain: 'Least privilege means a narrow policy — resource-scoped (that bucket) and action-scoped (needed operations only), assumed via the function\u2019s execution role.' },
