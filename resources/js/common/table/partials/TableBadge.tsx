import { cn } from '@/lib/utils';

import type { TableBadgeProps, TableBadgeButtonProps } from '../types';

export function TableBadge({
  className,
  tone = 'secondary',
  ...props
}: TableBadgeProps) {
  const toneClassName =
    tone === 'default'
      ? 'bg-primary text-primary-foreground'
      : tone === 'secondary'
        ? 'bg-secondary text-secondary-foreground'
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
          'bg-secondary text-secondary-foreground',
          badgeClassName,
        )}
      >
        {children}
      </div>
    </button>
  );
}
