import React from 'react';

import FriendItem from './FriendItem';
import { IFriendInfo } from '../../../interfaces/Friend';
import SkeletonFriendItem from '../../skeleton/SkeletonFriendItem';

type Props = {
  friendList: IFriendInfo[];
  selectedFriends: string[];
  toggleFriendSelection: (id: string) => void;
  isLoading: boolean; // New prop for loading state
  mode?: 'single' | 'multiple';
};

function FriendList({
  friendList,
  selectedFriends,
  toggleFriendSelection,
  mode = 'multiple',
  isLoading,
}: Props) {
  if (isLoading) {
    // Render skeleton items while loading
    return (
      <div className="overflow-y-auto flex-1">
        {Array(5)
          .fill(null)
          .map((_, index) => (
            <SkeletonFriendItem key={index} />
          ))}
      </div>
    );
  }

  // Render friend items after loading
  return (
    <div className="overflow-y-auto flex-1">
      {friendList.map((friend) => (
        <FriendItem
          key={friend.id}
          friendItem={friend}
          selectedFriends={selectedFriends}
          toggleFriendSelection={toggleFriendSelection}
          mode={mode}
        />
      ))}
    </div>
  );
}

export default FriendList;
