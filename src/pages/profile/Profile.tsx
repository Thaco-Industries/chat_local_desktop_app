import React from 'react';
import UserAvatar from '../../components/common/UserAvatar';
import { getAuthCookie } from '../../actions/auth.action';
import { IPositionInfo } from '../../interfaces';
import PositionIcon from '../../assets/icons/position-icon';

const Profile: React.FC = () => {
  const userInfor = getAuthCookie()?.user;

  const personalInfo = [
    { label: 'Email', value: userInfor?.infor.email },
    { label: 'Số điện thoại', value: userInfor?.infor.dien_thoai },
  ];

  function renderPosition(data: IPositionInfo[]) {
    const mainPosition = data.find((item) => item.priority === 0);
    const secondaryPositions = data.filter((item) => item.priority !== 0);
    return (
      <div>
        <div className="grid grid-cols-[200px_auto] gap-y-xs">
          <p className="text-textBody font-semibold">
            Chức vụ đảm nhiệm chính{' '}
          </p>
          <p className="text-textBody flex items-center">
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
        </div>
        <div className="grid grid-cols-[200px_auto] gap-y-xs mt-sm">
          <p className="text-textBody font-semibold">Chức vụ kiêm nhiệm</p>
          <div className="text-textBody">
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
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white px-md py-lg">
      <h1 className="text-title font-semibold">Thông tin tài khoản</h1>
      {userInfor && (
        <div className="flex gap-xl mt-[35px]">
          <div className="flex flex-col gap-xs items-center">
            <UserAvatar
              fullName={userInfor.infor.full_name}
              senderId={userInfor.id}
              url={userInfor.infor.avt_url}
              fontSize={30}
              size={150}
            />
            <h1 className="text-title font-semibold">
              {userInfor.infor.full_name}
            </h1>
            <h1>
              Mã số nhân viên:{' '}
              <span className="text-textBody font-semibold">
                {userInfor.infor.msnv}
              </span>
            </h1>
            <h1>
              Trạng thái hoạt động:{' '}
              <span className="text-green-500 font-semibold">
                Đang hoạt động
              </span>
            </h1>
            <button className="py-[6.5px] px-[17px] bg-white rounded-[40px] shadow border border-red-700 text-center">
              <div className="text-red-700">Đăng xuất</div>
            </button>
          </div>
          <div className="min-h-full border-r border-r-border"></div>
          <div className="flex flex-col gap-sm">
            <h1 className="text-title">Thông tin cá nhân</h1>
            <div className="grid grid-cols-[200px_auto] gap-y-xs">
              {personalInfo.map((info, index) => (
                <React.Fragment key={index}>
                  <p className="text-title">{info.label}:</p>
                  <p className="text-textBody">{info.value}</p>
                </React.Fragment>
              ))}
            </div>
            <h1 className="text-title font-semibold">Thông tin chức vụ</h1>
            <div className="flex flex-col gap-xs">
              {userInfor.position_infor &&
                renderPosition(userInfor.position_infor)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
