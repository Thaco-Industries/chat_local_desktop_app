import React, { useEffect, useState } from 'react';
import { useFetchApi } from '../../context/ApiContext';
import ArrowLeft from '../../assets/icons/arrow-left';
import UserAvatar from '../../components/common/UserAvatar';
import { formatDate } from '../../util/formatDate';

interface ListAddGroupMobileProps {
  setIsShowListAddFriends: React.Dispatch<React.SetStateAction<boolean>>;
  setIsShowMain: React.Dispatch<React.SetStateAction<boolean>>;
}

const ListAddGroupMobile: React.FC<ListAddGroupMobileProps> = ({
  setIsShowListAddFriends,
  setIsShowMain,
}) => {
  const { apiRequest } = useFetchApi();
  const [listAddGroups, setListAddGroups] = useState([]);
  useEffect(() => {
    getListAddGroups();
  }, []);
  const getListAddGroups = async () => {
    try {
      const response = await apiRequest('GET', 'invited-rooms');
      if (response.data) {
        setListAddGroups(response.data);
      }
    } catch (err) {
      console.error('API call failed: ', err);
    }
  };
  const handleGroup = async (id: string, mode: string) => {
    var urlHandle = 'invited-rooms/accept-invited-room/';
    if (mode === 'REJECTED') urlHandle = 'invited-rooms/reject-invited-room/';
    try {
      const response = await apiRequest('PUT', urlHandle + id);
      if (response.status == 200) {
        getListAddGroups();
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
    }
  };
  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* top */}
      <div className="h-[65px] w-full border-b border-solid border-[#DCDCDC] bg-white flex items-center pl-[15px] flex-shrink-0">
        <ArrowLeft
          onClick={() => {
            setIsShowListAddFriends(false);
            setIsShowMain(true);
          }}
          className="cursor-pointer"
        />
        <span className="text-[18px] font-semibold ml-[10px]">
          Lời mời vào nhóm
        </span>
      </div>
      {/* end top */}
      <div className="w-full h-full">
        <div className="bg-white w-full h-full rounded-[6px] py-[20px] flex flex-col">
          <span className="text-[14px] font-semibold px-[20px]">
            Tổng số nhóm ({listAddGroups.length})
          </span>
          <div className="mt-[15px] flex flex-wrap overflow-y-auto items-start pl-[20px]">
            {listAddGroups &&
              listAddGroups.map(
                (
                  item: {
                    avatar_url: string;
                    roomName: string;
                    numberMembers: string;
                    id: string;
                    invitedTime: string;
                  },
                  index
                ) => {
                  return (
                    <div
                      className="list-add-group__list-item py-[12px] w-[100%] flex items-center"
                      key={`${index}-${Math.random()
                        .toString(36)
                        .substring(7)}`}
                    >
                      <div className="w-[45px] h-[45px] rounded-full flex justify-center items-center relative flex-shrink-0">
                        <UserAvatar
                          url={item.avatar_url}
                          fullName={item.roomName}
                          senderId={item.id}
                        />
                      </div>
                      <div className="flex flex-col w-full ml-[15px]">
                        <div className="flex flex-col flex-grow overflow-hidden">
                          <span className="list-add-friend__text-ba-cham text-[14px] overflow-hidden whitespace-nowrap text-ellipsis">
                            {item.roomName}
                          </span>
                          <div className="list-add-group__item__desc flex items-center">
                            <span className="text-[13px] text-[#7B87A1] mr-[15px]">
                              {/* Từ {calculateTimeAgo(item.invitedTime)} trước */}
                              {item.numberMembers} thành viên
                            </span>
                            <div className="flex items-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                              >
                                <path
                                  d="M5.33203 1.33398V3.33398"
                                  stroke="#7B87A2"
                                  strokeWidth="1.5"
                                  strokeMiterlimit="10"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M10.668 1.33398V3.33398"
                                  stroke="#7B87A2"
                                  strokeWidth="1.5"
                                  strokeMiterlimit="10"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M2.33203 6.06055H13.6654"
                                  stroke="#7B87A2"
                                  strokeWidth="1.5"
                                  strokeMiterlimit="10"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M14 5.66732V11.334C14 13.334 13 14.6673 10.6667 14.6673H5.33333C3 14.6673 2 13.334 2 11.334V5.66732C2 3.66732 3 2.33398 5.33333 2.33398H10.6667C13 2.33398 14 3.66732 14 5.66732Z"
                                  stroke="#7B87A2"
                                  strokeWidth="1.5"
                                  strokeMiterlimit="10"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M10.4625 9.13411H10.4685"
                                  stroke="#7B87A2"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M10.4625 11.1341H10.4685"
                                  stroke="#7B87A2"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M7.99764 9.13411H8.00363"
                                  stroke="#7B87A2"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M7.99764 11.1341H8.00363"
                                  stroke="#7B87A2"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M5.5328 9.13411H5.53878"
                                  stroke="#7B87A2"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M5.5328 11.1341H5.53878"
                                  stroke="#7B87A2"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                              <span className="text-[13px] text-[#7B87A1] ml-[5px]">
                                {formatDate(item.invitedTime)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex mt-[5px]">
                          <span
                            className="w-[86px] h-[32px] border-solid border-[1px] border-[#A1A1A1] rounded-[24px] flex justify-center items-center text-[#485259] text-[14px] cursor-pointer flex-shrink-0"
                            onClick={() => handleGroup(item.id, 'REJECTED')}
                          >
                            Từ chối
                          </span>
                          <span
                            className="w-[86px] h-[32px] bg-[#076EB8] rounded-[24px] flex justify-center items-center text-white text-[14px] cursor-pointer ml-[10px] flex-shrink-0"
                            onClick={() => handleGroup(item.id, 'ACCEPTED')}
                          >
                            Đồng ý
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                }
              )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default ListAddGroupMobile;
