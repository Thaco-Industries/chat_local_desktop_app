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

  const urlFile = `${process.env.REACT_APP_FILE_URL}/media/view/${url_display}`;

  const urlVideoThumbnail = `${process.env.REACT_APP_API_URL}/media/view/${thumbnail_url_display}`;

  if (message.status === 'DELIVERED' && isUserMessage) {
    const convertFileSize = (fileSize: string | undefined) => {
      if (!fileSize) return;
      const changeFileSizeToNumber = Number(fileSize) / 1024 / 1024;

      if (changeFileSizeToNumber < 1) {
        return `${(changeFileSizeToNumber * 1024).toFixed(3)} KB`;
      } else {
        return `${changeFileSizeToNumber.toFixed(3)} MB`;
      }
    };

    const getFileExtension = (fileName: string) => {
      const index = fileName.lastIndexOf('.');
      return index !== -1 ? fileName.slice(index + 1) : '';
    };

    const removeExtensionFileName = (fileName: string) => {
      const index = fileName.lastIndexOf('.');
      return index !== -1 ? fileName.slice(0, index) : '';
    };

    return (
      <div className="flex justify-end">
        {isVideo ? (
          _.isEmpty(thumbnail_url_display) ? (
            <div className="relative w-[220px] lg:w-[350px] h-[100px] bg-white rounded overflow-hidden flex items-center justify-center">
              {/* Spinner hiển thị ở giữa */}
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <Spinner size="xl" />
              </div>
            </div>
          ) : (
            // Trường hợp không có `thumbnail_url_display` -> Background trắng và spinner
            <div className="relative max-w-[220px] lg:max-w-[350px] max-h-[350px] bg-white rounded overflow-hidden flex items-center justify-center">
              {/* Hình ảnh full nằm dưới spinner */}
              <img
                src={thumbnail_url_display}
                className="w-full h-full object-contain rounded"
                alt="uploading file"
              />
              {/* Spinner hiển thị ở giữa */}
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <Spinner size="xl" />
              </div>
            </div>
          )
        ) : isImage ? (
          // Trường hợp có `thumbnail_url_display`
          <div className="relative max-w-[220px] lg:max-w-[350px] max-h-[350px] bg-white rounded overflow-hidden flex items-center justify-center">
            {/* Hình ảnh full nằm dưới spinner */}
            <img
              src={thumbnail_url_display}
              className="w-full h-full object-contain rounded"
              alt="uploading file"
            />
            {/* Spinner hiển thị ở giữa */}
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <Spinner size="xl" />
            </div>
          </div>
        ) : (
          <div
            title={file_name}
            className="border rounded-lg bg-[#91CFFB80] p-xs relative min-w-0 flex-grow max-w-[220px] lg:max-w-[350px] max-h-[350px] box-border"
          >
            <div className="flex justify-between mb-1 gap-3">
              <div className="flex justify-between">
                <p
                  className={clsx(
                    'text-sm text-title truncate lg:max-w-[220px]'
                  )}
                >
                  {removeExtensionFileName(file_name)}
                </p>
                <span>.{getFileExtension(file_name)}</span>
              </div>
            </div>
            <div className="flex gap-3 flex-shrink-0 flex-grow-0">
              <p className="text-sm text-lightText">
                {convertFileSize(file_size)}
              </p>
              <Spinner size="xl" />
            </div>

            <DownloadButton url={url_display} file_name={file_name} />
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
        message.file_id?.system_deleted ? (
          <div className="max-w-[220px] lg:max-w-[350px] h-[97px] w-full flex flex-col justify-center items-center bg-white rounded-[10px] shadow">
            Video đã bị xóa
            <VideoSlash />
          </div>
        ) : (
          <div
            className={clsx('flex', {
              'justify-end': isUserMessage,
            })}
            onClick={() => handleClickMedia(urlFile, isVideo)}
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
        )
      ) : isImage ? (
        url_display.includes('.svg') ? (
          <FileInfo
            url={urlFile}
            fileSize={file_size}
            file_name={file_name}
            isUserMessage={isUserMessage}
            isDelete={message.file_id?.system_deleted}
          />
        ) : message.file_id?.system_deleted ? (
          <div className="max-w-[220px] lg:max-w-[350px] h-[97px] w-full flex flex-col justify-center items-center bg-white rounded-[10px] shadow">
            <div className=" text-lightText">Ảnh đã bị xóa</div>
            <GallerySlash />
          </div>
        ) : (
          <ImagePreview
            url={urlFile}
            onClick={() => handleClickMedia(urlFile, isVideo)}
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
          <FileInfo
            url={urlFile}
            fileSize={file_size}
            file_name={file_name}
            isUserMessage={isUserMessage}
            isDelete={message.file_id?.system_deleted}
          />
        </div>
      )}

      {message.message_type !== 'RECALLED' &&
        !message.file_id?.system_deleted && (
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
