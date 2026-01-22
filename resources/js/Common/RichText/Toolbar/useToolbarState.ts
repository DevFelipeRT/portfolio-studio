import { $isCodeNode } from '@lexical/code';
import { $isLinkNode } from '@lexical/link';
import { ListNode } from '@lexical/list';
import { $isHeadingNode, $isQuoteNode } from '@lexical/rich-text';
import { $getNearestNodeOfType, mergeRegister } from '@lexical/utils';
import type { LexicalEditor } from 'lexical';
import {
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
} from 'lexical';
import { useCallback, useEffect, useState } from 'react';
import type { BlockType } from './types';

interface ToolbarState {
  blockType: BlockType;
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  isStrikethrough: boolean;
  isCode: boolean;
  isLink: boolean;
  canUndo: boolean;
  canRedo: boolean;
}

export function useToolbarState(editor: LexicalEditor): ToolbarState {
  const [blockType, setBlockType] = useState<BlockType>('paragraph');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const [isLink, setIsLink] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) {
      return;
    }

    setIsBold(selection.hasFormat('bold'));
    setIsItalic(selection.hasFormat('italic'));
    setIsUnderline(selection.hasFormat('underline'));
    setIsStrikethrough(selection.hasFormat('strikethrough'));
    setIsCode(selection.hasFormat('code'));

    const anchorNode = selection.anchor.getNode();
    const topLevelElement = anchorNode.getTopLevelElementOrThrow();
    const listNode = $getNearestNodeOfType(anchorNode, ListNode);

    if (listNode) {
      const listType = listNode.getListType();
      setBlockType(
        listType === 'bullet' ? 'ul' : listType === 'number' ? 'ol' : 'check',
      );
    } else if ($isHeadingNode(topLevelElement)) {
      setBlockType(topLevelElement.getTag() as BlockType);
    } else if ($isQuoteNode(topLevelElement)) {
      setBlockType('quote');
    } else if ($isCodeNode(topLevelElement)) {
      setBlockType('code');
    } else {
      setBlockType('paragraph');
    }

    const parentNode = anchorNode.getParent();
    const hasLink =
      $isLinkNode(anchorNode) ||
      (parentNode !== null && $isLinkNode(parentNode));
    setIsLink(hasLink);
  }, []);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL,
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL,
      ),
    );
  }, [editor, updateToolbar]);

  return {
    blockType,
    isBold,
    isItalic,
    isUnderline,
    isStrikethrough,
    isCode,
    isLink,
    canUndo,
    canRedo,
  };
}
