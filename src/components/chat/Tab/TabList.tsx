import React from 'react';
import TabItems from './TabItems';
import { ITabItemsProps } from '../../../interfaces';

const TabList: React.FC<ITabItemsProps> = ({
  photos,
  files,
  activeTab,
  isDelete,
  fileSelected,
  setFileSelected,
  setImageView,
  setVisible,
}) => {
  return (
    <div className="bg-background-500 min-h-full w-80">
      <div className="overflow-y-auto scrollbar">
        <TabItems
          setImageView={setImageView}
          setVisible={setVisible}
          activeTab={activeTab}
          files={files}
          photos={photos}
          isDelete={isDelete}
          fileSelected={fileSelected}
          setFileSelected={setFileSelected}
        />
      </div>
    </div>
  );
};

export default TabList;
