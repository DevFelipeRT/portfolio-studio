import type { NavigationGroupItem, NavigationItem } from './types';

export interface NavigationTree {
  items: NavigationItem[];
  appendItem: (node: NavigationItem) => void;
  appendItemToGroup: (groupLabel: string, node: NavigationItem) => void;
}

/**
 * Builds a stable identifier for a navigation group node from its label.
 */
function groupIdFromLabel(label: string): string {
  const safe = label
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');

  return `group-${safe || 'default'}`;
}

/**
 * Builds the canonical key used to deduplicate navigation groups by label.
 */
function groupKeyFromLabel(groupLabel: string): string {
  return groupLabel.trim().toLowerCase();
}

/**
 * Creates the navigation group node for a label.
 */
function createGroupNode(groupLabel: string): NavigationGroupItem {
  return {
    id: groupIdFromLabel(groupLabel),
    label: groupLabel,
    kind: 'group',
    children: [],
  };
}

function getOrCreateGroupNode(
  items: NavigationItem[],
  groupByKey: Map<string, NavigationGroupItem>,
  groupLabel: string,
): NavigationGroupItem {
  const groupKey = groupKeyFromLabel(groupLabel);
  const existing = groupByKey.get(groupKey);

  if (existing) {
    return existing;
  }

  const groupNode = createGroupNode(groupLabel);
  groupByKey.set(groupKey, groupNode);
  items.push(groupNode);

  return groupNode;
}

/**
 * Creates a navigation tree used while building the navigation structure.
 */
export function createNavigationTree(): NavigationTree {
  const items: NavigationItem[] = [];
  const groupByKey = new Map<string, NavigationGroupItem>();

  return {
    items,
    appendItem: (node) => {
      items.push(node);
    },
    appendItemToGroup: (groupLabel, node) => {
      const groupNode = getOrCreateGroupNode(items, groupByKey, groupLabel);
      const children = groupNode.children ?? (groupNode.children = []);
      children.push(node);
    },
  };
}
