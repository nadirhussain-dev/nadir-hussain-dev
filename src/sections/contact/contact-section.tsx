import { ArrowUpRight } from 'lucide-react';
import type { Span } from '@/data/spans';
import { site } from '@/data/site';
import { isVerified, type Claim } from '@/types/content';
import { Section } from '@/components/ui/section';
import { MonoLabel } from '@/components/ui/mono-label';
import { ResumePanel } from './resume-panel';

/**
 * Contact.
 *
 * Every channel is filtered through the same rule: a link renders only if it
 * is both verified and non-empty. An unconfirmed address is not published as a
 * guess, and a dead link on a contact section is worse than a missing one.
 */
interface Channel {
  label: string;
  claim: Claim<string>;
  href: (value: string) => string;
  display: (value: string) => string;
  external: boolean;
}

const CHANNELS: readonly Channel[] = [
  {
    label: 'email',
    claim: site.email,
    href: (value) => `mailto:${value}`,
    display: (value) => value,
    external: false,
  },
  {
    label: 'github',
    claim: site.github,
    href: (value) => value,
    display: (value) => value.replace(/^https?:\/\//, ''),
    external: true,
  },
  {
    label: 'linkedin',
    claim: site.linkedin,
    href: (value) => value,
    display: (value) => value.replace(/^https?:\/\//, ''),
    external: true,
  },
];

export function ContactSection({ span }: { span: Span }) {
  const available = CHANNELS.filter(
    (channel) => isVerified(channel.claim) && channel.claim.value !== '',
  );

  return (
    <Section span={span}>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-16">
        <div>
          <p className="max-w-xl text-lead text-pretty text-paper-300">
            If any of this was useful, or you want to talk about a system you are trying
            to get right, the fastest way is directly.
          </p>

          {available.length > 0 ? (
            <ul className="mt-8 max-w-lg">
              {available.map((channel) => (
                <li key={channel.label} className="border-t border-rule">
                  <a
                    href={channel.href(channel.claim.value)}
                    {...(channel.external
                      ? { target: '_blank', rel: 'me noopener noreferrer' }
                      : {})}
                    className="group flex items-center justify-between gap-4 py-4"
                  >
                    <span className="flex min-w-0 flex-wrap items-baseline gap-x-4 gap-y-1">
                      <MonoLabel className="w-20 shrink-0">{channel.label}</MonoLabel>
                      <span className="truncate text-paper-200 transition-colors duration-(--duration-quick) group-hover:text-paper-100">
                        {channel.display(channel.claim.value)}
                      </span>
                    </span>
                    <ArrowUpRight
                      aria-hidden="true"
                      className="size-4 shrink-0 text-paper-500 transition-transform duration-(--duration-quick) group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-signal"
                    />
                    {channel.external && (
                      <span className="sr-only">(opens in a new tab)</span>
                    )}
                  </a>
                </li>
              ))}
              <li aria-hidden="true" className="border-t border-rule" />
            </ul>
          ) : (
            <p className="mt-8 text-paper-500">No contact channel is confirmed yet.</p>
          )}
        </div>

        <ResumePanel />
      </div>
    </Section>
  );
}
