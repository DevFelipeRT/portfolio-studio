export const PROJECT_LIST_CONFIG = {
  perPageOptions: [15, 30, 50] as const,
  sortableColumns: {
    name: true,
    status: true,
    display: true,
    image_count: true,
  } as const,
} as const;
