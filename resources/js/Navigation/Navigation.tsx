// resources/js/Navigation/Navigation.tsx
'use client';

import { NAMESPACES } from '@/i18n/config/namespaces';
import { useTranslation } from '@/i18n/react/hooks/useTranslation';
import { usePage } from '@inertiajs/react';
import { useMemo } from 'react';
import { useActiveSectionTracking } from './hooks/useActiveSectionTracking';
import { useNavigationSheet } from './hooks/useNavigationSheet';
import { useRenderableSectionTargets } from './hooks/useRenderableSectionTargets';
import { useSectionNavigation } from './hooks/useSectionNavigation';
import { useSectionPositions } from './hooks/useSectionPositions';
import type { NavigationProps, NavigationSectionItem } from './types';
import { NavigationDesktopMenu } from './ui/NavigationDesktopMenu';
import { NavigationMobileSheet } from './ui/NavigationMobileSheet';
import {
    shouldRenderSectionChild,
    shouldRenderSectionNode,
} from './utils/renderRules';
import { collectSectionTargets } from './utils/sectionTargets';

export default function Navigation({ items, user }: NavigationProps) {
    const { url } = usePage();

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

    const { isSheetOpen, setIsSheetOpen } = useNavigationSheet(url);

    const { translate: translateFromLayout } = useTranslation(
        NAMESPACES.layout,
    );
    const { translate: translateFromCommon } = useTranslation(
        NAMESPACES.common,
    );

    const primaryNavigationLabel = translateFromLayout(
        'header.navigation.primaryLabel',
        'Primary navigation',
    );

    const openNavigationLabel = translateFromCommon(
        'navigation.openMenu',
        'Open navigation menu',
    );

    const mobileNavigationTitle = translateFromLayout(
        'header.navigation.mobileTitle',
        'Navigation',
    );

    const isSectionIdentityActive = (identity: string): boolean => {
        return hasSections && activeSectionId === identity;
    };

    const shouldRenderSectionNodeBound = (
        node: NavigationSectionItem,
    ): boolean => shouldRenderSectionNode(node, renderableSectionTargets);

    const shouldRenderSectionChildBound = (
        node: NavigationSectionItem,
    ): boolean => shouldRenderSectionChild(node, renderableSectionTargets);

    const hasItems = safeItems.length > 0;

    if (!hasItems) {
        return null;
    }

    return (
        <nav
            className="flex grow items-center justify-center gap-3"
            aria-label={primaryNavigationLabel}
        >
            <NavigationDesktopMenu
                items={safeItems}
                hasSections={hasSections}
                sectionTargets={sectionTargets}
                isSectionIdentityActive={isSectionIdentityActive}
                shouldRenderSectionNode={shouldRenderSectionNodeBound}
                shouldRenderSectionChild={shouldRenderSectionChildBound}
                onSectionNavigate={handleSectionNavigate}
            />

            <NavigationMobileSheet
                items={safeItems}
                user={user}
                isSheetOpen={isSheetOpen}
                setIsSheetOpen={setIsSheetOpen}
                openNavigationLabel={openNavigationLabel}
                mobileNavigationTitle={mobileNavigationTitle}
                hasSections={hasSections}
                isSectionIdentityActive={isSectionIdentityActive}
                shouldRenderSectionNode={shouldRenderSectionNodeBound}
                shouldRenderSectionChild={shouldRenderSectionChildBound}
                onSectionNavigate={handleSectionNavigate}
            />
        </nav>
    );
}
