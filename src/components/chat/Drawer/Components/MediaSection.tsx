import GallerySlash from '../../../../assets/icons/gallery-slash';
import PlayIcon from '../../../../assets/icons/play';
import VideoSlash from '../../../../assets/icons/video-slash';
import { Photo } from '../../../../interfaces';

interface MediaSectionProps {
  items: IFileInfor[];
  isVideoSection: boolean;
  handleViewImageClick: (url: string) => void;
}

export const MediaSection = ({
  items,
  isVideoSection,
  handleViewImageClick,
}: MediaSectionProps) => {
  return (
    <div className="grid grid-cols-4 gap-xxs">
      {items.slice(0, 8).map((item, index) => {
        const urlFile = `${process.env.REACT_APP_API_URL}/media/view/${
          isVideoSection ? item.thumbnail_url_display : item.url_display
        }`;

        return (
          <div
            key={index}
            className="relative w-16 h-16 bg-black rounded-img overflow-hidden cursor-pointer"
          >
            {!item.system_deleted ? (
              <>
                <img
                  src={urlFile}
                  alt={item.file_name}
                  className="cursor-pointer object-cover w-full h-full"
                  onClick={() => handleViewImageClick(urlFile)}
                />
                {isVideoSection && (
                  <button
                    className="absolute inset-0 flex items-center justify-center w-8 h-8 bg-black bg-opacity-50 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                    title="Phát"
                  >
                    <PlayIcon />
                  </button>
                )}
              </>
            ) : (
              <div className="w-full h-full bg-[#EAEAEA] flex justify-center items-center">
                {!isVideoSection ? <GallerySlash /> : <VideoSlash />}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
