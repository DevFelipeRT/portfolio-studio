import { forwardRef, type JSX } from 'react';
import type { PageLinkProps } from '../types';
import { getPageRuntimeAdapter } from '../runtimeAdapter';

export const PageLink = forwardRef<HTMLElement, PageLinkProps>(function PageLink(
  props,
  ref,
): JSX.Element {
  const Link = getPageRuntimeAdapter().Link;

  return <Link {...props} ref={ref} />;
});
