import React, { useCallback, useEffect, useState } from 'react';
import MessageIcon from '../assets/icons/message';
import UserSquareIcon from '../assets/icons/user-square';
import PeopleIcon from '../assets/icons/people';
import SettingIcon from '../assets/icons/setting';
import clsx from 'clsx';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Popover } from 'flowbite-react';
import { deleteAuthCookie, getAuthCookie } from '../actions/auth.action';
import { useMessageContext } from '../context/MessageContext';
import UserAvatar from './common/UserAvatar';
import { useSocket } from '../context/SocketContext';
import { useMessageService } from '../services/MessageService';
import FeedbackIcon from '../assets/icons/feedback';
import ProfileIcon from '../assets/icons/profile';
import { useFriendService } from '../services/FriendService';
import { useRoomService } from '../services/RoomService';
import { INotificationRequest } from '../interfaces';

export const SideBar: React.FC = () => {
  const {
    roomList,
    unreadRooms,
    setUnreadRooms,
    setRoomList,
    setIsSearchMessage,
    setRoomId,
    setNumberOfFriendRequest,
    numberOfFriendRequest,
    numberOfInvitedRoom,
    setNumberOfInvitedRoom,
  } = useMessageContext();
  const { getInvitedRoom } = useRoomService();
  const { getFriendRequests } = useFriendService();
  const { getNumberConversationNotRead } = useMessageService();
  const { socket } = useSocket();
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();
  const userAuth = getAuthCookie();

  const [open, setOpen] = useState(false);

  useEffect(() => {
    handleNewFriendRequest(null);
    handleNewInvitation(null);
    if (currentPath !== '/') {
      // setUnreadRooms(0);
      setRoomList([]);
      setIsSearchMessage(false);
      setRoomId('');
    }
  }, [currentPath]);

  const updateUnreadRooms = async () => {
    if (location.pathname === '/') {
      const unreadCount = roomList.filter(
        (r) => r.number_message_not_read > 0
      ).length;
      setUnreadRooms(unreadCount);
    } else {
      const response = await getNumberConversationNotRead();
      if (response.data) setUnreadRooms(response.data);
    }
  };

  useEffect(() => {
    window.electronAPI.updateBadge(unreadRooms);
  }, [unreadRooms]);

  useEffect(() => {
    updateUnreadRooms();
  }, [roomList]);

  const openFeedbackForm = () => {
    const url =
      'https://docs.google.com/forms/d/e/1FAIpQLSeQ9f_GVmgrQ4gMES8Dl_BLjXqxG4XBmyw7bA4GLa44JAkaIQ/viewform';
    window.electronAPI
      .openUrl(url)
      .then((response: { success: boolean; error?: string }) => {
        if (response.success) {
          console.log('URL opened successfully');
        } else {
          console.error('Failed to open URL:', response.error);
        }
      });
  };

  const handleNewMessage = useCallback(async () => {
    await updateUnreadRooms();
  }, [roomList]);

  const handleNewFriendRequest = async (message: any) => {
    if (window.electronAPI) {
      if (!message) return;
      const notifyContent: INotificationRequest = {
        title: message.title || 'Thông báo mới',
        description: message.description || 'Bạn có một yêu cầu kết bạn mới.',
        type: 'friendRequest',
      };
      window.electronAPI.notifyRequest(notifyContent);
    } else {
      console.error('electronAPI.notifyRequest không được định nghĩa');
    }
    const response = await getFriendRequests();
    if (response.data) {
      setNumberOfFriendRequest(response.data.length);
    }
  };

  useEffect(() => {
    const handleNotification = async (data: INotificationRequest) => {
      try {
        if (data.type === 'friendRequest') {
          navigate('/room');
        } else if (data.type === 'groupInvite') {
          navigate('/group');
        }
      } catch (error) {
        console.error('Error handling notification:', error);
      }
    };

    window.electronAPI.onRequestNotificationClicked(handleNotification);

    return () => {
      // Clean up listener
      window.electronAPI.removeListener(
        'request-notification-clicked',
        handleNotification
      );
    };
  }, []);

  const handleNewInvitation = async (message: any) => {
    if (window.electronAPI) {
      if (!message) return;
      const notifyContent: INotificationRequest = {
        title: message.title || 'Thông báo mới',
        description: message.description || 'Bạn có một yêu cầu kết bạn mới.',
        type: 'groupInvite',
      };
      window.electronAPI.notifyRequest(notifyContent);
    } else {
      console.error('electronAPI.notifyRequest không được định nghĩa');
    }
    const response = await getInvitedRoom();
    if (response.data) {
      setNumberOfInvitedRoom(response.data.length);
    }
  };

  useEffect(() => {
    if (socket) {
      socket.on(`notification-new-message`, handleNewMessage);
      socket.on(`new-friend-request`, handleNewFriendRequest);
      socket.on(`new-invitation`, handleNewInvitation);
      return () => {
        socket.off(`notification-new-message`);
        socket.off(`new-friend-request`);
        socket.off(`new-invitation`);
      };
    }
  }, [socket, handleNewMessage]);

  const menuItems = [
    {
      icon: <MessageIcon />,
      title: 'Tin nhắn',
      url: '/',
      badge: true,
    },
    {
      icon: <UserSquareIcon />,
      title: 'Bạn bè',
      url: '/room',
      badge: true,
    },
    {
      icon: <PeopleIcon />,
      title: 'Nhóm',
      url: '/group',
      badge: false,
    },
    {
      icon: <ProfileIcon />,
      title: 'Cá nhân',
      url: '/profile',
      badge: false,
    },
    {
      icon: <SettingIcon />,
      title: 'Cài đặt',
      url: '/setting',
      badge: false,
    },
  ];

  const handleLogout = () => {
    deleteAuthCookie();
    setRoomList([]);
    setIsSearchMessage(false);
    setRoomId('');
    navigate('/login');
  };

  const content = (
    <div className="w-56">
      <div className="px-[20px] py-[10px]">
        <p
          className="cursor-pointer text-lg"
          onClick={() => {
            setOpen(false);
            navigate('/profile');
          }}
        >
          Thông tin tài khoản
        </p>
        <p className="mt-xxs cursor-pointer text-lg" onClick={handleLogout}>
          Đăng xuất
        </p>
      </div>
    </div>
  );

  return (
    <div className="w-[70px] h-full bg-primary py-xs flex flex-col justify-start items-center gap-xs">
      <Popover
        content={content}
        open={open}
        onOpenChange={setOpen}
        placement="bottom"
        className="absolute z-20 inline-block w-max max-w-[100vw] bg-white outline-none border border-gray-200 rounded-[4px] shadow-sm"
      >
        <div className="avatar px-xs cursor-pointer">
          <UserAvatar
            fullName={userAuth?.user.infor.full_name}
            senderId={userAuth?.user.id || ''}
            url={userAuth?.user.infor.avt_url}
            size={50}
          />
        </div>
      </Popover>
      <div className="w-full flex flex-col justify-around items-center">
        {menuItems &&
          menuItems.map((item, index) => (
            <Link
              to={item.url}
              key={index}
              className={clsx('flex flex-col min-w-[70px] h-xl', {
                'bg-[rgba(255,255,255,0.15)]': currentPath === item.url,
              })}
              title={item.title}
            >
              <span className="m-auto flex items-center justify-center">
                <div className="indicator">
                  {item.title === 'Tin nhắn' && Number(unreadRooms) > 0 && (
                    <span className="absolute inline-flex items-center justify-center text-[8px] leading-[12px] font-bold p-1 min-w-5 h-5 text-white bg-red-500 rounded-full -top-2 -end-3">
                      {unreadRooms}
                    </span>
                  )}
                  {item.title === 'Bạn bè' &&
                    Number(numberOfFriendRequest) > 0 && (
                      <span className="absolute inline-flex items-center justify-center text-[8px] leading-[12px] font-bold p-1 min-w-5 h-5 text-white bg-red-500 rounded-full -top-2 -end-3">
                        {numberOfFriendRequest}
                      </span>
                    )}
                  {item.title === 'Nhóm' && Number(numberOfInvitedRoom) > 0 && (
                    <span className="absolute inline-flex items-center justify-center text-[8px] leading-[12px] font-bold p-1 min-w-5 h-5 text-white bg-red-500 rounded-full -top-2 -end-3">
                      {numberOfInvitedRoom}
                    </span>
                  )}
                  {item.icon}
                </div>
              </span>
            </Link>
          ))}
      </div>
      <div className="min-w-[70px] h-xl flex-1 flex items-end justify-center">
        <div className="cursor-pointer" onClick={openFeedbackForm}>
          <FeedbackIcon />
        </div>
      </div>
    </div>
  );
};
