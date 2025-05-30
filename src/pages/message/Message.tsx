import React, { useState } from 'react';
import ChatScreen from '../../components/chat/ChatScreen';
import clsx from 'clsx';
import { RoomList } from '../../components/chat/RoomList/RoomList';
import WelcomeScreen from '../../components/welcome/WelcomeScreen';
import ChatDrawerDetail from '../../components/chat/Drawer/ChatDrawerDetail';
import { useFetchApi } from '../../context/ApiContext';
import { useMessageContext } from '../../context/MessageContext';
import SearchMessage from '../../components/chat/SearchMessage/SearchMessage';

const Message: React.FC = () => {
  const {
    roomList,
    setRoomList,
    isSearchMessage,
    roomId,
    setRoomId,
    roomInfo,
    setRoomInfo,
  } = useMessageContext();
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false);
  const [visible, setVisible] = useState<boolean>(false);

  const [imageView, setImageView] = useState<string>('');
  const [isVideo, setIsVideo] = useState<boolean>(false);
  const [isRightSideLoading, setIsRightSideLoading] = useState(false);

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
    <div className="flex h-full w-full tablet:gap-[2px]">
      <div
        className={clsx('w-full tablet:w-1/5 min-w-[330px] h-full bg-white', {
          'hidden tablet:block': roomId,
        })}
      >
        {!isSearchMessage ? (
          <RoomList
            setRoomId={(roomKey) => {
              if (isRightSideLoading) {
                console.log(
                  'Thông tin phòng chat chưa load xong, vui lòng chờ!'
                );
                return;
              }
              setRoomId(roomKey);
            }}
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
            setIsVideo={setIsVideo}
            isVideo={isVideo}
            setIsRightSideLoading={setIsRightSideLoading}
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
            setIsVideo={setIsVideo}
          />
        </div>
      )}
    </div>
  );
};

export default Message;
