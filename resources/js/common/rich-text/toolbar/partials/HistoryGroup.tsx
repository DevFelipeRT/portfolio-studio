import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import type { LexicalEditor } from 'lexical';
import { REDO_COMMAND, UNDO_COMMAND } from 'lexical';
import { Redo2, Undo2 } from 'lucide-react';
import type { JSX } from 'react';
import { useState } from 'react';
import type { HistoryType, ToggleItem } from '../types';
import { Separator } from '@/components/ui/separator';

const HISTORY_TOGGLE_ITEMS: ToggleItem<HistoryType>[] = [
  { value: 'undo', label: 'Undo', icon: Undo2 },
  { value: 'redo', label: 'Redo', icon: Redo2 },
];

interface HistoryGroupProps {
  editor: LexicalEditor;
  canUndo: boolean;
  canRedo: boolean;
}

export function HistoryGroup({
  editor,
  canUndo,
  canRedo,
}: HistoryGroupProps): JSX.Element {
  const [value, setValue] = useState<HistoryType | ''>('');

  const handleValueChange = (nextValue: string) => {
    const resolvedValue = nextValue as HistoryType | '';
    if (!resolvedValue) {
      return;
    }

    setValue('');
    editor.dispatchCommand(
      resolvedValue === 'undo' ? UNDO_COMMAND : REDO_COMMAND,
      undefined,
    );
  };

  return (
    <ToggleGroup 
      type="single"
      value={value}
      onValueChange={handleValueChange}
    >
      {HISTORY_TOGGLE_ITEMS.map((item) => {
        const Icon = item.icon;
        const disabled = item.value === 'undo' ? !canUndo : !canRedo;

        return (
          <ToggleGroupItem
            key={item.value}
            value={item.value}
            aria-label={item.label}
            disabled={disabled}
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
