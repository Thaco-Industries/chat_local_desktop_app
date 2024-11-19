export interface IUser {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  lastTimeMessage: string;
  unreadMessage: number;
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
      user_id: string;
      room_id: string;
    }
  ];
}
