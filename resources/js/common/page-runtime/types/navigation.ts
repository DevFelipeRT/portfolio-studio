import type { PageFormValue } from './form';

export type PageRequestPayload = Record<string, PageFormValue> | FormData;

export type PageVisitOptions = {
  preserveState?: boolean;
  preserveScroll?: boolean;
  replace?: boolean;
  forceFormData?: boolean;
  headers?: Record<string, string>;
  only?: string[];
  except?: string[];
  onStart?: () => void;
  onFinish?: (...args: unknown[]) => void;
  onSuccess?: (...args: unknown[]) => void;
  onError?: (...args: unknown[]) => void;
};

export type PageRouter = {
  visit(url: string, options?: PageVisitOptions): void;
  get(
    url: string,
    data?: PageRequestPayload,
    options?: PageVisitOptions,
  ): void;
  post(
    url: string,
    data?: PageRequestPayload,
    options?: PageVisitOptions,
  ): void;
  put(
    url: string,
    data?: PageRequestPayload,
    options?: PageVisitOptions,
  ): void;
  patch(
    url: string,
    data?: PageRequestPayload,
    options?: PageVisitOptions,
  ): void;
  delete(url: string, options?: PageVisitOptions): void;
};
