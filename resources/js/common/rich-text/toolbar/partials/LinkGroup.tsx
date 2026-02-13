import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { TOGGLE_LINK_COMMAND } from '@lexical/link';
import type { LexicalEditor } from 'lexical';
import { Link2, Unlink2 } from 'lucide-react';
import type { JSX } from 'react';
import type { LinkToggleConfig } from '../types';
import { Separator } from '@/components/ui/separator';

const LINK_TOGGLE: LinkToggleConfig = {
  value: 'link',
  label: 'Link',
  activeLabel: 'Unlink',
  icon: Link2,
  activeIcon: Unlink2,
};

interface LinkGroupProps {
  editor: LexicalEditor;
  isLink: boolean;
}

export function LinkGroup({ editor, isLink }: LinkGroupProps): JSX.Element {
  const Icon = isLink ? LINK_TOGGLE.activeIcon : LINK_TOGGLE.icon;
  const label = isLink ? LINK_TOGGLE.activeLabel : LINK_TOGGLE.label;

  const toggleLink = () => {
    if (isLink) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
      return;
    }

    const url = window.prompt('Enter a URL');
    if (!url) {
      return;
    }

    editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
  };

  const handleValueChange = (nextValue: string) => {
    if (!isLink && nextValue === LINK_TOGGLE.value) {
      toggleLink();
      return;
    }

    if (isLink && nextValue === '') {
      toggleLink();
    }
  };

  return (
    <ToggleGroup
      type="single"
      value={isLink ? LINK_TOGGLE.value : ''}
      onValueChange={handleValueChange}
    >
      <ToggleGroupItem value={LINK_TOGGLE.value} aria-label={LINK_TOGGLE.label}>
        <span className="inline-flex items-center gap-1 flex-nowrap text-nowrap">
          <Icon className="h-4 w-4" />
          <span className="hidden sm:inline">{label}</span>
        </span>
      </ToggleGroupItem>
      <Separator orientation="vertical" className="mx-1 h-8" />
    </ToggleGroup>
  );
}
