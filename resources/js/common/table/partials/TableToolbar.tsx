import { Slot } from '@radix-ui/react-slot';

import { cn } from '@/lib/utils';

import type { TableToolbarProps } from '../types';

export function TableToolbar({
  asChild = false,
  className,
  children,
  ...props
}: TableToolbarProps) {
  const Comp = asChild ? Slot : 'div';

  return (
    <Comp
      className={cn(
        'w-full',
        className,
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}
