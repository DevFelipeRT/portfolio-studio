import type {
  TableQueryParamsInput,
  TableQueryParamValue,
  TableSortState,
} from './types';

export function serializeTableQueryParams(
  params: TableQueryParamsInput,
): Record<string, string> {
  const serialized: Record<string, string> = {};

  Object.entries(params).forEach(([key, value]) => {
    const nextValue = normalizeTableQueryParamValue(value);

    if (nextValue !== null) {
      serialized[key] = nextValue;
    }
  });

  return serialized;
}

export function resetTablePageInQueryParams(
  params: TableQueryParamsInput,
): Record<string, string> {
  const next = serializeTableQueryParams(params);

  delete next.page;

  return next;
}

export function setTablePageInQueryParams(
  params: TableQueryParamsInput,
  page: number | null | undefined,
): Record<string, string> {
  const next = serializeTableQueryParams(params);

  if (!Number.isInteger(page) || page === undefined || page === null || page <= 1) {
    delete next.page;

    return next;
  }

  next.page = String(page);

  return next;
}

export function setTablePerPageInQueryParams(
  params: TableQueryParamsInput,
  perPage: number | null | undefined,
): Record<string, string> {
  const next = serializeTableQueryParams(params);

  if (
    !Number.isInteger(perPage) ||
    perPage === undefined ||
    perPage === null ||
    perPage < 1
  ) {
    delete next.per_page;

    return next;
  }

  next.per_page = String(perPage);

  return next;
}

export function toggleTableSortState(
  currentSort: TableSortState,
  column: string,
): TableSortState {
  if (column.trim() === '') {
    return {
      column: null,
      direction: null,
    };
  }

  if (currentSort.column !== column) {
    return {
      column,
      direction: 'asc',
    };
  }

  return {
    column,
    direction: currentSort.direction === 'asc' ? 'desc' : 'asc',
  };
}

export function setTableSortInQueryParams(
  params: TableQueryParamsInput,
  sort: TableSortState,
): Record<string, string> {
  const next = resetTablePageInQueryParams(params);

  if (
    sort.column === null ||
    sort.column.trim() === '' ||
    (sort.direction !== 'asc' && sort.direction !== 'desc')
  ) {
    delete next.sort;
    delete next.direction;

    return next;
  }

  next.sort = sort.column;
  next.direction = sort.direction;

  return next;
}

function normalizeTableQueryParamValue(
  value: TableQueryParamValue,
): string | null {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value === 'number') {
    if (!Number.isFinite(value)) {
      return null;
    }

    return String(value);
  }

  const trimmed = value.trim();

  return trimmed === '' ? null : trimmed;
}
