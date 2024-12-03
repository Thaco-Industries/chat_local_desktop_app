import React, { Dispatch, SetStateAction, useRef, useState } from 'react';
import SearchIcon from '../../assets/icons/search';
import AddGroupIcon from '../../assets/icons/add-group';
import AddFriendIcon from '../../assets/icons/add-friend';
import { useFetchApi } from '../../context/ApiContext';
import { IRoom } from '../../interfaces';
import _ from 'lodash';
import AddFriendModal from '../chat/Friend/AddFriendModal';
import AddRoomModal from '../chat/RoomList/AddRoomModal';

interface SearchProps {
  keyword: string;
  setRoomListSearch: Dispatch<SetStateAction<IRoom[]>>;
  setKeyword: Dispatch<SetStateAction<string>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
}

function SearchAndAddToolbar({
  keyword,
  setKeyword,
  setRoomListSearch,
  setLoading,
}: SearchProps) {
  const { apiRequest } = useFetchApi();
  const [openAddFriendModal, setOpenAddFriendModal] = useState<boolean>(false);
  const [openAddRoomModal, setOpenAddRoomModal] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = _.debounce(async (search: string) => {
    setLoading(true);
    if (search.trim()) {
      const response = await apiRequest('GET', `room/search?name=${search}`);
      if (response.data) {
        setRoomListSearch(response.data);
        setLoading(false);
      }
    }
  });

  const handleInputChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const search = event.target.value;
    setKeyword(search);
    handleSearch(search);
  };

  return (
    <div className="w-full flex px-5 pt-5 items-center gap-4 mb-5">
      <form className="flex flex-1 items-center">
        <label className="sr-only">Search</label>
        <div className="relative w-full">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <SearchIcon />
          </div>
          <input
            ref={inputRef}
            type="text"
            className="bg-lightGrey border border-gray-300 text-navyGrey text-sm rounded-[22px] block w-full ps-10 p-2.5 focus:ring-0 focus:border-gray-300"
            placeholder="Tìm kiếm"
            value={keyword}
            onChange={handleInputChange}
            required
          />
          {keyword && (
            <div className="absolute end-2.5 bottom-2.5 text-sm pe-1 py-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="cursor-pointer"
                onClick={() => {
                  setKeyword('');
                  inputRef.current?.focus();
                }}
                width="12"
                height="12"
                fill="none"
              >
                <path
                  d="M6.58586 5.82143L11.2734 0.233929C11.3519 0.141072 11.2859 0 11.1644 0H9.73943C9.6555 0 9.57514 0.0374999 9.51979 0.101786L5.65372 4.71071L1.78764 0.101786C1.73407 0.0374999 1.65371 0 1.568 0H0.143C0.0215717 0 -0.0444998 0.141072 0.0340716 0.233929L4.72157 5.82143L0.0340716 11.4089C0.0164709 11.4296 0.00517935 11.4549 0.00153715 11.4819C-0.00210506 11.5088 0.00205506 11.5362 0.013524 11.5608C0.024993 11.5855 0.043289 11.6063 0.0662396 11.6208C0.0891901 11.6354 0.115831 11.643 0.143 11.6429H1.568C1.65193 11.6429 1.73229 11.6054 1.78764 11.5411L5.65372 6.93214L9.51979 11.5411C9.57336 11.6054 9.65372 11.6429 9.73943 11.6429H11.1644C11.2859 11.6429 11.3519 11.5018 11.2734 11.4089L6.58586 5.82143Z"
                  fill="#485259"
                />
              </svg>
            </div>
          )}
        </div>
      </form>
      <div className="flex gap-xs">
        <button
          className="btn btn-square btn-ghost btn-sm"
          title="Thêm bạn"
          onClick={() => setOpenAddFriendModal(true)}
        >
          <AddFriendIcon />
        </button>
        <button
          className="btn btn-square btn-ghost btn-sm"
          title="Tạo nhóm chat"
          onClick={() => setOpenAddRoomModal(true)}
        >
          <AddGroupIcon />
        </button>
      </div>
      <AddFriendModal
        openAddFriendModal={openAddFriendModal}
        setOpenAddFriendModal={setOpenAddFriendModal}
      />
      <AddRoomModal
        openAddRoomModal={openAddRoomModal}
        setOpenAddRoomModal={setOpenAddRoomModal}
      />
    </div>
  );
}

export default SearchAndAddToolbar;
