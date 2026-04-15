import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

type ProjectOverlayInfoRowProps = {
  className?: string;
  label: string;
  value: ReactNode;
};

export function ProjectOverlayInfoRow({
  className,
  label,
  value,
}: ProjectOverlayInfoRowProps) {
  return (
    <section className={cn('min-w-0 space-y-3', className)}>
      <p className="text-foreground text-base leading-5 font-semibold">
        {label}
      </p>
      <div className="text-foreground min-w-0 text-sm leading-6">{value}</div>
    </section>
  );
}
