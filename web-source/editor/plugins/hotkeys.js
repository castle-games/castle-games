import { Block, Text } from 'slate';
import { isKeyHotkey } from 'is-hotkey';

const KEY_ENTER = 'Enter';

const isBoldHotkey = isKeyHotkey('mod+b');
const isItalicHotkey = isKeyHotkey('mod+i');
const isUnderlinedHotkey = isKeyHotkey('mod+u');
const isLinkHotkey = isKeyHotkey('mod+k');
const isStrikethroughHotkey = isKeyHotkey('mod+shift+x');
const isInlineCodeHotkey = isKeyHotkey('mod+ctrl+i');
const isTab = isKeyHotkey('tab');

const onEnter = (event, change) => {
  const { document, selection, schema, startBlock } = change.value;
  if (startBlock && schema.isVoid(startBlock) && selection.start.key === selection.end.key) {
    event.preventDefault();

    const nextBlock = document.getNextBlock(selection.start.key);
    const prevBlock = document.getPreviousBlock(selection.start.key);
    const isFocusedStart = selection.anchor.isAtStartOfNode;
    const isFocusedEnd = selection.anchor.isAtEndOfNode;
    const blockToInsert = Block.create({
      type: 'paragraph',
      nodes: [Text.create('')],
    });

    if (!nextBlock) {
      return change
        .moveToEndOfNode(startBlock)
        .insertBlock(blockToInsert)
        .moveToEnd();
    }

    if (nextBlock && prevBlock) {
      return change.moveToEndOfNode(startBlock).insertBlock(blockToInsert);
    }

    if (nextBlock && !prevBlock) {
      return change.moveToStartOfNode(startBlock).insertNodeByKey(document.key, 0, blockToInsert);
    }
  }
};

export default () => {
  return {
    onKeyDown(event, change, editor) {
      if (event.key === KEY_ENTER) {
        return onEnter(event, change);
      }

      if (isTab(event)) {
        event.preventDefault();
        return change.insertText('  ');
      }

      if (isBoldHotkey(event)) {
        event.preventDefault();
        return change.toggleMark('bold');
      }

      if (isItalicHotkey(event)) {
        event.preventDefault();
        return change.toggleMark('italic');
      }

      if (isUnderlinedHotkey(event)) {
        event.preventDefault();
        return change.toggleMark('underlined');
      }

      if (isStrikethroughHotkey(event)) {
        event.preventDefault();
        return change.toggleMark('strikethrough');
      }

      if (isInlineCodeHotkey(event)) {
        event.preventDefault();
        return change.toggleMark('code');
      }
    },
  };
};
