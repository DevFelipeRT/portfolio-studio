import { cn } from '@/lib/utils';
import { AutoLinkPlugin } from '@lexical/react/LexicalAutoLinkPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import type { LexicalEditor } from 'lexical';
import type { JSX } from 'react';
import { useEffect, useMemo, useRef } from 'react';
import {
  defaultRichTextAutoLinkMatchers,
  defaultRichTextNodes,
  defaultRichTextTheme,
} from './richTextConfig';
import { applyRichTextValue, parseRichTextValue } from './richTextUtils';

interface RichTextRendererProps {
  value: string;
  className?: string;
  fallbackClassName?: string;
  namespace?: string;
}

export function RichTextRenderer({
  value,
  className,
  fallbackClassName,
  namespace = 'CommonRichTextReadOnly',
}: RichTextRendererProps): JSX.Element | null {
  const parsed = useMemo(() => parseRichTextValue(value), [value]);

  if (!value || value.trim() === '') {
    return null;
  }

  if (!parsed) {
    return (
      <div
        className={cn(
          'text-muted-foreground text-base leading-relaxed whitespace-pre-line',
          fallbackClassName ?? className,
        )}
      >
        {value}
      </div>
    );
  }

  const initialConfig = {
    namespace,
    nodes: defaultRichTextNodes,
    theme: defaultRichTextTheme,
    editable: false,
    editorState: (editor: LexicalEditor) => {
      editor.setEditorState(editor.parseEditorState(parsed));
    },
    onError: (error: Error) => {
      throw error;
    },
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <RichTextPlugin
        contentEditable={
          <ContentEditable
            className={cn(
              'text-muted-foreground text-base leading-relaxed focus:outline-none',
              className,
            )}
          />
        }
        placeholder={null}
        ErrorBoundary={LexicalErrorBoundary}
      />
      <ListPlugin />
      <LinkPlugin />
      <AutoLinkPlugin matchers={defaultRichTextAutoLinkMatchers} />
      <RichTextRendererSync value={value} />
    </LexicalComposer>
  );
}

interface RichTextRendererSyncProps {
  value: string;
}

function RichTextRendererSync({
  value,
}: RichTextRendererSyncProps): JSX.Element | null {
  const [editor] = useLexicalComposerContext();
  const lastAppliedValueRef = useRef(value);

  useEffect(() => {
    if (value === lastAppliedValueRef.current) {
      return;
    }

    lastAppliedValueRef.current = value;
    applyRichTextValue(editor, value);
  }, [editor, value]);

  return null;
}
