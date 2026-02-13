import type { LucideIcon } from 'lucide-react';

export type BlockType =
  | 'paragraph'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'quote'
  | 'code'
  | 'ul'
  | 'ol'
  | 'check';

export type ListType = 'ul' | 'ol' | 'check';
export type HistoryType = 'undo' | 'redo';

export interface ToggleItem<Value extends string = string> {
  value: Value;
  label: string;
  icon: LucideIcon;
}

export interface LinkToggleConfig {
  value: 'link';
  label: string;
  activeLabel: string;
  icon: LucideIcon;
  activeIcon: LucideIcon;
}

export interface RichTextToolbarProps {
  className?: string;
}
