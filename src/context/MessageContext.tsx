import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { INotificationNewMessage, IRoom } from '../interfaces';
import { useSocket } from './SocketContext';

interface MessageContextProps {
  roomList: IRoom[];
  setRoomList: React.Dispatch<React.SetStateAction<IRoom[]>>;
  setUnreadRooms: React.Dispatch<React.SetStateAction<Set<string>>>;
  unreadRooms: Set<string>;
}

// Tạo context
const MessageContext = createContext<MessageContextProps | null>(null);

export const MessageProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { socket } = useSocket();
  const [roomList, setRoomList] = useState<IRoom[]>([]);
  const [unreadRooms, setUnreadRooms] = useState<Set<string>>(new Set());

  // useEffect(() => {
  //   if (socket) {
  //     socket.on(`notification-new-message`, handleNewMessage);

  //     return () => {
  //       socket.off(`notification-new-message`);
  //     };
  //   }
  // }, [socket]);

  return (
    <MessageContext.Provider
      value={{ roomList, setRoomList, unreadRooms, setUnreadRooms }}
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
