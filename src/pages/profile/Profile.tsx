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
        <div className="grid grid-cols-1 gap-y-xs md:grid-cols-[200px_auto]">
          <p className="text-textBody font-semibold">
            Chức vụ đảm nhiệm chính{' '}
          </p>
          <div className="text-textBody flex items-center">
            {mainPosition ? (
              <>
                <div className="basis-[20px]">
                  <PositionIcon />
                </div>
                <span className="ml-xs">
                  {mainPosition.position} - {mainPosition.ban_name}
                </span>
              </>
            ) : (
              <span className="text-[#C0C0C0]">
                Chưa có chức vụ đảm nhiệm chính
              </span>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-y-xs md:grid-cols-[200px_auto] mt-sm">
          <p className="text-textBody font-semibold">Chức vụ kiêm nhiệm</p>
          <div className="text-textBody">
            {secondaryPositions.length > 0 ? (
              secondaryPositions.map((item, index) => (
                <div key={index} className="flex items-center">
                  <div className="basis-[20px]">
                    <PositionIcon />
                  </div>
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
        <div className="flex flex-col sm:flex-col md:flex-row gap-sm tablet:gap-xl mt-xs md:mt-[35px] overflow-y-auto h-[calc(100%-15px)] md:h-[335px]">
          <div className="flex flex-col gap-xs items-center min-w-[180px]">
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
              Trạng thái:{' '}
              <span className="text-green-500 font-semibold">
                Đang hoạt động
              </span>
            </h1>
            <button className="py-[6.5px] px-[17px] bg-white rounded-[40px] shadow-lg border border-red-700 text-center">
              <div className="text-red-700">Đăng xuất</div>
            </button>
          </div>
          <div className="min-h-full border-r border-r-border hidden md:block"></div>
          <div className="min-W-full border-t border-t-border block md:hidden"></div>
          <div className="flex flex-col gap-sm flex-1">
            <h1 className="text-title font-semibold">Thông tin cá nhân</h1>
            <div className="grid grid-cols-[100px_auto] md:grid-cols-[200px_auto] gap-y-xs">
              {personalInfo.map((info, index) => (
                <React.Fragment key={index}>
                  <p className="text-title">{info.label}:</p>
                  <span className="text-textBody font-semibold">
                    {info.value}
                  </span>
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
