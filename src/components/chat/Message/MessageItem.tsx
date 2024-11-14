// MessageItem.tsx
import clsx from 'clsx';
import React from 'react';
import { IMessageItem } from '../../../interfaces/Message';
import moment from 'moment';
import { getAuthCookie } from '../../../actions/auth.action';
import FileInfo from './components/FileInfor';
import PlayButton from './components/PlayButton';
import ImagePreview from './components/ImagePreview';

const MessageItem: React.FC<IMessageItem> = ({
  message,
  setImageView,
  setVisible,
  showSenderInfo,
}) => {
  const userId = getAuthCookie()?.user.id || '';
  const isUserMessage = message.sender_id === userId;

  const handleClickMedia = (url: string) => {
    setImageView(url);
    setVisible(true);
  };

  const renderMediaContent = () => {
    const file = message.file_id;
    if (!file) return null;

    const { file_type, url_display, file_size, file_name } = file;

    if (file_type === 'IMAGE') {
      return url_display.includes('.svg') ? (
        <FileInfo
          url={url_display}
          fileSize={file_size}
          file_name={file_name}
        />
      ) : (
        <ImagePreview
          url={url_display}
          onClick={() => handleClickMedia(url_display)}
          file_name={file_name}
        />
      );
    }
    if (file_type === 'VIDEO') {
      return (
        <div
          className="relative w-full"
          onClick={() => handleClickMedia(url_display)}
        >
          <video
            src={url_display}
            className="md:max-w-full max-h-[350px] object-contain rounded"
          />
          <PlayButton />
        </div>
      );
    }
    if (file_type === 'FILE') {
      return (
        <FileInfo
          url={url_display}
          fileSize={file_size}
          file_name={file_name}
        />
      );
    }
  };

  return (
    <div
      className={`flex gap-[15px] ${
        isUserMessage ? 'justify-end' : 'justify-start'
      } my-[2.5px]`}
    >
      {!isUserMessage && (
        <img
          src="https://i.pravatar.cc/150?img=2"
          alt="avatar user"
          className={clsx('w-10 h-10 rounded-full', {
            'opacity-0': !showSenderInfo,
          })}
        />
      )}

      <div>
        {showSenderInfo && (
          <div
            className={clsx('flex items-center gap-xs mb-xxs', {
              'flex-row-reverse': isUserMessage,
            })}
          >
            <p>{isUserMessage ? 'Bạn' : 'Nguyễn Công Minh'}</p>
            <p className="text-[#00000080] text-[10px]">
              {moment(message.created_at).format('HH:mm')}
            </p>
          </div>
        )}

        {message.message_display && (
          <div
            className={`max-w-xs p-3 rounded-lg text-[#252525] ${
              isUserMessage ? 'bg-[#91CFFB80]' : 'bg-white'
            }`}
          >
            <p className="whitespace-pre-wrap break-words">
              {message.message_display}
            </p>
          </div>
        )}

        {renderMediaContent()}
      </div>
    </div>
  );
};

export default MessageItem;
