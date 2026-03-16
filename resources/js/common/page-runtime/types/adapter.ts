import type { ComponentType, ReactNode } from 'react';
import type { PageHeadProps } from './document';
import type { PageFormDataValues, PageFormHook } from './form';
import type { PageRouter } from './navigation';
import type { RuntimePage, RuntimePageProps } from './page';

export type PageLinkProps = {
  children?: ReactNode;
  [key: string]: unknown;
};

export type PageRuntimeAdapter = {
  Head: ComponentType<PageHeadProps>;
  Link: ComponentType<PageLinkProps>;
  router: PageRouter;
  useCurrentPage(): RuntimePage;
  usePageProps<TPageProps extends RuntimePageProps>(): TPageProps;
  useForm<TValues extends PageFormDataValues>(
    initialValues: TValues,
  ): PageFormHook<TValues>;
};
