export interface IFriendInfo {
  id: string;
  msnv: string;
  avt_url: string;
  full_name: string;
  status: 'FRIEND' | 'NOTFRIEND' | 'SENT_REQUEST' | 'RECEIVER_REQUEST';
  isOnline: boolean;
  isInRoom: boolean;
  isInvited: boolean;
  room_id: string;
}
