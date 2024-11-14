import clsx from 'clsx';
import { IPhotoTabContentProps } from '../../../interfaces';
import PlayIcon from '../../../assets/icons/play';

export const PhotoTabContent: React.FC<IPhotoTabContentProps> = ({
  groupedPhotos,
  handleFileChoosen,
  isDelete,
  fileSelected,
}) => {
  return (
    <div>
      {Object.keys(groupedPhotos).map((date, dateIndex) => (
        <div
          key={date}
          className={clsx('bg-white p-5', {
            'mb-4': dateIndex !== Object.keys(groupedPhotos).length - 1,
          })}
        >
          <h2 className="font-semibold mb-4">Ngày {date}</h2>
          <div className="grid grid-cols-4 gap-xxs">
            {groupedPhotos[date].map((photo, index) => (
              <div
                key={photo.id}
                className="relative w-16 h-16 bg-black rounded-img overflow-hidden cursor-pointer"
                onClick={() => handleFileChoosen(photo.id, photo.src)}
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
                      onClick={() => handleFileChoosen(photo.id, photo.src)}
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
                {isDelete && (
                  <div
                    className={clsx(
                      'absolute top-xxs right-xxs w-xs h-xs border-border border rounded-full',
                      isDelete && fileSelected.includes(photo.id)
                        ? 'bg-blue-400'
                        : 'bg-white'
                    )}
                  ></div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
