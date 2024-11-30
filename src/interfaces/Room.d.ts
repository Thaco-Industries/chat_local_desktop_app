import { Dispatch, ReactNode, SetStateAction } from 'react';
import { IFileMessage } from './Message';

export interface IRoom {
  // id: string;
  // name: string;
  // avatar: string;
  // lastMessage: string;
  // lastTimeMessage: string;
  // unreadMessage: number;
  id: string;
  avatar_url: string;
  is_group: boolean;
  last_message: ILastMessage;
  number_message_not_read: number;
  room_name: string;
  type_room: string;
  userRoom: IUserRoom[];
}

export interface IRoomItem {
  room: IRoom;
  keyword: string;
}
export interface IRoomList {
  roomList: IRoom[];
  setRoomList: Dispatch<SetStateAction<IRoom[]>>;
  roomId: string;
  setRoomId: Dispatch<SetStateAction<string>>;
  setRoomInfo: Dispatch<SetStateAction<IRoom>>;
  getRoomData: () => Promise<void>;
}

export interface ILastMessage {
  id: string;
  created_at: string;
  room_id: string;
  sender_id: string;
  file_id?: IFileMessage;
  message_type: string;
  seen_by: string[];
  deleted_by: [];
  status: string;
  reactions: [];
  message_display: string | ReactNode;
}

export interface IUserRoom {
  created_at: string;
  id: string;
  user_id: string;
  room_id: string;
  permission: string;
  user: any;
}
