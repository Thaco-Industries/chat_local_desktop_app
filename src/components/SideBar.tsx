import React from 'react';
import MessageIcon from '../assets/icons/message';
import UserSquareIcon from '../assets/icons/user-square';
import PeopleIcon from '../assets/icons/people';
import SettingIcon from '../assets/icons/setting';
import clsx from 'clsx';
import { Link, useLocation } from 'react-router-dom';

export const SideBar: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;

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
  return (
    <div className="w-[70px] h-full bg-primary rounded-ee-sm rounded-se-sm py-xs flex flex-col justify-start items-center gap-7">
      <Link to="/profile" className="avatar px-xs ">
        <div className="w-xl rounded-full border border-white border-solid">
          <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
        </div>
      </Link>
      <div className="w-full flex flex-col justify-around items-center">
        {menuItems &&
          menuItems.map((item, index) => (
            <a
              href={item.url}
              key={index}
              className={clsx('flex flex-col min-w-[70px] h-xl', {
                'bg-[rgba(255,255,255,0.15)]': currentPath === item.url,
              })}
            >
              <span className="m-auto flex items-center justify-center">
                <div className="indicator">
                  {item.badge && (
                    <span className="indicator-item badge badge-sm bg-red-600  border-red-600 text-white">
                      9
                    </span>
                  )}
                  {item.icon}
                </div>
              </span>
            </a>
          ))}
      </div>
    </div>
  );
};
