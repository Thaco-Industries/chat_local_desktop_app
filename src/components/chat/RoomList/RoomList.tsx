import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import RoomItem from './RoomItem';
import SearchAndAddToolbar from '../../common/SearchAndAddToolbar';
import clsx from 'clsx';

import { IRoom, IRoomList } from '../../../interfaces/Room';
import { useChatContext } from '../../../context/ChatContext';
import { useMessageService } from '../../../services/MessageService';
import { useRoomService } from '../../../services/RoomService';
import { useSocket } from '../../../context/SocketContext';
import { IMessage, INotificationNewMessage } from '../../../interfaces';
import { getAuthCookie } from '../../../actions/auth.action';
import GalleryIcon from '../../../assets/icons/gallery';
import RoomListSkeleton from './RoomListSkeleton';

export const RoomList: React.FC<IRoomList> = ({
  setRoomId,
  roomId,
  roomList,
  setRoomList,
  setRoomInfo,
  getRoomData,
}) => {
  const { setMessages, setLastMessageId, setHasMoreData, setIsFirstLoad } =
    useChatContext();
  const { markAsReadMessage } = useMessageService();
  const { getMemberInRoom } = useRoomService();
  const { setListMember } = useChatContext();
  const socket = useSocket();
  const userAuth = getAuthCookie();

  const [keyword, setKeyword] = useState<string>('');
  const [roomListSearch, setRoomListSearch] = useState<IRoom[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (keyword === '') {
      setLoading(true);
      getRoomData().finally(() => {
        setRoomListSearch([]);
        setLoading(false);
      });
    }
  }, [keyword]);

  const handleNewMessage = useCallback(
    (message: INotificationNewMessage) => {
      setRoomList((prevRoomList) => {
        const updatedRoomList = prevRoomList.map((room) => {
          if (room.id !== message.message.room_id) {
            return room; // Không thay đổi room này
          }

          // Xử lý nếu là phòng hiện tại
          const isCurrentRoom = room.id === roomId;
          if (isCurrentRoom) {
            markAsRead(room);
          }

          // Xác định người gửi
          const isNotUserMessage = message.sender.id !== userAuth?.user.id;

          // Xử lý kiểu tin nhắn
          const { file_id, message_type, message_display } = message.message;

          const fileExtension =
            file_id?.file_name?.split('.').pop()?.toLocaleLowerCase() || '';
          const isImage = ['png', 'jpg', 'jpeg', 'gif', 'svf'].includes(
            fileExtension
          );

          let renderedMessage: string | React.ReactNode = '';
          if (typeof message_display !== 'string') {
            renderedMessage = message_display; // Không render lại nếu đã được xử lý
          } else if (message_type === 'TEXT') {
            renderedMessage = message_display;
          } else if (message_type === 'FILE') {
            if (isImage) {
              renderedMessage = (
                <div className="flex gap-1 items-center">
                  <GalleryIcon size="16" color="#7B87A1" /> Hình ảnh
                </div>
              );
            } else {
              renderedMessage = message_display;

              {
                /* <span>
                    <PaperClipIcon size="16" color="#7B87A1" />
                  </span> */
              }
              // <span className="truncate w-full">{}</span>
            }
          } else {
            renderedMessage = message_display;
          }

          // Trả về room đã cập nhật
          return {
            ...room,
            number_message_not_read:
              isNotUserMessage && !isCurrentRoom
                ? room.number_message_not_read + 1
                : room.number_message_not_read,
            last_message: {
              ...room.last_message,
              ...message.message,
              message_display: renderedMessage, // Cập nhật message display
            },
          };
        });

        const roomToMove = updatedRoomList.find(
          (room) => room.id === message.message.room_id
        );

        const otherRooms = updatedRoomList.filter(
          (room) => room.id !== message.message.room_id
        );

        return roomToMove ? [roomToMove, ...otherRooms] : updatedRoomList;
      });
    },
    [roomId, userAuth]
  );

  const handleMarkAsReadRoomSuccess = (room: any) => {
    setRoomList((prevRoomList) =>
      prevRoomList.map((r) =>
        r.id === room.roomId ? { ...r, number_message_not_read: 0 } : r
      )
    );
  };

  const handleNotifyRecallMessage = (message: IMessage) => {
    setRoomList((prevRoomList) =>
      prevRoomList.map((r) =>
        r.id === message.room_id && r.last_message.id === message.id
          ? {
              ...r,
              last_message: {
                ...r.last_message,
                message_display: message.message_display,
              },
            }
          : r
      )
    );
  };

  useEffect(() => {
    if (socket) {
      socket.on(`notification-new-message`, handleNewMessage);
      socket.on(`mark-as-read-room-success`, handleMarkAsReadRoomSuccess);
      socket.on(`notification-recall-message`, handleNotifyRecallMessage);
      socket.on(`new-room-connected`, getRoomData);
      return () => {
        socket.off(`notification-new-message`);
        socket.off(`mark-as-read-room-success`);
        socket.off(`notification-recall-message`);
        socket.off(`new-room-connected`);
      };
    }
  }, [socket, handleNewMessage, handleMarkAsReadRoomSuccess]);

  const markAsRead = async (room: IRoom) => {
    try {
      await markAsReadMessage(room.id);
    } catch (err) {
      console.error('API call failed: ', err);
    }
  };

  const getListMember = async (roomId: string) => {
    const response = await getMemberInRoom(roomId);
    if (response.status === 200) {
      const updatedList = response.data;
      setListMember(updatedList);
    }
  };

  const handleRoomClick = (room: IRoom) => {
    let newRoomId = room.id;
    setRoomId((prevRoomId) => {
      if (newRoomId === prevRoomId) {
        return prevRoomId;
      }
      setListMember(null);
      markAsRead(room);
      setRoomInfo(room);
      setMessages([]);
      setLastMessageId('');
      getListMember(room.id);
      setHasMoreData(true);
      setIsFirstLoad(true);

      return newRoomId;
    });
  };

  return (
    <div className="h-full bg-white">
      <SearchAndAddToolbar
        keyword={keyword}
        setKeyword={setKeyword}
        setRoomListSearch={setRoomListSearch}
        setLoading={setLoading}
      />
      {keyword && roomListSearch.length >= 0 && (
        <div className="w-full px-md py-xs bg-[#A1A1A133]">
          <p className="text-textBody">{roomListSearch.length} kết quả</p>
        </div>
      )}

      <ul
        className={clsx(
          'h-[calc(100%-120px)] overflow-y-auto scrollbar transition-opacity duration-300 '
        )}
      >
        {loading
          ? Array(5) // Render 5 skeleton items
              .fill(null)
              .map((_, index) => <RoomListSkeleton key={index} />)
          : (roomListSearch.length > 0 || keyword
              ? roomListSearch
              : roomList
            ).map((room) => (
              <li
                key={room.id}
                className={clsx('cursor-pointer', {
                  'bg-[#91CFFB33]': room.id === roomId,
                })}
                onClick={() => handleRoomClick(room)}
              >
                <RoomItem room={room} keyword={keyword} />
              </li>
            ))}
      </ul>
    </div>
  );
};
