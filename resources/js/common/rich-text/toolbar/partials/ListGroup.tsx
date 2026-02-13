import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
  INSERT_CHECK_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
} from '@lexical/list';
import type { LexicalEditor } from 'lexical';
import { List, ListChecks, ListOrdered } from 'lucide-react';
import type { JSX } from 'react';
import type { BlockType, ListType, ToggleItem } from '../types';
import { Separator } from '@/components/ui/separator';

const LIST_TOGGLE_ITEMS: ToggleItem<ListType>[] = [
  { value: 'ul', label: 'Bulleted', icon: List },
  { value: 'ol', label: 'Numbered', icon: ListOrdered },
  { value: 'check', label: 'Checklist', icon: ListChecks },
];

interface ListGroupProps {
  editor: LexicalEditor;
  blockType: BlockType;
}

export function ListGroup({ editor, blockType }: ListGroupProps): JSX.Element {
  const listToggleValue = (['ul', 'ol', 'check'] as const).includes(
    blockType as ListType,
  )
    ? (blockType as ListType)
    : '';

  const handleValueChange = (nextValue: string) => {
    const resolvedValue = nextValue as ListType | '';

    if (resolvedValue === '' || resolvedValue === blockType) {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
      return;
    }

    switch (resolvedValue) {
      case 'ul':
        editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
        break;
      case 'ol':
        editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
        break;
      case 'check':
        editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);
        break;
    }
  };

  return (
    <ToggleGroup
      type="single"
      value={listToggleValue}
      onValueChange={handleValueChange}
    >
      {LIST_TOGGLE_ITEMS.map((item) => {
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
