import { Button, Modal } from 'flowbite-react';
import React, { Dispatch, SetStateAction } from 'react';
import EmptySearch from '../../../assets/icons/empty-search';

type Props = {
  openAddFriendModal: boolean;
  setOpenAddFriendModal: Dispatch<SetStateAction<boolean>>;
};

function AddFriendModal({ openAddFriendModal, setOpenAddFriendModal }: Props) {
  const closeModal = () => {
    setOpenAddFriendModal(false);
  };

  if (!openAddFriendModal) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center w-full h-full bg-black bg-opacity-50"
      aria-hidden="true"
      onClick={closeModal}
    >
      <div
        className="relative w-[30vw] h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal content */}
        <div className="relative flex flex-col bg-white rounded-lg shadow w-full h-full">
          {/* Modal header */}
          <div className="flex items-center justify-between p-4 px-[20px] pt-[20px] rounded-t">
            <h3 className="text-[16px] font-semibold text-title">
              Thêm bạn bè
            </h3>
            <button
              type="button"
              onClick={closeModal}
              className="text-[#7B7B7BD9] bg-transparent rounded-lg text-sm w-8 h-8 ms-autoborder-border inline-flex justify-center items-center"
            >
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          {/* Modal body */}
          <div className="w-full px-5">
            <div className="relative">
              <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                type="search"
                id="default-search"
                className="block w-full h-[20px] ps-8 text-sm text-lightText border-none ring-0 rounded-lg focus:border-none focus:ring-0 bg-white"
                placeholder="Nhập MSNV hoặc tên nhân viên"
                required
              />
            </div>
          </div>{' '}
          <hr className="mt-3 text-border" />
          <div className="w-full mt-[50px] flex justify-center">
            <EmptySearch size="120" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddFriendModal;
