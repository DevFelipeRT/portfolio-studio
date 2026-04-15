import type {
  ComponentPropsWithoutRef,
  KeyboardEvent,
  MouseEvent,
  ReactNode,
} from 'react';
import type { LucideIcon } from 'lucide-react';

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
  header?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
  contentClassName?: string;
  children: ReactNode;
};

export type TableToolbarProps = ComponentPropsWithoutRef<'div'> & {
  asChild?: boolean;
};

export type NewButtonProps = {
  href: string;
  label: ReactNode;
  icon?: LucideIcon;
  className?: string;
};

export type TablePaginationLink = {
  url: string | null;
  label: string;
  active: boolean;
  page?: number | null;
};

export type TablePaginated<TItem> = {
  data: TItem[];
  current_page: number;
  per_page: number;
  last_page: number;
  from: number | null;
  to: number | null;
  total: number;
  path?: string;
  links?: TablePaginationLink[];
};

export type TablePaginationState = {
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
  from: number | null;
  to: number | null;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  links: TablePaginationLink[];
};

export type TablePaginationProps = ComponentPropsWithoutRef<'div'> & {
  pagination: TablePaginated<unknown> | TablePaginationState;
  onPageChange?: (page: number) => void;
  perPageOptions?: readonly number[];
  onPerPageChange?: (perPage: number) => void;
  showPageLinks?: boolean;
};

export type TableQueryParamValue = string | number | null | undefined;

export type TableQueryParamsInput = Record<string, TableQueryParamValue>;

export type TableSortDirection = 'asc' | 'desc';

export type TableSortState = {
  column: string | null;
  direction: TableSortDirection | null;
};

export type TableSortHeaderProps = Omit<
  ComponentPropsWithoutRef<'button'>,
  'children' | 'onClick'
> & {
  column: string;
  label: ReactNode;
  sort: TableSortState;
  onToggleSort?: (column: string) => void;
  srLabel?: string;
  labelClassName?: string;
  truncateLabel?: boolean;
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
};

export type TableTitleCellProps = Omit<
  ComponentPropsWithoutRef<typeof TableCell>,
  'title'
> & {
  title: ReactNode;
  subtitle?: ReactNode;
  aside?: ReactNode;
  titleClassName?: string;
  subtitleClassName?: string;
  asideClassName?: string;
};

export type TableMetaCellProps = ComponentPropsWithoutRef<typeof TableCell>;

export type TableStatusStackProps = ComponentPropsWithoutRef<'div'>;

export type TableDateTextProps = ComponentPropsWithoutRef<'span'> & {
  value?: string | null;
  endValue?: string | null;
  locale?: string | null;
  fallback?: ReactNode;
  todayAsTime?: boolean;
  presentLabel?: string;
  rangeLayout?: 'inline' | 'stacked';
  startLabel?: ReactNode;
  endLabel?: ReactNode;
  format?:
    | string
    | {
        compact?: string;
        medium?: string;
        full?: string;
        time?: string;
      };
};

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

export type TableBooleanBadgeProps = {
  active: boolean;
  activeLabel: ReactNode;
  inactiveLabel: ReactNode;
  className?: string;
  labelClassName?: string;
  activeIcon?: ComponentPropsWithoutRef<'svg'> extends never
    ? never
    : React.ComponentType<{ className?: string }>;
  inactiveIcon?: React.ComponentType<{ className?: string }>;
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

export type TableSurfaceRowProps = ComponentPropsWithoutRef<typeof TableRow> & {
  variant?: TableRowVariant;
  active?: boolean;
};

export type InteractiveTableRowKeyboardEvent = KeyboardEvent<HTMLTableRowElement>;

export type InteractiveTableRowMouseEvent = MouseEvent<HTMLTableRowElement>;
