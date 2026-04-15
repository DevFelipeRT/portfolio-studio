import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Eye, EyeOff, type LucideIcon } from 'lucide-react';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

interface VisibilityBadgeProps extends Omit<
  ComponentPropsWithoutRef<typeof Badge>,
  'children'
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
  const Icon = visible ? (publicIcon ?? Eye) : (privateIcon ?? EyeOff);

  return (
    <Badge
      className={cn(
        'inline-flex w-fit items-center gap-1 border-none px-2 py-0.5 font-medium whitespace-nowrap shadow-none',
        visible
          ? 'bg-primary text-primary-foreground hover:bg-primary'
          : 'bg-muted text-muted-foreground hover:bg-muted',
        className,
      )}
      {...props}
    >
      <Icon className="h-3.5 w-3.5" />
      <span
        className={cn(
          'whitespace-nowrap',
          labelClassName ?? 'xs:inline hidden',
        )}
      >
        {visible ? publicLabel : privateLabel}
      </span>
    </Badge>
  );
}
