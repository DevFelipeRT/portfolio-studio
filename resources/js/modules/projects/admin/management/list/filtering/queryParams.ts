import {
  serializeTableQueryParams,
  setTableSortInQueryParams,
  type TableSortState,
} from '@/common/table';

export function buildProjectListQueryParams({
  search,
  status,
  visibility,
  perPage,
  sort,
}: {
  search: string;
  status: string;
  visibility: string;
  perPage?: number;
  sort: TableSortState;
}): Record<string, string> {
  return setTableSortInQueryParams(
    serializeTableQueryParams({
      search,
      status,
      visibility,
      per_page: perPage,
    }),
    sort,
  );
}
