import React, { createContext, ReactNode, useContext, useState } from 'react';
import { IRoom } from '../interfaces';

interface MessageContextProps {
  roomList: IRoom[];
  setRoomList: React.Dispatch<React.SetStateAction<IRoom[]>>;
  setUnreadRooms: React.Dispatch<React.SetStateAction<number>>;
  unreadRooms: number;
  setNumberOfFriendRequest: React.Dispatch<React.SetStateAction<number>>;
  numberOfFriendRequest: number;
  setNumberOfInvitedRoom: React.Dispatch<React.SetStateAction<number>>;
  numberOfInvitedRoom: number;
  isSearchMessage: boolean;
  setIsSearchMessage: React.Dispatch<React.SetStateAction<boolean>>;
  roomId: string;
  setRoomId: React.Dispatch<React.SetStateAction<string>>;
  roomInfo: IRoom;
  setRoomInfo: React.Dispatch<React.SetStateAction<IRoom>>;
}

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

// Tạo context
const MessageContext = createContext<MessageContextProps | null>(null);

export const MessageProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [roomList, setRoomList] = useState<IRoom[]>([]);
  const [unreadRooms, setUnreadRooms] = useState<number>(0);
  const [numberOfFriendRequest, setNumberOfFriendRequest] = useState<number>(0);
  const [numberOfInvitedRoom, setNumberOfInvitedRoom] = useState<number>(0);
  const [isSearchMessage, setIsSearchMessage] = useState<boolean>(false);
  const [roomId, setRoomId] = useState<string>('');
  const [roomInfo, setRoomInfo] = useState<IRoom>(defaultRoom);

  return (
    <MessageContext.Provider
      value={{
        roomList,
        setRoomList,
        roomId,
        setRoomId,
        unreadRooms,
        setUnreadRooms,
        numberOfFriendRequest,
        numberOfInvitedRoom,
        setNumberOfFriendRequest,
        setNumberOfInvitedRoom,
        isSearchMessage,
        setIsSearchMessage,
        roomInfo,
        setRoomInfo,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};

// Hook để sử dụng context
export const useMessageContext = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};
