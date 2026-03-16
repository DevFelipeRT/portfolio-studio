import type { PageFormDataValues, PageFormHook } from '../types';
import { getPageRuntimeAdapter } from '../runtimeAdapter';

export function usePageForm<TValues extends PageFormDataValues>(
  initialValues: TValues,
): PageFormHook<TValues>;
export function usePageForm<TValues extends PageFormDataValues>(
  initialValues: TValues,
): PageFormHook<TValues> {
  return getPageRuntimeAdapter().useForm(initialValues);
}
