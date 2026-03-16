import { useCurrentPage } from './useCurrentPage';

export function usePageComponentName(): string {
  return useCurrentPage().component;
}
