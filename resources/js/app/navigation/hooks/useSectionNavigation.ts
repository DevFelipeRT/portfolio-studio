// resources/js/Navigation/hooks/useSectionNavigation.ts
import type { MouseEvent } from 'react';
import type { NavigationSectionItem } from '../types';
import { getHeaderHeight } from '../utils/dom';

type SetActiveSectionId = (value: string | null) => void;

export function useSectionNavigation(setActiveSectionId: SetActiveSectionId) {
  function handleSectionNavigate(
    event: MouseEvent<HTMLElement>,
    node: NavigationSectionItem,
    identity: string,
  ): void {
    event.preventDefault();

    if (typeof window === 'undefined') {
      return;
    }

    if (node.scrollToTop) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });

      window.history.replaceState(null, '', '#top');
      setActiveSectionId(identity);

      return;
    }

    if (!node.targetId) {
      return;
    }

    if (typeof document === 'undefined') {
      return;
    }

    const targetElement = document.getElementById(node.targetId);
    if (!targetElement) {
      return;
    }

    const headerHeight = getHeaderHeight();
    const rect = targetElement.getBoundingClientRect();
    const targetScrollTop = window.scrollY + rect.top - headerHeight;

    window.scrollTo({
      top: targetScrollTop,
      behavior: 'smooth',
    });

    window.history.replaceState(null, '', `#${node.targetId}`);
    setActiveSectionId(identity);
  }

  return { handleSectionNavigate };
}
