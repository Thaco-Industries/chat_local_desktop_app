// src/types/TabItems.d.ts

import { File, Photo } from './common';

export interface ITabItemsProps {
  activeTab: 'photos' | 'files' | null;
  photos: Photo[];
  files: File[];
  isDelete: boolean;
  fileSelected: string[];
  setFileSelected: React.Dispatch<React.SetStateAction<string[]>>;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setImageView: React.Dispatch<React.SetStateAction<string>>;
}

export interface IPhotoTabContentProps {
  groupedPhotos: { [key: string]: Photo[] };
  handleFileChoosen: (id: string, url: string | null) => void;
  isDelete: boolean;
  fileSelected: string[];
}

export interface IFileTabContentProps {
  groupedFiles: { [key: string]: File[] };
  handleFileChoosen: (id: string) => void;
  isDelete: boolean;
  fileSelected: string[];
}
