import clsx from 'clsx';
import { IPhotoTabContentProps } from '../../../interfaces';
import PlayIcon from '../../../assets/icons/play';
import GallerySlash from '../../../assets/icons/gallery-slash';
import VideoSlash from '../../../assets/icons/video-slash';
import React from 'react';

export const PhotoTabContent: React.FC<IPhotoTabContentProps> = ({
  groupedPhotos,
  handleFileChoosen,
  isDelete,
  fileSelected,
  isVideoTab,
}) => {
  return (
    <React.Fragment>
      {Object.keys(groupedPhotos).map((date, dateIndex) => (
        <div
          key={date}
          className={clsx('bg-white', {
            'mb-[5px]': dateIndex !== Object.keys(groupedPhotos).length - 1,
          })}
        >
          <h2 className="px-md pt-md font-semibold mb-4">Ngày {date}</h2>
          <div className="px-md pb-md grid grid-cols-4 gap-xxs">
            {groupedPhotos[date].map((photo, index) => {
              const urlFile = `${process.env.REACT_APP_FILE_URL}/media/view/${photo.url_display}`;
              const urlThumbnail = `${process.env.REACT_APP_FILE_URL}/media/view/${photo.thumbnail_url_display}`;

              return (
                <div
                  key={photo.id}
                  className="relative w-16 h-16 bg-black rounded-img overflow-hidden cursor-pointer border-border border"
                  onClick={() => {
                    handleFileChoosen(photo.id, urlFile, isVideoTab);
                  }}
                >
                  {!photo.system_deleted ? (
                    <>
                      <img
                        src={isVideoTab ? urlThumbnail : urlFile}
                        alt={`Photo ${index + 1}`}
                        className="object-cover w-full h-full"
                      />
                      {isVideoTab && (
                        <button
                          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white w-8 h-8 bg-[#0000001A] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                          title="phát"
                        >
                          <PlayIcon />
                        </button>
                      )}
                      {isDelete && (
                        <div
                          className={clsx(
                            'absolute top-xxs right-xxs w-xs h-xs border-border border rounded-full',
                            fileSelected.includes(photo.id)
                              ? 'bg-blue-400'
                              : 'bg-white'
                          )}
                        ></div>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full bg-[#EAEAEA] flex justify-center items-center">
                      {!isVideoTab ? <GallerySlash /> : <VideoSlash />}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="h-xxs bg-background-500"></div>
        </div>
      ))}
    </React.Fragment>
  );
};
