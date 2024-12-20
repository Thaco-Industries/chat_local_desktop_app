import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { SideBar } from './SideBar';
import { MessageProvider, useMessageContext } from '../context/MessageContext';
import { useConfigSystemService } from '../services/ConfigSystemService';

export const Layout: React.FC = () => {
  const { getConfigSystem } = useConfigSystemService();
  const { setConfigSystemValue } = useMessageContext();
  useEffect(() => {
    getConfig();
  }, []);

  async function getConfig() {
    const response = await getConfigSystem();
    if (response.data) {
      setConfigSystemValue(response.data);
    }
  }
  return (
    <div className="font-nunito w-screen h-screen flex">
      <SideBar />
      {/* Outlet chỉ render nội dung của route con */}
      <div className="flex-1 overflow-hidden w-full bg-background-500">
        <Outlet />
      </div>
    </div>
  );
};
