import React, { useRef, useState } from 'react';
import { Formik, Form } from 'formik';
import GalleryIcon from '../../assets/icons/gallery';
import PaperClipIcon from '../../assets/icons/paper-clip';
import SendIcon from '../../assets/icons/send';
import SmileIcon from '../../assets/icons/smile';
import clsx from 'clsx';

interface ChatInputProps {
  onSendMessage: (message: string, files?: File[]) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
  const [text, setText] = useState<string>('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [formHeight, setFormHeight] = useState<string>('24px'); // Initial form height

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length) {
      onSendMessage('', files);
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

  return (
    <Formik
      initialValues={{ message: '' }}
      onSubmit={(_, { resetForm }) => {
        if (text.trim()) {
          onSendMessage(text.trim());
          resetForm();
          setText('');
          setFormHeight('24px');
          textareaRef.current?.focus();
        }
      }}
    >
      {({ submitForm }) => (
        <Form
          className="mb-5 mx-lg min-h-[50px] max-h-[150px] input flex items-center gap-2 focus:outline-none focus-within:outline-none rounded-[30px] border-none shadow-sm drop-shadow-md"
          style={{ height: formHeight }}
        >
          <div className={clsx('flex items-center gap-2', { hidden: !!text })}>
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
              style={{ display: 'none' }}
              accept=".jpg, .jpeg, .png, .gif, .webp, .jxl"
              onChange={handleFileChange}
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
              style={{ display: 'none' }}
              accept="*"
              onChange={handleFileChange}
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
      )}
    </Formik>
  );
};

export default ChatInput;
