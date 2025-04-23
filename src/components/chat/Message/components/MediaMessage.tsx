import clsx from 'clsx';
import { Spinner } from 'flowbite-react';
import React, { useState } from 'react';
import PlayButton from './PlayButton';
import DownloadButton from './DownloadButton';
import FileInfo from './FileInfor';
import ImagePreview from './ImagePreview';
import { IMessage } from '../../../../interfaces';
import ActionButton from './ActionButton';
import GallerySlash from '../../../../assets/icons/gallery-slash';
import VideoSlash from '../../../../assets/icons/video-slash';
import _ from 'lodash';

type Props = {
  message: IMessage;
  isUserMessage: boolean;
  handleClickMedia: (url: string, isVideo: boolean) => void;
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
  const [showMessageOption, setShowMessageOption] = useState(false);

  const { file_id } = message;
  if (!file_id) return null;

  const { file_name, file_size, url_display, thumbnail_url_display } = file_id;

  const fileExtension = file_name.split('.').pop()?.toLocaleLowerCase();
  const isVideo = ['mp4', 'mov', 'avi', 'mkv'].includes(fileExtension || '');
  const isImage = ['png', 'jpg', 'jpeg', 'gif', 'svf'].includes(
    fileExtension || ''
  );

  const urlFile = `${process.env.REACT_APP_FILE_URL}${url_display}`;
  const urlVideoThumbnail = `${process.env.REACT_APP_API_URL}/media/view/${thumbnail_url_display}`;

  const renderSpinner = () => {
    console.log('abc');

    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-white bg-opacity-80 rounded-lg">
        <div className="w-48 mt-4">
          <div className="h-2 bg-gray-300 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${message.progress || 0}%` }}
            />
          </div>
          <div className="mt-2 text-center text-sm text-gray-700">
            {message.progress || 0}%
          </div>
        </div>
      </div>
    );
  };

  const renderPlaceholder = () => (
    <div className="relative w-[220px] lg:w-[350px] h-[100px] bg-white rounded overflow-hidden flex items-center justify-center">
      {renderSpinner()}
    </div>
  );

  const renderFileSize = (size?: string) => {
    if (!size) return '';
    const mbSize = Number(size) / 1024 / 1024;
    return mbSize < 1
      ? `${(mbSize * 1024).toFixed(3)} KB`
      : `${mbSize.toFixed(3)} MB`;
  };

  if (message.status === 'DELIVERED' && isUserMessage) {
    return (
      <div className="flex justify-end">
        {isVideo || isImage ? (
          _.isEmpty(thumbnail_url_display) ? (
            renderPlaceholder()
          ) : (
            <div className="relative max-w-[220px] lg:max-w-[350px] max-h-[350px] bg-white rounded overflow-hidden">
              <img
                src={thumbnail_url_display}
                className="w-full h-full object-contain rounded"
                alt="uploading file"
              />
              {renderSpinner()}
            </div>
          )
        ) : (
          <div className="border rounded-lg bg-[#91CFFB80] p-xs relative max-w-[220px] lg:max-w-[350px]">
            <div className="flex justify-between gap-3">
              <p className="text-sm text-title truncate lg:max-w-[220px]">
                {file_name.split('.').slice(0, -1).join('.')}
              </p>
              <span>.{fileExtension}</span>
            </div>
            <div className="flex gap-3">
              <p className="text-sm text-lightText">
                {renderFileSize(file_size)}
              </p>
              <Spinner size="xl" />
              <div className="mt-2 text-center text-sm text-gray-700 pe-10">
                {message.progress || 0}%
              </div>
            </div>
            <DownloadButton url={url_display} file_name={file_name} />
          </div>
        )}
      </div>
    );
  }

  const renderDeletedMessage = (message: string, Icon: React.FC) => (
    <div className="max-w-[220px] lg:max-w-[350px] h-[97px] flex flex-col justify-center items-center bg-white rounded-[10px] shadow">
      <div className="text-lightText">{message}</div>
      <Icon />
    </div>
  );

  return (
    <div
      className={clsx('relative flex flex-row gap-3', {
        'flex-row-reverse gap-8': isUserMessage,
      })}
      onMouseEnter={() => setShowMessageOption(true)}
      onMouseLeave={() => setShowMessageOption(false)}
    >
      {isVideo ? (
        file_id.system_deleted ? (
          renderDeletedMessage('Video đã bị xóa', VideoSlash)
        ) : (
          <div
            className="relative"
            onClick={() => handleClickMedia(urlFile, isVideo)}
          >
            <img
              src={urlVideoThumbnail}
              className="max-w-[220px] lg:max-w-[350px] max-h-[350px] object-contain rounded"
              alt="video thumbnail"
            />
            <PlayButton />
            <DownloadButton url={urlFile} file_name={file_name} />
          </div>
        )
      ) : isImage ? (
        url_display.includes('.svg') ? (
          <FileInfo
            {...{
              url: urlFile,
              fileSize: file_size,
              file_name,
              isUserMessage,
              isDelete: file_id.system_deleted,
            }}
          />
        ) : file_id.system_deleted ? (
          renderDeletedMessage('Ảnh đã bị xóa', GallerySlash)
        ) : (
          <ImagePreview
            url={urlFile}
            onClick={() => handleClickMedia(urlFile, isVideo)}
            file_name={file_name}
            isUserMessage={isUserMessage}
          />
        )
      ) : (
        <FileInfo
          {...{
            url: urlFile,
            fileSize: file_size,
            file_name,
            isUserMessage,
            isDelete: file_id.system_deleted,
          }}
        />
      )}

      {!message.file_id?.system_deleted &&
        message.message_type !== 'RECALLED' && (
          <ActionButton
            {...{
              handleRecallMessage,
              handleReplyMessage,
              message,
              showMessageOption,
              isUserMessage,
            }}
          />
        )}
    </div>
  );
};

export default MediaMessage;
