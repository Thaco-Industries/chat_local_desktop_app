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
        if (friendItem.isInRoom || friendItem.isInvited) return;
        toggleFriendSelection(friendItem.id);
      }}
    >
      {mode === 'multiple' ? (
        <Checkbox
          checked={isSelected}
          onChange={handleSelection}
          disabled={friendItem.isInRoom || friendItem.isInvited}
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="focus:ring-0 focus:ring-offset-0 text-primary bg-white border-[#D9D9D9] cursor-pointer disabled:bg-[#F5F5F5]"
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
      <div className="flex flex-col gap-xxs">
        <p className="flex-1">{friendItem.full_name}</p>
        {(friendItem.isInRoom || friendItem.isInvited) && (
          <p className="flex-1 text-lightText text-sm">
            {friendItem.isInRoom ? 'Đã tham gia' : 'Đang chờ duyệt'}
          </p>
        )}
      </div>
    </div>
  );
}

export default FriendItem;
