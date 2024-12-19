import { useEffect, useState } from 'react';
import AddFriendIcon from '../../assets/icons/add-friend';
import { useFetchApi } from '../../context/ApiContext';
import UserAvatar from '../../components/common/UserAvatar';
import { formatDate } from '../../util/formatDate';
import { notify } from '../../helper/notify';

const ListAddFriend: React.FC = () => {
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
        notify(
          mode === 'REJECTED'
            ? 'Từ chối lời mời kết bạn thành công'
            : 'Đồng ý kết bạn thành công',
          'success'
        );
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
        notify('Thu hồi lời mời kết bạn thành công', 'success');
        getListSendAddFriends();
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
    }
  };
  return (
    <div className="h-full flex-1">
      {/* top */}
      <div className="h-[65px] bg-white w-full pl-[30px] flex items-center border-b border-solid border-[#DCDCDC]">
        <AddFriendIcon color="#485259" />
        <span className="text-[16px] font-semibold ml-[10px]">
          Lời mời kết bạn
        </span>
      </div>
      {/* end top */}
      {/* body */}
      <div className="p-[10px] w-full h-[calc(100%-65px)]">
        <div className="bg-white w-full h-[calc(50%-5px)] rounded-[6px] flex flex-col p-[20px]">
          <span className="text-[14px] font-semibold">
            Lời mời đã nhận ({listAddFriends.length})
          </span>
          <div className="mt-[15px] flex flex-wrap overflow-y-auto overflow-x-hidden items-start ml-[-20px]">
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
                      className="list-add-friend__list-item py-[12px] flex items-center px-[20px] max-xl:w-[100%] w-[50%]"
                      key={`${index}-${Math.random()
                        .toString(36)
                        .substring(7)}`}
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
                      </div>
                      <span
                        className="w-[86px] h-[32px] border-solid border-[1px] border-[#A1A1A1] rounded-[24px] flex justify-center items-center text-[#485259] text-[14px] cursor-pointer flex-shrink-0"
                        onClick={() => handleFriend(item.id, 'REJECTED')}
                      >
                        Từ chối
                      </span>
                      <span
                        className="w-[86px] h-[32px] bg-[#076EB8] rounded-[24px] flex justify-center items-center text-white text-[14px] cursor-pointer ml-[10px] flex-shrink-0"
                        onClick={() => handleFriend(item.id, 'ACCEPTED')}
                      >
                        Đồng ý
                      </span>
                    </div>
                  );
                }
              )}
          </div>
        </div>
        <div className="bg-white w-full h-[calc(50%-5px)] rounded-[6px] flex flex-col mt-[10px] p-[20px]">
          <span className="text-[14px] font-semibold">
            Lời mời đã gửi ({listSendAddFriends.length})
          </span>
          <div className="mt-[15px] flex flex-wrap overflow-y-auto items-start ml-[-20px]">
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
                      className="list-add-friend__list-item py-[12px] max-xl:w-[100%] w-[50%] flex items-center px-[20px]"
                      key={`${index}-${Math.random()
                        .toString(36)
                        .substring(7)}`}
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
                        <span className="text-[13px] text-[#7B87A1] overflow-hidden whitespace-nowrap text-ellipsis">
                          {formatDate(item.sent_date)}
                        </span>
                      </div>
                      <span
                        className="w-[133px] h-[32px] border-solid border-[1px] border-[#A1A1A1] rounded-[24px] flex justify-center items-center text-[#485259] text-[14px] cursor-pointer flex-shrink-0"
                        onClick={() => handleCancelSendAddFriend(item.id)}
                      >
                        Thu hồi lời mời
                      </span>
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
export default ListAddFriend;
