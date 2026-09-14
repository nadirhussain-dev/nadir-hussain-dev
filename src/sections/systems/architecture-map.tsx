'use client';

import { SYSTEM_NODES, PATH_TO, type NodeId, type SystemNode } from '@/data/systems';
import { MonoLabel } from '@/components/ui/mono-label';
import { useNodeNavigation } from './use-node-navigation';
import { cn } from '@/lib/utils';

const DETAIL_FIELDS = [
  { key: 'why', label: 'why it exists' },
  { key: 'scale', label: 'under load' },
  { key: 'failure', label: 'how it fails' },
  { key: 'tradeoff', label: 'what it costs' },
] as const satisfies readonly { key: keyof SystemNode; label: string }[];

/** Tier 4 fans out; every other tier holds a single node. */
const isFanTier = (tier: number): boolean => tier === 4;

function Node({
  node,
  isSelected,
  isOnPath,
  register,
  onSelect,
  onKeyDown,
}: {
  node: SystemNode;
  isSelected: boolean;
  isOnPath: boolean;
  register: (element: HTMLButtonElement | null) => void;
  onSelect: () => void;
  onKeyDown: (event: React.KeyboardEvent) => void;
}) {
  return (
    <button
      ref={register}
      type="button"
      role="tab"
      id={`node-${node.id}`}
      aria-selected={isSelected}
      aria-controls="system-detail"
      // Roving tabindex: one stop for the whole diagram, then arrow keys.
      tabIndex={isSelected ? 0 : -1}
      onClick={onSelect}
      onFocus={onSelect}
      onKeyDown={onKeyDown}
      className={cn(
        'group w-full rounded-sm border px-3 py-2.5 text-left transition-colors duration-(--duration-quick) sm:px-4 sm:py-3',
        isSelected
          ? 'border-signal bg-signal/10'
          : isOnPath
            ? 'border-flow/50 bg-flow/5'
            : 'border-rule bg-ink-850 hover:border-rule-strong',
      )}
    >
      <span
        className={cn(
          'block font-medium transition-colors duration-(--duration-quick)',
          isSelected ? 'text-signal' : 'text-paper-100',
        )}
      >
        {node.label}
      </span>
      <span className="mt-0.5 block font-mono text-micro tracking-[0.06em] text-paper-500">
        {node.role}
      </span>
    </button>
  );
}

/** Vertical connector between two stacked tiers. */
function Connector({ active }: { active: boolean }) {
  return (
    <div aria-hidden="true" className="flex h-6 justify-center md:h-8">
      <span
        className={cn(
          'w-px transition-colors duration-(--duration-quick)',
          active ? 'bg-flow' : 'bg-rule',
        )}
      />
    </div>
  );
}

export function ArchitectureMap() {
  const { selected, setSelected, registerNode, onKeyDown } =
    useNodeNavigation('client');

  const activePath = PATH_TO[selected];
  const selectedNode =
    SYSTEM_NODES.find((node) => node.id === selected) ?? SYSTEM_NODES[0];

  const stacked = SYSTEM_NODES.filter((node) => !isFanTier(node.tier) && node.tier < 4);
  const fanned = SYSTEM_NODES.filter((node) => isFanTier(node.tier));
  const trailing = SYSTEM_NODES.filter((node) => node.tier > 4);

  const nodeProps = (node: SystemNode) => ({
    node,
    isSelected: node.id === selected,
    isOnPath: activePath.includes(node.id),
    register: registerNode(node.id),
    onSelect: () => setSelected(node.id),
    onKeyDown: (event: React.KeyboardEvent) => onKeyDown(event, node.id),
  });

  const onPath = (id: NodeId): boolean => activePath.includes(id);

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-14">
      {/* ---------------- Diagram ---------------- */}
      <div role="tablist" aria-label="System architecture" className="min-w-0">
        {stacked.map((node, index) => (
          <div key={node.id}>
            <Node {...nodeProps(node)} />
            {index < stacked.length - 1 && (
              <Connector active={onPath(stacked[index + 1]!.id)} />
            )}
          </div>
        ))}

        {/* Fan-out from the service tier. On phones this becomes a plain
            stack with a left-edge spine, rather than three columns crushed
            into 320px. */}
        <div aria-hidden="true" className="relative h-8 md:h-10">
          <span
            className={cn(
              'absolute top-0 left-1/2 h-4 w-px -translate-x-1/2 md:h-5',
              onPath('cache') || onPath('database') || onPath('queue')
                ? 'bg-flow'
                : 'bg-rule',
            )}
          />
          {/* The horizontal bus spans column centres: 1/6 to 5/6. */}
          <span className="absolute top-4 right-[16.666%] left-[16.666%] hidden h-px bg-rule md:block" />
          {['16.666%', '50%', '83.333%'].map((left, index) => (
            <span
              key={left}
              className={cn(
                'absolute top-4 hidden h-4 w-px -translate-x-1/2 md:block md:h-6',
                onPath(fanned[index]!.id) ? 'bg-flow' : 'bg-rule',
              )}
              style={{ left }}
            />
          ))}
          <span className="absolute top-4 left-1/2 h-4 w-px -translate-x-1/2 bg-rule md:hidden" />
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          {fanned.map((node) => (
            <Node key={node.id} {...nodeProps(node)} />
          ))}
        </div>

        {trailing.map((node) => (
          <div key={node.id} className="md:ml-[66.666%] md:w-1/3">
            <Connector active={onPath(node.id)} />
            <Node {...nodeProps(node)} />
          </div>
        ))}
      </div>

      {/* ---------------- Detail ---------------- */}
      <div
        role="tabpanel"
        id="system-detail"
        aria-labelledby={`node-${selected}`}
        tabIndex={0}
        className="rule-frame min-w-0 p-5 sm:p-6 lg:sticky lg:top-24 lg:self-start"
      >
        <div className="mb-5 flex flex-wrap items-center gap-x-3 gap-y-1">
          <h3 className="text-h3 font-medium text-paper-100">{selectedNode?.label}</h3>
          <MonoLabel tone="flow">
            {activePath.length} hop{activePath.length === 1 ? '' : 's'} from client
          </MonoLabel>
        </div>

        {/* The path is the point: a component means little without what had to
            happen before you reach it. */}
        <ol className="mb-6 flex flex-wrap items-center gap-x-1.5 gap-y-1">
          {activePath.map((id, index) => (
            <li key={id} className="flex items-center gap-1.5">
              {index > 0 && (
                <span aria-hidden="true" className="text-flow-dim">
                  →
                </span>
              )}
              <MonoLabel tone={id === selected ? 'signal' : 'muted'}>{id}</MonoLabel>
            </li>
          ))}
        </ol>

        <dl className="space-y-5">
          {DETAIL_FIELDS.map((field) => (
            <div key={field.key}>
              <dt className="mb-1.5">
                <MonoLabel>{field.label}</MonoLabel>
              </dt>
              <dd className="m-0 text-pretty text-paper-300">
                {selectedNode?.[field.key]}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
