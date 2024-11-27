import React, { useEffect, useRef, useState } from 'react';
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
import { FileHandle } from '../../util/downloadFile';
import { v4 as uuidv4 } from 'uuid';
import EmojiPickerPopover from './EmojiPickerPopover';

interface ChatInputProps {
  onSendMessage: (
    message: string,
    reply_message_id?: string,
    files?: File[]
  ) => void;
  roomId: string;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, roomId }) => {
  const [text, setText] = useState<string>('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  const [formHeight, setFormHeight] = useState<number>(40);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const {
    messageReply,
    setMessageReply,
    isReplyMessage,
    setIsReplyMessage,
    textareaRef,
    setUploadProgress,
  } = useChatContext();

  const { uploadFileInChunks } = FileHandle();

  useEffect(() => {
    setText('');
  }, [roomId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    adjustTextareaHeight(e.target.value);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (!files || files.length === 0) return;

    for (const file of files) {
      try {
        const onProgress = (progress: number) => {
          setUploadProgress(progress);
        };

        await uploadFileInChunks(file, {
          fileId: uuidv4(),
          replyId: messageReply?.id || '',
          roomId: roomId,
          onProgress: onProgress,
        }); // Gọi hàm upload từng file
      } catch (error) {
        console.error(`Failed to upload file ${file.name}`, error);
        alert(`Error uploading file: ${file.name}`);
      }
    }
    e.target.value = ''; // Reset input sau khi tải lên
  };

  const adjustTextareaHeight = (message: string) => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const newHeight = Math.max(textareaRef.current.scrollHeight, 40);

      textareaRef.current.style.height = `${newHeight}px`;
      textareaRef.current.style.overflowY =
        newHeight > 140 ? 'scroll' : 'hidden';
      setFormHeight(newHeight);
    }

    if (!message.trim() && textareaRef.current) {
      textareaRef.current.style.height = `40px`;
      textareaRef.current.style.overflowY = 'hidden';
      setFormHeight(40);
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

  const getDateLabel = (created_at: string) => {
    const messageDate = moment(created_at, 'YYYY-MM-DD HH:mm');
    const today = moment();

    if (messageDate.isSame(today, 'day')) return 'Hôm nay';
    return messageDate.format('DD/MM/YYYY');
  };

  return (
    <Formik
      initialValues={{ message: '' }}
      onSubmit={(_, { resetForm }) => {
        if (text.trim()) {
          onSendMessage(text.trim(), messageReply?.id);
          resetForm();
          setText('');
          adjustTextareaHeight('');
          textareaRef.current?.focus();
        }
      }}
    >
      {({ submitForm }) => (
        <div className="join join-vertical mb-5 mx-lg shadow-sm drop-shadow-md gap-[1px]">
          {isReplyMessage && messageReply && (
            <div className="join-item bg-white px-6 py-5 grid grid-cols-[40px_1fr_auto] items-start border-b border-b-border">
              <div>
                <ReplyMessageIcon />
              </div>
              <div className="min-w-0">
                <p className="text-[#252525] text-base truncate">
                  {messageReply.message_display}
                </p>
                <p className="text-sm text-lightText truncate">
                  {messageReply.sender?.infor.full_name},
                  {` ${moment(messageReply.created_at).format(
                    'HH:mm'
                  )} ${getDateLabel(messageReply.created_at)}`}
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
            className={clsx(
              'min-h-[50px] max-h-[150px] input flex items-center focus:outline-none focus-within:outline-none rounded-[30px] border-none join-item',
              { 'transition-[height 0.2s ease-in-out]': true }
            )}
            style={{ height: `${formHeight}px` }}
          >
            <label className="sr-only">Nhập tin nhắn</label>

            <div className={clsx('flex items-center', { hidden: !!text })}>
              <button
                type="button"
                className="inline-flex justify-center p-2 text-gray-500  cursor-pointer"
                title="Gửi hình ảnh"
                onClick={() => document.getElementById('imageUpload')?.click()}
              >
                <GalleryIcon />

                <span className="sr-only">Upload image</span>
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
                className="p-2 text-gray-500 cursor-pointer"
              >
                <PaperClipIcon />
                <span className="sr-only">Add emoji</span>
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
              rows={1}
              autoFocus={true}
              onChange={handleInputChange}
              onKeyDown={(e) => handleKeyDown(e, submitForm)}
              ref={textareaRef}
              value={text}
              className="block resize-none p-2.5 w-full text-[#252525]  border-0 focus:ring-0 max-h-[140px] scrollbar rounded-s-[10px]"
              placeholder="Nhập tin nhắn"
            ></textarea>
            <div className="relative">
              <button
                type="button"
                title="Biểu cảm"
                onClick={() => setShowEmojiPicker((prev) => !prev)}
              >
                <SmileIcon />
              </button>
              {showEmojiPicker && (
                <div
                  ref={emojiPickerRef}
                  role="tooltip"
                  className="absolute bottom-full right-0"
                >
                  <EmojiPickerPopover setText={setText} />{' '}
                </div>
              )}
            </div>
            <button
              type="submit"
              title="Gửi"
              className="inline-flex justify-center p-2 text-blue-600  cursor-pointer ml-xs"
            >
              <SendIcon />
              <span className="sr-only">Send message</span>
            </button>
            {/* </div> */}
          </Form>
        </div>
      )}
    </Formik>
  );
};

export default ChatInput;
