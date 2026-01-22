import { Separator } from '@/Components/Ui/separator';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import type { JSX } from 'react';
import { BlockTypeGroup } from './partials/BlockTypeGroup';
import { FormatGroup } from './partials/FormatGroup';
import { HistoryGroup } from './partials/HistoryGroup';
import { LinkGroup } from './partials/LinkGroup';
import { ListGroup } from './partials/ListGroup';
import type { RichTextToolbarProps } from './types';
import { useToolbarState } from './useToolbarState';

/**
 * Rich text editor toolbar bound to a Lexical editor instance.
 */
export function RichTextToolbar({
  className,
}: RichTextToolbarProps): JSX.Element {
  const [editor] = useLexicalComposerContext();
  const {
    blockType,
    isBold,
    isItalic,
    isUnderline,
    isStrikethrough,
    isCode,
    isLink,
    canUndo,
    canRedo,
  } = useToolbarState(editor);

  const content = (
    <div className="flex flex-row flex-wrap h-fit">
      <BlockTypeGroup editor={editor} blockType={blockType} />
      <FormatGroup
        editor={editor}
        isBold={isBold}
        isItalic={isItalic}
        isUnderline={isUnderline}
        isStrikethrough={isStrikethrough}
        isCode={isCode}
      />
      <ListGroup editor={editor} blockType={blockType} />
      <LinkGroup editor={editor} isLink={isLink} />
      <HistoryGroup editor={editor} canUndo={canUndo} canRedo={canRedo} />
    </div>
  );

  return className ? <div className={className}>{content}</div> : content;
}
