import type {
  NavigationGroupItem,
  NavigationItem,
  NavigationLinkItem,
  NavigationSectionItem,
} from '../types';

export function isLinkItem(item: NavigationItem): item is NavigationLinkItem {
  return item.kind === 'link';
}

export function isSectionItem(
  item: NavigationItem,
): item is NavigationSectionItem {
  return item.kind === 'section';
}

export function isGroupItem(item: NavigationItem): item is NavigationGroupItem {
  return item.kind === 'group';
}
