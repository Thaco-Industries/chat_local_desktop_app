import React, { useRef, useState } from 'react';
import { Formik, Form } from 'formik';
import GalleryIcon from '../../assets/icons/gallery';
import PaperClipIcon from '../../assets/icons/paper-clip';
import SendIcon from '../../assets/icons/send';
import SmileIcon from '../../assets/icons/smile';
import clsx from 'clsx';
import { ReplyMessageIcon } from '../../assets/icons/reply-icon';
import CloseIcon from '../../assets/icons/close-icon';
import { useChatContext } from '../../context/ChatContext';
import moment from 'moment';
import { getDateLabel } from '../../util/getDateLabel';

interface ChatInputProps {
  onSendMessage: (
    message: string,
    reply_message_id?: string,
    files?: File[]
  ) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
  const [text, setText] = useState<string>('');

  const [formHeight, setFormHeight] = useState<string>('24px');
  const {
    messageReply,
    setMessageReply,
    isReplyMessage,
    setIsReplyMessage,
    textareaRef,
  } = useChatContext();

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length) {
      onSendMessage('', '', files);
      e.target.value = '';
    }
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const newHeight = `${textareaRef.current.scrollHeight}px`;
      textareaRef.current.style.height = newHeight;
      setFormHeight(newHeight);
    }
    if (!text.trim()) {
      setFormHeight('24px');
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>,
    submitForm: () => void
  ) => {
    if (e.key === 'Enter') {
      if (!e.shiftKey && !e.altKey) {
        e.preventDefault();
        if (text.trim()) {
          submitForm();
        }
      }
    }
  };

  const handleCancelReply = () => {
    setIsReplyMessage(false);
    setMessageReply(null);
  };

  return (
    <Formik
      initialValues={{ message: '' }}
      onSubmit={(_, { resetForm }) => {
        if (text.trim()) {
          onSendMessage(text.trim(), messageReply?.id);
          resetForm();
          setText('');
          setFormHeight('24px');
          textareaRef.current?.focus();
        }
      }}
    >
      {({ submitForm }) => (
        <div className="join join-vertical mb-5 mx-lg shadow-sm drop-shadow-md">
          {isReplyMessage && messageReply && (
            <div className="join-item bg-white px-6 py-5 flex gap-4">
              <div className="">
                <ReplyMessageIcon />
              </div>
              <div className="flex-grow flex flex-col gap-xs">
                <p className="text-[#252525] text-base">
                  {messageReply.message_display}
                </p>
                <p className="text-sm text-lightText">
                  {messageReply.sender?.infor.full_name},
                  {` ${getDateLabel(messageReply.created_at)} ${moment(
                    messageReply.created_at
                  ).format('hh:mm A')}`}
                </p>
              </div>
              <div
                className="cursor-pointer"
                title="Đóng"
                onClick={handleCancelReply}
              >
                <CloseIcon />
              </div>
            </div>
          )}
          <Form
            className=" min-h-[50px] max-h-[150px] input flex items-center gap-sm focus:outline-none focus-within:outline-none rounded-[30px] border-none join-item"
            style={{ height: formHeight }}
          >
            <div
              className={clsx('flex items-center gap-xs', { hidden: !!text })}
            >
              <button
                type="button"
                title="Gửi hình ảnh"
                onClick={() => document.getElementById('imageUpload')?.click()}
              >
                <GalleryIcon />
              </button>
              <input
                type="file"
                id="imageUpload"
                multiple
                className="hidden"
                accept=".jpg, .jpeg, .png, .gif, .webp, .jxl"
                onChange={handleFileChange}
                title="gửi ảnh"
              />
              <button
                type="button"
                title="Đính kèm file"
                onClick={() => document.getElementById('fileUpload')?.click()}
              >
                <PaperClipIcon />
              </button>
              <input
                type="file"
                id="fileUpload"
                multiple
                className="hidden"
                accept="*"
                onChange={handleFileChange}
                title="gửi file"
              />
            </div>

            <textarea
              name="message"
              autoFocus={true}
              onChange={handleInputChange}
              onKeyDown={(e) => handleKeyDown(e, submitForm)}
              onInput={adjustTextareaHeight}
              value={text}
              placeholder="Nhập tin nhắn"
              className="grow resize-none overflow-y-auto break-words focus:outline-none max-h-[140px] scrollbar"
              ref={textareaRef}
              rows={1}
              style={{ height: formHeight }}
            />
            <button type="button" title="Biểu cảm">
              <SmileIcon />
            </button>
            <button type="submit" title="Gửi" className="ml-xs">
              <SendIcon />
            </button>
          </Form>
        </div>
      )}
    </Formik>
  );
};

export default ChatInput;
