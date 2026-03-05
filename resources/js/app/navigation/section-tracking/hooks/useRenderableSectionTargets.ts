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

    let cancelled = false;
    let frameId: number | null = null;
    let attempts = 0;

    const expectedTargetIds = sectionTargets
      .map((target) => target.node)
      .filter((node) => !node.scrollToTop)
      .map((node) => node.targetId)
      .filter((value): value is string => typeof value === 'string' && value.trim() !== '')
      .map((value) => value.trim());

    const scan = (): string[] => {
      const targets: string[] = [];

      expectedTargetIds.forEach((targetId) => {
        const element = document.getElementById(targetId);
        if (element && !targets.includes(targetId)) {
          targets.push(targetId);
        }
      });

      return targets;
    };

    const MAX_ATTEMPTS = 30; // ~0.5s at 60fps

    const tick = () => {
      if (cancelled) {
        return;
      }

      const targets = scan();

      // If no targets are found yet, keep returning `null` for a short time.
      // This prevents the navigation from disappearing when content is gated
      // (e.g. i18n scope loading) and anchors are rendered slightly later.
      if (targets.length === 0 && attempts < MAX_ATTEMPTS) {
        attempts += 1;
        frameId = window.requestAnimationFrame(tick);
        return;
      }

      setRenderableSectionTargets(targets.length > 0 ? targets : null);
    };

    tick();

    return () => {
      cancelled = true;
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, [isEnabled, sectionTargets]);

  return renderableSectionTargets;
}
