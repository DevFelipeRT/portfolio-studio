// resources/js/app/navigation/index.ts
export { default as Navigation } from './Navigation';

export type {
  AuthUser,
  NavigationConfigBaseNode,
  NavigationConfigGroupNode,
  NavigationConfigKind,
  NavigationConfigLinkNode,
  NavigationConfigNode,
  NavigationConfigSectionNode,
  NavigationGroupItem,
  NavigationItem,
  NavigationLinkItem,
  NavigationSectionItem,
  SectionPosition,
  SectionTargetNode,
} from './types';

export { createNavigationTree } from './navigationTree';
export { useNavigationSheet } from './useNavigationSheet';
