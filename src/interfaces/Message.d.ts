import { IModalImageSetData } from './common';
import { IUserInRoomInfo } from './User';

export interface IMessage {
  // id: string;
  // text?: string;
  // sender: string;
  // timestamp: string;
  // type: 'video' | 'file' | 'image' | 'text';
  // fileUrl?: string;
  // videoUrl?: string;
  // fileName?: string;
  // fileSize?: string;
  created_at: string;
  room_id: string;
  sender_id: string;
  sender?: IUserInRoomInfo | null;
  message_type: 'TEXT' | 'FILE' | 'RECALLED';
  reply_id: IMessageReply;
  file_id?: IFileMessage;
  seen_by: string[];
  deleted_by: [];
  status: 'ERROR' | 'SENT';
  reactions: [];
  message_display: string;
  id: string;
}

export interface IMessageReply {
  created_at: string;
  message_display: string;
  id: string;
}
export interface IFileMessage {
  created_at: string;
  file_name: string;
  file_size: string;
  uploaded_by: string;
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
  loading: boolean;
}
