import clsx from 'clsx';
import { Spinner } from 'flowbite-react';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import PlayButton from './PlayButton';
import DownloadButton from './DownloadButton';
import FileInfo from './FileInfor';
import ImagePreview from './ImagePreview';
import { IMessage } from '../../../../interfaces';
import ActionButton from './ActionButton';
import { useChatContext } from '../../../../context/ChatContext';

type Props = {
  message: IMessage;
  isUserMessage: boolean;
  handleClickMedia: (url: string) => void;
  handleReplyMessage: (message: IMessage) => void;
  handleRecallMessage: (messageId: string) => void;
};

const MediaMessage: React.FC<Props> = ({
  message,
  handleClickMedia,
  isUserMessage,
  handleReplyMessage,
  handleRecallMessage,
}) => {
  const { uploadProgress } = useChatContext();
  const [showMessageOption, setShowMessageOption] = useState(false);

  const { file_id } = message;

  if (!file_id) return null;

  const { file_name, file_size, url_display, thumbnail_url_display } = file_id;

  const fileExtension = file_name.split('.').pop()?.toLocaleLowerCase();
  const isVideo = ['mp4', 'mov', 'avi', 'mkv'].includes(fileExtension || '');
  const isImage = ['png', 'jpg', 'jpeg', 'gif', 'svf'].includes(
    fileExtension || ''
  );

  const urlFile = `${process.env.REACT_APP_API_URL}/media/view/${url_display}`;

  const urlVideoThumbnail = `${process.env.REACT_APP_API_URL}/media/view/${thumbnail_url_display}`;

  if (uploadProgress < 100 && message.status === 'DELIVERED' && isUserMessage) {
    return (
      <div className="flex justify-end">
        {isVideo || isVideo ? (
          <div className="relative w-[350px] h-[350px] bg-white rounded overflow-hidden flex items-center justify-center">
            {/* Hình ảnh full nằm dưới spinner */}
            <img
              src={`${process.env.REACT_APP_API_URL}/media/view/${message.file_id?.thumbnail_url_display}`}
              className="absolute inset-0 w-full h-full object-contain"
              alt="uploading file"
            />
            {/* Spinner hiển thị ở giữa */}
            <Spinner size="xl" className="relative z-10" />
          </div>
        ) : (
          <div className="relative w-[350px] h-[70px] bg-white rounded overflow-hidden flex items-center justify-center">
            <Spinner size="xl" className="relative z-10" />
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={clsx('relative flex flex-row gap-3', {
        'flex-row-reverse gap-8': isUserMessage,
      })}
      onMouseEnter={() => setShowMessageOption(true)}
      onMouseLeave={() => setShowMessageOption(false)}
    >
      {isVideo ? (
        <div
          className={clsx('flex', {
            'justify-end': isUserMessage,
          })}
          onClick={() => handleClickMedia(urlFile)}
        >
          <div className="relative">
            <img
              src={urlVideoThumbnail}
              className="max-w-[220px] lg:max-w-[350px] max-h-[350px] object-contain rounded"
              alt="video thumbnail"
            />
            <PlayButton />
            <DownloadButton url={urlFile} file_name={file_name} />
          </div>
        </div>
      ) : isImage ? (
        url_display.includes('.svg') ? (
          <FileInfo url={urlFile} fileSize={file_size} file_name={file_name} />
        ) : (
          <ImagePreview
            url={urlFile}
            onClick={() => handleClickMedia(urlFile)}
            file_name={file_name}
            isUserMessage={isUserMessage}
          />
        )
      ) : (
        <div
          className={clsx('flex items-center', {
            'justify-end': isUserMessage,
          })}
        >
          <FileInfo url={urlFile} fileSize={file_size} file_name={file_name} />
        </div>
      )}

      {message.message_type !== 'RECALLED' && (
        <ActionButton
          handleRecallMessage={handleRecallMessage}
          handleReplyMessage={handleReplyMessage}
          message={message}
          showMessageOption={showMessageOption}
          isUserMessage={isUserMessage}
        />
      )}
    </div>
  );
};

export default MediaMessage;
