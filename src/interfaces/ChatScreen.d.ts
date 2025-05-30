import { IChatDrawerDetail } from './common';
import { IRoom } from './Room';
import { IUserInRoomInfo } from './User';

export interface IChatHeader extends IChatScreen {
  isCollapsed: boolean;
  listMember: Record<string, IUserInRoomInfo> | null;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface IChatScreen extends IChatDrawerDetail {
  roomId: string;
  roomInfo: IRoom;
  setRoomInfo: React.Dispatch<React.SetStateAction<IRoom>>;
  setRoomId: React.Dispatch<React.SetStateAction<string>>;
  isDesktopCollapsed: boolean;
  setIsDesktopCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  isVideo: boolean;
  setIsRightSideLoading: React.Dispatch<React.SetStateAction<boolean>>;
}
