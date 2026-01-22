import { cn } from '@/lib/utils';
import { TRANSFORMERS } from '@lexical/markdown';
import { AutoLinkPlugin } from '@lexical/react/LexicalAutoLinkPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import type { EditorState, LexicalEditor } from 'lexical';
import type { JSX } from 'react';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  defaultRichTextAutoLinkMatchers,
  defaultRichTextNodes,
  defaultRichTextTheme,
} from './richTextConfig';
import { RichTextExternalSync } from './RichTextSync';
import { applyRichTextValue, serializeRichTextState } from './richTextUtils';
import { RichTextToolbar } from './Toolbar/RichTextToolbar';

interface RichTextEditorProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  editorClassName?: string;
  toolbarClassName?: string;
  showToolbar?: boolean;
  editable?: boolean;
  namespace?: string;
}

export function RichTextEditor({
  id,
  value,
  onChange,
  placeholder = 'Start typing rich text content...',
  className,
  editorClassName,
  toolbarClassName,
  showToolbar = true,
  editable = true,
  namespace = 'CommonRichText',
}: RichTextEditorProps): JSX.Element {
  const lastEmittedValueRef = useRef(value);
  const editorId = useMemo(() => `${id}-lexical-editor`, [id]);

  const initialConfig = useMemo(() => {
    return {
      namespace,
      nodes: defaultRichTextNodes,
      theme: defaultRichTextTheme,
      editable,
      editorState: (editor: LexicalEditor) => {
        applyRichTextValue(editor, value);
      },
      onError: (error: Error) => {
        throw error;
      },
    };
  }, [editable, namespace, value]);

  const handleChange = useCallback(
    (editorState: EditorState) => {
      const serialized = serializeRichTextState(editorState);
      lastEmittedValueRef.current = serialized;
      onChange(serialized);
    },
    [onChange],
  );

  return (
    <div className={cn('space-y-3', className)}>
      <LexicalComposer key={editorId} initialConfig={initialConfig}>
        {showToolbar && <RichTextToolbar className={toolbarClassName} />}
        <div className="border-input bg-background focus-within:ring-ring relative rounded-md border px-3 py-2 shadow-sm focus-within:ring-1">
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                id={editorId}
                className={cn(
                  'min-h-[160px] text-sm leading-relaxed focus:outline-none',
                  editorClassName,
                )}
              />
            }
            placeholder={
              <div className="text-muted-foreground pointer-events-none absolute top-0 left-0 px-3 py-2 text-sm">
                {placeholder}
              </div>
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
        </div>
        <HistoryPlugin />
        <ListPlugin />
        <CheckListPlugin />
        <LinkPlugin />
        <AutoLinkPlugin matchers={defaultRichTextAutoLinkMatchers} />
        <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
        <OnChangePlugin onChange={handleChange} />
        <RichTextExternalSync
          value={value}
          lastEmittedValueRef={lastEmittedValueRef}
        />
        <EditableSync editable={editable} />
      </LexicalComposer>
    </div>
  );
}

interface EditableSyncProps {
  editable: boolean;
}

function EditableSync({ editable }: EditableSyncProps): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    editor.setEditable(editable);
  }, [editor, editable]);

  return null;
}
