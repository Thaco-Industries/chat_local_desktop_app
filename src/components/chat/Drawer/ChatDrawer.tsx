import React, { Dispatch, SetStateAction } from 'react';
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';

import ChatDrawerDetail from './ChatDrawerDetail';
import { IChatDrawer } from '../../../interfaces/ChatDrawer';

const ChatDrawer: React.FC<IChatDrawer> = ({
  isCollapsed,
  setIsCollapsed,
  visible,
  setVisible,
  imageView,
  setImageView,
}) => {
  return (
    <Dialog
      open={isCollapsed}
      onClose={() => setIsCollapsed(false)}
      className="relative z-10 xl:hidden"
    >
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity duration-500 ease-in-out data-[closed]:opacity-0"
      />

      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <DialogPanel
              transition
              className="pointer-events-auto relative w-80 max-w-80 transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700"
            >
              <ChatDrawerDetail
                visible={visible}
                setVisible={setVisible}
                imageView={imageView}
                setImageView={setImageView}
              />
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default ChatDrawer;
