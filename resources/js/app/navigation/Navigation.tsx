// resources/js/Navigation/Navigation.tsx
'use client';

import { NAMESPACES } from '@/Common/i18n/config/namespaces';
import { useTranslation } from '@/Common/i18n/react/hooks/useTranslation';
import { useIsMobile } from '@/hooks/use-mobile';
import { useMemo } from 'react';
import { useActiveSectionTracking } from './hooks/useActiveSectionTracking';
import { useRenderableSectionTargets } from './hooks/useRenderableSectionTargets';
import { useSectionNavigation } from './hooks/useSectionNavigation';
import { useSectionPositions } from './hooks/useSectionPositions';
import type { NavigationProps, NavigationSectionItem } from './types';
import { DesktopNavigationMenu } from './ui/DesktopNavigationMenu';
import { MobileNavigationMenu } from './ui/MobileNavigationMenu';
import {
  shouldRenderSectionChild,
  shouldRenderSectionNode,
} from './utils/renderRules';
import { collectSectionTargets } from './utils/sectionTargets';

export default function Navigation({ items, onClose }: NavigationProps) {
  const isMobile = useIsMobile();

  const safeItems = useMemo(() => items ?? [], [items]);

  const sectionTargets = useMemo(
    () => collectSectionTargets(safeItems),
    [safeItems],
  );

  const hasSections = sectionTargets.length > 0;

  const renderableSectionTargets = useRenderableSectionTargets(
    sectionTargets,
    hasSections,
  );

  const sectionPositions = useSectionPositions(
    sectionTargets,
    hasSections,
    renderableSectionTargets,
  );

  const [activeSectionId, setActiveSectionId] = useActiveSectionTracking(
    sectionPositions,
    sectionTargets,
    hasSections,
  );

  const { handleSectionNavigate } = useSectionNavigation(setActiveSectionId);

  const { translate: translateFromLayout } = useTranslation(NAMESPACES.layout);

  const primaryNavigationLabel = translateFromLayout(
    'header.navigation.primaryLabel',
    'Primary navigation',
  );

  const isSectionIdentityActive = (identity: string): boolean => {
    return hasSections && activeSectionId === identity;
  };

  const shouldRenderSectionNodeBound = (node: NavigationSectionItem): boolean =>
    shouldRenderSectionNode(node, renderableSectionTargets);

  const shouldRenderSectionChildBound = (
    node: NavigationSectionItem,
  ): boolean => shouldRenderSectionChild(node, renderableSectionTargets);

  const hasItems = safeItems.length > 0;

  if (!hasItems) {
    return null;
  }

  const navigationClassName = isMobile
    ? 'flex w-full flex-col'
    : 'flex grow items-center justify-center gap-3';

  return (
    <nav className={navigationClassName} aria-label={primaryNavigationLabel}>
      {isMobile ? (
        <MobileNavigationMenu
          items={safeItems}
          hasSections={hasSections}
          isSectionIdentityActive={isSectionIdentityActive}
          shouldRenderSectionNode={shouldRenderSectionNodeBound}
          shouldRenderSectionChild={shouldRenderSectionChildBound}
          onSectionNavigate={handleSectionNavigate}
          onClose={onClose}
        />
      ) : (
        <DesktopNavigationMenu
          items={safeItems}
          hasSections={hasSections}
          sectionTargets={sectionTargets}
          isSectionIdentityActive={isSectionIdentityActive}
          shouldRenderSectionNode={shouldRenderSectionNodeBound}
          shouldRenderSectionChild={shouldRenderSectionChildBound}
          onSectionNavigate={handleSectionNavigate}
        />
      )}
    </nav>
  );
}
