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

export const SideBar: React.FC = () => {
  const {
    roomList,
    unreadRooms,
    setUnreadRooms,
    setRoomList,
    setIsSearchMessage,
  } = useMessageContext();
  const { getNumberConversationNotRead } = useMessageService();
  const { socket } = useSocket();
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();
  const userAuth = getAuthCookie();

  useEffect(() => {
    setUnreadRooms(0);
    setRoomList([]);
    setIsSearchMessage(false);
  }, [location]);

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

  const handleNewMessage = useCallback(async () => {
    await updateUnreadRooms();
  }, [roomList]);

  useEffect(() => {
    if (socket) {
      socket.on(`notification-new-message`, handleNewMessage);

      return () => {
        socket.off(`notification-new-message`);
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
      badge: false,
    },
    {
      icon: <PeopleIcon />,
      title: 'Nhóm',
      url: '/group',
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
    navigate('/login');
  };

  const content = (
    <div className="w-56">
      <div className="px-[20px] py-[10px]">
        <p className="cursor-pointer text-lg">Thông tin tài khoản</p>
        <p className="mt-xxs cursor-pointer text-lg" onClick={handleLogout}>
          Đăng xuất
        </p>
      </div>
    </div>
  );

  return (
    <div className="w-[70px] h-full bg-primary rounded-ee-sm rounded-se-sm py-xs flex flex-col justify-start items-center gap-7">
      <Popover
        content={content}
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
            >
              <span className="m-auto flex items-center justify-center">
                <div className="indicator">
                  {item.badge && Number(unreadRooms) > 0 && (
                    <span className="absolute inline-flex items-center justify-center text-[8px] leading-[12px] font-bold p-1 min-w-5 h-5 text-white bg-red-500 rounded-full -top-2 -end-3">
                      {unreadRooms}
                    </span>
                  )}
                  {item.icon}
                </div>
              </span>
            </Link>
          ))}
      </div>
    </div>
  );
};
