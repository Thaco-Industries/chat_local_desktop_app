import React from 'react';
import TabItems from './TabItems';
import { ITabItemsProps } from '../../../interfaces';

const TabList: React.FC<ITabItemsProps> = ({
  photos,
  videos,
  files,
  activeTab,
  isDelete,
  fileSelected,
  setFileSelected,
  setImageView,
  setVisible,
  setIsVideo,
}) => {
  return (
    <div className="bg-background-500 min-h-full w-[310px]">
      <div className="overflow-y-auto scrollbar">
        <TabItems
          setImageView={setImageView}
          setVisible={setVisible}
          activeTab={activeTab}
          files={files}
          videos={videos}
          photos={photos}
          isDelete={isDelete}
          fileSelected={fileSelected}
          setFileSelected={setFileSelected}
          setIsVideo={setIsVideo}
        />
      </div>
    </div>
  );
};

export default TabList;
