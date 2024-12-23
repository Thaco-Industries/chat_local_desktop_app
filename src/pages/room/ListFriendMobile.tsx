import React, { useEffect, useState } from 'react';
import { useFetchApi } from '../../context/ApiContext';
import ArrowLeft from '../../assets/icons/arrow-left';
import UserAvatar from '../../components/common/UserAvatar';
import { useNavigate } from 'react-router-dom';
import { useMessageContext } from '../../context/MessageContext';
import { useChatContext } from '../../context/ChatContext';
import { useRoomService } from '../../services/RoomService';
import { useMessageService } from '../../services/MessageService';
import { notify } from '../../helper/notify';

interface ListFriendMobileProps {
  setIsShowListFriends: React.Dispatch<React.SetStateAction<boolean>>;
  setIsShowMain: React.Dispatch<React.SetStateAction<boolean>>;
}

const ListFriendMobile: React.FC<ListFriendMobileProps> = ({
  setIsShowListFriends,
  setIsShowMain,
}) => {
  const { setRoomId, setRoomInfo } = useMessageContext();
  const {
    setListMember,
    setIsFirstLoad,
    setHasMoreData,
    setLastMessageId,
    setMessages,
  } = useChatContext();
  const { getRoomById } = useRoomService();
  const { getMemberInRoom } = useRoomService();
  const { markAsReadMessage } = useMessageService();
  const [listFriends, setListFriends] = useState([]);
  const { apiRequest } = useFetchApi();
  const navigate = useNavigate();
  useEffect(() => {
    getListFriends();
  }, []);
  const getListFriends = async () => {
    try {
      const response = await apiRequest('GET', 'friend/list-friend');
      if (response.data) {
        console.log(response.data);

        setListFriends(response.data);
      }
    } catch (err) {
      console.error('API call failed: ', err);
    }
  };

  const getListMember = async (roomId: string) => {
    const response = await getMemberInRoom(roomId);
    if (response.status === 200) {
      const updatedList = response.data;
      setListMember(updatedList);
    }
  };

  const markAsRead = async (room_id: string) => {
    try {
      await markAsReadMessage(room_id);
    } catch (err) {
      console.error('API call failed: ', err);
    }
  };

  const handleFriendClick = async (item: any) => {
    try {
      const response = await getRoomById(item.room_id);
      if (response.data) {
        const room = response.data;
        setRoomId(room.id);
        setListMember(null);
        markAsRead(room.id);
        setRoomInfo(room);
        setMessages([]);
        setLastMessageId('');
        getListMember(room.id);
        setHasMoreData(true);
        setIsFirstLoad(true);
        navigate('/');
      }
    } catch (error: any) {
      // Lấy thông tin lỗi chi tiết
      const errorMessage = error?.response?.data?.message || error.message;
      notify(`Lỗi tải ảnh: ${errorMessage}`, 'error');
      console.error('Error:', errorMessage);
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
        <div className="bg-white w-full h-[calc(100%-65px)] rounded-[6px] pt-[15px] flex flex-col">
          <span className="font-semibold px-[20px]">
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
                      className="list-friend__list-item pt-[13px] pb-[12px] px-[20px] flex items-center cursor-pointer"
                      key={index}
                      onClick={() => handleFriendClick(item)}
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
