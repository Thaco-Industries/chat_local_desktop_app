import React, { useState } from 'react';
import ChatScreen from '../../components/chat/ChatScreen';
import clsx from 'clsx';
import { RoomList } from '../../components/chat/RoomList/RoomList';
import WelcomeScreen from '../../components/welcome/WelcomeScreen';
import ChatDrawerDetail from '../../components/chat/Drawer/ChatDrawerDetail';
import { IRoom } from '../../interfaces';
import { useFetchApi } from '../../context/ApiContext';
import { ChatProvider } from '../../context/ChatContext';
import { useMessageContext } from '../../context/MessageContext';
import SearchMessage from '../../components/chat/SearchMessage/SearchMessage';

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

const Message: React.FC = () => {
  const { roomList, setRoomList, isSearchMessage } = useMessageContext();
  const [roomId, setRoomId] = useState<string>('');
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);
  const [visible, setVisible] = useState<boolean>(false);
  const [imageView, setImageView] = useState<string>('');
  const [roomInfo, setRoomInfo] = useState<IRoom>(defaultRoom);

  const { apiRequest } = useFetchApi();

  const getRoomData = async (): Promise<void> => {
    try {
      const response = await apiRequest('GET', 'room');
      if (response.data) {
        setRoomList(response.data);
      }
    } catch (err) {
      console.error('API call failed: ', err);
    }
  };

  return (
    <ChatProvider>
      <div className="flex h-full w-full tablet:gap-[2px]">
        <div
          className={clsx('w-full tablet:w-1/5 min-w-[330px] h-full bg-white', {
            'hidden tablet:block': roomId,
          })}
        >
          {!isSearchMessage ? (
            <RoomList
              setRoomId={setRoomId}
              roomId={roomId}
              setRoomList={setRoomList}
              roomList={roomList}
              setRoomInfo={setRoomInfo}
              getRoomData={getRoomData}
            />
          ) : (
            <SearchMessage roomId={roomId} />
          )}
        </div>
        <div className={clsx('flex-1 bg-white')}>
          {roomId ? (
            <ChatScreen
              roomInfo={roomInfo}
              setRoomInfo={setRoomInfo}
              roomId={roomId}
              setRoomId={setRoomId}
              isDesktopCollapsed={isDesktopCollapsed}
              setIsDesktopCollapsed={setIsDesktopCollapsed}
              visible={visible}
              setVisible={setVisible}
              // imageView={imageView}
              imageView={imageView}
              setImageView={setImageView}
            />
          ) : (
            <WelcomeScreen />
          )}
        </div>
        {isDesktopCollapsed && (
          <div className="hidden xl:flex w-[310px]">
            <ChatDrawerDetail
              imageView={imageView}
              setImageView={setImageView}
              setVisible={setVisible}
              visible={visible}
              roomId={roomId}
              roomInfo={roomInfo}
              setRoomInfo={setRoomInfo}
              setRoomId={setRoomId}
              setIsDesktopCollapsed={setIsDesktopCollapsed}
            />
          </div>
        )}
      </div>
    </ChatProvider>
  );
};

export default Message;
