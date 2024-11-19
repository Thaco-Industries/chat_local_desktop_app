import React, { useCallback, useEffect, useRef, useState } from 'react';

import ChatInput from '../common/ChatInput';
import ChatHeader from './ChatHeader';
import ChatDrawer from './Drawer/ChatDrawer';
import MessageList from './Message/MessageList';
import { IChatScreen } from '../../interfaces/ChatScreen';
import ScrollBottomIcon from '../../assets/icons/scroll-bottom';
import ViewImageModal from './ViewImageModal';
import { useSocket } from '../../context/SocketContext';
import { useChatContext } from '../../context/ChatContext';
import { useMessageService } from '../../services/MessageService';
import { IMessage, IUserInRoomInfo } from '../../interfaces';

const ChatScreen: React.FC<IChatScreen> = ({
  roomId,
  setRoomId,
  roomInfo,
  isDesktopCollapsed,
  setIsDesktopCollapsed,
  visible,
  setVisible,
  imageView,
  setImageView,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const [numberMessageUnread, setNumberMessageUnread] = useState(0);
  const [loading, setLoading] = useState(false);
  const messageListRef = useRef<HTMLDivElement>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  const {
    listMember,
    messages,
    setMessages,
    lastMessageId,
    setLastMessageId,
    hasMoreData,
    setMessageReply,
    setIsReplyMessage,
  } = useChatContext();
  const { markAsReadMessage, getMessageByRoom, sendMessage } =
    useMessageService();
  const socket = useSocket();

  const markAsRead = async () => {
    try {
      const response = await markAsReadMessage(roomId);
      if (response.status === 204) {
        setNumberMessageUnread(0);
      }
    } catch (err) {
      console.error('API call failed: ', err);
    }
  };

  const scrollToBottom = useCallback(
    (smooth = false) => {
      messageEndRef.current?.scrollIntoView({
        behavior: smooth ? 'smooth' : 'auto',
      });
      if (numberMessageUnread > 0) {
        markAsRead();
      }
    },
    [numberMessageUnread, roomId, markAsRead]
  );

  const handleRecallMessage = useCallback(
    (message: IMessage) => {
      setMessages((prevMessages) => {
        const index = prevMessages.findIndex((msg) => msg.id === message.id);
        if (index !== -1) {
          // Nếu id đã tồn tại, thay thế message
          return prevMessages.map((msg) =>
            msg.id === message.id ? message : msg
          );
        } else {
          // Nếu id chưa tồn tại, thêm message mới
          return [...prevMessages, message];
        }
      });
    },
    [listMember, setMessages, showScrollToBottom]
  );

  const handleNewMessage = useCallback(
    (message: IMessage) => {
      const senderInfo = listMember?.[message.sender_id] || null;
      setMessages((prev) => [{ ...message, sender: senderInfo }, ...prev]);
      if (showScrollToBottom) {
        setNumberMessageUnread((prev) => prev + 1);
      }
    },
    [listMember, setMessages, showScrollToBottom]
  );

  const getMessageListData = useCallback(async () => {
    if (loading || !hasMoreData) return;
    setLoading(true);

    // Lưu vị trí `scrollTop` trước khi tải dữ liệu
    const previousScrollTop = messageListRef.current?.scrollTop || 0;

    try {
      const response = await getMessageByRoom(roomId, 20, lastMessageId);
      if (response.data?.length && listMember) {
        const messageList = response.data;
        setLastMessageId(messageList[messageList.length - 1].id);
        const newMessages = response.data.map((msg: IMessage) => ({
          ...msg,
          sender: listMember?.[msg.sender_id] || null,
        }));

        setMessages((prev) => {
          const map = new Map(
            [...prev, ...newMessages].map((msg) => [msg.id, msg])
          );
          return Array.from(map.values());
        });

        setTimeout(() => {
          if (messageListRef.current) {
            // Giữ vị trí cuộn bằng cách cộng thêm sự chênh lệch chiều cao mới
            messageListRef.current.scrollTop = previousScrollTop;
          }
        }, 0);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  }, [roomId, lastMessageId, listMember, loading, hasMoreData, setMessages]);

  useEffect(() => {
    if (messages.length === 0 && listMember) getMessageListData();
  }, [roomId, listMember, getMessageListData]);

  useEffect(() => {
    if (socket) {
      socket.on(`new-message/${roomId}`, handleNewMessage);
      socket.on(`recall-message/${roomId}`, handleRecallMessage);
      return () => {
        socket.off(`new-message/${roomId}`);
        socket.off(`recall-message/${roomId}`);
      };
    }
  }, [socket, roomId, handleNewMessage]);

  useEffect(() => {
    if (observer.current) observer.current.disconnect();

    if (listMember) {
      observer.current = new IntersectionObserver(
        (entries) => entries[0].isIntersecting && getMessageListData(),
        { root: null, rootMargin: '20px', threshold: 0.5 }
      );

      const target = document.getElementById('endOfMessages');

      if (target) observer.current.observe(target);
    }
    return () => observer.current?.disconnect();
  }, [listMember, getMessageListData]);

  const handleScroll = useCallback((e: any) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const scrollPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100;

    setShowScrollToBottom(scrollPercentage <= -20);
  }, []);

  const handleSendMessage = async (
    message: string,
    reply_message_id?: string,
    files?: File[]
  ) => {
    const payload = {
      message: message,
      reciever: roomInfo.id,
      reply_message_id: reply_message_id,
      toGroup: roomInfo.is_group,
      type: 'TEXT',
    };
    try {
      const response = await sendMessage(payload);
      if (response.status === 204) {
        scrollToBottom();
        setIsReplyMessage(false);
        setMessageReply(null);
      }
    } catch (err) {
      console.error('API call failed: ', err);
    }
  };

  return (
    <div className="flex flex-col bg-background-500 h-full relative">
      <ChatHeader
        roomInfo={roomInfo}
        roomId={roomId}
        setRoomId={setRoomId}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isDesktopCollapsed={isDesktopCollapsed}
        setIsDesktopCollapsed={setIsDesktopCollapsed}
        visible={visible}
        setVisible={setVisible}
        imageView={setImageView}
        setImageView={setImageView}
      />
      <div
        className="flex flex-col-reverse flex-1 mb-2 overflow-y-auto scrollbar"
        onScroll={handleScroll}
        ref={messageListRef}
      >
        <div className="flex flex-col">
          <MessageList
            messages={messages}
            setImageView={setImageView}
            setVisible={setVisible}
            loading={loading}
          />
          <div ref={messageEndRef} />
        </div>
      </div>
      {showScrollToBottom && (
        <div
          onClick={() => scrollToBottom(true)}
          className="absolute right-7 md:right-14 bottom-24 cursor-pointer"
        >
          <div className="indicator">
            {numberMessageUnread !== 0 && (
              <span className="indicator-item indicator-start badge badge-sm bg-red-600 top-1 left-1 border-red-600 text-white">
                {numberMessageUnread}
              </span>
            )}
            <ScrollBottomIcon />
          </div>
        </div>
      )}
      <ChatInput onSendMessage={handleSendMessage} />
      <ChatDrawer
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        visible={visible}
        setVisible={setVisible}
        imageView={imageView}
        setImageView={setImageView}
      />
      <ViewImageModal
        title="Hình ảnh"
        visible={visible}
        imageView={imageView}
        onClose={() => setVisible(false)}
      />
    </div>
  );
};

export default ChatScreen;
