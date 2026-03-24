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

export function extractRichTextPlainText(
  value: string | null | undefined,
): string {
  const trimmed = value?.trim() ?? '';

  if (trimmed === '') {
    return '';
  }

  const parsed = parseRichTextValue(trimmed);

  if (!parsed) {
    return trimmed;
  }

  const children = parsed.root.children ?? [];
  const text = joinSerializedNodeText(children, 'root');

  return text.trim();
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

function collectRichTextNodeText(
  node: SerializedEditorState['root']['children'][number],
): string {
  if ('text' in node && typeof node.text === 'string') {
    return node.text;
  }

  const children = 'children' in node ? node.children : null;

  if (!Array.isArray(children)) {
    return '';
  }

  return joinSerializedNodeText(children, node.type);
}

function joinSerializedNodeText(
  children: SerializedEditorState['root']['children'],
  parentType: string,
): string {
  const separator =
    parentType === 'root' || parentType === 'list' || parentType === 'listitem'
      ? '\n'
      : '';

  return children
    .map((child) => collectRichTextNodeText(child))
    .filter((part) => part.trim() !== '')
    .join(separator)
    .replace(/\n{3,}/g, '\n\n');
}
