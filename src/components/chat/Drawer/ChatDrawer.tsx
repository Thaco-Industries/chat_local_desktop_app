import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';

import ChatDrawerDetail from './ChatDrawerDetail';
import { IChatDrawer } from '../../../interfaces/ChatDrawer';
import clsx from 'clsx';

const ChatDrawer: React.FC<IChatDrawer> = ({
  isCollapsed,
  setIsCollapsed,
  visible,
  setVisible,
  imageView,
  setImageView,
}) => {
  const closeDrawer = () => {
    setIsCollapsed(false);
  };

  return (
    <div className="xl:hidden">
      {isCollapsed && (
        <div className="fixed inset-0 z-30" onClick={closeDrawer} />
      )}
      {isCollapsed && (
        <div
          id="drawer-right-example"
          className={clsx(
            'fixed top-0 right-0 z-40 h-screen overflow-y-auto bg-white w-80 transition-transform duration-500',
            { 'translate-x-0': isCollapsed }
          )}
          aria-labelledby="drawer-right-label"
        >
          <ChatDrawerDetail
            visible={visible}
            setVisible={setVisible}
            imageView={imageView}
            setImageView={setImageView}
          />
        </div>
      )}
    </div>
  );
};

export default ChatDrawer;
