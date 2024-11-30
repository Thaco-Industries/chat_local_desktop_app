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
  // const observer = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const listMemberRef = useRef<Record<string, IUserInRoomInfo> | null>(null);

  const {
    listMember,
    messages,
    setMessages,
    lastMessageId,
    setLastMessageId,
    hasMoreData,
    setHasMoreData,
    setMessageReply,
    setIsReplyMessage,
  } = useChatContext();
  const { markAsReadMessage, getMessageByRoom, sendMessage } =
    useMessageService();
  const socket = useSocket();

  const markAsRead = async () => {
    try {
      await markAsReadMessage(roomId);
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
        setNumberMessageUnread((prev) => (prev !== 0 ? 0 : prev));
      }
    },
    [numberMessageUnread, roomId, markAsRead]
  );

  const handleRecallMessage = useCallback(
    (message: IMessage) => {
      if (messages) {
        setMessages((prevMessages) => {
          // Tìm vị trí của tin nhắn hiện tại theo `id`

          const updatedMessages = prevMessages.map((msg) => {
            if (msg.reply_id?.id === message.id) {
              return {
                ...msg,
                reply_id: {
                  ...msg.reply_id,
                  message_display: message.message_display,
                },
              };
            }
            return msg;
          });

          const index = updatedMessages.findIndex(
            (msg) => msg.id === message.id
          );
          // Nếu tin nhắn đã tồn tại, thay thế nó
          if (index !== -1) {
            return updatedMessages.map((msg) =>
              msg.id === message.id ? message : msg
            );
          }

          // Nếu tin nhắn chưa tồn tại, thêm mới
          return [...updatedMessages, message];
        });
      }
    },
    [listMember, messages, setMessages, showScrollToBottom]
  );

  useEffect(() => {
    if (listMember) {
      listMemberRef.current = listMember; // Không còn lỗi
    }
  }, [listMember]);

  const handleNewMessage = useCallback(
    (message: IMessage) => {
      if (listMemberRef.current) {
        const currentListMember = listMemberRef.current;
        const senderInfo = currentListMember?.[message.sender_id] || null;

        let modifiedMessage = message.message_display;
        Object.keys(currentListMember).forEach((memberKey) => {
          const fullName = currentListMember[memberKey]?.infor?.full_name;
          if (fullName) {
            const placeholder = `<#${memberKey}>`;
            modifiedMessage = modifiedMessage.replace(placeholder, fullName);
          }
        });

        // Cập nhật nội dung tin nhắn đã thay thế
        const updatedMessage = { ...message, message_display: modifiedMessage };

        setMessages((prev) => {
          // Tìm chỉ số tin nhắn trùng ID
          const existingMessageIndex = prev.findIndex(
            (msg) => msg.id === message.id
          );

          // Nếu tin nhắn đã có
          if (existingMessageIndex !== -1) {
            const existingMessage = prev[existingMessageIndex];

            // Nếu trạng thái mới là SENT và cũ là DELIVERED -> thay thế tin nhắn cũ
            if (
              existingMessage.status === 'DELIVERED' &&
              updatedMessage.status === 'SENT'
            ) {
              const updatedMessages = [...prev];
              updatedMessages[existingMessageIndex] = {
                ...existingMessage,
                ...message,
                sender: senderInfo,
              };
              return updatedMessages; // Trả về danh sách đã thay thế
            }

            // Nếu trạng thái mới là DELIVERED -> giữ nguyên tin nhắn
            if (updatedMessage.status === 'DELIVERED') {
              return prev; // Không thay đổi gì, giữ nguyên tin nhắn hiện tại
            }

            // Nếu tin nhắn có trạng thái khác, vẫn giữ nguyên (không thay đổi)
            return prev;
          }

          // Nếu tin nhắn không trùng ID, thêm mới vào danh sách
          return [{ ...updatedMessage, sender: senderInfo }, ...prev]; // Thêm vào đầu danh sách
        });

        // Nếu tin nhắn trong room hiện tại, đánh dấu là đã đọc
        if (message.room_id === roomId && !showScrollToBottom) {
          markAsRead();
        }

        // Tăng số lượng tin nhắn chưa đọc
        if (showScrollToBottom) {
          setNumberMessageUnread((prev) => prev + 1);
        }
      }
    },
    [listMember, setMessages, showScrollToBottom, roomId]
  );

  const getMessageListData = useCallback(async () => {
    if (loading || !hasMoreData || !listMember) return;
    setLoading(true);

    const previousScrollTop = messageListRef.current?.scrollTop || 0;
    const currentLastMessageId = lastMessageId; // Lưu lại giá trị hiện tại

    try {
      if (listMemberRef.current) {
        const currentListMember = listMemberRef.current;

        const response = await getMessageByRoom(
          roomId,
          20,
          currentLastMessageId
        );
        if (response.data?.length) {
          const messageList = response.data;
          setLastMessageId(messageList[messageList.length - 1]?.id); // Cập nhật chính xác id mới nhất
          const newMessages = messageList.map((msg: IMessage) => ({
            ...msg,
            sender: currentListMember?.[msg.sender_id],
          }));

          setMessages((prev) => {
            const map = new Map(
              [...prev, ...newMessages].map((msg) => [msg.id, msg])
            );
            return Array.from(map.values());
          });

          setTimeout(() => {
            if (messageListRef.current) {
              messageListRef.current.scrollTop = previousScrollTop;
            }
          }, 0);
        } else {
          setHasMoreData(false);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [roomId, lastMessageId, listMember, loading, hasMoreData, setMessages]);

  useEffect(() => {
    if (messages.length === 0 && listMember) getMessageListData();
  }, [roomId, listMember, getMessageListData]);

  useEffect(() => {
    //Xóa tin nhắn reply khi thay đổi phòng
    setIsReplyMessage(false);
    setMessageReply(null);
  }, [roomId]);

  useEffect(() => {
    if (socket) {
      socket.on(`new-message/${roomId}`, handleNewMessage);
      socket.on(`recall-message/${roomId}`, handleRecallMessage);
      return () => {
        socket.off(`new-message/${roomId}`);
        socket.off(`recall-message/${roomId}`);
      };
    }
  }, [socket, roomId, handleNewMessage, handleRecallMessage]);

  useEffect(() => {
    if (hasMoreData) {
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          // kiểm tra element có nằm trong viewport không?
          getMessageListData();
        }
      });

      if (loadMoreRef.current) {
        observer.observe(loadMoreRef.current);
      }

      return () => {
        if (loadMoreRef.current) {
          observer.unobserve(loadMoreRef.current);
        }
      };
    }
  }, [listMember, hasMoreData, getMessageListData]);

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
            hasMoreData={hasMoreData}
            ref={loadMoreRef}
          />
          <div ref={messageEndRef} />
        </div>
      </div>
      {showScrollToBottom && (
        <div
          onClick={() => scrollToBottom(true)}
          className="absolute right-7 md:right-14 bottom-24 cursor-pointer"
        >
          {numberMessageUnread !== 0 && (
            <span className=" inline-flex items-center justify-center text-[12px] leading-[16px] font-bold p-1 min-w-7 h-7 text-white bg-red-500 border-2 border-white rounded-full absolute -top-2 -left-1">
              {numberMessageUnread > 99 ? '99+' : numberMessageUnread}
            </span>
          )}

          <ScrollBottomIcon />
        </div>
      )}
      <ChatInput onSendMessage={handleSendMessage} roomId={roomId} />
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
        setVisible={setVisible}
        imageView={imageView}
      />
    </div>
  );
};

export default ChatScreen;
