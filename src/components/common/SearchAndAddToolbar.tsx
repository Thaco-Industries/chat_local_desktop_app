import React from 'react';
import SearchIcon from '../../assets/icons/search';
import AddGroupIcon from '../../assets/icons/add-group';
import AddFriendIcon from '../../assets/icons/add-friend';

function SearchAndAddToolbar() {
  return (
    <div className="w-full flex px-5 pt-5 items-center gap-4 mb-5">
      <form className="flex flex-1 items-center">
        <label className="sr-only">Search</label>
        <div className="relative w-full">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <SearchIcon />
          </div>
          <input
            type="text"
            className="bg-lightGrey border border-gray-300 text-navyGrey text-sm rounded-[22px] block w-full ps-10 p-2.5 focus:ring-0 focus:border-gray-300"
            placeholder="Tìm kiếm"
            required
          />
        </div>
      </form>
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
