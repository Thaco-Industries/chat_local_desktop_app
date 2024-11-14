// ChatContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { IMessage } from '../interfaces';

interface ChatContextProps {
  messages: IMessage[];
  setMessages: React.Dispatch<React.SetStateAction<IMessage[]>>;
  lastMessageId: string;
  setLastMessageId: React.Dispatch<React.SetStateAction<string>>;
  hasMoreData: boolean;
  setHasMoreData: React.Dispatch<React.SetStateAction<boolean>>;
  isFirstLoad: boolean;
  setIsFirstLoad: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChatContext = createContext<ChatContextProps | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [lastMessageId, setLastMessageId] = useState<string>('');
  const [hasMoreData, setHasMoreData] = useState<boolean>(true);
  const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true);

  return (
    <ChatContext.Provider
      value={{
        messages,
        setMessages,
        lastMessageId,
        setLastMessageId,
        hasMoreData,
        setHasMoreData,
        isFirstLoad,
        setIsFirstLoad,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};
