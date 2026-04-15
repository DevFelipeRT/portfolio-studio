import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { ComponentPropsWithoutRef } from 'react';

export const infoBadgeToneClassNames = {
  default: 'border-none bg-primary text-primary-foreground hover:bg-primary',
  secondary: 'border-none bg-accent text-accent-foreground hover:bg-accent',
  destructive:
    'border-none bg-destructive text-destructive-foreground hover:bg-destructive',
  outline: 'border-border bg-background text-foreground hover:bg-background',
  muted: 'border-none bg-muted text-muted-foreground hover:bg-muted',
} as const;

export interface InfoBadgeProps
  extends Omit<ComponentPropsWithoutRef<typeof Badge>, 'variant'> {
  tone?: keyof typeof infoBadgeToneClassNames;
}

export function InfoBadge({
  className,
  tone = 'secondary',
  ...props
}: InfoBadgeProps) {
  return (
    <Badge
      className={cn(
        'inline-flex w-fit items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium whitespace-nowrap shadow-none',
        infoBadgeToneClassNames[tone],
        className,
      )}
      {...props}
    />
  );
}
