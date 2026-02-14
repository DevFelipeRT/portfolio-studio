import { NAMESPACES } from '@/common/i18n/config/namespaces';
import { useTranslation } from '@/common/i18n/react/hooks/useTranslation';
import { useIsMobile } from '@/hooks/useMobile';
import { useMemo } from 'react';
import { DesktopNavigationMenu, MobileNavigationMenu } from './menu';
import {
  collectSectionTargets,
  useActiveSectionTracking,
  useRenderableSectionTargets,
  useSectionNavigation,
  useSectionPositions,
} from './section-tracking';
import type { NavigationItem } from './types';

type NavigationProps = {
  items: NavigationItem[];
  onClose?: () => void;
};

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
          renderableSectionTargets={renderableSectionTargets}
          isSectionIdentityActive={isSectionIdentityActive}
          onSectionNavigate={handleSectionNavigate}
          onClose={onClose}
        />
      ) : (
        <DesktopNavigationMenu
          items={safeItems}
          hasSections={hasSections}
          sectionTargets={sectionTargets}
          renderableSectionTargets={renderableSectionTargets}
          isSectionIdentityActive={isSectionIdentityActive}
          onSectionNavigate={handleSectionNavigate}
        />
      )}
    </nav>
  );
}
