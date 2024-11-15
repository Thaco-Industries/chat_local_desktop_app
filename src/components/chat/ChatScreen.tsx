import React, { useEffect, useRef, useState } from 'react';

import ChatInput from '../common/ChatInput';
import ChatHeader from './ChatHeader';
import ChatDrawer from './Drawer/ChatDrawer';
import MessageList from './Message/MessageList';
import { IChatScreen } from '../../interfaces/ChatScreen';
import ScrollBottomIcon from '../../assets/icons/scroll-bottom';
import ViewImageModal from './ViewImageModal';
import { useFetchApi } from '../../context/ApiContext';
import { useSocket } from '../../context/SocketContext';
import { useChatContext } from '../../context/ChatContext';
import { useMarkAsReadService } from '../../services/MarkAsReadService';

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
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [showScrollToBottom, setShowScrollToBottom] = useState<boolean>(false);
  const showScrollToBottomRef = useRef(showScrollToBottom);
  const [numberMessageUnread, setNumberMessageUnread] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const observer = useRef<IntersectionObserver | null>(null);
  const pageSize = 20;
  const socket = useSocket();
  const messageListRef = useRef<HTMLDivElement>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const { apiRequest } = useFetchApi();
  const { markAsReadMessage } = useMarkAsReadService();

  const {
    messages,
    setMessages,
    lastMessageId,
    setLastMessageId,
    hasMoreData,
    setHasMoreData,
    isFirstLoad,
    setIsFirstLoad,
  } = useChatContext();

  useEffect(() => {
    if (!messages) getMessageListData();
  }, [roomId]);

  useEffect(() => {
    showScrollToBottomRef.current = showScrollToBottom;
  }, [showScrollToBottom]);

  useEffect(() => {
    if (isFirstLoad && messages.length > 0) {
      scrollToBottom();
      setIsFirstLoad(false);
    }
  }, [messages, isFirstLoad]);

  useEffect(() => {
    if (!socket) return;

    socket.on(`new-message/${roomId}`, (message: any) => {
      setMessages((prev) => [message, ...prev]);

      if (showScrollToBottomRef.current) {
        setNumberMessageUnread((prev) => prev + 1);
      }
    });
    socket.on(`recall-message/${roomId}`, (message: any) => {
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
    });

    return () => {
      socket.off(`new-message/${roomId}`);
      socket.off(`recall-message/${roomId}`);
    };
  }, [socket, roomId]);

  useEffect(() => {
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMoreData && !loading) {
          getMessageListData();
        }
      },
      { root: null, rootMargin: '20px', threshold: 0.5 }
    );

    const targetElement = document.getElementById('endOfMessages');
    if (targetElement) observer.current.observe(targetElement);

    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [lastMessageId, hasMoreData, loading]);

  const markAsRead = async (roomId: string) => {
    try {
      const response = await markAsReadMessage(roomId);
      if (response.status === 204) {
        setNumberMessageUnread(0);
      }
    } catch (err) {
      console.error('API call failed: ', err);
    }
  };

  const getMessageListData = async () => {
    if (!hasMoreData || loading) return;

    const previousScrollHeight = messageListRef.current?.scrollHeight || 0;
    setLoading(true);
    try {
      const response = await apiRequest(
        'GET',
        `message/by-room-id?roomId=${roomId}&pageSize=${pageSize}&lastMessageId=${lastMessageId}`
      );

      if (response.data && response.data.length > 0) {
        const newMessages = response.data;
        setLastMessageId(newMessages[newMessages.length - 1]._id);
        setMessages((prevMessages) => [...prevMessages, ...newMessages]);

        setTimeout(() => {
          const newScrollHeight = messageListRef.current?.scrollHeight || 0;
          const heightDiff = newScrollHeight - previousScrollHeight;
          if (messageListRef.current) {
            messageListRef.current.scrollTop = heightDiff;
          }
        }, 0);
      } else {
        setHasMoreData(false);
      }
    } catch (error) {
      console.error('API call failed:', error);
    }
    setLoading(false);
  };

  const handleSendMessage = async (message: string, files?: File[]) => {
    const payload = {
      message: message,
      reciever: roomInfo.id,
      toGroup: roomInfo.is_group,
      type: 'TEXT',
    };
    try {
      const response = await apiRequest('POST', 'message', payload);
      if (response.status === 204) {
        scrollToBottom();
      }
    } catch (err) {
      console.error('API call failed: ', err);
    }
  };

  const scrollToBottom = (smooth: boolean = false) => {
    messageEndRef.current?.scrollIntoView({
      behavior: smooth ? 'smooth' : 'auto',
    });
    setShowScrollToBottom(false);
    if (numberMessageUnread > 0) {
      markAsRead(roomId);
    }
  };

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const element = event.currentTarget;
    const scrollPercentage =
      (element.scrollTop / (element.scrollHeight - element.clientHeight)) * 100;
    if (scrollPercentage <= -20) {
      setShowScrollToBottom(true);
    } else {
      setShowScrollToBottom(false);
    }
  };

  const onClose = () => {
    setVisible(false);
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
        className="flex flex-col-reverse flex-1  mb-2 overflow-y-auto scrollbar"
        onScroll={handleScroll}
        ref={messageListRef}
      >
        <div className="flex flex-col justify-end ">
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
        onClose={onClose}
      />
    </div>
  );
};

export default ChatScreen;
