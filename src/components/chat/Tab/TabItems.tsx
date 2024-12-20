import React from 'react';
import { PhotoTabContent } from './PhotoTabContent';
import { FileTabContent } from './FileTabContent';
import { ITabItemsProps, Item } from '../../../interfaces';
import moment from 'moment';

const groupItemsByDate = <T extends IFileInfor>(items: T[]) => {
  return items.reduce((groups, item) => {
    const date = moment(item.created_at).format('DD/MM/YYYY');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(item);
    return groups;
  }, {} as { [key: string]: T[] });
};

const TabItems: React.FC<ITabItemsProps> = ({
  activeTab,
  photos,
  videos,
  files,
  isDelete,
  fileSelected,
  setFileSelected,
  setVisible,
  setImageView,
  setIsVideo,
}) => {
  const groupedPhotos = groupItemsByDate(photos);
  const groupedVideos = groupItemsByDate(videos);
  const groupedFiles = groupItemsByDate(files);

  const handleFileChoosen = (
    id: string,
    url: string | null,
    isVideo: boolean | null = null
  ) => {
    if (isDelete) {
      setFileSelected((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      );
    } else {
      setVisible(true);
      setIsVideo(isVideo);
      if (url) setImageView(url);
    }
  };

  const handleFileChoosenWrapper = (id: string) =>
    handleFileChoosen(id, null, null);

  return (
    <div>
      {activeTab === 'image' && (
        <PhotoTabContent
          fileSelected={fileSelected}
          groupedPhotos={groupedPhotos}
          handleFileChoosen={handleFileChoosen}
          isDelete={isDelete}
          isVideoTab={false}
        />
      )}
      {activeTab === 'video' && (
        <PhotoTabContent
          fileSelected={fileSelected}
          groupedPhotos={groupedVideos}
          handleFileChoosen={handleFileChoosen}
          isDelete={isDelete}
          isVideoTab={true}
        />
      )}
      {activeTab === 'other' && (
        <FileTabContent
          fileSelected={fileSelected}
          groupedFiles={groupedFiles}
          handleFileChoosen={handleFileChoosenWrapper}
          isDelete={isDelete}
        />
      )}
    </div>
  );
};

export default TabItems;
