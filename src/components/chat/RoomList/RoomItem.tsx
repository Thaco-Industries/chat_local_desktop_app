import moment from 'moment';
import React from 'react';
import { IRoomItem } from '../../../interfaces';
import UserAvatar from '../../common/UserAvatar';
import GalleryIcon from '../../../assets/icons/gallery';
import PaperClipIcon from '../../../assets/icons/paper-clip';
import { getAuthCookie } from '../../../actions/auth.action';

const RoomItem: React.FC<IRoomItem> = ({ room, keyword }) => {
  const { file_name } = room?.last_message?.file_id || {};
  const fileExtension = file_name?.split('.').pop()?.toLocaleLowerCase() || '';
  const isImage = ['png', 'jpg', 'jpeg', 'gif', 'svf'].includes(fileExtension);
  const userAuth = getAuthCookie();

  const renderLastMessage = () => {
    let modifiedMessage = room.last_message.message_display?.toString() || '';

    room.userRoom.forEach((user, index) => {
      const fullName = room.userRoom[index].user.infor.full_name;

      if (fullName) {
        const placeholder = `<#${user.user_id}>`;
        modifiedMessage = modifiedMessage.replace(placeholder, fullName);
      }
    });

    if (
      room.last_message.message_type !== 'NOTIFICATION' &&
      room.last_message.message_type !== 'FILE'
    ) {
      const senderIndex = room.userRoom.findIndex(
        (user) => user.user_id === room.last_message.sender_id
      );
      if (room.last_message.sender_id === userAuth?.user.id) {
        modifiedMessage = `Bạn: ${modifiedMessage}`;
      } else if (room.is_group) {
        modifiedMessage = `${room.userRoom[senderIndex]?.user.infor.full_name}: ${modifiedMessage}`;
      }
    }

    if (room.last_message.message_type === 'RECALLED') {
      return modifiedMessage;
    }
    if (room.last_message.message_type === 'FILE') {
      if (isImage) {
        const senderIndex = room.userRoom.findIndex(
          (user) => user.user_id === room.last_message.sender_id
        );
        return (
          <div className="flex gap-1 items-center">
            {room.last_message.sender_id === userAuth?.user.id ? (
              <p>Bạn: </p>
            ) : (
              `${room.userRoom[senderIndex]?.user.infor.full_name}:`
            )}
            <GalleryIcon size="16" color="#7B87A1" /> Hình ảnh
          </div>
        );
      } else {
        const senderIndex = room.userRoom.findIndex(
          (user) => user.user_id === room.last_message.sender_id
        );
        const senderName =
          room.last_message.sender_id === userAuth?.user.id
            ? 'Bạn: '
            : room.userRoom[senderIndex]?.user.infor.full_name || '';
        return (
          <div className="flex gap-1 items-center">
            <p>{senderName}</p>
            <span>
              <PaperClipIcon size="16" color="#7B87A1" />
            </span>
            <span className="truncate w-full">{modifiedMessage}</span>
          </div>
        );
      }
    } else {
      return modifiedMessage;
    }
  };

  const getDateLabel = (created_at: string) => {
    const messageDate = moment(created_at, 'YYYY-MM-DD HH:mm');
    const today = moment();

    return messageDate.isSame(today, 'day')
      ? moment(created_at).format('HH:mm')
      : messageDate.format('DD/MM/YYYY');
  };

  return (
    <div>
      {room.last_message && !keyword ? (
        <div className="flex gap-4 px-5 py-3">
          <UserAvatar
            fullName={room.room_name}
            senderId={room.is_group ? room.id : room.userRoom[0].user_id}
            url={room.avatar_url}
          />
          <div className="min-w-0 flex-1 max-w-full">
            <div className="flex justify-between mb-1 gap-3">
              <div className="text-base text-title truncate w-full">
                {room.room_name}
              </div>
              <div className="text-sm text-lightText">
                {getDateLabel(room.last_message.created_at)}
              </div>
            </div>
            <div className="flex gap-3 flex-shrink-0 flex-grow-0">
              <span className="truncate w-full text-sm text-lightText">
                {renderLastMessage()}
              </span>
              {room.number_message_not_read !== 0 && (
                <span className=" inline-flex items-center justify-center text-[12px] leading-[16px] font-bold p-1 min-w-7 h-7 text-white bg-red-500 border-2 border-white rounded-full ">
                  {room.number_message_not_read > 99
                    ? '99+'
                    : room.number_message_not_read}
                </span>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex gap-4 px-5 py-3 items-center">
          <UserAvatar
            fullName={room.room_name}
            senderId={room.is_group ? room.id : room.userRoom[0].user_id}
            url={room.avatar_url}
          />
          <div className="min-w-0 flex-1 max-w-full">
            <div className="text-base text-title truncate w-full">
              {room.room_name}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomItem;
