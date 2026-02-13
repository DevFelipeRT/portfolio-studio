import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import type { LexicalEditor, TextFormatType } from 'lexical';
import { FORMAT_TEXT_COMMAND } from 'lexical';
import { Bold, Code, Italic, Strikethrough, Underline } from 'lucide-react';
import type { JSX } from 'react';
import type { ToggleItem } from '../types';
import { Separator } from '@/components/ui/separator';

const FORMAT_TOGGLE_ITEMS: ToggleItem<TextFormatType>[] = [
  { value: 'bold', label: 'Bold', icon: Bold },
  { value: 'italic', label: 'Italic', icon: Italic },
  { value: 'underline', label: 'Underline', icon: Underline },
  { value: 'strikethrough', label: 'Strike', icon: Strikethrough },
  { value: 'code', label: 'Code', icon: Code },
];

interface FormatGroupProps {
  editor: LexicalEditor;
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  isStrikethrough: boolean;
  isCode: boolean;
}

export function FormatGroup({
  editor,
  isBold,
  isItalic,
  isUnderline,
  isStrikethrough,
  isCode,
}: FormatGroupProps): JSX.Element {
  const formatState: Partial<Record<TextFormatType, boolean>> = {
    bold: isBold,
    italic: isItalic,
    underline: isUnderline,
    strikethrough: isStrikethrough,
    code: isCode,
  };

  const formatValues = FORMAT_TOGGLE_ITEMS.filter((item) =>
    Boolean(formatState[item.value]),
  ).map((item) => item.value);

  const handleValueChange = (nextValues: string[]) => {
    const next = new Set(nextValues);
    const current = new Set(formatValues);

    FORMAT_TOGGLE_ITEMS.forEach((item) => {
      if (next.has(item.value) === current.has(item.value)) {
        return;
      }
      editor.dispatchCommand(FORMAT_TEXT_COMMAND, item.value);
    });
  };

  return (
    <ToggleGroup
      type="multiple"
      value={formatValues}
      onValueChange={handleValueChange}
    >
      {FORMAT_TOGGLE_ITEMS.map((item) => {
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
