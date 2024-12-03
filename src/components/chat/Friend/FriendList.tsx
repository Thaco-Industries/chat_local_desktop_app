import React from 'react';
import { IFriendInfo } from '../../../interfaces/Friend';
import FriendItem from './FriendItem';

type Props = {
  friendList: IFriendInfo[];
};

function FriendList({ friendList }: Props) {
  return (
    <div className="overflow-y-auto">
      {friendList &&
        friendList.map((friend) => (
          <FriendItem key={friend.id} friendItem={friend} />
        ))}
    </div>
  );
}

export default FriendList;
