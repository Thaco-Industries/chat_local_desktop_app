import { Dispatch } from 'react';
import { File, Photo } from './common';
import { IInvitedInfor, IRoom } from './Room';

export interface IChatInformationProps {
  setActiveTab: Dispatch<SetStateAction<'photos' | 'files' | null>>;
  photos: IFileInfor[];
  videos: IFileInfor[];
  files: IFileInfor[];
  setVisible: Dispatch<SetStateAction<boolean>>;
  setImageView: Dispatch<SetStateAction<string>>;
  setViewAllMemberInRoom: Dispatch<SetStateAction<boolean>>;
  roomInfo: IRoom;
  invitedList: IInvitedInfor[];
  setInvitedList: Dispatch<SetStateAction<IInvitedInfor[]>>;
  setRoomId: Dispatch<SetStateAction<string>>;
  setFileSelected: Dispatch<SetStateAction<string[]>>;
  setIsDelete: Dispatch<SetStateAction<boolean>>;
  setIsCollapsed: Dispatch<SetStateAction<boolean>>;
  setIsDesktopCollapsed: Dispatch<SetStateAction<boolean>>;
  setRoomInfo: React.Dispatch<React.SetStateAction<IRoom>>;
  setIsVideo: Dispatch<SetStateAction<boolean>>;
}
