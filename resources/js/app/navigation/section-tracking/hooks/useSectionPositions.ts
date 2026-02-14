import { useEffect, useState } from 'react';
import type { SectionPosition, SectionTargetNode } from '../../types';
import { getHeaderHeight } from '../../utils/headerHeight';

export function useSectionPositions(
  sectionTargets: SectionTargetNode[],
  isEnabled: boolean,
  renderableSectionTargets: string[] | null,
): SectionPosition[] {
  const [sectionPositions, setSectionPositions] = useState<SectionPosition[]>(
    [],
  );

  useEffect(() => {
    if (!isEnabled) {
      setSectionPositions([]);
      return;
    }

    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    function collect(): void {
      const headerHeight = getHeaderHeight();
      const positions: SectionPosition[] = [];

      sectionTargets.forEach((target) => {
        const node = target.node;

        if (node.scrollToTop) {
          return;
        }

        if (!node.targetId) {
          return;
        }

        if (
          renderableSectionTargets !== null &&
          !renderableSectionTargets.includes(node.targetId)
        ) {
          return;
        }

        const element = document.getElementById(node.targetId);
        if (!element) {
          return;
        }

        const rect = element.getBoundingClientRect();
        const top = window.scrollY + rect.top - headerHeight;

        positions.push({
          id: target.identity,
          top,
        });
      });

      positions.sort((a, b) => a.top - b.top);
      setSectionPositions(positions);
    }

    collect();
    window.addEventListener('resize', collect);

    return () => {
      window.removeEventListener('resize', collect);
    };
  }, [isEnabled, sectionTargets, renderableSectionTargets]);

  return sectionPositions;
}
