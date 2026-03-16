import type { FormDataType } from '@inertiajs/core';
import { useForm, type InertiaFormProps } from '@inertiajs/react';
import type {
  PageFormDataValues,
  PageFormHook,
  PageFormSetDefaults,
  PageFormSetData,
} from '../../types';

function adaptInertiaPageForm<TValues extends PageFormDataValues>(
  form: InertiaFormProps<FormDataType<TValues>>,
): PageFormHook<TValues> {
  return {
    data: form.data as TValues,
    setData: form.setData as unknown as PageFormSetData<TValues>,
    errors: form.errors as Record<string, string>,
    processing: form.processing,
    recentlySuccessful: form.recentlySuccessful,
    isDirty: form.isDirty,
    hasErrors: form.hasErrors,
    reset: (...fields: string[]) => form.reset(...(fields as never[])),
    clearErrors: (...fields: string[]) =>
      form.clearErrors(...(fields as never[])),
    setDefaults: form.setDefaults as unknown as PageFormSetDefaults<TValues>,
    transform: (callback) => form.transform(callback),
    post: (url, options) => form.post(url, options),
    put: (url, options) => form.put(url, options),
    patch: (url, options) => form.patch(url, options),
    delete: (url, options) => form.delete(url, options),
  };
}

export function useInertiaPageForm<TValues extends PageFormDataValues>(
  rememberKey: string,
  initialValues: TValues,
): PageFormHook<TValues>;
export function useInertiaPageForm<TValues extends PageFormDataValues>(
  initialValues: TValues,
): PageFormHook<TValues>;
export function useInertiaPageForm<TValues extends PageFormDataValues>(
  rememberKeyOrInitialValues: string | TValues,
  initialValues?: TValues,
): PageFormHook<TValues> {
  const formArgs:
    | [rememberKey: string, initialValues: FormDataType<TValues>]
    | [initialValues: FormDataType<TValues>] =
    typeof rememberKeyOrInitialValues === 'string'
      ? [
          rememberKeyOrInitialValues,
          initialValues as FormDataType<TValues>,
        ]
      : [rememberKeyOrInitialValues as FormDataType<TValues>];
  const useInertiaForm =
    useForm as unknown as (
      ...args:
        | [rememberKey: string, initialValues: FormDataType<TValues>]
        | [initialValues: FormDataType<TValues>]
    ) => InertiaFormProps<FormDataType<TValues>>;
  const form = useInertiaForm(...formArgs);

  return adaptInertiaPageForm(form);
}
