// src/types/TabItems.d.ts

import { File, Photo } from './common';

export interface ITabItemsProps {
  activeTab: 'image' | 'other' | 'video' | null;
  photos: IFileInfor[];
  videos: IFileInfor[];
  files: IFileInfor[];
  isDelete: boolean;
  fileSelected: string[];
  setFileSelected: React.Dispatch<React.SetStateAction<string[]>>;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setIsVideo: React.Dispatch<React.SetStateAction<boolean> | null>;
  setImageView: React.Dispatch<React.SetStateAction<string>>;
}

export interface IPhotoTabContentProps {
  groupedPhotos: { [key: string]: IFileInfor[] };
  handleFileChoosen: (
    id: string,
    url: string | null,
    isVideo: boolean | null
  ) => void;
  isDelete: boolean;
  fileSelected: string[];
  isVideoTab: boolean;
}

export interface IFileTabContentProps {
  groupedFiles: { [key: string]: IFileInfor[] };
  handleFileChoosen: (id: string) => void;
  isDelete: boolean;
  fileSelected: string[];
}
