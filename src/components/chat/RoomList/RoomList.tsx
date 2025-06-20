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
import { useFriendService } from '../../../services/FriendService';

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
  const { setUnreadRooms, isChangeRoomProcessing, setIsChangeRoomProcessing } =
    useMessageContext();
  const { searchUserById } = useFriendService();
  const { socket } = useSocket();
  const userAuth = getAuthCookie();

  const [keyword, setKeyword] = useState<string>('');
  const [roomListSearch, setRoomListSearch] = useState<IRoom[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const newMessageRoomInfoRef = useRef<IRoom>(defaultRoom);

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
      if (!roomInfo || !roomInfo.id || !roomInfo.last_message.id) {
        notify(
          'Không thể gửi phản hồi. Phòng hoặc tin nhắn không hợp lệ.',
          'error'
        );
        return;
      }

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
        notify(errorMessage, 'error');
        console.error('Error:', errorMessage);
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
      try {
        if (data?.message?.room_id) {
          const newRoomId = data.message.room_id;

          // Nếu roomId trùng, thoát sớm
          if (newRoomId === roomId) return;

          // Gọi API lấy thông tin phòng
          const response = await getRoomById(newRoomId);
          if (response.data) {
            // Thêm thông tin người dùng vào phòng
            const roomData = await handleGetUserInfor(response.data);
            handleRoomClick(roomData); // Cập nhật giao diện
          }
        }
      } catch (error) {
        console.error('Error handling notification:', error);
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

  async function handleGetUserInfor(roomInfo: IRoom) {
    try {
      // Gọi API để lấy thông tin bạn bè
      const response = await searchUserById(roomInfo.userRoom[0]?.user_id);
      if (response?.data) {
        // Trả về thông tin phòng sau khi thêm trạng thái bạn bè
        const updatedRoomInfo = {
          ...roomInfo,
          userRoom: roomInfo.userRoom.map((userRoom, index) =>
            index === 0
              ? {
                  ...userRoom,
                  friendStatus: response.data.status,
                }
              : userRoom
          ),
        };
        return updatedRoomInfo;
      }
      return roomInfo; // Trả về dữ liệu ban đầu nếu không tìm thấy thông tin bạn bè
    } catch (error) {
      console.error('Error getting user information:', error);
      return roomInfo; // Trả về dữ liệu ban đầu nếu lỗi
    }
  }

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
      if (existingRoom) {
        // Không cần lưu vào ref, xử lý trực tiếp trong setRoomList
        setRoomList((prevRoomList) => {
          // Duyệt qua danh sách phòng và cập nhật phòng phù hợp
          const updatedRoomList = prevRoomList.map((room) => {
            if (room.id !== room_Id) return room; // Giữ nguyên phòng không liên quan

            const isCurrentRoom = room.id === roomId; // Kiểm tra phòng hiện tại
            if (isCurrentRoom) {
              markAsRead(room.id); // Đánh dấu là đã đọc
            }

            const isNotUserMessage = message.sender.id !== userAuth?.user.id;

            // Cập nhật phòng với dữ liệu mới
            return {
              ...room,
              number_message_not_read:
                isNotUserMessage && !isCurrentRoom
                  ? room.number_message_not_read + 1
                  : room.number_message_not_read,
              last_message: {
                ...room.last_message,
                ...message.message,
                message_display: renderedMessage, // Nội dung tin nhắn hiển thị
              },
            };
          });

          // Tách phòng cần di chuyển và danh sách còn lại
          const roomToMove = updatedRoomList.find(
            (room) => room.id === room_Id
          );
          const otherRooms = updatedRoomList.filter(
            (room) => room.id !== room_Id
          );

          if (roomToMove) {
            newMessageRoomInfoRef.current = roomToMove;
          }

          // Đưa phòng liên quan lên đầu danh sách
          return roomToMove ? [roomToMove, ...otherRooms] : updatedRoomList;
        });
      }
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
    setRoomInfo((prevRoomInfo) => {
      return {
        ...prevRoomInfo,
        room_name: room.room_name,
        avatar_url: room.avatar_url,
      };
    });

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

  const handleRoomClick = async (room: IRoom) => {
    const newRoomId = room.id;
    if (isChangeRoomProcessing || newRoomId === roomId) return;

    setIsChangeRoomProcessing(true);
    try {
      setRoomId(newRoomId);
      setListMember(null);
      setMessages([]);
      setLastMessageId('');
      setHasMoreData(true);
      setIsFirstLoad(true);

      markAsRead(newRoomId);
      setRoomInfo(room);

      await getListMember(newRoomId); // Đợi quá trình lấy danh sách member
    } catch (error) {
      console.error('Error handling room click:', error);
    } finally {
      // Xử lý xong, cho phép thao tác tiếp
      setIsChangeRoomProcessing(false);
    }
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
          'overflow-y-auto scrollbar transition-opacity duration-300',
          keyword ? 'h-[calc(100%-120px)]' : 'h-[calc(100%-80px)]'
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
                onClick={() => {
                  if (isChangeRoomProcessing) {
                    console.log('Đang xử lý');
                    return;
                  }else{
                    handleRoomClick(room);
                  }
                }}
              >
                <RoomItem room={room} keyword={keyword} />
              </li>
            ))}
      </ul>
    </div>
  );
};
