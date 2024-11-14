import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { SideBar } from './SideBar';

export const Layout: React.FC = () => {
  return (
    <div className="font-nunito w-screen h-screen flex">
      <SideBar />

      <div className="flex-1 overflow-hidden w-full bg-background-500">
        <Outlet />
      </div>
    </div>
  );
};
