import React from 'react';
import SearchIcon from '../../assets/icons/search';
import AddGroupIcon from '../../assets/icons/add-group';
import AddFriendIcon from '../../assets/icons/add-friend';

function SearchAndAddToolbar() {
  return (
    <div className="w-full flex px-5 pt-5 items-center gap-4 mb-5">
      <label className="input h-10 flex flex-1 items-center gap-2 bg-lightGrey text-navyGrey rounded-[22px] focus:border-none focus-within:border-none focus:outline-none focus-within:outline-none min-w-[110px]">
        <SearchIcon />
        <input
          type="text"
          className="grow min-w-[110px]"
          placeholder="Tìm kiếm"
        />
      </label>
      <div className="flex gap-xs">
        <button className="btn btn-square btn-ghost btn-sm" title="Thêm bạn">
          <AddFriendIcon />
        </button>
        <button
          className="btn btn-square btn-ghost btn-sm"
          title="Tạo nhóm chat"
        >
          <AddGroupIcon />
        </button>
      </div>
    </div>
  );
}

export default SearchAndAddToolbar;
