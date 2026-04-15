import { cn } from '@/lib/utils';
import { Eye, EyeOff, type LucideIcon } from 'lucide-react';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import { BooleanBadge } from './boolean-badge';

interface VisibilityBadgeProps extends Omit<
  ComponentPropsWithoutRef<typeof BooleanBadge>,
  | 'active'
  | 'activeLabel'
  | 'inactiveLabel'
  | 'activeIcon'
  | 'inactiveIcon'
  | 'activeTone'
  | 'inactiveTone'
> {
  visible: boolean;
  publicLabel: ReactNode;
  privateLabel: ReactNode;
  labelClassName?: string;
  publicIcon?: LucideIcon;
  privateIcon?: LucideIcon;
}

export function VisibilityBadge({
  visible,
  publicLabel,
  privateLabel,
  className,
  labelClassName,
  publicIcon,
  privateIcon,
  ...props
}: VisibilityBadgeProps) {
  return (
    <BooleanBadge
      active={visible}
      activeLabel={publicLabel}
      inactiveLabel={privateLabel}
      activeIcon={publicIcon ?? Eye}
      inactiveIcon={privateIcon ?? EyeOff}
      activeTone="default"
      inactiveTone="muted"
      className={cn(className)}
      labelClassName={labelClassName}
      {...props}
    />
  );
}
