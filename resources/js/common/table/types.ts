import type {
  ComponentPropsWithoutRef,
  KeyboardEvent,
  MouseEvent,
  ReactNode,
} from 'react';

import { DialogContent } from '@/components/ui/dialog';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Table, TableCell, TableRow } from '@/components/ui/table';

export type TableLayout = 'fixed' | 'auto';

export type TableDensity = 'default' | 'compact';

export type TableRowVariant = 'default' | 'muted' | 'emphasized';

export type SystemTableProps = {
  layout?: TableLayout;
  density?: TableDensity;
} & ComponentPropsWithoutRef<typeof Table>;

export type TableCardProps = {
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
  contentClassName?: string;
  children: ReactNode;
};

export type TableHeaderRowProps = ComponentPropsWithoutRef<typeof TableRow>;

export type TableEmptyStateProps = {
  colSpan: number;
  message: ReactNode;
  density?: TableDensity;
  className?: string;
};

export type TableActionCellProps = ComponentPropsWithoutRef<typeof TableCell> & {
  children?: ReactNode;
  showChevron?: boolean;
  chevronClassName?: string;
};

export type TableDetailDialogProps = {
  open: boolean;
  onOpenChange(open: boolean): void;
  title?: ReactNode;
  description?: ReactNode;
  className?: string;
  children: ReactNode;
} & Omit<
  ComponentPropsWithoutRef<typeof DialogContent>,
  'open' | 'onOpenChange' | 'children'
>;

export type TableActionsMenuProps = {
  triggerLabel?: string;
  triggerClassName?: string;
  contentClassName?: string;
  children: ReactNode;
};

export type TableActionsMenuItemProps = ComponentPropsWithoutRef<
  typeof DropdownMenuItem
>;

export type TableBadgeProps = ComponentPropsWithoutRef<'div'> & {
  tone?: 'default' | 'secondary' | 'destructive' | 'outline';
};

export type TableBadgeButtonProps = Omit<
  ComponentPropsWithoutRef<'button'>,
  'children'
> & {
  children: ReactNode;
  badgeClassName?: string;
};

export type InteractiveTableRowProps = ComponentPropsWithoutRef<typeof TableRow> & {
  interactive?: boolean;
  onActivate?: () => void;
  variant?: TableRowVariant;
  active?: boolean;
};

export type InteractiveTableRowKeyboardEvent = KeyboardEvent<HTMLTableRowElement>;

export type InteractiveTableRowMouseEvent = MouseEvent<HTMLTableRowElement>;
