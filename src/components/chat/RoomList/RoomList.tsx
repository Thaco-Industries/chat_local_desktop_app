import React from 'react';
import RoomItem from './RoomItem';
import SearchAndAddToolbar from '../../common/SearchAndAddToolbar';
import clsx from 'clsx';
import { useFetchApi } from '../../../context/ApiContext';
import { IRoom, IRoomList } from '../../../interfaces/Room';
import { useChatContext } from '../../../context/ChatContext';

export const RoomList: React.FC<IRoomList> = ({
  setRoomId,
  roomId,
  roomList,
  setRoomList,
  setRoomInfo,
}) => {
  const { setMessages, setLastMessageId, setHasMoreData, setIsFirstLoad } =
    useChatContext();
  const { apiRequest } = useFetchApi();

  const markAsReadMessage = async (room: IRoom) => {
    try {
      const response = await apiRequest(
        'PUT',
        `message/mark-as-read?roomId=${room.id}`
      );
      if (response.status === 204) {
        // getRoomData();
        setRoomList((prevRoomList) =>
          prevRoomList.map((r) =>
            r.id === room.id ? { ...r, number_message_not_read: 0 } : r
          )
        );
      }
    } catch (err) {
      console.error('API call failed: ', err);
    }
  };

  const handleRoomClick = (room: IRoom) => {
    setRoomId(room.id);
    markAsReadMessage(room);
    setRoomInfo(room);
    setMessages([]);
    setLastMessageId('');
    setHasMoreData(true);
    setIsFirstLoad(true);
  };

  return (
    <div className="h-full bg-white">
      <SearchAndAddToolbar />
      <ul className="h-[calc(100%-80px)] overflow-y-auto scrollbar">
        {roomList &&
          roomList.map((room) => (
            <li
              key={room.id}
              className={clsx('cursor-pointer hover:bg-gray-200', {
                'bg-[#91CFFB33]': room.id === roomId,
              })}
              onClick={() => handleRoomClick(room)}
            >
              <RoomItem room={room} />
            </li>
          ))}
      </ul>
    </div>
  );
};
