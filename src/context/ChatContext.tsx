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
  bufferMessages: IMessage[];
  setBufferMessages: React.Dispatch<React.SetStateAction<IMessage[]>>;
  isSearching: boolean;
  setIsSearching: React.Dispatch<React.SetStateAction<boolean>>;
  lastMessageId: string;
  setLastMessageId: React.Dispatch<React.SetStateAction<string>>;
  newerMessageId: string;
  setNewerMessageId: React.Dispatch<React.SetStateAction<string>>;
  hasMoreData: boolean;
  setHasMoreData: React.Dispatch<React.SetStateAction<boolean>>;
  hasMoreMessages: boolean;
  setHasMoreMessages: React.Dispatch<React.SetStateAction<boolean>>;
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
  messageListRef: React.RefObject<HTMLDivElement>;
  uploadProgress: number;
  setUploadProgress: React.Dispatch<React.SetStateAction<number>>;
}

const ChatContext = createContext<ChatContextProps | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [bufferMessages, setBufferMessages] = useState<IMessage[]>([]);
  const [lastMessageId, setLastMessageId] = useState<string>('');
  const [newerMessageId, setNewerMessageId] = useState<string>('');
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
  const messageListRef = useRef<HTMLDivElement>(null);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);

  return (
    <ChatContext.Provider
      value={{
        messages,
        setMessages,
        bufferMessages,
        setBufferMessages,
        isSearching,
        setIsSearching,
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
        messageListRef,
        hasMoreMessages,
        setHasMoreMessages,
        newerMessageId,
        setNewerMessageId,
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
