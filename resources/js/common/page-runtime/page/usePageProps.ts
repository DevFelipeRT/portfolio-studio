import type { RuntimePageProps } from '../types';
import { getPageRuntimeAdapter } from '../runtimeAdapter';

export function usePageProps<TPageProps extends RuntimePageProps>(): TPageProps {
  return getPageRuntimeAdapter().usePageProps<TPageProps>();
}
