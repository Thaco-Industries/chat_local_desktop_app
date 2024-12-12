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
import { useMessageContext } from '../../../context/MessageContext';

export const RoomList: React.FC<IRoomList> = ({
  setRoomId,
  roomId,
  roomList,
  setRoomList,
  setRoomInfo,
  getRoomData,
}) => {
  const {
    setMessages,
    setLastMessageId,
    setHasMoreData,
    setIsFirstLoad,
    setListMember,
  } = useChatContext();

  const { markAsReadMessage } = useMessageService();
  const { getMemberInRoom, getRoomById } = useRoomService();
  const { setUnreadRooms } = useMessageContext();
  const { socket } = useSocket();
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
    const numberOfUnreadRooms = roomList.filter(
      (r) => r.number_message_not_read !== 0
    );
    setUnreadRooms(numberOfUnreadRooms.length);
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

  const handleRoomInforChange = (room: IRoom) => {
    setRoomList((prevRoomList) => {
      let updatedInfor = prevRoomList.map((r) =>
        r.id === room.id
          ? { ...r, room_name: room.room_name, avatar_url: room.avatar_url }
          : r
      );

      return updatedInfor;
    });
  };

  const handleDisconnectedRoom = (message: {
    roomId: string;
    userId: string;
  }) => {
    setRoomList((prevRoomList) =>
      prevRoomList.filter((room) => room.id !== message.roomId)
    );
  };

  const handleLoadRoomByRoomId = async (res: { roomId: string }) => {
    const response = await getRoomById(res.roomId);
    if (response.data) {
      setRoomList((prevRoomList) => {
        const existingRoomIndex = prevRoomList.findIndex(
          (room) => room.id === response.data.id
        );

        if (existingRoomIndex !== -1) {
          const updatedRoomList = prevRoomList.filter(
            (room) => room.id !== response.data.id
          );
          return [response.data, ...updatedRoomList];
        }
        return [response.data, ...prevRoomList];
      });
    }
  };

  useEffect(() => {
    if (socket) {
      socket.on(`notification-new-message`, handleNewMessage);
      socket.on(`mark-as-read-room-success`, handleMarkAsReadRoomSuccess);
      socket.on(`notification-recall-message`, handleNotifyRecallMessage);
      socket.on(`new-room-connected`, handleLoadRoomByRoomId);
      socket.on(`change-room-info`, handleRoomInforChange);
      socket.on(`user-join-room`, handleLoadRoomByRoomId);
      socket.on(`user-out-room`, handleLoadRoomByRoomId);
      socket.on(`disconnected-room`, handleDisconnectedRoom);
      return () => {
        socket.off(`notification-new-message`);
        socket.off(`mark-as-read-room-success`);
        socket.off(`notification-recall-message`);
        socket.off(`new-room-connected`);
        socket.off(`change-room-info`);
        socket.off(`user-join-room`);
        socket.off(`user-out-room`);
        socket.off(`disconnected-room`);
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
    const newRoomId = room.id;
    if (newRoomId === roomId) return;

    setRoomId(newRoomId);
    setListMember(null);
    markAsRead(room);
    setRoomInfo(room);
    setMessages([]);
    setLastMessageId('');
    getListMember(room.id);
    setHasMoreData(true);
    setIsFirstLoad(true);
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
          'h-[calc(100%-80px)] overflow-y-auto scrollbar transition-opacity duration-300 '
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
