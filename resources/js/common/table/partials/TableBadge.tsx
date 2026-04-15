import { cn } from '@/lib/utils';
import { Check, Minus } from 'lucide-react';

import type {
  TableBadgeProps,
  TableBadgeButtonProps,
  TableBooleanBadgeProps,
} from '../types';

export function TableBadge({
  className,
  tone = 'secondary',
  ...props
}: TableBadgeProps) {
  const toneClassName =
    tone === 'default'
      ? 'bg-primary text-primary-foreground'
      : tone === 'secondary'
        ? 'bg-accent text-accent-foreground'
        : tone === 'destructive'
          ? 'bg-destructive text-destructive-foreground'
          : 'border-border bg-background text-foreground';

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold',
        'cursor-default whitespace-nowrap shadow-none',
        'pointer-events-auto',
        toneClassName,
        className,
      )}
      {...props}
    />
  );
}

export function TableBadgeButton({
  type = 'button',
  className,
  badgeClassName,
  children,
  ...props
}: TableBadgeButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'focus-visible:ring-ring rounded-md focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold',
          'cursor-pointer whitespace-nowrap border-transparent shadow-none transition-colors',
          'hover:bg-primary hover:text-primary-foreground',
          'bg-accent text-accent-foreground',
          badgeClassName,
        )}
      >
        {children}
      </div>
    </button>
  );
}

export function TableBooleanBadge({
  active,
  activeLabel,
  inactiveLabel,
  className,
  labelClassName,
  activeIcon,
  inactiveIcon,
}: TableBooleanBadgeProps) {
  const Icon = active ? (activeIcon ?? Check) : (inactiveIcon ?? Minus);

  return (
    <TableBadge
      className={cn(
        'flex w-fit items-center gap-1 border-none px-2 py-0.5 font-medium whitespace-nowrap',
        active
          ? 'bg-primary text-primary-foreground'
          : 'bg-muted text-muted-foreground',
        className,
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      <span className={cn('whitespace-nowrap', labelClassName ?? 'hidden xs:inline')}>
        {active ? activeLabel : inactiveLabel}
      </span>
    </TableBadge>
  );
}
