import React from 'react';
import DownloadOutlineIcon from '../../assets/icons/download-outline';
import { IChatInformationProps } from '../../interfaces/ChatInformation';
import PlayIcon from '../../assets/icons/play';

const ChatInformation: React.FC<IChatInformationProps> = ({
  setActiveTab,
  photos,
  files,
  setVisible,
  setImageView,
}) => {
  const handleViewAllClick = (section: 'photos' | 'files') => {
    setActiveTab(section);
  };

  const handleViewImageClick = (url: string) => {
    console.log(url);

    setVisible(true);
    setImageView(url);
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
          {files.slice(0, 3).map((file, index) => (
            <div
              key={index}
              className="w-full rounded-[2px] border border-primary p-xs relative"
            >
              <p className="text-sm text-title truncate">{file.name}</p>
              <p className="text-sm text-lightText">{file.size}</p>
              <button
                title="tải về"
                className="rounded-sm absolute bottom-xs right-xs bg-white border border-border w-6 h-6"
              >
                <DownloadOutlineIcon />
              </button>
            </div>
          ))}
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
