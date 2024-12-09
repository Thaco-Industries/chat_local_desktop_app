import React from 'react';
import { IFriendInfo } from '../../../interfaces/Friend';
import UserAvatar from '../../common/UserAvatar';
import { Checkbox, Radio } from 'flowbite-react';

type Props = {
  friendItem: IFriendInfo;
  selectedFriends: string[];
  toggleFriendSelection: (id: string) => void;
  mode: 'single' | 'multiple';
};

function FriendItem({
  friendItem,
  selectedFriends,
  toggleFriendSelection,
  mode,
}: Props) {
  const isSelected = selectedFriends.includes(friendItem.id);

  const handleSelection = () => {
    toggleFriendSelection(friendItem.id);
  };

  return (
    <div
      className="h-[70px] flex items-center gap-md cursor-pointer"
      onClick={(e) => {
        e.stopPropagation();
        toggleFriendSelection(friendItem.id);
      }}
    >
      {mode === 'multiple' ? (
        <Checkbox
          checked={isSelected}
          onChange={handleSelection}
          onClick={(e) => e.stopPropagation()}
          className="focus:ring-0 focus:ring-offset-0 text-primary bg-white border-[#D9D9D9] cursor-pointer"
        />
      ) : (
        <Radio
          checked={isSelected}
          onChange={handleSelection}
          onClick={(e) => e.stopPropagation()}
          className="focus:ring-0 focus:ring-offset-0 text-primary bg-white border-[#D9D9D9] cursor-pointer"
        />
      )}
      <UserAvatar
        fullName={friendItem.full_name}
        senderId={friendItem.id}
        url={friendItem.avt_url}
      />
      <p className="flex-1">{friendItem.full_name}</p>
    </div>
  );
}

export default FriendItem;
