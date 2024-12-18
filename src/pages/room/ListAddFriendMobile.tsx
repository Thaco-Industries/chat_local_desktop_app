import React, { useEffect, useState } from 'react';
import ArrowLeft from '../../assets/icons/arrow-left';
import { useFetchApi } from '../../context/ApiContext';
import UserAvatar from '../../components/common/UserAvatar';
import { formatDate } from '../../util/formatDate';

interface ListAddFriendMobileProps {
  setIsShowListAddFriends: React.Dispatch<React.SetStateAction<boolean>>;
  setIsShowMain: React.Dispatch<React.SetStateAction<boolean>>;
}

const ListAddFriendMobile: React.FC<ListAddFriendMobileProps> = ({
  setIsShowListAddFriends,
  setIsShowMain,
}) => {
  const { apiRequest } = useFetchApi();
  const [listAddFriends, setListAddFriends] = useState([]);
  const [listSendAddFriends, setListSendAddFriends] = useState([]);

  useEffect(() => {
    getListAddFriends();
    getListSendAddFriends();
  }, []);

  const getListAddFriends = async () => {
    try {
      const response = await apiRequest('GET', 'friend/requests');
      setListAddFriends(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
    }
  };

  const getListSendAddFriends = async () => {
    try {
      const response = await apiRequest('GET', 'friend/sent-requests');
      setListSendAddFriends(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
    }
  };

  const handleFriend = async (id: string, mode: string) => {
    try {
      const response = await apiRequest(
        'PATCH',
        'friend/action-request-friend/' + id,
        { id: id, status: mode }
      );
      if (response.status == 204) {
        getListAddFriends();
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
    }
  };

  const handleCancelSendAddFriend = async (id: string) => {
    try {
      const response = await apiRequest(
        'PATCH',
        'friend/cancel-send-request/' + id
      );
      if (response.status == 204) {
        getListSendAddFriends();
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
    }
  };
  return (
    <div className="flex h-full flex-col overflow-hidden">
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
          Lời mời kết bạn
        </span>
      </div>
      {/* end top */}
      {/* body */}
      <div
        className="w-full overflow-y-auto py-[15px] px-[20px] bg-white"
        // style={{ height: `calc(100% - 135px)` }}
      >
        <span className="text-[16px] font-semibold">
          Lời mời đã nhận ({listAddFriends.length})
        </span>
        {listAddFriends &&
          listAddFriends.map(
            (
              item: {
                id: string;
                full_name: string;
                avt_url: string;
                sent_date: string;
              },
              index
            ) => {
              return (
                <div
                  className="flex items-center mt-[15px]"
                  key={`${index}-${Math.random().toString(36).substring(7)}`}
                >
                  <div>
                    <UserAvatar
                      url={item.avt_url}
                      fullName={item.full_name}
                      senderId={item.id}
                    />
                  </div>
                  <div className="flex flex-col ml-[15px] flex-grow overflow-hidden w-[5px]">
                    <span className="list-add-friend__text-ba-cham text-[14px] overflow-hidden whitespace-nowrap text-ellipsis">
                      {item.full_name}
                    </span>
                    <span className="list-add-friend__text-ba-cham text-[13px] text-[#7B87A1] overflow-hidden whitespace-nowrap text-ellipsis">
                      {formatDate(item.sent_date)}
                    </span>
                    <div className="flex mt-[5px]">
                      <span
                        className="w-[86px] h-[32px] border-solid border-[1px] border-[#A1A1A1] rounded-[24px] flex justify-center items-center text-[#485259] text-[13px] cursor-pointer flex-shrink-0"
                        onClick={() => handleFriend(item.id, 'REJECTED')}
                      >
                        Từ chối
                      </span>
                      <span
                        className="w-[86px] h-[32px] bg-[#076EB8] rounded-[24px] flex justify-center items-center text-white text-[13px] cursor-pointer ml-[10px] flex-shrink-0"
                        onClick={() => handleFriend(item.id, 'ACCEPTED')}
                      >
                        Đồng ý
                      </span>
                    </div>
                  </div>
                </div>
              );
            }
          )}
        <div className="mt-[20px]"></div>
        <span className="text-[16px] font-semibold">
          Lời mời đã gửi ({listSendAddFriends.length})
        </span>
        {listSendAddFriends &&
          listSendAddFriends.map(
            (
              item: {
                id: string;
                full_name: string;
                avt_url: string;
                sent_date: string;
              },
              index
            ) => {
              console.log(item);
              return (
                <div
                  className="flex items-center mt-[15px]"
                  key={`${index}-${Math.random().toString(36).substring(7)}`}
                >
                  <div>
                    <UserAvatar
                      url={item.avt_url}
                      fullName={item.full_name}
                      senderId={item.id}
                    />
                  </div>
                  <div className="flex flex-col ml-[15px] flex-grow overflow-hidden w-[5px]">
                    <span className="text-[14px] overflow-hidden whitespace-nowrap text-ellipsis">
                      {item.full_name}
                    </span>
                    <span className="text-[13px] text-[#7B87A1] overflow-hidden whitespace-nowrap text-ellipsis mt-[5px]">
                      {formatDate(item.sent_date)}
                    </span>
                    <span
                      className="w-[133px] h-[32px] border-solid border-[1px] border-[#A1A1A1] rounded-[24px] flex justify-center items-center text-[#485259] text-[13px] cursor-pointer flex-shrink-0 mt-[5px]"
                      onClick={() => handleCancelSendAddFriend(item.id)}
                    >
                      Thu hồi lời mời
                    </span>
                  </div>
                </div>
              );
            }
          )}
      </div>
      {/* end body */}
    </div>
  );
};
export default ListAddFriendMobile;
