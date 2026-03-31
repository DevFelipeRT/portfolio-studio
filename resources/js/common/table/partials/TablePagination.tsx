import { useTranslation, I18N_NAMESPACES } from '@/common/i18n';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

import { normalizeTablePagination } from '../pagination';
import type { TablePaginationProps } from '../types';

export function TablePagination({
  pagination,
  onPageChange,
  perPageOptions,
  onPerPageChange,
  showPageLinks = false,
  className,
  ...props
}: TablePaginationProps) {
  const state = normalizeTablePagination(pagination);
  const { translate: tPagination } = useTranslation(I18N_NAMESPACES.pagination);

  const summary =
    state.total > 0 && state.from !== null && state.to !== null
      ? tPagination(
          'resultsWithRange',
          '{{from}}-{{to}} of {{total}} results',
          {
            from: state.from,
            to: state.to,
            total: state.total,
          },
        )
      : tPagination('results', '{{count}} results', {
          count: state.total,
        });

  const pageLabel = tPagination('pageOf', 'Page {{page}} of {{total}}', {
    page: state.currentPage,
    total: state.lastPage,
  });

  const pageLinks = state.links.filter((link) => link.page !== null && link.page !== undefined);
  const canChangePerPage = Boolean(
    onPerPageChange && perPageOptions && perPageOptions.length > 0,
  );

  return (
    <div
      className={cn(
        'flex flex-col gap-3 border-t px-4 py-3',
        className,
      )}
      {...props}
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <span className="text-muted-foreground text-xs">{summary}</span>

          {canChangePerPage ? (
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-xs whitespace-nowrap">
                {tPagination('itemsPerPage', 'Items per page')}
              </span>

              <Select
                value={String(state.perPage)}
                onValueChange={(value) => {
                  const nextPerPage = Number(value);

                  if (Number.isInteger(nextPerPage) && nextPerPage > 0) {
                    onPerPageChange?.(nextPerPage);
                  }
                }}
              >
                <SelectTrigger className="h-8 w-[88px] text-xs">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  {perPageOptions?.map((option) => (
                    <SelectItem key={option} value={String(option)}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center justify-end gap-2">
          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={!onPageChange || !state.hasPreviousPage}
            onClick={() => onPageChange?.(state.currentPage - 1)}
          >
            {tPagination('previousPage', 'Previous page')}
          </Button>

          {showPageLinks && onPageChange && pageLinks.length > 0 ? (
            <div className="hidden items-center gap-1 md:flex">
              {pageLinks.map((link) => {
                if (link.page === undefined || link.page === null) {
                  return null;
                }

                return (
                  <Button
                    key={`${link.label}-${link.page}`}
                    type="button"
                    size="sm"
                    variant={link.active ? 'default' : 'outline'}
                    className="min-w-9 px-2"
                    aria-current={link.active ? 'page' : undefined}
                    onClick={() => onPageChange(link.page ?? state.currentPage)}
                  >
                    {link.page}
                  </Button>
                );
              })}
            </div>
          ) : null}

          <span className="text-muted-foreground min-w-fit text-xs whitespace-nowrap">
            {pageLabel}
          </span>

          <Button
            type="button"
            size="sm"
            variant="outline"
            disabled={!onPageChange || !state.hasNextPage}
            onClick={() => onPageChange?.(state.currentPage + 1)}
          >
            {tPagination('nextPage', 'Next page')}
          </Button>
        </div>
      </div>
    </div>
  );
}
