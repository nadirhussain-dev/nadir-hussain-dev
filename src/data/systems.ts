import { needsConfirmation, type Claim } from '@/types/content';

/**
 * The architecture explorer.
 *
 * This describes general distributed-systems reasoning rather than any
 * specific system Nadir has shipped, so nothing here claims credit for work.
 * It is still marked needs-confirmation: the trade-off calls are opinions, and
 * opinions attributed to Nadir on his own site should be ones he actually
 * holds. He should sharpen or overrule any of these.
 */

export type NodeId =
  'client' | 'edge' | 'gateway' | 'service' | 'cache' | 'database' | 'queue' | 'worker';

export interface SystemNode {
  id: NodeId;
  label: string;
  /** One line, shown on the node itself. */
  role: string;
  /** Which tier it sits in. Drives layout and the request path. */
  tier: number;
  why: string;
  scale: string;
  failure: string;
  tradeoff: string;
}

/**
 * Upstream path from the client to each node. Selecting a node lights this
 * path, which is the point of the diagram: components are meaningless in
 * isolation, and what matters is what had to happen before you reach one.
 */
export const PATH_TO: Record<NodeId, readonly NodeId[]> = {
  client: ['client'],
  edge: ['client', 'edge'],
  gateway: ['client', 'edge', 'gateway'],
  service: ['client', 'edge', 'gateway', 'service'],
  cache: ['client', 'edge', 'gateway', 'service', 'cache'],
  database: ['client', 'edge', 'gateway', 'service', 'database'],
  queue: ['client', 'edge', 'gateway', 'service', 'queue'],
  worker: ['client', 'edge', 'gateway', 'service', 'queue', 'worker'],
};

export const SYSTEM_NODES: readonly SystemNode[] = [
  {
    id: 'client',
    label: 'Client',
    role: 'Browser or app',
    tier: 0,
    why: 'Where latency is actually felt. Every decision further down the diagram is ultimately justified by what it does to this number.',
    scale:
      'Scales by itself — there is one per user. The work is keeping payload and round trips down, not adding capacity.',
    failure:
      'Flaky networks, not outages. Assume retries arrive twice and that any request can be abandoned halfway.',
    tradeoff:
      'Work moved to the client is capacity you no longer pay for, but it is also code you no longer control the execution environment of.',
  },
  {
    id: 'edge',
    label: 'Edge / CDN',
    role: 'Cache close to the user',
    tier: 1,
    why: 'Distance is the one latency cost that no amount of server capacity fixes. Serving from a nearby node removes a round trip that would otherwise cross the planet.',
    scale:
      'Absorbs read traffic before it becomes load. The cheapest request is the one the origin never sees.',
    failure:
      'Usually degrades rather than fails — a miss becomes an origin request. The real risk is a stampede when a popular key expires everywhere at once.',
    tradeoff:
      'Every cache layer buys speed with staleness. The design question is never whether data goes stale, but how long that is acceptable and who notices first.',
  },
  {
    id: 'gateway',
    label: 'API Gateway',
    role: 'Single entry point',
    tier: 2,
    why: 'Gives authentication, rate limiting and routing one place to live, so services do not each reimplement them slightly differently.',
    scale:
      'Stateless, so it scales horizontally. Rate limiting is the part that needs shared state and therefore the part that gets hard.',
    failure:
      'A single entry point is also a single point of failure. It has to be boring, well understood, and not the place clever logic accumulates.',
    tradeoff:
      'Centralising cross-cutting concerns is worth a hop of latency. Centralising business logic is how a gateway quietly becomes a monolith.',
  },
  {
    id: 'service',
    label: 'Service',
    role: 'Business logic',
    tier: 3,
    why: 'Where the rules that make the product what it is are enforced — and the only tier that should own them.',
    scale:
      'Horizontal while it stays stateless. The moment it holds session state in memory, scaling becomes a migration rather than a config change.',
    failure:
      'Its dependencies fail more often than it does. Timeouts, retries with backoff and circuit breakers are what keep one slow dependency from consuming every worker.',
    tradeoff:
      'Splitting services buys independent deploys and failure isolation, and costs a network boundary where a function call used to be. That trade is worth making later than most teams make it.',
  },
  {
    id: 'cache',
    label: 'Cache',
    role: 'Hot reads',
    tier: 4,
    why: 'Most systems read far more than they write, and most reads want the same small set of rows. Keeping those in memory removes the majority of database work.',
    scale:
      'Turns a read-heavy load into a mostly-memory workload. Hit rate matters more than size — a small cache with good keys beats a large one with poor ones.',
    failure:
      'A cold cache is a thundering herd aimed at the database. That is an availability problem, not a performance one, and it needs request coalescing rather than more capacity.',
    tradeoff:
      'Invalidation is the real cost. Caching is easy to add and hard to reason about once several writers can change the same key.',
  },
  {
    id: 'database',
    label: 'Database',
    role: 'Source of truth',
    tier: 4,
    why: 'The one tier permitted to be authoritative. Everything else in the diagram is an optimisation over reading from here.',
    scale:
      'The hardest tier to scale, because it is the one holding state. Read replicas first, partitioning much later and only with a key you are confident in.',
    failure:
      'Failure here is rarely total. It is a slow query holding a lock, a connection pool exhausted upstream, or a replica lagging far enough that reads start lying.',
    tradeoff:
      'Strong consistency is simpler to build against and harder to scale. Most of the design work is deciding exactly where you are willing to relax it.',
  },
  {
    id: 'queue',
    label: 'Queue',
    role: 'Work to do later',
    tier: 4,
    why: 'Separates accepting work from completing it. The user gets an answer as soon as the request is durable, not once every downstream effect has finished.',
    scale:
      'Absorbs spikes that would otherwise become timeouts. Depth is the metric that matters — a queue that only ever grows is a capacity problem wearing a disguise.',
    failure:
      'Delivery is at-least-once in practice, so consumers must be idempotent. This is exactly where duplicate charges come from in a payment system.',
    tradeoff:
      'Asynchrony buys resilience and costs certainty. The client no longer learns whether the work succeeded, so you now owe them a way to find out.',
  },
  {
    id: 'worker',
    label: 'Worker',
    role: 'Consumes the queue',
    tier: 5,
    why: 'Does the slow, retryable work — settlement, reconciliation, notifications — away from the request path.',
    scale:
      'Scales on queue depth rather than on traffic, which is what makes it a useful pressure valve.',
    failure:
      'Poison messages block a partition until they are moved aside. A dead-letter queue is not optional; it is the difference between one bad message and a stalled pipeline.',
    tradeoff:
      'Retries are what make this tier reliable and what make duplicate side effects likely. Idempotency keys are the price of admission.',
  },
] as const;

export const systemsIntro = needsConfirmation(
  'Components are easy to name and hard to justify. What follows is how I reason about each tier: the problem it exists to solve, how it behaves under load, how it fails, and what it costs to have it. Select any node to see the path a request takes to reach it.',
  'Systems section intro, written in your voice. The trade-off calls throughout this section are opinions — sharpen or overrule any that are not yours.',
) satisfies Claim<string>;
