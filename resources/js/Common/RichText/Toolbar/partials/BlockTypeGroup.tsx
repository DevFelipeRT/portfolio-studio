import { ToggleGroup, ToggleGroupItem } from '@/Components/Ui/toggle-group';
import { $createCodeNode } from '@lexical/code';
import { $createHeadingNode, $createQuoteNode } from '@lexical/rich-text';
import { $setBlocksType } from '@lexical/selection';
import type { LexicalEditor } from 'lexical';
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
} from 'lexical';
import {
  Code,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Pilcrow,
  Quote,
} from 'lucide-react';
import type { JSX } from 'react';
import type { BlockType, ToggleItem } from '../types';
import { Separator } from '@/Components/Ui/separator';

const BLOCK_TYPE_OPTIONS: ToggleItem<
  Exclude<BlockType, 'ul' | 'ol' | 'check'>
>[] = [
  { value: 'paragraph', label: 'Paragraph', icon: Pilcrow },
  { value: 'h1', label: 'Heading 1', icon: Heading1 },
  { value: 'h2', label: 'Heading 2', icon: Heading2 },
  { value: 'h3', label: 'Heading 3', icon: Heading3 },
  { value: 'h4', label: 'Heading 4', icon: Heading4 },
  { value: 'quote', label: 'Quote', icon: Quote },
  { value: 'code', label: 'Code block', icon: Code },
];

interface BlockTypeGroupProps {
  editor: LexicalEditor;
  blockType: BlockType;
}

export function BlockTypeGroup({
  editor,
  blockType,
}: BlockTypeGroupProps): JSX.Element {
  const blockToggleValue = BLOCK_TYPE_OPTIONS.some(
    (option) => option.value === blockType,
  )
    ? (blockType as Exclude<BlockType, 'ul' | 'ol' | 'check'>)
    : 'paragraph';

  const handleValueChange = (nextValue: string) => {
    const resolvedValue = (nextValue || 'paragraph') as Exclude<
      BlockType,
      'ul' | 'ol' | 'check'
    >;

    editor.update(() => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) {
        return;
      }

      switch (resolvedValue) {
        case 'paragraph':
          $setBlocksType(selection, () => $createParagraphNode());
          break;
        case 'quote':
          $setBlocksType(selection, () => $createQuoteNode());
          break;
        case 'code':
          $setBlocksType(selection, () => $createCodeNode());
          break;
        case 'h1':
        case 'h2':
        case 'h3':
        case 'h4':
          $setBlocksType(selection, () => $createHeadingNode(resolvedValue));
          break;
      }
    });
  };

  return (
    <ToggleGroup
      type="single"
      value={blockToggleValue}
      onValueChange={handleValueChange}
    >
      {BLOCK_TYPE_OPTIONS.map((item) => {
        const Icon = item.icon;

        return (
          <ToggleGroupItem
            key={item.value}
            value={item.value}
            aria-label={item.label}
          >
            <span className="inline-flex items-center gap-1 flex-nowrap text-nowrap">
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{item.label}</span>
            </span>
          </ToggleGroupItem>
        );
      })}
      <Separator orientation="vertical" className="mx-1 h-8" />
    </ToggleGroup>
  );
}
