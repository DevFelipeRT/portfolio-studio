import type { JSX } from 'react';
import type { PageLinkProps } from '../types';
import { getPageRuntimeAdapter } from '../runtimeAdapter';

export function PageLink(props: PageLinkProps): JSX.Element {
  const Link = getPageRuntimeAdapter().Link;

  return <Link {...props} />;
}
