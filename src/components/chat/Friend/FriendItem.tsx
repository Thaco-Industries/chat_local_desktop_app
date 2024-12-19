import React, { useState } from 'react';
import { IFriendInfo } from '../../../interfaces/Friend';
import UserAvatar from '../../common/UserAvatar';
import { useFriendService } from '../../../services/FriendService';
import { Spinner } from 'flowbite-react';
import clsx from 'clsx';
import FriendInfoModal from './FriendInfoModal';

type Props = {
  friendItem: IFriendInfo;
};

export default function FriendItem({ friendItem }: Props) {
  const { sendFriendRequest, cancelSendFriendRequest, actionRequestFriend } =
    useFriendService();
  const [isRequest, setIsRequest] = useState<boolean>(
    friendItem.status === 'SENT_REQUEST'
  );
  const [isShowButton, setIsShowButton] = useState<boolean>(
    friendItem.status !== 'FRIEND'
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [openFriendInfoModal, setOpenFriendInfoModal] =
    useState<boolean>(false);
  const [friendId, setFriendId] = useState<string>('');

  const openModal = (info: IFriendInfo) => {
    setOpenFriendInfoModal(true);
    setFriendId(info.id);
  };

  const handleAddFriendClick = async (userId: string) => {
    setIsRequest((prev) => !prev);
    setIsLoading(true);
    try {
      if (isRequest) {
        const response = await cancelSendFriendRequest(userId);
        if (response.status !== 204) {
          // Nếu API lỗi, hoàn nguyên trạng thái
          setIsRequest(true);
        }
      } else {
        const response = await sendFriendRequest(userId);
        if (response.status !== 201) {
          // Nếu API lỗi, hoàn nguyên trạng thái
          setIsRequest(false);
        }
      }
    } catch (error) {
      console.error('Error:', error);
      // Hoàn nguyên trạng thái nếu xảy ra lỗi
      setIsRequest(!isRequest);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptRequestClick = async (userId: string) => {
    setIsLoading(true);
    try {
      const payload = {
        id: userId,
        status: 'ACCEPTED',
      };
      const response = await actionRequestFriend(userId, payload);
      if (response.status === 204) {
        setIsShowButton(false);
      }
    } catch (error) {
      console.error('Error accepting friend request:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="h-[70px] flex items-center gap-md cursor-pointer"
      onClick={() => openModal(friendItem)}
    >
      <UserAvatar
        fullName={friendItem.full_name}
        senderId={friendItem.id}
        url={friendItem.avt_url}
      />
      <p className="flex-1">{friendItem.full_name}</p>
      {isShowButton && (
        <button
          type="button"
          className={clsx(
            'px-md py-[6.5px]  rounded-3xl shadow-md shadow-[#95959533]',
            {
              'bg-white border-[#A1A1A1] border text-textBody': isRequest,
            },
            {
              'bg-primary border text-white': !isRequest,
            }
          )}
          onClick={(e) => {
            e.stopPropagation();
            if (friendItem.status === 'RECEIVER_REQUEST') {
              handleAcceptRequestClick(friendItem.id); // Xử lý trạng thái RECEIVER_REQUEST
            } else {
              handleAddFriendClick(friendItem.id);
            }
          }}
        >
          {isLoading ? (
            <Spinner />
          ) : friendItem.status === 'RECEIVER_REQUEST' ? (
            'Đồng ý'
          ) : isRequest ? (
            'Thu hồi lời mời'
          ) : (
            'Kết bạn'
          )}
        </button>
      )}
      {openFriendInfoModal && (
        <FriendInfoModal
          openFriendInfoModal={openFriendInfoModal}
          setOpenFriendInfoModal={setOpenFriendInfoModal}
          friendId={friendId}
          handleAddFriendClick={handleAddFriendClick}
          isLoading={isLoading}
          isRequest={isRequest}
          isShowButton={isShowButton}
          handleAcceptRequestClick={handleAcceptRequestClick}
          overlay={false}
        />
      )}
    </div>
  );
}
