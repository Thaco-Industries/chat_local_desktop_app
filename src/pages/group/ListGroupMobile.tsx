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

interface ListGroupMobileProps {
  setIsShowListFriends: React.Dispatch<React.SetStateAction<boolean>>;
  setIsShowMain: React.Dispatch<React.SetStateAction<boolean>>;
}

const ListGroupMobile: React.FC<ListGroupMobileProps> = ({
  setIsShowListFriends,
  setIsShowMain,
}) => {
  const [listGroups, setListGroups] = useState([]);
  const { apiRequest } = useFetchApi();
  const navigate = useNavigate();
  const { setRoomId, setRoomInfo } = useMessageContext();
  const {
    setListMember,
    setIsFirstLoad,
    setHasMoreData,
    setLastMessageId,
    setMessages,
  } = useChatContext();
  const { getMemberInRoom } = useRoomService();
  const { markAsReadMessage } = useMessageService();
  const { getRoomById } = useRoomService();

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

  const handleGroupClick = async (item: any) => {
    try {
      const response = await getRoomById(item.room_id);
      if (response.data) {
        const room = response.data;
        console.log(room);
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
      notify(errorMessage, 'error');
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
          Danh sách nhóm
        </span>
      </div>
      {/* end top */}
      <div className="w-full h-full">
        <div className="bg-white w-full h-full rounded-[6px] pt-[15px] flex flex-col">
          <span className="text-[14px] font-semibold px-[20px]">
            Tổng số nhóm ({listGroups.length})
          </span>
          <div className="mt-[15px] overflow-y-auto">
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
                    onClick={() => handleGroupClick(item)}
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListGroupMobile;
