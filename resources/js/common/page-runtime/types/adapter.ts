import type { ComponentType, CSSProperties, MouseEventHandler, ReactNode } from 'react';
import type { PageHeadProps } from './document';
import type { PageFormDataValues, PageFormHook } from './form';
import type { PageRequestPayload, PageRouter, PageVisitOptions } from './navigation';
import type { RuntimePage, RuntimePageProps } from './page';

export type PageLinkMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';
export type PageLinkAs = 'a' | 'button';

export type PageLinkProps = {
  href: string;
  children?: ReactNode;
  method?: PageLinkMethod;
  data?: PageRequestPayload;
  as?: PageLinkAs;
  id?: string;
  className?: string;
  style?: CSSProperties;
  title?: string;
  tabIndex?: number;
  disabled?: boolean;
  preserveState?: PageVisitOptions['preserveState'];
  preserveScroll?: PageVisitOptions['preserveScroll'];
  replace?: PageVisitOptions['replace'];
  headers?: PageVisitOptions['headers'];
  only?: PageVisitOptions['only'];
  except?: PageVisitOptions['except'];
  onClick?: MouseEventHandler<HTMLElement>;
  'aria-label'?: string;
  'aria-current'?: boolean | 'page' | 'step' | 'location' | 'date' | 'time';
  'aria-controls'?: string;
  'aria-expanded'?: boolean;
  [key: `data-${string}`]: string | number | boolean | undefined;
};

export type PageRuntimeAdapter = {
  Head: ComponentType<PageHeadProps>;
  Link: ComponentType<PageLinkProps>;
  router: PageRouter;
  useCurrentPage(): RuntimePage;
  usePageProps<TPageProps extends RuntimePageProps>(): TPageProps;
  useForm<TValues extends PageFormDataValues>(
    rememberKey: string,
    initialValues: TValues,
  ): PageFormHook<TValues>;
  useForm<TValues extends PageFormDataValues>(
    initialValues: TValues,
  ): PageFormHook<TValues>;
};
