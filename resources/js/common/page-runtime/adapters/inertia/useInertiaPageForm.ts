import type { FormDataType } from '@inertiajs/core';
import { useForm, type InertiaFormProps } from '@inertiajs/react';
import type {
  PageFormDataValues,
  PageFormHook,
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
    setDefaults: (...args: unknown[]) =>
      (form.setDefaults as (...values: unknown[]) => void)(...args),
    transform: (callback) => form.transform(callback),
    post: (url, options) => form.post(url, options),
    put: (url, options) => form.put(url, options),
    patch: (url, options) => form.patch(url, options),
    delete: (url, options) => form.delete(url, options),
  };
}

export function useInertiaPageForm<TValues extends PageFormDataValues>(
  initialValues: TValues,
): PageFormHook<TValues>;
export function useInertiaPageForm<TValues extends PageFormDataValues>(
  initialValues: TValues,
): PageFormHook<TValues> {
  const form = useForm<FormDataType<TValues>>(
    initialValues as FormDataType<TValues>,
  );

  return adaptInertiaPageForm(form);
}
