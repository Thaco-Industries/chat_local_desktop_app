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
import { useRoomService } from '../../services/RoomService';
import { notify } from '../../helper/notify';
import { useFriendService } from '../../services/FriendService';
import { useFileService } from '../../services/FileService';
import { useMessageContext } from '../../context/MessageContext';
import _ from 'lodash';

const ChatScreen: React.FC<IChatScreen> = ({
  roomId,
  setRoomId,
  roomInfo,
  setRoomInfo,
  isDesktopCollapsed,
  setIsDesktopCollapsed,
  visible,
  setVisible,
  imageView,
  setImageView,
  isVideo,
  setIsVideo,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const [numberMessageUnread, setNumberMessageUnread] = useState(0);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const listMemberRef = useRef<Record<string, IUserInRoomInfo> | null>(null);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const { getAllFilesInRoom } = useFileService();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {
    setListMember,
    listMember,
    messages,
    setMessages,
    lastMessageId,
    setLastMessageId,
    newerMessageId,
    setNewerMessageId,
    hasMoreData,
    setHasMoreData,
    setMessageReply,
    setIsReplyMessage,
    messageListRef,
    hasMoreMessages,
    setHasMoreMessages,
    setBufferMessages,
    isSearching,
    setIsSearching,
  } = useChatContext();
  const { isChangeRoomProcessing } = useMessageContext();
  const {
    markAsReadMessage,
    getMessageByRoom,
    sendMessage,
    getRedirectMessage,
  } = useMessageService();
  const { searchUserById } = useFriendService();

  const { getMemberInRoom } = useRoomService();
  const { socket } = useSocket();

  const markAsRead = async () => {
    try {
      await markAsReadMessage(roomId);
    } catch (err) {
      console.error('API call failed: ', err);
    }
  };

  const scrollToBottom = useCallback(async () => {
    // debugger;
    messageEndRef.current?.scrollIntoView({
      behavior: 'auto',
    });
    if (numberMessageUnread > 0) {
      await markAsRead(); // Gọi API đánh dấu đã đọc
      setNumberMessageUnread(0);
    }
    setShowScrollToBottom(false);
    // Lấy danh sách tin nhắn
  }, [numberMessageUnread, roomId, markAsRead]);

  const handleRecallMessage = useCallback(
    (message: IMessage) => {
      console.log(message);

      if (messages && listMemberRef.current) {
        const currentListMember = listMemberRef.current;
        const senderInfo = currentListMember?.[message.sender_id] || null;
        setMessages((prevMessages) => {
          // Tìm vị trí của tin nhắn hiện tại theo `id`

          const updatedMessages = prevMessages.map((msg) => {
            if (msg.reply_id?.id === message.id) {
              return {
                ...msg,
                reply_id: {
                  ...msg.reply_id,
                  message_display: message.message_display,
                  sender: senderInfo,
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
              msg.id === message.id ? { ...message, sender: senderInfo } : msg
            );
          }

          // Nếu tin nhắn chưa tồn tại, thêm mới
          return [
            ...updatedMessages,
            {
              ...message,
              sender: senderInfo, // Gắn thông tin người gửi vào tin nhắn mới
            },
          ];
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

        if (isSearching) {
          setBufferMessages((prev) => {
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
        } else {
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
        }

        // Tăng số lượng tin nhắn chưa đọc
        if (showScrollToBottom) {
          setNumberMessageUnread((prev) => prev + 1);
        }
      }
    },
    [listMember, showScrollToBottom, roomId]
  );

  const handleUserJoinAndOutRoom = async () => {
    try {
      const response = await getMemberInRoom(roomId);
      if (response.data) {
        setListMember(response.data);
      }
    } catch (error) {
      console.error('API call failed: ', error);
    }
  };
  const lastMessageIdRef = useRef<string>('');
  const getMessageListData = useCallback(async () => {
    if (
      isChangeRoomProcessing ||
      !hasMoreData ||
      !listMember ||
      isAutoScrolling
    )
      return;
    setIsLoading(true);
    const previousScrollTop = messageListRef.current?.scrollTop || 0;

    try {
      if (listMemberRef.current) {
        const currentListMember = listMemberRef.current;

        const response = await getMessageByRoom(
          roomId,
          15,
          lastMessageIdRef.current
        );
        if (response.data?.length) {
          const messageLists = response.data.map((msg: IMessage) => ({
            ...msg,
            sender: currentListMember?.[msg.sender_id],
          }));
          lastMessageIdRef.current = messageLists[messageLists.length - 1]?.id;
          setLastMessageId(messageLists[messageLists.length - 1]?.id);

          setMessages(messageLists);

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
      setIsLoading(false);
    }
  }, [roomId, lastMessageId, listMember, isChangeRoomProcessing]);

  const getOldMessages = async () => {
    if (
      isChangeRoomProcessing ||
      !hasMoreData ||
      !listMember ||
      isAutoScrolling
    )
      return;
    const previousScrollTop = messageListRef.current?.scrollTop || 0;

    try {
      if (listMemberRef.current) {
        const currentListMember = listMemberRef.current;

        const response = await getMessageByRoom(
          roomId,
          15,
          lastMessageIdRef.current
        );
        if (response.data?.length) {
          const messageLists = response.data;
          lastMessageIdRef.current = messageLists[messageLists.length - 1]?.id;
          setLastMessageId(messageLists[messageLists.length - 1]?.id); // Cập nhật chính xác id mới nhất
          const newMessages = messageLists.map((msg: IMessage) => ({
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
    }
  };

  const getNewMessages = async () => {
    if (!hasMoreMessages) return;
    const previousScrollHeight = messageListRef.current?.scrollHeight || 0;

    if (listMemberRef.current) {
      const currentListMember = listMemberRef.current;
      try {
        const response = await getRedirectMessage(
          roomId,
          15,
          false,
          newerMessageId
        ); // Endpoint hỗ trợ tải mới
        if (response.data?.length) {
          const messageLists = response.data;
          setNewerMessageId(messageLists[0]?.id || ''); // Cập nhật ID đầu tiên
          const newMessages = messageLists.map((msg: IMessage) => ({
            ...msg,
            sender: currentListMember?.[msg.sender_id],
          }));

          setMessages((prev) => {
            const map = new Map(
              [...newMessages, ...prev].map((msg) => [msg.id, msg])
            );
            return Array.from(map.values());
          });

          setTimeout(() => {
            if (messageListRef.current) {
              const currentScrollHeight = messageListRef.current.scrollHeight;

              messageListRef.current.scrollTop =
                previousScrollHeight - currentScrollHeight;
            }
          }, 0);
        } else {
          setHasMoreMessages(false); // Đặt trạng thái không còn dữ liệu
        }
      } catch (error) {
        console.error('Error fetching new messages:', error);
      }
    }
  };

  useEffect(() => {
    if (roomInfo.is_group) return;
    async function handleGetUserInfor() {
      const response = await searchUserById(roomInfo.userRoom[0].user_id);
      if (response.data) {
        // setFriendStatus(response.data.status);
        roomInfo.userRoom[0] = {
          ...roomInfo.userRoom[0],
          friendStatus: response.data.status,
        };
      }
    }

    handleGetUserInfor();
  }, [roomId]);

  useEffect(() => {
    lastMessageIdRef.current = '';
    // Chỉ gọi getMessageListData sau khi lastMessageId đã được reset
    if (!isChangeRoomProcessing && roomId) {
      getMessageListData();
    }
  }, [isChangeRoomProcessing, roomId]);

  useEffect(() => {
    //Xóa tin nhắn reply khi thay đổi phòng
    setIsReplyMessage(false);
    setMessageReply(null);
  }, [roomId]);

  const getListMember = async () => {
    const response = await getMemberInRoom(roomInfo.id);
    if (response.status === 200) {
      const updatedList = response.data;
      setListMember(updatedList);
    }
  };

  const handleChangeRoomLeader = () => {
    getListMember();
  };

  const handleListFileChanged = (data: any) => {
    if (data.messageIds.length > 0) {
      setMessages((prevMessages) => {
        const filterMessage = prevMessages.filter(
          (message) => !data.messageIds.includes(message.id)
        );
        return filterMessage;
      });
    }
  };

  useEffect(() => {
    if (socket) {
      socket.on(`new-message/${roomId}`, handleNewMessage);
      socket.on(`recall-message/${roomId}`, handleRecallMessage);
      socket.on(`user-join-room/${roomId}`, handleUserJoinAndOutRoom);
      socket.on(`user-out-room/${roomId}`, handleUserJoinAndOutRoom);
      socket.on(`change-room-leader/${roomInfo.id}`, handleChangeRoomLeader);
      socket.on(
        `list-files-in-room-changed/${roomInfo.id}`,
        handleListFileChanged
      );

      return () => {
        socket.off(`new-message/${roomId}`);
        socket.off(`recall-message/${roomId}`);
        socket.off(`user-join-room/${roomId}`);
        socket.off(`user-out-room/${roomId}`);
        socket.off(`change-room-leader/${roomInfo.id}`);
        socket.off(`list-files-in-room-changed/${roomInfo.id}`);
      };
    }
  }, [
    socket,
    roomId,
    handleNewMessage,
    handleRecallMessage,
    handleUserJoinAndOutRoom,
  ]);

  useEffect(() => {
    const handleScroll = () => {
      if (messageListRef.current) {
        const { scrollTop, scrollHeight, clientHeight } =
          messageListRef.current;

        if (scrollTop <= clientHeight - scrollHeight + 10 && hasMoreData) {
          getOldMessages();
        }
      }
    };

    messageListRef.current?.addEventListener('scroll', handleScroll);
    return () => {
      messageListRef.current?.removeEventListener('scroll', handleScroll);
    };
  }, [getMessageListData, hasMoreData]);

  useEffect(() => {
    const checkScrollHeight = () => {
      if (messageListRef.current && !_.isEmpty(messages)) {
        const scrollHeight = messageListRef.current.scrollHeight;
        const clientHeight = messageListRef.current.clientHeight;
        // Nếu không có scrollbar và vẫn còn dữ liệu, tải thêm tin nhắn

        if (scrollHeight <= clientHeight && hasMoreData) {
          getMessageListData();
        }
      }
    };

    // Kiểm tra ngay khi render hoặc khi danh sách tin nhắn thay đổi
    checkScrollHeight();
  }, [messages, hasMoreData]);

  useEffect(() => {
    if (isSearching) {
      const handleScroll = () => {
        if (messageListRef.current && !isAutoScrolling) {
          const scrollPosition = messageListRef.current.scrollTop;

          if (scrollPosition === 0) {
            if (hasMoreMessages) {
              getNewMessages();
            }
          }
        }
      };

      // Thêm sự kiện lắng nghe cuộn
      const messageList = messageListRef.current;
      messageList?.addEventListener('scroll', handleScroll);

      // Gỡ bỏ sự kiện khi unmount
      return () => {
        messageList?.removeEventListener('scroll', handleScroll);
      };
    }
  }, [
    isSearching,
    isAutoScrolling,
    hasMoreMessages,
    getNewMessages,
    markAsRead,
  ]);

  useEffect(() => {
    if (isSearching) {
      if (!hasMoreMessages && messageListRef.current?.scrollTop === 0) {
        markAsRead();
        setShowScrollToBottom(false);
        setNumberMessageUnread(0);
        setIsSearching(false);
      }
    }
  }, [hasMoreMessages, isSearching]); // Lắng nghe hasMoreMessages và isSearching

  const handleScroll = useCallback(
    (e: any) => {
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
      const scrollPercentage =
        (scrollTop / (scrollHeight - clientHeight)) * 100;

      setShowScrollToBottom(isSearching || scrollPercentage <= -20);

      if (scrollTop === 0 && numberMessageUnread > 0 && !isSearching) {
        markAsRead(); // Gọi hàm đánh dấu đã đọc
        setNumberMessageUnread(0); // Reset số lượng tin nhắn chưa đọc
      }
    },
    [numberMessageUnread, markAsRead]
  );

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
    } catch (error: any) {
      // Lấy thông tin lỗi chi tiết
      const errorMessage = error?.response?.data?.message || error.message;
      notify(errorMessage, 'error');
      console.error('Error:', errorMessage);
    }
  };

  return (
    <div className="flex flex-col bg-background-500 h-full relative">
      <ChatHeader
        roomInfo={roomInfo}
        setRoomInfo={setRoomInfo}
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
        listMember={listMember}
        isVideo={isVideo}
        setIsVideo={setIsVideo}
      />
      <div
        className="flex flex-col-reverse flex-1 overflow-y-auto scrollbar"
        onScroll={handleScroll}
        ref={messageListRef}
      >
        <div className="flex flex-col">
          <MessageList
            isLoading={isLoading}
            messages={messages}
            setImageView={setImageView}
            setVisible={setVisible}
            setIsVideo={setIsVideo}
          />
          <div ref={messageEndRef} />
        </div>
      </div>
      {showScrollToBottom && (
        <div
          onClick={async () => {
            if (isSearching) {
              setIsAutoScrolling(true); // Bắt đầu trạng thái tự động cuộn
              setMessages([]);
              setLastMessageId('');
              await new Promise((resolve) => setTimeout(resolve, 0)); // Đảm bảo cập nhật state xong
              getMessageListData();
            }
            scrollToBottom();
            setTimeout(() => {
              setIsAutoScrolling(false);
              setIsSearching(false);
            }, 300);
          }}
          className="absolute right-7 tablet:right-14 bottom-24 cursor-pointer"
        >
          {numberMessageUnread !== 0 && (
            <span className=" inline-flex items-center justify-center text-[12px] leading-[16px] font-bold p-1 min-w-7 h-7 text-white bg-red-500 border-2 border-white rounded-full absolute -top-2 -left-1">
              {numberMessageUnread > 99 ? '99+' : numberMessageUnread}
            </span>
          )}

          <ScrollBottomIcon />
        </div>
      )}
      <ChatInput
        onSendMessage={handleSendMessage}
        roomId={roomId}
        roomInfo={roomInfo}
      />
      <ChatDrawer
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        visible={visible}
        setVisible={setVisible}
        imageView={imageView}
        setImageView={setImageView}
        roomId={roomId}
        roomInfo={roomInfo}
        setRoomId={setRoomId}
        setRoomInfo={setRoomInfo}
        setIsVideo={setIsVideo}
      />
      <ViewImageModal
        title="Hình ảnh"
        visible={visible}
        setVisible={setVisible}
        imageView={imageView}
        isVideo={isVideo}
      />
    </div>
  );
};

export default ChatScreen;
