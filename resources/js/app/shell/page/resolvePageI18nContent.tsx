'use client';

import { I18nScopeGate } from '@/common/i18n';
import type { ReactElement, ReactNode } from 'react';
import type { AppPageComponent, AppPageProps } from '../types';
import { resolveAppLocalizationContext } from '../runtime';

/**
 * The resolved page-content payload produced by shell page-i18n composition.
 */
type ResolvePageI18nContentResult = {
  content: ReactNode;
  scopeIds: string[];
};

/**
 * The gate predicate used to decide whether page-level i18n scopes should
 * block rendering for the current localization profile.
 */
function shouldGatePageScope(
  isSystemLocalization: boolean,
  scopeIds: readonly string[],
): boolean {
  if (!isSystemLocalization) {
    return false;
  }

  return scopeIds.some(
    (scopeId) => typeof scopeId === 'string' && scopeId.trim() !== '',
  );
}

/**
 * The shell page-content resolver that derives i18n scopes and, when
 * appropriate, wraps the page subtree in a scope gate.
 */
export function resolvePageI18nContent(
  Component: AppPageComponent,
  page: ReactElement<Record<string, unknown>>,
  props: AppPageProps,
): ResolvePageI18nContentResult {
  const staticIds = Component.i18n ?? [];
  const dynamicIds = Component.getI18nScope?.(props) ?? [];
  const pageScopeIds = [...staticIds, ...dynamicIds];
  const scopeIds = ['layouts', ...pageScopeIds];
  const localizationContext = resolveAppLocalizationContext(props);
  const shouldGate = shouldGatePageScope(
    localizationContext.profile.isSystem,
    pageScopeIds,
  );

  return {
    content: shouldGate ? (
      <I18nScopeGate
        scopeIds={pageScopeIds}
        keepPreviousContentDuringLoad={false}
      >
        {page}
      </I18nScopeGate>
    ) : (
      page
    ),
    scopeIds,
  };
}
