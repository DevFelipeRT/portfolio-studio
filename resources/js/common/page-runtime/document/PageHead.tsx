import type { JSX } from 'react';
import type { PageHeadProps } from '../types';
import { getPageRuntimeAdapter } from '../runtimeAdapter';

export function PageHead(props: PageHeadProps): JSX.Element {
  const Head = getPageRuntimeAdapter().Head;

  return <Head {...props} />;
}
