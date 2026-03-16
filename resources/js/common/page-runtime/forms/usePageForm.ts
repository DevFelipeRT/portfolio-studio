import type { PageFormDataValues, PageFormHook } from '../types';
import { getPageRuntimeAdapter } from '../runtimeAdapter';

export function usePageForm<TValues extends PageFormDataValues>(
  rememberKey: string,
  initialValues: TValues,
): PageFormHook<TValues>;
export function usePageForm<TValues extends PageFormDataValues>(
  initialValues: TValues,
): PageFormHook<TValues>;
export function usePageForm<TValues extends PageFormDataValues>(
  rememberKeyOrInitialValues: string | TValues,
  initialValues?: TValues,
): PageFormHook<TValues> {
  if (typeof rememberKeyOrInitialValues === 'string') {
    return getPageRuntimeAdapter().useForm(
      rememberKeyOrInitialValues,
      initialValues as TValues,
    );
  }

  return getPageRuntimeAdapter().useForm(rememberKeyOrInitialValues);
}
