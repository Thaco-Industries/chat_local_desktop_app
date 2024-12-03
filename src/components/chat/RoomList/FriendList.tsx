import React from 'react';
import { IFriendInfo } from '../../../interfaces/Friend';
import FriendItem from './FriendItem';

type Props = {
  friendList: IFriendInfo[];
  selectedFriends: string[];
  toggleFriendSelection: (id: string) => void;
};

function FriendList({
  friendList,
  selectedFriends,
  toggleFriendSelection,
}: Props) {
  return (
    <div className="overflow-y-auto flex-1">
      {friendList &&
        friendList.map((friend) => (
          <FriendItem
            key={friend.id}
            friendItem={friend}
            selectedFriends={selectedFriends}
            toggleFriendSelection={toggleFriendSelection}
          />
        ))}
    </div>
  );
}

export default FriendList;
