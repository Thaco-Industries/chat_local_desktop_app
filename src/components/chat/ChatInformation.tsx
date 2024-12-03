import React from 'react';
import DownloadOutlineIcon from '../../assets/icons/download-outline';
import { IChatInformationProps } from '../../interfaces/ChatInformation';
import PlayIcon from '../../assets/icons/play';
import DownloadButton from './Message/components/DownloadButton';
import { FileHandle } from '../../util/downloadFile';

const ChatInformation: React.FC<IChatInformationProps> = ({
  setActiveTab,
  photos,
  files,
  setVisible,
  setImageView,
}) => {
  const { handleFileDownload } = FileHandle();

  const handleViewAllClick = (section: 'photos' | 'files') => {
    setActiveTab(section);
  };

  const handleViewImageClick = (url: string) => {
    setVisible(true);
    setImageView(url);
  };

  const getFileExtension = (fileName: string) => {
    const index = fileName.lastIndexOf('.');
    return index !== -1 ? fileName.slice(index + 1) : '';
  };

  const removeExtensionFileName = (fileName: string) => {
    const index = fileName.lastIndexOf('.');
    return index !== -1 ? fileName.slice(0, index) : '';
  };

  const convertFileSize = (fileSize: number | undefined) => {
    if (!fileSize) return;
    const changeFileSizeToNumber = fileSize;
    if (changeFileSizeToNumber < 1) {
      return `${(changeFileSizeToNumber * 1024).toFixed(0)} KB`;
    } else {
      return `${changeFileSizeToNumber} MB`;
    }
  };

  const handleDownload = async (
    e: React.MouseEvent<HTMLDivElement>,
    url: string,
    file_name: string
  ) => {
    e.stopPropagation();
    handleFileDownload(url, file_name);
  };

  return (
    <div className="menu flex flex-col gap-xxs bg-background-500 text-base-content min-h-full w-80 max-w-80 p-0">
      <div className="bg-white px-5">
        <div className="flex flex-col gap-sm">
          <h1 className="text-title font-semibold">Ảnh, video</h1>
          <div className="grid grid-cols-4 gap-xxs">
            {photos.slice(0, 8).map((photo, index) => (
              <div
                key={photo.id}
                className="relative w-16 h-16 bg-black rounded-img overflow-hidden cursor-pointer"
                onClick={() => handleViewImageClick(photo.src)}
              >
                {photo.isVideo ? (
                  <>
                    <video
                      src={photo.src}
                      className="object-cover w-full h-full"
                      muted
                    />
                    <button
                      className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white w-8 h-8 bg-[#0000001A] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                      onClick={() => handleViewImageClick(photo.id)}
                      title="phát"
                    >
                      <PlayIcon />
                    </button>
                  </>
                ) : (
                  <img
                    src={photo.src}
                    alt={`Photo ${index + 1}`}
                    className="object-cover w-full h-full"
                  />
                )}
              </div>
            ))}
          </div>
          <p
            className="text-center text-primary cursor-pointer mb-sm"
            onClick={() => handleViewAllClick('photos')}
          >
            Xem tất cả
          </p>
        </div>
      </div>
      <div className="bg-white flex-1 p-5">
        <h1 className="text-title font-semibold mb-xs">File</h1>
        <div className="flex flex-col gap-xs">
          {files.slice(0, 3).map((file, index) => {
            const { url_display, file_name, file_size } = file;

            return (
              <div
                key={index}
                className="rounded-[2px] border border-primary p-xs relative cursor-pointer"
                onClick={(e) => handleDownload(e, url_display, file_name)}
              >
                <div className="flex justify-between">
                  <p className="truncate lg:max-w-[190px]">
                    {removeExtensionFileName(file_name)}
                  </p>
                  <span>.{getFileExtension(file_name)}</span>
                </div>
                <p className="text-sm text-lightText">
                  {convertFileSize(file_size)}
                </p>
                <DownloadButton url={url_display} file_name={file_name} />
              </div>
            );
          })}
        </div>
        <p
          className="text-center text-primary cursor-pointer mt-sm"
          onClick={() => handleViewAllClick('files')}
        >
          Xem tất cả
        </p>
      </div>
    </div>
  );
};

export default ChatInformation;
