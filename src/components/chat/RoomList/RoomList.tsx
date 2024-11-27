import React from 'react';
import RoomItem from './RoomItem';
import SearchAndAddToolbar from '../../common/SearchAndAddToolbar';
import clsx from 'clsx';

import { IRoom, IRoomList } from '../../../interfaces/Room';
import { useChatContext } from '../../../context/ChatContext';
import { useMessageService } from '../../../services/MessageService';
import { useRoomService } from '../../../services/RoomService';

export const RoomList: React.FC<IRoomList> = ({
  setRoomId,
  roomId,
  roomList,
  setRoomList,
  setRoomInfo,
}) => {
  const { setMessages, setLastMessageId, setHasMoreData, setIsFirstLoad } =
    useChatContext();
  const { markAsReadMessage } = useMessageService();
  const { getMemberInRoom } = useRoomService();
  const { setListMember } = useChatContext();

  const markAsRead = async (room: IRoom) => {
    try {
      const response = await markAsReadMessage(room.id);
      if (response.status === 204) {
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

  const getListMember = async (roomId: string) => {
    const response = await getMemberInRoom(roomId);
    if (response.status === 200) {
      const updatedList = response.data;
      setListMember(updatedList);
    }
  };

  const handleRoomClick = (room: IRoom) => {
    // debugger;
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
      <SearchAndAddToolbar />
      <ul className="h-[calc(100%-80px)] overflow-y-auto scrollbar">
        {roomList &&
          roomList.map((room) => (
            <li
              key={room.id}
              className={clsx('cursor-pointer', {
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
