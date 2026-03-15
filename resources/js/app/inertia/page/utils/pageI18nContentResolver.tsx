'use client';

import { I18nScopeGate } from '@/common/i18n';
import type { ReactElement, ReactNode } from 'react';
import type { InertiaPageComponent, InertiaPageProps } from '../../types';
import { resolveInertiaLocalizationContext } from '../../runtime';

type ResolvePageI18nContentResult = {
  content: ReactNode;
  scopeIds: string[];
};

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
 * Resolves the page subtree content and i18n scopes that should be handed to
 * the shared provider/runtime layer.
 */
export function resolvePageI18nContent(
  Component: InertiaPageComponent,
  page: ReactElement<Record<string, unknown>>,
  props: InertiaPageProps,
): ResolvePageI18nContentResult {
  const staticIds = Component.i18n ?? [];
  const dynamicIds = Component.getI18nScope?.(props) ?? [];
  const pageScopeIds = [...staticIds, ...dynamicIds];
  const scopeIds = ['layouts', ...pageScopeIds];
  const localizationContext = resolveInertiaLocalizationContext(props);
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
