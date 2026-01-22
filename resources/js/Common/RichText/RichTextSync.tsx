import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import type { JSX, MutableRefObject } from 'react';
import { useEffect } from 'react';
import { applyRichTextValue } from './richTextUtils';

interface RichTextExternalSyncProps {
  value: string;
  lastEmittedValueRef: MutableRefObject<string>;
}

export function RichTextExternalSync({
  value,
  lastEmittedValueRef,
}: RichTextExternalSyncProps): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (value === lastEmittedValueRef.current) {
      return;
    }

    lastEmittedValueRef.current = value;
    applyRichTextValue(editor, value);
  }, [editor, value, lastEmittedValueRef]);

  return null;
}
