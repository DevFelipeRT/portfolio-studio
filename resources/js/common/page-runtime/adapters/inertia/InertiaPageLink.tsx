import { Link } from '@inertiajs/react';
import { forwardRef, type ComponentProps, type JSX } from 'react';
import type { PageLinkProps } from '../../types';

export const InertiaPageLink = forwardRef<HTMLElement, PageLinkProps>(
  function InertiaPageLink(props, ref): JSX.Element {
    return <Link {...(props as ComponentProps<typeof Link>)} ref={ref as never} />;
  },
);
