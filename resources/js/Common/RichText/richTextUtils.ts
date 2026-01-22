import type {
  EditorState,
  LexicalEditor,
  SerializedEditorState,
} from 'lexical';
import { $createParagraphNode, $createTextNode, $getRoot } from 'lexical';

export function parseRichTextValue(
  value: string | null | undefined,
): SerializedEditorState | null {
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(value);

    if (
      parsed &&
      typeof parsed === 'object' &&
      'root' in parsed &&
      typeof parsed.root === 'object'
    ) {
      return parsed as SerializedEditorState;
    }
  } catch {
    return null;
  }

  return null;
}

export function serializeRichTextState(editorState: EditorState): string {
  const textContent = editorState.read(() =>
    $getRoot().getTextContent().trim(),
  );

  if (textContent === '') {
    return '';
  }

  return JSON.stringify(editorState.toJSON());
}

export function applyRichTextValue(editor: LexicalEditor, value: string): void {
  const parsed = parseRichTextValue(value);

  if (parsed) {
    editor.setEditorState(editor.parseEditorState(parsed));
    return;
  }

  const trimmed = value.trim();
  editor.update(() => {
    const root = $getRoot();
    root.clear();
    const paragraph = $createParagraphNode();
    if (trimmed !== '') {
      paragraph.append($createTextNode(trimmed));
    }
    root.append(paragraph);
  });
}
