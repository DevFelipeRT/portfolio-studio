// resources/js/Navigation/index.ts
export { default as Navigation } from './Navigation';

export type {
  NavigationConfigBaseNode,
  NavigationConfigGroupNode,
  NavigationConfigKind,
  NavigationConfigLinkNode,
  NavigationConfigNode,
  NavigationConfigSectionNode,
} from './configTypes';
export type {
  AuthUser,
  NavigationGroupItem,
  NavigationItem,
  NavigationLinkItem,
  NavigationProps,
  NavigationSectionItem,
  SectionPosition,
  SectionTargetNode,
} from './types';

export { createNavigationTree } from './tree';
