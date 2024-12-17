import React, { useCallback, useEffect, useRef, useState } from 'react';
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
import { notify } from '../../../helper/notify';

const defaultRoom: IRoom = {
  id: '',
  avatar_url: '',
  is_group: false,
  last_message: {
    id: '',
    created_at: '',
    room_id: '',
    sender_id: '',
    message_type: '',
    seen_by: [],
    deleted_by: [],
    status: '',
    reactions: [],
    message_display: '',
  },
  number_message_not_read: 0,
  room_name: '',
  type_room: '',
  userRoom: [],
};
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

  const { markAsReadMessage, sendMessage } = useMessageService();
  const { getMemberInRoom, getRoomById } = useRoomService();
  const { setUnreadRooms } = useMessageContext();
  const { socket } = useSocket();
  const userAuth = getAuthCookie();

  const [keyword, setKeyword] = useState<string>('');
  const [roomListSearch, setRoomListSearch] = useState<IRoom[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [newMessageRoomInfo, setNewMessageRoomInfo] =
    useState<IRoom>(defaultRoom);
  const newMessageRoomInfoRef = useRef<IRoom>(defaultRoom);

  useEffect(() => {
    newMessageRoomInfoRef.current = newMessageRoomInfo;
  }, [newMessageRoomInfo]);

  useEffect(() => {
    if (keyword === '') {
      setLoading(true);
      getRoomData().finally(() => {
        setRoomListSearch([]);
        setLoading(false);
      });
    }
  }, [keyword]);

  useEffect(() => {
    const handleReplyMessage = async (message: string) => {
      const roomInfo = newMessageRoomInfoRef.current;
      if (roomInfo) {
        const payload = {
          message,
          reciever: roomInfo.id,
          reply_message_id: roomInfo.last_message.id,
          toGroup: roomInfo.is_group,
          type: 'TEXT',
        };

        try {
          const response = await sendMessage(payload);
        } catch (error: any) {
          const errorMessage = error?.response?.data?.message || error.message;
          notify(errorMessage);
          console.error('Error:', errorMessage);
        }
      }
    };

    window.electronAPI.onReplyNotification(handleReplyMessage);

    return () => {
      // Clean up listener
      window.electronAPI.removeListener(
        'send-reply-message',
        handleReplyMessage
      );
    };
  }, []);

  useEffect(() => {
    const handleNotification = async (data: INotificationNewMessage) => {
      if (data && data.message.room_id) {
        const newRoomId = data.message.room_id;
        if (newRoomId === roomId) return;

        const response = await getRoomById(newRoomId);
        if (response.data) {
          handleRoomClick(response.data);
        }
      }
    };

    window.electronAPI.onNotificationClicked(handleNotification);

    return () => {
      // Clean up listener
      window.electronAPI.removeListener(
        'notification-clicked',
        handleNotification
      );
    };
  }, []);

  const handleNewMessage = useCallback(
    (message: INotificationNewMessage) => {
      let renderedMessage: string | React.ReactNode =
        message.message.message_display;

      const fileExtension =
        message.message.file_id?.file_name?.split('.').pop()?.toLowerCase() ||
        '';
      const isImage = ['png', 'jpg', 'jpeg', 'gif', 'svf'].includes(
        fileExtension
      );
      if (message.message.message_type === 'FILE') {
        renderedMessage = isImage ? (
          <div className="flex gap-1 items-center">
            <GalleryIcon size="16" color="#7B87A1" /> Hình ảnh
          </div>
        ) : (
          message.message.message_display
        );
      }

      let notificationMessage;
      if (message.message.message_type === 'FILE') {
        if (isImage) {
          notificationMessage = 'Hình ảnh';
        } else {
          notificationMessage = `File đính kèm: ${
            message.message.file_id?.file_name || 'Không xác định'
          }`;
        }
      } else {
        notificationMessage = message.message.message_display;
      }

      // Nội dung thông báo
      if (
        message.sender.id !== userAuth?.user.id &&
        message.message.message_type !== 'NOTIFICATION'
      ) {
        const notificationContent = {
          ...message,
          message_display: notificationMessage,
        };

        // Hiển thị thông báo qua Electron
        if (window.electronAPI) {
          window.electronAPI.notifyMessage(notificationContent);
        } else {
          console.error(
            'electronAPI.receiveNotification không được định nghĩa'
          );
        }
      }

      const room_Id = message.message.room_id;
      const existingRoom = roomList.find((room) => room.id === room_Id);
      if (existingRoom) setNewMessageRoomInfo(existingRoom);

      // Cập nhật danh sách phòng
      setRoomList((prevRoomList) => {
        const updatedRoomList = prevRoomList.map((room) => {
          if (room.id !== message.message.room_id) return room;

          const isCurrentRoom = room.id === roomId;
          if (isCurrentRoom) {
            markAsRead(room.id);
          }

          const isNotUserMessage = message.sender.id !== userAuth?.user.id;

          return {
            ...room,
            number_message_not_read:
              isNotUserMessage && !isCurrentRoom
                ? room.number_message_not_read + 1
                : room.number_message_not_read,
            last_message: {
              ...room.last_message,
              ...message.message,
              message_display: renderedMessage,
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

  const markAsRead = async (room_id: string) => {
    try {
      await markAsReadMessage(room_id);
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
    markAsRead(room.id);
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
