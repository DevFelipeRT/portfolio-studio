import { MoreVertical } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

import type { TableActionsMenuItemProps, TableActionsMenuProps } from '../types';

export function TableActionsMenu({
  triggerLabel = 'Open row actions',
  triggerClassName,
  contentClassName,
  children,
}: TableActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          data-row-action
          className={cn(
            'text-muted-foreground hover:bg-primary hover:text-primary-foreground h-8 w-8',
            triggerClassName,
          )}
          onClick={(event) => event.stopPropagation()}
          onKeyDown={(event) => event.stopPropagation()}
        >
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">{triggerLabel}</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className={cn('min-w-40', contentClassName)}
        onClick={(event) => event.stopPropagation()}
      >
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function TableActionsMenuItem({
  className,
  ...props
}: TableActionsMenuItemProps) {
  return <DropdownMenuItem className={className} {...props} />;
}
