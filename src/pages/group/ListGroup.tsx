import React, { useState, useEffect } from 'react';
import { useFetchApi } from '../../context/ApiContext';
import UserAvatar from '../../components/common/UserAvatar';
import PeopleIcon from '../../assets/icons/people';

const ListGroup: React.FC = () => {
  const [listGroups, setListGroups] = useState([]);
  const { apiRequest } = useFetchApi();
  useEffect(() => {
    getListFriends();
  }, []);
  const getListFriends = async () => {
    try {
      const response = await apiRequest('GET', 'room/list-room-group');
      if (response.data) {
        setListGroups(response.data);
      }
    } catch (err) {
      console.error('API call failed: ', err);
    }
  };
  return (
    <div className="h-full flex-1">
      {/* top */}
      <div className="h-[65px] bg-white w-full pl-[30px] flex items-center border-b border-solid border-[#DCDCDC]">
        <PeopleIcon color="#485259" />
        <span className="text-[16px] font-semibold ml-[10px]">
          Danh sách nhóm
        </span>
      </div>
      {/* end top */}
      {/* body */}
      <div className="p-[10px] w-full h-full">
        <div className="bg-white w-full h-[calc(100%-65px)] rounded-[6px] py-[20px] flex flex-col">
          <span className="text-[14px] font-semibold pl-[20px]">
            Tổng số nhóm ({listGroups.length})
          </span>
          {/* list */}
          <div className="mt-[15px] overflow-y-auto">
            {/* item */}
            {listGroups?.map(
              (
                item: {
                  room_name: string;
                  isOnline: boolean;
                  avt_url: string;
                  room_id: string;
                  member_count: string;
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
                        fullName={item.room_name}
                        senderId={item.room_id}
                      />
                      {item.isOnline && (
                        <div className=" absolute bottom-0 right-[2px] w-[10px] h-[10px] bg-[#4DD965] rounded-full border-solid border-[1px] border-white" />
                      )}
                    </div>
                    {/* name */}
                    <div className="ml-[20px] flex flex-col">
                      <span className="text-[14px]">{item.room_name}</span>
                      <div className="">
                        <span className="text-[13px] text-[#7B87A1] mt-[3px]">
                          {item.member_count} thành viên
                        </span>
                      </div>
                    </div>
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
export default ListGroup;
