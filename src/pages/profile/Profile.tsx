import React from 'react';
import UserAvatar from '../../components/common/UserAvatar';
import { getAuthCookie } from '../../actions/auth.action';

const Profile: React.FC = () => {
  const userInfor = getAuthCookie()?.user;
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
              size={150}
            />
            <h1>{userInfor.infor.full_name}</h1>
            <h1>
              Mã số nhân viên: <span>{userInfor.infor.msnv}</span>
            </h1>
            <h1>
              Trạng thái hoạt động: <span>Đang hoạt động</span>
            </h1>
            <button className="py-[6.5px] px-[17px] bg-white rounded-[40px] shadow border border-red-700 text-center">
              <div className="text-red-700">Đăng xuất</div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
