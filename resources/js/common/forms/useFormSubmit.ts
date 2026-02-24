import type { VisitOptions } from '@inertiajs/core';
import React from 'react';

type InertiaSubmitMethod = (url: string, options?: VisitOptions) => void;

export type UseFormSubmitOptions = {
  preserveState?: boolean;
  preserveScroll?: boolean;
  scrollToTopOnError?: boolean;
  scrollBehavior?: ScrollBehavior;
};

/**
 * Builds a reusable form submit handler for Inertia forms.
 *
 * Defaults:
 * - preserveState: true
 * - preserveScroll: true
 * - scrollToTopOnError: true
 * - scrollBehavior: 'smooth'
 */
export function useFormSubmit(options: UseFormSubmitOptions = {}) {
  const preserveState = options.preserveState ?? true;
  const preserveScroll = options.preserveScroll ?? true;
  const scrollToTopOnError = options.scrollToTopOnError ?? true;
  const scrollBehavior = options.scrollBehavior ?? 'smooth';

  return React.useCallback(
    (
      event: React.FormEvent<HTMLFormElement>,
      submit: InertiaSubmitMethod,
      url: string,
      visitOptions: VisitOptions = {},
    ): void => {
      event.preventDefault();

      const userOnError = visitOptions.onError;

      submit(url, {
        preserveState,
        preserveScroll,
        ...visitOptions,
        onError: (...args) => {
          userOnError?.(...args);
          if (scrollToTopOnError) {
            window.scrollTo({ top: 0, behavior: scrollBehavior });
          }
        },
      });
    },
    [preserveScroll, preserveState, scrollBehavior, scrollToTopOnError],
  );
}

