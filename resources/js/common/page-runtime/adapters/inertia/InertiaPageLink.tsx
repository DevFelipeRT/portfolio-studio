import { Link } from '@inertiajs/react';
import type { ComponentProps, JSX } from 'react';
import type { PageLinkProps } from '../../types';

export function InertiaPageLink(props: PageLinkProps): JSX.Element {
  return <Link {...(props as ComponentProps<typeof Link>)} />;
}
