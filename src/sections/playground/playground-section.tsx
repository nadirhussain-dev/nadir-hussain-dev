import Image from 'next/image';
import type { Span } from '@/data/spans';
import { Section } from '@/components/ui/section';
import { Simulator } from './simulator';

export function PlaygroundSection({ span }: { span: Span }) {
  return (
    <div className="relative bg-hoodie text-white">
      <Image
        src="/art/robot.webp"
        alt=""
        width={546}
        height={660}
        className="absolute top-8 right-(--spacing-gutter) hidden w-32 rounded-2xl md:block"
      />
      <Section
        span={span}
        intro="A working simulation of a payment system. Turn up the traffic, make the processor fail, and watch it protect customers from double charges."
      >
        <Simulator />
      </Section>
    </div>
  );
}
