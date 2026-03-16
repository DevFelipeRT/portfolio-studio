import { usePage } from '@inertiajs/react';
import type { RuntimePageProps } from '../../types';

export function useInertiaPageProps<
  TPageProps extends RuntimePageProps,
>(): TPageProps {
  return usePage().props as unknown as TPageProps;
}
