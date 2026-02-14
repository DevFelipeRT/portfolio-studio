import { useEffect, useMemo, useState } from 'react';
import type { SectionPosition, SectionTargetNode } from '../../types';
import { getHeaderHeight } from '../../utils/headerHeight';

function pickInitialActiveSectionId(
  sectionTargets: SectionTargetNode[],
): string | null {
  if (sectionTargets.length === 0) {
    return null;
  }

  const topTarget = sectionTargets.find((target) => target.node.scrollToTop);
  if (topTarget) {
    return topTarget.identity;
  }

  const firstWithTarget = sectionTargets.find(
    (target) => !!target.node.targetId && !target.node.scrollToTop,
  );

  return firstWithTarget
    ? firstWithTarget.identity
    : sectionTargets[0].identity;
}

export function useActiveSectionTracking(
  sectionPositions: SectionPosition[],
  sectionTargets: SectionTargetNode[],
  isEnabled: boolean,
): [string | null, (value: string | null) => void] {
  const initial = useMemo(
    () => pickInitialActiveSectionId(sectionTargets),
    [sectionTargets],
  );

  const [activeSectionId, setActiveSectionId] = useState<string | null>(
    initial,
  );

  useEffect(() => {
    if (!isEnabled) {
      setActiveSectionId(null);
      return;
    }

    if (typeof window === 'undefined') {
      return;
    }

    if (sectionPositions.length === 0 && sectionTargets.length === 0) {
      return;
    }

    function handleScroll(): void {
      const scrollY = window.scrollY;
      const headerHeight = getHeaderHeight();
      const viewportReference =
        scrollY + headerHeight + window.innerHeight * 0.25;

      let currentSectionId: string | null = null;

      for (let index = 0; index < sectionPositions.length; index += 1) {
        const section = sectionPositions[index];

        if (viewportReference >= section.top) {
          currentSectionId = section.id;
        } else {
          break;
        }
      }

      if (!currentSectionId) {
        const topTarget = sectionTargets.find(
          (target) => target.node.scrollToTop,
        );

        if (topTarget) {
          currentSectionId = topTarget.identity;
        } else if (sectionPositions.length > 0) {
          currentSectionId = sectionPositions[0].id;
        } else if (sectionTargets.length > 0) {
          currentSectionId = sectionTargets[0].identity;
        }
      }

      setActiveSectionId((previous) =>
        previous === currentSectionId ? previous : currentSectionId,
      );
    }

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isEnabled, sectionPositions, sectionTargets]);

  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    setActiveSectionId((previous) => {
      if (previous === null) {
        return initial;
      }

      const exists = sectionTargets.some((t) => t.identity === previous);
      return exists ? previous : initial;
    });
  }, [isEnabled, initial, sectionTargets]);

  return [activeSectionId, setActiveSectionId];
}
