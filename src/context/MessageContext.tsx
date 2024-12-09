import React, { createContext, ReactNode, useContext, useState } from 'react';
import { IRoom } from '../interfaces';

interface MessageContextProps {
  roomList: IRoom[];
  setRoomList: React.Dispatch<React.SetStateAction<IRoom[]>>;
}

// Tạo context
const MessageContext = createContext<MessageContextProps | null>(null);

export const MessageProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [roomList, setRoomList] = useState<IRoom[]>([]);

  return (
    <MessageContext.Provider value={{ roomList, setRoomList }}>
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
