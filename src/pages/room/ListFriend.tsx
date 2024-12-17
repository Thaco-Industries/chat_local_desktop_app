import React, { useState, useEffect } from 'react';

import UserSquareIcon from '../../assets/icons/user-square';
import { useFetchApi } from '../../context/ApiContext';
import UserAvatar from '../../components/common/UserAvatar';

const ListFriend: React.FC = () => {
  const [listFriends, setListFriends] = useState([]);
  const { apiRequest } = useFetchApi();

  useEffect(() => {
    getListFriends();
  }, []);

  const getListFriends = async () => {
    try {
      const response = await apiRequest('GET', 'friend/list-friend');
      if (response.data) {
        setListFriends(response.data);
      }
    } catch (err) {
      console.error('API call failed: ', err);
    }
  };

  return (
    <div className="h-full flex-1">
      {/* top */}
      <div className="h-[65px] bg-white w-full pl-[30px] flex items-center border-b border-solid border-[#DCDCDC]">
        <UserSquareIcon color="#485259" />
        <span className="text-[16px] font-semibold ml-[10px]">
          Danh sách bạn bè
        </span>
      </div>
      {/* end top */}
      {/* body */}
      <div className="p-[10px] w-full h-full">
        <div className="bg-white w-full h-[calc(100%-65px)] rounded-[6px] py-[20px] flex flex-col">
          <span className="text-[14px] font-semibold pl-[20px]">
            Tổng số bạn ({listFriends.length})
          </span>
          {/* list */}
          <div className="mt-[15px] overflow-y-auto">
            {/* item */}
            {listFriends?.map(
              (
                item: {
                  full_name: string;
                  isOnline: boolean;
                  avt_url: string;
                  id: string;
                },
                index
              ) => {
                return (
                  <div
                    className="pt-[13px] pb-[12px] px-[20px] flex items-center hover:bg-[#91cffb33] cursor-pointer"
                    key={index}
                    // onClick={() => handleFriendClick(item)}
                  > 
                    {/* avatar */}
                    <div className="min-w-[45px] min-h-[45px] max-w-[45px] max-h-[45px] relative">
                      <UserAvatar
                        url={item.avt_url}
                        fullName={item.full_name}
                        senderId={item.id}
                      />
                      {item.isOnline && (
                        <div className=" absolute bottom-0 right-[2px] w-[10px] h-[10px] bg-[#4DD965] rounded-full border-solid border-[1px] border-white" />
                      )}
                    </div>
                    {/* name */}
                    <span className="ml-[20px] text-[14px]">
                      {item.full_name}
                    </span>
                    {/* <span className="ml-[20px] text-[14px]">12345</span> */}
                    {/* end name */}
                  </div>
                );
              }
            )}
            {/* end item */}
          </div>
          {/* end list */}
        </div>
      </div>
      {/* end body */}
    </div>
  );
};

export default ListFriend;
