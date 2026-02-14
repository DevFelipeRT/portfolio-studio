export type NavigationConfigKind = 'link' | 'section' | 'group';

export type NavigationConfigBaseNode = {
  id: string;
  kind: NavigationConfigKind;
  translationKey: string;
  fallbackLabel: string;
  children?: NavigationConfigNode[];
};

export type NavigationConfigLinkNode = NavigationConfigBaseNode & {
  kind: 'link';
  routeName: string;
};

export type NavigationConfigSectionNode = NavigationConfigBaseNode & {
  kind: 'section';
  targetId?: string;
  scrollToTop?: boolean;
};

export type NavigationConfigGroupNode = NavigationConfigBaseNode & {
  kind: 'group';
};

export type NavigationConfigNode =
  | NavigationConfigLinkNode
  | NavigationConfigSectionNode
  | NavigationConfigGroupNode;
