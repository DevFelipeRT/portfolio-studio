import { cn } from '@/lib/utils';
import { Check, Minus, type LucideIcon } from 'lucide-react';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import { InfoBadge, type InfoBadgeProps } from './info-badge';

interface BooleanBadgeProps extends Omit<
  ComponentPropsWithoutRef<typeof InfoBadge>,
  'children' | 'tone'
> {
  active: boolean;
  activeLabel: ReactNode;
  inactiveLabel: ReactNode;
  labelClassName?: string;
  activeIcon?: LucideIcon;
  inactiveIcon?: LucideIcon;
  activeTone?: InfoBadgeProps['tone'];
  inactiveTone?: InfoBadgeProps['tone'];
}

export function BooleanBadge({
  active,
  activeLabel,
  inactiveLabel,
  className,
  labelClassName,
  activeIcon,
  inactiveIcon,
  activeTone = 'default',
  inactiveTone = 'muted',
  ...props
}: BooleanBadgeProps) {
  const Icon = active ? (activeIcon ?? Check) : (inactiveIcon ?? Minus);

  return (
    <InfoBadge
      tone={active ? activeTone : inactiveTone}
      className={cn('flex items-center gap-1 border-none px-2', className)}
      {...props}
    >
      <Icon className="h-3.5 w-3.5" />
      <span className={cn('whitespace-nowrap', labelClassName ?? 'hidden xs:inline')}>
        {active ? activeLabel : inactiveLabel}
      </span>
    </InfoBadge>
  );
}

export type { BooleanBadgeProps };
