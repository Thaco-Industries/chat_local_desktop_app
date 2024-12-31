import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import UserAvatar from '../../common/UserAvatar';
import { IPositionInfo, IUserInfo } from '../../../interfaces';
import { useFriendService } from '../../../services/FriendService';
import { IFriendInfo } from '../../../interfaces/Friend';
import clsx from 'clsx';
import { Spinner } from 'flowbite-react';
import PositionIcon from '../../../assets/icons/position-icon';

type Props = {
  openFriendInfoModal: boolean;
  setOpenFriendInfoModal: Dispatch<SetStateAction<boolean>>;
  friendId: string;
  isRequest: boolean;
  isLoading: boolean;
  isShowButton: boolean;
  handleAddFriendClick: (userId: string) => void;
  handleAcceptRequestClick: (userId: string) => void;
  overlay: boolean;
};

function FriendInfoModal({
  openFriendInfoModal,
  setOpenFriendInfoModal,
  friendId,
  isRequest,
  isLoading,
  isShowButton,
  handleAddFriendClick,
  handleAcceptRequestClick,
  overlay,
}: Props) {
  const { searchUserById } = useFriendService();
  const [userInfor, setUserInfo] = useState<IUserInfo>();
  const [friendInfor, setFriendInfor] = useState<IFriendInfo>();
  const { getUserInfo } = useFriendService();

  useEffect(() => {
    if (!openFriendInfoModal) return;
    getUser();
    if (friendId) {
      getFriendById(friendId);
    }
  }, [openFriendInfoModal, friendId]);

  const personalInfo = [
    { label: 'Mã số nhân viên', value: userInfor?.infor.msnv },
    { label: 'Email', value: userInfor?.infor.email },
    { label: 'Số điện thoại', value: userInfor?.infor.dien_thoai },
  ];

  const getUser = async () => {
    if (!friendId) return;
    try {
      const response = await getUserInfo(friendId);
      if (response.data) {
        setUserInfo(response.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getFriendById = async (id: string) => {
    const response = await searchUserById(id);
    if (response.data) {
      console.log(response.data);

      setFriendInfor(response.data);
    }
  };

  const closeModal = () => {
    setOpenFriendInfoModal(false);
  };

  function renderPosition(data: IPositionInfo[]) {
    const mainPosition = data.find((item) => item.priority === 0);
    const secondaryPositions = data.filter((item) => item.priority !== 0);
    return (
      <div>
        <p className="text-textBody font-semibold">Chức vụ đảm nhiệm chính </p>
        <p className="text-textBody mt-xs flex items-center">
          {mainPosition ? (
            <>
              <PositionIcon />
              <span className="ml-xs">
                {mainPosition.position} - {mainPosition.ban_name}
              </span>
            </>
          ) : (
            <span className="text-[#C0C0C0]">
              Chưa có chức vụ đảm nhiệm chính
            </span>
          )}
        </p>
        <p className="text-textBody font-semibold mt-sm">Chức vụ kiêm nhiệm</p>
        <p className="text-textBody mt-xs">
          {secondaryPositions.length > 0 ? (
            secondaryPositions.map((item, index) => (
              <div key={index} className="flex items-center">
                <PositionIcon />
                <span className="ml-xs">
                  {item.position} - {item.ban_name}
                </span>
              </div>
            ))
          ) : (
            <span className="text-[#C0C0C0]">Chưa có chức vụ kiêm nhiệm</span>
          )}
        </p>
      </div>
    );
  }

  if (!openFriendInfoModal) return null;

  return (
    <div
      className={clsx(
        'fixed inset-0 z-[9999] flex items-center justify-center w-full h-full',
        {
          'bg-black bg-opacity-50': overlay,
        }
      )}
      onClick={closeModal}
    >
      <div
        className="relative w-[80vw] md:w-[50vw] lg:w-[30vw] h-[80vh] transition-[width] duration-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal content */}
        <div className="relative flex flex-col bg-white rounded-[10px] shadow w-full h-full overflow-y-auto">
          {/* Modal header */}
          <div className="flex items-center justify-between p-4 px-[20px] pt-[20px] rounded-t">
            <h3 className="text-[16px] font-semibold text-title">
              Thông tin tài khoản
            </h3>
            <button
              type="button"
              onClick={closeModal}
              className="text-[#7B7B7BD9] bg-transparent rounded-lg text-sm w-8 h-8 ms-autoborder-border inline-flex justify-center items-center"
            >
              <svg
                className="w-3 h-3"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          {/* Modal body */}
          <div className="h-full flex flex-col">
            {userInfor && (
              <div className="w-full pb-md">
                <div className="flex flex-col items-center px-5 mb-sm">
                  <UserAvatar
                    fullName={userInfor.infor.full_name}
                    senderId={userInfor.id}
                    url={userInfor.infor.avt_url}
                    size={150}
                  />
                  <p className="my-xs">{userInfor.infor.full_name}</p>
                  {friendInfor && isShowButton && (
                    <button
                      type="button"
                      className={clsx(
                        'px-md py-[6.5px]  rounded-3xl shadow-md shadow-[#95959533]',
                        {
                          'bg-white border-[#A1A1A1] border text-textBody':
                            isRequest,
                        },
                        {
                          'bg-primary border text-white': !isRequest,
                        }
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (friendInfor.status === 'RECEIVER_REQUEST') {
                          handleAcceptRequestClick(friendInfor.id);
                        } else {
                          handleAddFriendClick(friendInfor.id);
                        }
                      }}
                    >
                      {isLoading ? (
                        <Spinner />
                      ) : friendInfor.status === 'RECEIVER_REQUEST' ? (
                        'Đồng ý'
                      ) : isRequest ? (
                        'Thu hồi lời mời'
                      ) : (
                        'Kết bạn'
                      )}
                    </button>
                  )}
                </div>
                <hr className="text-border my-xxs" />

                <div className="px-md">
                  <h1 className="text-title font-semibold my-[15px]">
                    Thông tin cá nhân
                  </h1>
                  <div className="grid grid-cols-[160px_auto] gap-y-[15px]">
                    {personalInfo.map((info, index) => (
                      <React.Fragment key={index}>
                        <p>{info.label}:</p>
                        <p>{info.value}</p>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
                <div className="px-md">
                  <h1 className="text-title font-semibold my-[15px]">
                    Thông tin chức vụ
                  </h1>
                  <div className="flex flex-col gap-xs">
                    {userInfor.position_infor &&
                      renderPosition(userInfor.position_infor)}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FriendInfoModal;
