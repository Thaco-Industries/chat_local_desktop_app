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
  files,
  isDelete,
  fileSelected,
  setFileSelected,
  setVisible,
  setImageView,
}) => {
  const groupedPhotos = groupItemsByDate(photos);
  const groupedFiles = groupItemsByDate(files);

  const handleFileChoosen = (id: string, url: string | null) => {
    if (isDelete) {
      setFileSelected((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      );
    } else {
      setVisible(true);
      if (url) setImageView(url);
    }
  };

  const handleFileChoosenWrapper = (id: string) => handleFileChoosen(id, null);

  return (
    <div>
      {activeTab === 'photos' && (
        <></>
        // <PhotoTabContent
        //   fileSelected={fileSelected}
        //   groupedPhotos={groupedPhotos}
        //   handleFileChoosen={handleFileChoosen}
        //   isDelete={isDelete}
        // />
      )}
      {activeTab === 'files' && (
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
