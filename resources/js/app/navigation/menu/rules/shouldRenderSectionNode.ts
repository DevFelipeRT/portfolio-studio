import type { NavigationSectionItem } from '../../types';
import { isSectionItem } from '../../utils/guards';
import { shouldRenderSectionChild } from './shouldRenderSectionChild';

export function shouldRenderSectionNode(
  node: NavigationSectionItem,
  renderableSectionTargets: string[] | null,
): boolean {
  const hasChildren = !!node.children && node.children.length > 0;

  if (!hasChildren) {
    return shouldRenderSectionChild(node, renderableSectionTargets);
  }

  const children = node.children!.filter(isSectionItem);

  const hasRenderableChild = children.some((child) =>
    shouldRenderSectionChild(child, renderableSectionTargets),
  );

  if (node.scrollToTop || node.targetId) {
    if (node.scrollToTop) {
      return true;
    }

    if (!node.targetId) {
      return hasRenderableChild;
    }

    if (renderableSectionTargets === null) {
      return true;
    }

    return renderableSectionTargets.includes(node.targetId);
  }

  return hasRenderableChild;
}
