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
    avt_url: string;
    email: string;
    dien_thoai: string;
    msnv: string;
    full_name: string;
  };
  position_infor: IPositionInfo[];
}

export interface IPositionInfo {
  id: string;
  code: string;
  ban_name: string;
  position: string;
  priority: number;
  group_name: string;
}

export interface IUserInRoomInfo {
  id: string;
  userName: string;
  infor: {
    avt_url: string;
    email: string;
    dien_thoai: string;
    msnv: string;
    full_name: string;
  };
  position_infor: IPositionInfo[];
  userRoom: [
    {
      deleted_at: string;
      user_id: string;
      permission: 'LEADER' | 'MEMBER';
      room_id: string;
    }
  ];
}
