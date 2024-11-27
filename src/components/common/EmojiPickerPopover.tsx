import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import React, { Dispatch, SetStateAction, useState } from 'react';

interface Props {
  setText: Dispatch<SetStateAction<string>>;
}

function EmojiPickerPopover({ setText }: Props) {
  const onEmojiClick = (emojiData: EmojiClickData, _: MouseEvent) => {
    setText((prevText) => prevText + emojiData.emoji);
  };

  return (
    <EmojiPicker
      onEmojiClick={onEmojiClick}
      searchPlaceholder="Tìm kiếm emoji"
      skinTonesDisabled={true}
      allowExpandReactions={false}
      previewConfig={{ showPreview: false }}
    />
  );
}

export default EmojiPickerPopover;
