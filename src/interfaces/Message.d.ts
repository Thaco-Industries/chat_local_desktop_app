import { Dispatch } from 'react';
import { IModalImageSetData } from './common';
import { IUserInRoomInfo } from './User';

export interface IMessage {
  created_at: string;
  room_id: string;
  sender_id: string;
  sender?: IUserInRoomInfo | null;
  message_type:
    | 'TEXT'
    | 'FILE'
    | 'RECALLED'
    | 'EMOJI'
    | 'STICKER'
    | 'NOTIFICATION'
    | 'TEXT_TAG';
  reply_id?: IMessageReply | null;
  file_id?: IFileMessage;
  seen_by: string[];
  deleted_by: [];
  status: 'ERROR' | 'SENT' | 'DELIVERED';
  reactions: [];
  message_display: string;
  id: string;
}

export interface IMessageReply {
  created_at: string;
  message_display: string;
  message_type:
    | 'TEXT'
    | 'FILE'
    | 'RECALLED'
    | 'EMOJI'
    | 'STICKER'
    | 'NOTIFICATION'
    | 'TEXT_TAG';
  id: string;
  file_id: IFileMessage;
}
export interface IFileMessage {
  created_at: string;
  file_name: string;
  file_size: string;
  uploaded_by: string;
  thumbnail_url_display: string;
  system_deleted: boolean;
  id_file: string;
  file_type: 'IMAGE' | 'FILE' | 'VIDEO';
  room_id: string;
  url_display: string;
  id: string;
}

export interface IMessageItem extends IModalImageSetData {
  message: IMessage;
  showSenderInfo: boolean;
}

export interface IMessageList extends IModalImageSetData {
  messages: IMessage[];
  isLoading: boolean;
}

export interface INotificationNewMessage {
  message: IMessage;
  sender: {
    id: string;
    userName: string;
    role: 'ADMIN' | 'USER';
    is_locked: boolean;
    infor: {
      avt_url: string;
      email: string;
      dien_thoai: string;
      msnv: string;
      full_name: string;
    };
    position_infor: IPositionInfo[];
  };
}
