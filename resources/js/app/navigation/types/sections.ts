import type { NavigationSectionItem } from './item';

export type SectionPosition = {
  id: string;
  top: number;
};

export type SectionTargetNode = {
  identity: string;
  node: NavigationSectionItem;
};
