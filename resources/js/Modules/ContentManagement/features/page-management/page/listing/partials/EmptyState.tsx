import { TableCell, TableRow } from '@/Components/Ui/table';

interface EmptyStateProps {
  colSpan: number;
  message: string;
}

/**
 * Empty state row for the listing table body.
 */
export function EmptyState({ colSpan, message }: EmptyStateProps) {
  return (
    <TableRow>
      <TableCell
        colSpan={colSpan}
        className="text-muted-foreground py-10 text-center text-sm"
      >
        {message}
      </TableCell>
    </TableRow>
  );
}
