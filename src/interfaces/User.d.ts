export interface IUser {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  lastTimeMessage: string;
  unreadMessage: number;
}

export interface IUserInfo {
  id: string;
  userName: string;
  role: 'USER' | 'ADMIN';
  is_locked: false;
  infor: {
    ban: string;
    msnv: string;
    nhom: string;
    email: string;
    avt_url: string;
    bo_phan: string;
    cap_bac: string;
    full_name: string;
    phong_phu: string;
    dien_thoai: string;
    phong_chinh: string;
    chuc_danh: string;
  };
}

export interface IUserInRoomInfo {
  id: string;
  userName: string;
  infor: {
    ban: string;
    msnv: string;
    nhom: string;
    email: string;
    avt_url: string;
    bo_phan: string;
    cap_bac: string;
    full_name: string;
    phong_phu: string;
    dien_thoai: string;
    phong_chinh: string;
  };
  userRoom: [
    {
      deleted_at: string;
      user_id: string;
      permission: 'LEADER' | 'MEMBER';
      room_id: string;
    }
  ];
}
