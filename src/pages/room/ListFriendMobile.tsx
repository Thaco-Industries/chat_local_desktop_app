import React, { useEffect, useState } from 'react';
import { useFetchApi } from '../../context/ApiContext';
import ArrowLeft from '../../assets/icons/arrow-left';
import UserAvatar from '../../components/common/UserAvatar';

interface ListFriendMobileProps {
  setIsShowListFriends: React.Dispatch<React.SetStateAction<boolean>>;
  setIsShowMain: React.Dispatch<React.SetStateAction<boolean>>;
}

const ListFriendMobile: React.FC<ListFriendMobileProps> = ({
  setIsShowListFriends,
  setIsShowMain,
}) => {
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
    <div className="h-full flex flex-col overflow-hidden">
      {/* top */}
      <div className="h-[65px] w-full border-b border-solid border-[#DCDCDC] bg-white flex items-center pl-[15px] flex-shrink-0">
        <ArrowLeft
          onClick={() => {
            setIsShowListFriends(false);
            setIsShowMain(true);
          }}
          className="cursor-pointer"
        />
        <span className="text-[18px] font-semibold ml-[10px]">
          Danh sách bạn bè
        </span>
      </div>
      {/* end top */}
      {/* body */}
      <div className="w-full h-full">
        <div className="bg-white w-full h-full rounded-[6px] pt-[15px] flex flex-col">
          <span className="text-[16px] font-semibold px-[20px]">
            Tổng số bạn ({listFriends.length})
          </span>
          <div className="mt-[15px] overflow-y-auto">
            {listFriends &&
              listFriends.map(
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
                      className="list-friend__list-item pt-[13px] pb-[12px] px-[20px] flex items-center"
                      key={index}
                      // onClick={() => handleFriendClick(item)}
                    >
                      {/* avatar */}
                      <div className="min-w-[45px] min-h-[45px] max-w-[45px] max-h-[45px] relative">
                        <UserAvatar
                          url={item.avt_url}
                          fullName={item.full_name}
                          senderId={item.id}
                          size={45}
                        />
                        {item.isOnline && (
                          <div className=" absolute bottom-0 right-[2px] w-[10px] h-[10px] bg-[#4DD965] rounded-full border-solid border-[1px] border-white" />
                        )}
                      </div>
                      {/* name */}
                      <span className="ml-[20px] text-[16px]">
                        {item.full_name}
                      </span>
                      {/* end name */}
                    </div>
                  );
                }
              )}
          </div>
        </div>
      </div>
      {/* end body */}
    </div>
  );
};
export default ListFriendMobile;
