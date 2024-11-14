import { IChatDrawerDetail } from './common';
import { IRoom } from './Room';

export interface IChatHeader extends IChatScreen {
  roomInfo: IRoom;
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface IChatScreen extends IChatDrawerDetail {
  roomId: string;
  roomInfo: IRoom;
  setRoomId: React.Dispatch<React.SetStateAction<string>>;
  isDesktopCollapsed: boolean;
  setIsDesktopCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}
