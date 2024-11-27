// ChatContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useRef,
} from 'react';
import { IMessage, IUserInRoomInfo } from '../interfaces';

interface ChatContextProps {
  messages: IMessage[];
  setMessages: React.Dispatch<React.SetStateAction<IMessage[]>>;
  lastMessageId: string;
  setLastMessageId: React.Dispatch<React.SetStateAction<string>>;
  hasMoreData: boolean;
  setHasMoreData: React.Dispatch<React.SetStateAction<boolean>>;
  isFirstLoad: boolean;
  setIsFirstLoad: React.Dispatch<React.SetStateAction<boolean>>;
  isReplyMessage: boolean;
  setIsReplyMessage: React.Dispatch<React.SetStateAction<boolean>>;
  messageReply: IMessage | null;
  setMessageReply: React.Dispatch<React.SetStateAction<IMessage | null>>;
  listMember: Record<string, IUserInRoomInfo> | null;
  setListMember: React.Dispatch<
    React.SetStateAction<Record<string, IUserInRoomInfo> | null>
  >;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  uploadProgress: number;
  setUploadProgress: React.Dispatch<React.SetStateAction<number>>;
}

const ChatContext = createContext<ChatContextProps | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [lastMessageId, setLastMessageId] = useState<string>('');
  const [hasMoreData, setHasMoreData] = useState<boolean>(true);
  const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true);
  const [isReplyMessage, setIsReplyMessage] = useState<boolean>(false);
  const [messageReply, setMessageReply] = useState<IMessage | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [listMember, setListMember] = useState<Record<
    string,
    IUserInRoomInfo
  > | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
        isReplyMessage,
        setIsReplyMessage,
        messageReply,
        setMessageReply,
        listMember,
        setListMember,
        textareaRef,
        uploadProgress,
        setUploadProgress,
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
