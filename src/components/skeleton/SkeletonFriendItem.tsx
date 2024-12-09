import React from 'react';

const SkeletonFriendItem: React.FC = () => {
  return (
    <div className="h-[70px] flex items-center gap-md animate-pulse">
      <div className="w-[20px] h-[20px] rounded-full bg-gray-300" />
      <div className="w-[40px] h-[40px] rounded-full bg-gray-300" />
      <div className="flex-1 h-[20px] bg-gray-300 rounded-md" />
    </div>
  );
};

export default SkeletonFriendItem;
