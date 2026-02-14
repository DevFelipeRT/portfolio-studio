import { useEffect, useState } from 'react';
import type { SectionTargetNode } from '../../types';

type UseRenderableSectionTargetsResult = string[] | null;

export function useRenderableSectionTargets(
  sectionTargets: SectionTargetNode[],
  isEnabled: boolean,
): UseRenderableSectionTargetsResult {
  const [renderableSectionTargets, setRenderableSectionTargets] =
    useState<UseRenderableSectionTargetsResult>(null);

  useEffect(() => {
    if (!isEnabled) {
      setRenderableSectionTargets(null);
      return;
    }

    if (typeof document === 'undefined') {
      return;
    }

    const targets: string[] = [];

    sectionTargets.forEach((target) => {
      const node = target.node;

      if (node.scrollToTop) {
        return;
      }

      if (!node.targetId) {
        return;
      }

      const element = document.getElementById(node.targetId);
      if (element && !targets.includes(node.targetId)) {
        targets.push(node.targetId);
      }
    });

    setRenderableSectionTargets(targets);
  }, [isEnabled, sectionTargets]);

  return renderableSectionTargets;
}
