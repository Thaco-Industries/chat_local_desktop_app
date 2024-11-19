import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { SideBar } from './SideBar';
import Message from '../pages/message/Message';

export const Layout: React.FC = () => {
  const location = useLocation();
  return (
    <div className="font-nunito w-screen h-screen flex">
      <SideBar />

      <div className="flex-1 overflow-hidden w-full bg-background-500">
        {location.pathname === '/' ? <Message /> : <Outlet />}
      </div>
    </div>
  );
};
