import { cn } from '@/lib/utils';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

import {
  infoBadgeToneClassNames,
  type InfoBadgeProps,
} from './info-badge';

interface ButtonBadgeProps extends Omit<
  ComponentPropsWithoutRef<'button'>,
  'children'
> {
  children: ReactNode;
  tone?: InfoBadgeProps['tone'];
}

export function ButtonBadge({
  type = 'button',
  className,
  tone = 'secondary',
  children,
  ...props
}: ButtonBadgeProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium whitespace-nowrap shadow-none',
        'cursor-pointer transition-colors',
        'focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
        'hover:bg-primary hover:text-primary-foreground',
        infoBadgeToneClassNames[tone],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export type { ButtonBadgeProps };
