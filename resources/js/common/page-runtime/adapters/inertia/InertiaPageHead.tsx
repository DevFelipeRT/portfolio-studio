import { Head } from '@inertiajs/react';
import type { ComponentProps, JSX } from 'react';
import type { PageHeadProps } from '../../types';

export function InertiaPageHead(props: PageHeadProps): JSX.Element {
  return <Head {...(props as ComponentProps<typeof Head>)} />;
}
