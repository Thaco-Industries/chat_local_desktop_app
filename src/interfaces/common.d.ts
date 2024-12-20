import { INotificationNewMessage } from './Message';
import { IInvitedInfor, IRoom } from './Room';

export interface Item {
  id: string;
  date: string;
}

export interface Photo extends Item {
  src: string;
  isVideo: boolean;
}

export interface File extends Item {
  name: string;
  size: string;
}

export interface IModalImageSetData {
  setVisible: Dispatch<SetStateAction<boolean>>;
  setImageView: Dispatch<SetStateAction<string>>;
}

export interface IChatDrawerDetail extends IModalImageSetData {
  visible: boolean;
  imageView: string;
  roomId: string;
  roomInfo: IRoom;
  setRoomInfo: Dispatch<SetStateAction<IRoom>>;
  setRoomId: Dispatch<SetStateAction<string>>;
  setIsCollapsed?: Dispatch<SetStateAction<boolean>>;
  setIsDesktopCollapsed?: Dispatch<SetStateAction<boolean>>;
  setIsVideo?: Dispatch<SetStateAction<boolean>>;
  friendStatus?: string;
}

export interface IConfigSystem {
  _id: string;
  deleted_at: string;
  created_at: string;
  code: 'CONFIG_SYSTEM';
  value: {
    time_revoke_mssg: number;
    time_remove_file: number;
    end_file: string[];
    max_capacity_file: number;
    max_capacity_file_per_cycle: number;
    join_group_system: string;
  };
  updated_at: string;
}

declare global {
  interface Window {
    electronAPI: {
      // Gửi thông báo
      notifyMessage: (message: INotificationNewMessage) => void;
      // Nhận thông báo
      receiveNotification: (
        callback: (event: unknown, data: INotificationNewMessage) => void
      ) => void;
      // Lắng nghe sự kiện khi thông báo được nhấp
      onNotificationClicked: (
        callback: (message: INotificationNewMessage) => void
      ) => void;
      // Lắng nghe sự kiện trả lời tin nhắn được gọi
      onReplyNotification: (callback: (message: string) => void) => void;
      //Loại bỏ lắng nghe event
      removeListener: (event: string, callback: (data: any) => void) => void;
      updateBadge: (count: number) => void;
      openUrl: (url: string) => Promise<{ success: boolean; error?: string }>;
    };
  }
}
