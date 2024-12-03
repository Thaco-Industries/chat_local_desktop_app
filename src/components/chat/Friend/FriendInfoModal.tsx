import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import UserAvatar from '../../common/UserAvatar';
import { IUserInfo } from '../../../interfaces';
import { useFriendService } from '../../../services/FriendService';
import { IFriendInfo } from '../../../interfaces/Friend';
import clsx from 'clsx';
import { Spinner } from 'flowbite-react';

type Props = {
  openFriendInfoModal: boolean;
  setOpenFriendInfoModal: Dispatch<SetStateAction<boolean>>;
  friendInfo?: IFriendInfo;
  isRequest: boolean;
  isLoading: boolean;
  isShowButton: boolean;
  handleAddFriendClick: (userId: string) => void;
  handleAcceptRequestClick: (userId: string) => void;
};

function FriendInfoModal({
  openFriendInfoModal,
  setOpenFriendInfoModal,
  friendInfo,
  isRequest,
  isLoading,
  isShowButton,
  handleAddFriendClick,
  handleAcceptRequestClick,
}: Props) {
  const [userInfor, setUserInfo] = useState<IUserInfo>();
  const { getUserInfo } = useFriendService();

  useEffect(() => {
    if (!openFriendInfoModal) return;
    getUser();
  }, [openFriendInfoModal, friendInfo]);

  const personalInfo = [
    { label: 'Mã số nhân viên', value: userInfor?.infor.msnv },
    { label: 'Email', value: userInfor?.infor.email },
    { label: 'Số điện thoại', value: userInfor?.infor.dien_thoai },
  ];

  const positionInfo = [
    { label: 'Cấp bậc', value: userInfor?.infor.cap_bac },
    { label: 'Chức danh', value: userInfor?.infor.chuc_danh },
    { label: 'Ban', value: userInfor?.infor.ban },
    { label: 'Phòng chính', value: userInfor?.infor.phong_chinh },
    { label: 'Phòng phụ', value: userInfor?.infor.phong_phu },
    { label: 'Nhóm', value: userInfor?.infor.nhom },
    { label: 'Bộ phận', value: userInfor?.infor.bo_phan },
  ];

  const getUser = async () => {
    if (!friendInfo) return;
    try {
      const response = await getUserInfo(friendInfo.id);
      if (response.data) {
        setUserInfo(response.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const closeModal = () => {
    setOpenFriendInfoModal(false);
  };

  if (!openFriendInfoModal) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center w-full h-full"
      aria-hidden="true"
      onClick={closeModal}
    >
      <div
        className="relative w-[400px] h-[80vh]"
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
                aria-hidden="true"
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
                  {friendInfo && isShowButton && (
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
                        if (friendInfo.status === 'RECEIVER_REQUEST') {
                          handleAcceptRequestClick(friendInfo.id);
                        } else {
                          handleAddFriendClick(friendInfo.id);
                        }
                      }}
                    >
                      {isLoading ? (
                        <Spinner />
                      ) : friendInfo.status === 'RECEIVER_REQUEST' ? (
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
                  <div className="grid grid-cols-[160px_auto] gap-y-[15px]">
                    {positionInfo.map((info, index) => (
                      <React.Fragment key={index}>
                        <p>{info.label}:</p>
                        <p>{info.value}</p>
                      </React.Fragment>
                    ))}
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
