import type {
  TablePaginated,
  TablePaginationLink,
  TablePaginationState,
} from './types';

export function normalizeTablePagination<TItem>(
  pagination: TablePaginated<TItem> | TablePaginationState,
): TablePaginationState {
  if (isTablePaginationState(pagination)) {
    return pagination;
  }

  return {
    currentPage: pagination.current_page,
    lastPage: pagination.last_page,
    perPage: pagination.per_page,
    total: pagination.total,
    from: pagination.from ?? null,
    to: pagination.to ?? null,
    hasPreviousPage: pagination.current_page > 1,
    hasNextPage: pagination.current_page < pagination.last_page,
    links: normalizeTablePaginationLinks(pagination.links ?? []),
  };
}

function isTablePaginationState(
  pagination: TablePaginated<unknown> | TablePaginationState,
): pagination is TablePaginationState {
  return 'currentPage' in pagination;
}

function normalizeTablePaginationLinks(
  links: TablePaginationLink[],
): TablePaginationLink[] {
  return links.map((link) => ({
    ...link,
    // Laravel includes "Previous" / "Next" links in linkCollection().
    // We only infer page numbers for labels that actually represent pages.
    page: link.page ?? extractPageFromLabel(link.label),
  }));
}

function extractPageFromLabel(label: string): number | null {
  const stripped = label
    .replace(/&[^;]+;/g, ' ')
    .replace(/[^\d]+/g, '')
    .trim();

  if (stripped === '') {
    return null;
  }

  const page = Number(stripped);

  if (!Number.isInteger(page) || page < 1) {
    return null;
  }

  return page;
}
