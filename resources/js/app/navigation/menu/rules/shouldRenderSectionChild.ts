import type { NavigationSectionItem } from '../../types';

export function shouldRenderSectionChild(
  node: NavigationSectionItem,
  renderableSectionTargets: string[] | null,
): boolean {
  if (node.scrollToTop) {
    return true;
  }

  if (!node.targetId) {
    return false;
  }

  if (renderableSectionTargets === null) {
    return true;
  }

  return renderableSectionTargets.includes(node.targetId);
}
